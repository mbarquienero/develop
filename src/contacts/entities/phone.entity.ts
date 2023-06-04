import {ApiProperty} from '@nestjs/swagger';
import {Phone} from '@prisma/client';
import {ContactEntity} from './contact.entity';

export class PhoneEntity implements Phone {
	@ApiProperty()
	type: string;

	@ApiProperty()
	numberPhone: string;

	id: string;

	contact: ContactEntity;

	contactId: string;
}
