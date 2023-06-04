import {Controller, Get, Post, Body, Patch,
	Param, Delete, Query} from '@nestjs/common';
import {ApiTags, ApiQuery, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiParam,
	ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse} from '@nestjs/swagger';
import {ContactsService} from './contacts.service';
import {CreateContactDto} from './dto/contact/create-contact.dto';
import {UpdateContactDto} from './dto/contact/update-contact.dto';
import {SearchContactDto} from './dto/contact/search-contact.dto';
import {ContactEntity} from './entities/contact.entity';

@Controller('contacts')
@ApiTags('contactos')
export class ContactsController {
	constructor(private readonly contactsService: ContactsService) {}

	@ApiOperation({summary: 'Crear un contacto'})
	@ApiCreatedResponse({status: 201, description: 'Contacto creado correctamente', type: ContactEntity})
	@ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos'})
	@ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado'})
	@ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado'})
	@ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor'})
	@Post()
	async create(@Body() createContactDto: CreateContactDto) {
		return this.contactsService.create(createContactDto);
	}

	@ApiOperation({summary: 'Busqueda de contacto por email'})
	@ApiOkResponse({status: 200, description: 'Contacto encontrado', type: ContactEntity})
	@ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos'})
	@ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado'})
	@ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado'})
	@ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor'})
	@Get('email/:email')
	findByEmail(@Param('email') email: string) {
		return this.contactsService.findByEmail(email);
	}

	@ApiOperation({summary: 'Busqueda de contacto por telefono'})
	@ApiOkResponse({status: 200, description: 'Contacto encontrado', type: ContactEntity})
	@ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos'})
	@ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado'})
	@ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado'})
	@ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor'})
	@Get('by-phone')
	getContactByPhone(@Query('type') type: string, @Query('numberPhone') numberPhone: string) {
		return this.contactsService.getContactByPhone(type, numberPhone);
	}

	@ApiOperation({summary: 'Buscar contactos por domicilio'})
	@ApiOkResponse({status: 200, description: 'Contactos encontrados', type: ContactEntity, isArray: true})
	@ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos'})
	@ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado'})
	@ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado'})
	@ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor'})
	@Get('by-address')
	@ApiQuery({name: 'locality', required: true})
	async getContactsByAddress(@Query('locality') locality: string): Promise<ContactEntity[]> {
		return this.contactsService.getContactsByAddress(locality);
	}

	@ApiOperation({summary: 'Eliminar un contacto'})
	@ApiOkResponse({status: 200, description: 'Contacto eliminado correctamente', type: ContactEntity})
	@ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos'})
	@ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado'})
	@ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado'})
	@ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor'})
	@Delete(':documentType/:documentNumber')
	@ApiParam({name: 'documentType', required: true})
	@ApiParam({name: 'documentNumber', required: true})
	async deleteContact(@Param('documentType') documentType: string, @Param('documentNumber') documentNumber: string) {
		await this.contactsService.delete(documentType, documentNumber);
	}

	@ApiOperation({summary: 'Buscar contactos por datos personales'})
	@ApiOkResponse({status: 200, description: 'Contacto encontrado', type: ContactEntity, isArray: true})
	@ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos'})
	@ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado'})
	@ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado'})
	@ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor'})
	@Post('search')
	async searchByPersonalData(@Body() searchData: SearchContactDto) {
		return this.contactsService.searchContactsByPersonalData(searchData);
	}

	@ApiOperation({summary: 'Modificacion de los datos personales, telefono y domicilio del contacto'})
	@ApiOkResponse({status: 200, description: 'Contacto actualizado correctamente', type: ContactEntity})
	@ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos'})
	@ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado'})
	@ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado'})
	@ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor'})
	@Patch(':documentType/:documentNumber')
	async updateContact(@Param('documentType') documentType: string, @Param('documentNumber') documentNumber: string, @Body() updateDto: UpdateContactDto) {
		return this.contactsService.update(documentType, documentNumber, updateDto);
	}
}
