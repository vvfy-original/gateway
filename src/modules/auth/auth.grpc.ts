import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import type {
	AuthServiceClient,
	TelegramCompleteRequest,
	TelegramConsumeRequest,
	TelegramVerifyRequest
} from '@vvfy/contracts/gen/auth'

@Injectable()
export class AuthGrpcClient implements OnModuleInit {
	private authService: AuthServiceClient

	public constructor(
		@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc
	) {}

	public onModuleInit() {
		this.authService = this.client.getService<AuthServiceClient>('AuthService')
	}

	public telegramInit() {
		return this.authService.telegramInit({})
	}

	public telegramVerify(data: TelegramVerifyRequest) {
		return this.authService.telegramVerify(data)
	}

	public telegramComplete(data: TelegramCompleteRequest) {
		return this.authService.telegramComplete(data)
	}

	public telegramConsume(data: TelegramConsumeRequest) {
		return this.authService.telegramConsume(data)
	}
}
