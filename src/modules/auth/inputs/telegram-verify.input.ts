import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class TelegramVerifyInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	tgAuthResult: string
}
