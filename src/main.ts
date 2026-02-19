import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { AppModule } from './core/app.module'
import { getCorsConfig } from './core/config/cors.config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(new ValidationPipe())

	const configService = app.get(ConfigService)
	const logger = new Logger(AppModule.name)

	app.use(cookieParser(configService.getOrThrow<string>('COOKIES_SECRET')))
	app.enableCors(getCorsConfig(configService))

	const port = configService.getOrThrow<number>('HTTP_PORT')
	const host = configService.getOrThrow<number>('HTTP_HOST')

	await app.listen(port)
	logger.log(`Gateway started at ${host}`)
}
bootstrap()
