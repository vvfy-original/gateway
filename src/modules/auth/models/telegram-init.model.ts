import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TelegramInitModel {
	@Field(() => String)
	url: string
}
