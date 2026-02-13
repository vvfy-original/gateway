import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { getGraphqlFactory } from '@vvfy/common'
import { IS_DEV_ENV, isDev } from 'src/shared/utils/is-dev.util'

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
		})
	],
	providers: [AppService, AppResolver]
})
export class AppModule {}
