import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './core/app.module'
import { getCorsConfig } from './core/config/cors.config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const configService = app.get(ConfigService)
	const logger = new Logger(AppModule.name)

	app.enableCors(getCorsConfig(configService))

	const port = configService.getOrThrow<number>('HTTP_PORT')
	const host = configService.getOrThrow<number>('HTTP_HOST')

	await app.listen(port)
	logger.log(`Gateway started at ${host}`)
}
bootstrap()
