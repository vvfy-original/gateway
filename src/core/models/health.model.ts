import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthModel {
	@Field(() => String)
	status: string
}
