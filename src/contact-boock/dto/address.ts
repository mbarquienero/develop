import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Contact } from '@prisma/client';

export class AddressDto {
    
  id: string;

  Contact: Contact;

  contactId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locality: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  street: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  numberStreet: number;
  
  @ApiProperty({ required: false })
  @IsString()
  description?: string;
}