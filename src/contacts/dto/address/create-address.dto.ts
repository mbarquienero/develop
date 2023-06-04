import {IsNotEmpty, IsString, IsInt} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Contact} from '@prisma/client';

export class CreateAddressDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	locality: string;

	@ApiProperty()
	@IsString()
	street: string;

	@ApiProperty()
	@IsInt()
	numberStreet: number;

	@ApiProperty({required: false, nullable: true})
	@IsString()
	description?: string | undefined;

	id: string;

	contact: Contact;

	contactId: string;
}
