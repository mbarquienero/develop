import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Contact} from '@prisma/client';

export class CreatePhoneDto {
	id: string;

	contact: Contact;

	contactId: string;

	@ApiProperty()
	@IsString()
	type: string;

	@ApiProperty()
	@IsString()
	numberPhone: string;
}
