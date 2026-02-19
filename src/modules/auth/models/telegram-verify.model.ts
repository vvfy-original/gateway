import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TelegramVerifyModel {
	@Field(() => String, {
		nullable: true
	})
	url: string

	@Field(() => String, {
		nullable: true
	})
	session_token: string
}
