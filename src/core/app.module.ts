import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { IS_DEV_ENV } from 'src/shared/utils/is-dev.util'

import { AppResolver } from './app.resolver'
import { AppService } from './app.service'
import { getGraphqlFactory } from './config/factories'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEV_ENV
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			useFactory: getGraphqlFactory,
			inject: [ConfigService],
			imports: [ConfigModule]
		})
	],
	providers: [AppService, AppResolver]
})
export class AppModule {}
