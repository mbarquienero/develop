import { IsNotEmpty, IsString, IsEmail, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PhoneDto } from './phone';
import { AddressDto } from './address';

export class ContactDto {

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
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ type: [PhoneDto] })
    phone: PhoneDto[];

    @ApiProperty({ type: [AddressDto] })
    address: AddressDto[];

    phoneId: string;
    
    addressId: string;
  }