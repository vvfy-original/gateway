import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { getGraphqlFactory, IS_DEV_ENV, isDev } from '@vvfy/common'
import { AuthModule } from 'src/modules/auth/auth.module'

import { AppResolver } from './app.resolver'
import { AppService } from './app.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEV_ENV
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			useFactory: (configService: ConfigService) =>
				getGraphqlFactory(
					isDev(configService),
					configService.getOrThrow<string>('GRAPHQL_PREFIX'),
					'src/core/graphql/schema.gql'
				),
			inject: [ConfigService],
			imports: [ConfigModule]
		}),
		AuthModule
	],
	providers: [AppService, AppResolver]
})
export class AppModule {}
