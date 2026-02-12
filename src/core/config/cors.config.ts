import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ConfigService } from '@nestjs/config'

export function getCorsConfig(configService: ConfigService): CorsOptions {
	return {
		credentials: true,
		origin: configService.getOrThrow<string>('HTTP_CORS').split(',')
	}
}
