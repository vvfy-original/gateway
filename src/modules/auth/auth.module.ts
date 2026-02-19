import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PROTO_PATHS } from '@vvfy/contracts'

import { AuthGrpcClient } from './auth.grpc'
import { AuthResolver } from './auth.resolver'

@Module({
	providers: [AuthResolver, AuthGrpcClient],
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'AUTH_PACKAGE',
				useFactory: (configService: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: 'auth.v1',
						protoPath: PROTO_PATHS.AUTH,
						url: configService.getOrThrow<string>('AUTH_GRPC_URL')
					}
				}),
				inject: [ConfigService]
			}
		])
	]
})
export class AuthModule {}
