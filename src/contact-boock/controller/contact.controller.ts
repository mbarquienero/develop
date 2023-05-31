import { Controller, Get, Post, Param, Body, Delete, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse,ApiUnauthorizedResponse, ApiInternalServerErrorResponse,
   ApiQuery, ApiParam } from '@nestjs/swagger';
import { ContactService } from '../service/contact.service';
import { ContactDto } from '../dto/contact';


@ApiTags('Contactos')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({ summary: 'Crear un contacto' })
  @ApiResponse({ status: 201, description: 'Contacto creado correctamente' })
  @ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado' })
  @ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado' })
  @ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor' })
  @Post()
  async createContact(@Body() contactDto: ContactDto) {
    return await this.contactService.createContact(contactDto);
  }

  @ApiOperation({ summary: 'Buscar contacto por email' })
  @ApiResponse({ status: 200, description: 'Contacto encontrado' })
  @ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado' })
  @ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado' })
  @ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor' })
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.contactService.findContactByEmail(email);
  }

  @ApiOperation({ summary: 'Buscar contactos por datos personales' })
  @ApiResponse({ status: 200, description: 'Contactos encontrados' })
  @ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado' })
  @ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado' })
  @ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor' })
  @Post('search')
  searchByPersonalData(@Body() searchData: ContactDto) {
    return this.contactService.searchContactsByPersonalData(searchData);
  }

  @ApiOperation({ summary: 'Busqueda de contacto por telefono' })
  @ApiResponse({ status: 200, description: 'Contactos encontrados' })
  @ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado' })
  @ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado' })
  @ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor' })
  @Get('by-phone')
  getContactsByPhone(@Query('type') type: string, @Query('numberPhone') numberPhone: string) {
    return this.contactService.getContactsByPhone(type, numberPhone);
  }

  @ApiOperation({ summary: 'Buscar contactos por domicilio' })
  @ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado' })
  @ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado' })
  @ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor' })
  @Get('by-address')
  @ApiQuery({ name: 'locality', required: true })
  @ApiResponse({ status: 200, type: [ContactDto] })
  async getContactsByAddress(
    @Query('locality') locality: string,
  ): Promise<ContactDto[]> {
    return await this.contactService.getContactsByAddress(locality);
  }

  @ApiOperation({ summary: 'Eliminar un contacto' })
  @ApiResponse({ status: 200, description: 'Contacto eliminado correctamente' })
  @ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado' })
  @ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado' })
  @ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor' })
  @Delete(':documentType/:documentNumber')
  @ApiParam({ name: 'documentType', required: true })
  @ApiParam({ name: 'documentNumber', required: true })
  async deleteContact( @Param('documentType') documentType: string, @Param('documentNumber') documentNumber: string, ): Promise<void> {
    await this.contactService.deleteContact(documentType, documentNumber);
  }

  @ApiOperation({ summary: 'Modificacion de los datos personales, telefono y domicilio del contacto' })
  @ApiResponse({ status: 200, description: 'Contacto eliminado correctamente' })
  @ApiBadRequestResponse({status: 400, description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({status: 401, description: 'Acceso no authorizado' })
  @ApiNotFoundResponse({status: 404, description: 'El recurso solicitado no se ha encontrado' })
  @ApiInternalServerErrorResponse({status: 500, description: 'Se ha producido un error interno en el servidor' })
  @Patch(':documentType/:documentNumber')
  async updateContact(
    @Param('documentType') documentType: string,
    @Param('documentNumber') documentNumber: string,
    @Body() contactDto: ContactDto,
  ): Promise<ContactDto> {
    return await this.contactService.updateContact(documentType, documentNumber, contactDto);
  }
}
