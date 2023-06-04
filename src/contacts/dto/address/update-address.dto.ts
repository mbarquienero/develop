import {PartialType} from '@nestjs/swagger';
import {CreateAddressDto} from '../address/create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
