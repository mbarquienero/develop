import {ApiProperty} from '@nestjs/swagger';
import {ContactEntity} from './contact.entity';

export class AddressEntity {
	@ApiProperty()
	locality: string;

	@ApiProperty()
	street: string;

	@ApiProperty()
	numberStreet: number;

	@ApiProperty({required: false})
	description?: string;

	id: string;

	contact: ContactEntity;

	contactId: string;
}
