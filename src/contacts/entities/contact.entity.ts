import {type Contact} from '@prisma/client';
import {ApiProperty} from '@nestjs/swagger';
import {PhoneEntity} from './phone.entity';
import {AddressEntity} from './address.entity';

export class ContactEntity implements Contact {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	documentType: string;

	@ApiProperty()
	documentNumber: number;

	@ApiProperty()
	age: number;

	@ApiProperty()
	email: string;

	@ApiProperty({type: [PhoneEntity]})
	phone: PhoneEntity[];

	@ApiProperty({type: [AddressEntity]})
	address: AddressEntity[];

	id: string;

	phoneId: string;

	addressId: string;
}
