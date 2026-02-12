import { Query, Resolver } from '@nestjs/graphql'

import { AppService } from './app.service'
import { HealthModel } from './models/health.model'

@Resolver()
export class AppResolver {
	constructor(private readonly appService: AppService) {}

	@Query(() => HealthModel, {
		name: 'health'
	})
	health(): HealthModel {
		return {
			status: 'OK'
		}
	}
}
