import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
	Args,
	Context,
	GqlExecutionContext,
	Mutation,
	Query,
	Resolver
} from '@nestjs/graphql'
import { isDev, ms } from '@vvfy/common'
import type { Request, Response } from 'express'
import { lastValueFrom } from 'rxjs'

import { AuthGrpcClient } from './auth.grpc'
import { TelegramFinalizeInput, TelegramVerifyInput } from './inputs'
import { TelegramInitModel, TelegramVerifyModel } from './models'

@Resolver()
export class AuthResolver {
	constructor(
		private readonly client: AuthGrpcClient,
		private readonly configService: ConfigService
	) {}

	@Query(() => TelegramInitModel, {
		name: 'telegramInit'
	})
	public async telegramInit() {
		return await lastValueFrom(this.client.telegramInit())
	}

	@Mutation(() => TelegramVerifyModel, {
		name: 'telegramVerify'
	})
	public async telegramVerify(
		@Args('data') data: TelegramVerifyInput,
		@Context() ctx: { req: Request; res: Response }
	) {
		const query = JSON.parse(atob(data.tgAuthResult))
		console.log(query)

		const result = await lastValueFrom(this.client.telegramVerify({ query }))
		console.log(result)

		if ('url' in result && result.url) return result

		if (result.sessionToken) {
			const { sessionToken } = result
			ctx.res.cookie('session', sessionToken, {
				httpOnly: true,
				domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
				secure: !isDev(this.configService),
				sameSite: 'lax',
				maxAge: ms('30d')
			})
			return { sessionToken }
		}

		throw new UnauthorizedException('Invalid telegram login response')
	}

	@Mutation(() => Boolean, {
		name: 'telegramFinalize'
	})
	public async telegramFinalize(
		@Args('data') data: TelegramFinalizeInput,
		@Context() ctx: { req: Request; res: Response }
	) {
		const { sessionToken } = await lastValueFrom(
			this.client.telegramConsume(data)
		)
		ctx.res.cookie('session', sessionToken, {
			httpOnly: true,
			domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
			secure: !isDev(this.configService),
			sameSite: 'lax',
			maxAge: ms('30d')
		})
		return true
	}
}
