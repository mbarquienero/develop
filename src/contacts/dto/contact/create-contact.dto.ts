import {IsNotEmpty, IsString, IsEmail, IsInt, Min} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {CreatePhoneDto} from '../phone/create-phone.dto';
import {CreateAddressDto} from '../address/create-address.dto';

export class CreateContactDto {
	id: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	firstName: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	lastName: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	documentType: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsInt()
	documentNumber: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsInt()
	@Min(18)
	age: number;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty({type: [CreatePhoneDto]})
	phone: CreatePhoneDto[];

	@ApiProperty({type: [CreateAddressDto]})
	address: CreateAddressDto[];

	phoneId: string;

	addressId: string;
}
