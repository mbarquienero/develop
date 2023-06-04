import {PartialType} from '@nestjs/swagger';
import {CreatePhoneDto} from '../phone/create-phone.dto';

export class UpdatePhoneDto extends PartialType(CreatePhoneDto) {}
