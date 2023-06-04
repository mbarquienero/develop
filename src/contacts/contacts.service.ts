import {Injectable} from '@nestjs/common';
import {CreateContactDto} from './dto/contact/create-contact.dto';
import {CreatePhoneDto} from './dto/phone/create-phone.dto';
import {CreateAddressDto} from './dto/address/create-address.dto';
import {UpdateContactDto} from './dto/contact/update-contact.dto';
import {SearchContactDto} from './dto/contact/search-contact.dto';
import {UpdateAddressDto} from './dto/address/update-address.dto';
import {ContactEntity} from './entities/contact.entity';
import {PrismaService} from 'src/prisma/prisma.service';
import {plainToClass} from 'class-transformer';
import {Prisma, Phone} from '@prisma/client';

@Injectable()
export class ContactsService {
	constructor(private readonly prisma: PrismaService) {}

   /**
   * Crea un nuevo contacto utilizando los datos proporcionados.
   * @param createContactDto Los datos del contacto a crear.
   * @returns Contacto creado.
   */
	async create(createContactDto: CreateContactDto) {
	try {
		
		if (!createContactDto) 
			throw new Error('No se ha ingresado datos para la creación de contacto'); 

		const contactData: Prisma.ContactCreateInput = await this.dtoToPrimaInput(createContactDto);
		const createdContact = await this.prisma.contact.create({data: contactData});

		// Transformar el objeto creado a ContactDto
		const contactToDto = plainToClass(ContactEntity, createdContact);

		return contactToDto;

		} catch (error) {
			console.error('Error al crear el contacto:', error);
			throw new Error('No se pudo crear el contacto debido a un error');
		}
	}

	/**
	* Busca un contacto por su direccion de correo electronico.
	* @param email La dirección de correo electronico del contacto a buscar.
	* @returns El contacto encontrado, incluyendo sus teléfonos y direcciones.
	*/
	findByEmail(email: string) {
	try {
		return this.prisma.contact.findFirst({
			where: {
				email: {
					equals: email,
				},
			},
			include: {
				phone: true,
				address: true,
			},
		});

	} catch (error) {
		console.error('Error al buscar el contacto por correo electronico:', error);
		throw new Error('No se pudo encontrar el contacto debido a un error');
	  }
	}

   /**
	* Obtiene un contacto a traves de tipo y numero de telefono
	* @param El tipo de teléfono a buscar.
	* @param numberPhone El número de teléfono a buscar.
	* @returns El contacto que tienen el número de teléfono específico, incluyendo sus teléfonos y direcciones.
	*/
	getContactByPhone(type: string, numberPhone: string) {
	try {

		return this.prisma.phone.findUnique({
			where: {
				type_numberPhone: {type, numberPhone},
			},
			}).Contact({
				include: {
					address: true,
					phone: true,
				},
			});

		} catch (error) {
			console.error('Error al obtener los contactos por numero de telefono:', error);
			throw new Error('No se pudieron obtener los contactos debido a un error');
		  }
	}

   /**
	* Obtiene los contactos que tienen una direccion especifica.
	* @param locality La localidad de la dirección a buscar.
	* @returns Los contactos que tienen la direccion especifica, incluyendo sus telefonos y direcciones.
	*/
	async getContactsByAddress(locality: string): Promise<ContactEntity[]> {
	try {

		const contacts = await this.prisma.contact.findMany({
			where: {
				address: {
					some: {
						locality,
					},
				},
			},
			include: {
				phone: true,
				address: true,
			},
		});

		if (!contacts || contacts.length === 0) return [];

		const contactToDto = plainToClass(ContactEntity, contacts);

		return contactToDto;

		} catch (error) {
			console.error('Error al intentar recuperar contacto por domicilio:', error);
			throw new Error('Fallo recuperación de contact');
		}
	}

   /**
  	* Elimina un contacto por su tipo de documento y numero de documento.
  	* @param documentEl tipo de documento del contacto a eliminar.
  	* @param documentNumberParse El número de documento del contacto a eliminar.
  	*/
 	async delete(documentType: string, documentNumberParse: string) {
	try {

		const documentNumber: number = parseInt(documentNumberParse, 10);
		return await this.prisma.contact.delete({
			where: {
				documentType_documentNumber: {documentType, documentNumber},
			},
		});

		} catch (error) {
			console.error('Error al eliminar contacto:', error);
			throw new Error('Fallo eliminacion de contacto');
		}
	}

   /**
  	* Busca contactos por datos personales, numeros de telefono y dirección.
  	* @param searchData Los datos de búsqueda que incluyen información personal, números de telefono y direccion.
  	* @returns Los contactos encontrados que coinciden con los criterios de búsqueda, incluyendo sus telefonos y direcciones.
  	*/
	async searchContactsByPersonalData(searchData: SearchContactDto): Promise<ContactEntity[]> {
	try {

		if (!searchData)
			throw new Error('searchData es vacio, se debe ingresar dos del contacto a buscar');

		const contacts = await this.prisma.contact.findMany({
			where: {
				OR: [
					{firstName: searchData?.firstName},
					{lastName: searchData?.lastName},
					{documentType: searchData?.documentType},
					{documentNumber: searchData?.documentNumber},
					{email: searchData?.email},
					{
						phone: searchData?.phone?.[0]?.type && searchData?.phone?.[0]?.numberPhone
							? {
								some: {
									type: searchData.phone[0].type,
									numberPhone: searchData.phone[0].numberPhone,
								},
							  } : undefined,
					},
					{
						address: searchData?.address?.[0]?.locality
							? {
								some: {
									locality: searchData.address[0].locality,
								},
							  } : undefined,
					},
					],
				},
				include: {
					phone: true,
					address: true,
				},
			});

		if (!contacts || contacts.length === 0) return [];

		const transform = plainToClass(ContactEntity, contacts);

		return transform;

		} catch (error) {
			console.error('Error al buscar los contactos por datos personales:', error);
			throw new Error('No se pudo encontrar los contactos debido a un error');
		}
	}

   /**
	* Actualiza un contacto buscado por tipo de documento y número de documento, una vez encontrado se puede actualizar sus datos personales,
	* telefonos y domicilios.
	* @param documentEl tipo de documento del contacto a actualizar.
	* @param documentNumber El número de documento del contacto a actualizar.
	*/
	async update(documentType: string, documentNumberParse: string, updateDto: UpdateContactDto) {
	try {
		const documentNumber: number = parseInt(documentNumberParse, 10);

		const contact = await this.prisma.contact.findUnique({
			where: {
				documentType_documentNumber: {documentType, documentNumber},
			},
			select: {
				id: true,
				documentType: true,
				documentNumber: true,
				firstName: true,
				lastName: true,
				age: true,
				email: true,
				phone: true,
				address: true,
			},
		});

		if (contact) {
			if (updateDto.documentType && updateDto.documentType === 'string') {
				return contact;
			}

			await this.getPhonesUpdate(updateDto);
			await this.getAddressUpdate(updateDto);

			const updateM = await this.prisma.contact.update({
				where: {
					id: contact.id
				},
				data: {
					documentType: updateDto?.documentType,
					documentNumber: updateDto?.documentNumber,
					firstName: updateDto?.firstName,
					lastName: updateDto?.lastName,
					age: updateDto?.age,
					email: updateDto?.email
				}
			});
				return updateDto;
		}
		else {
			return [];
		}
		
		} catch (error) {
			console.error('Error al actualizar contacto:', error);
			throw new Error('Fallo actualizacion de contacto');
		}
	}

   /**
	* Convierte los datos del DTO de contacto a un objeto de entrada de Prisma para crear un contacto.
	* @param contactDto Los datos del DTO de contacto.
	* @returns Una promesa que se resuelve con el objeto de entrada de Prisma para crear un contacto.
	*/
	private async dtoToPrimaInput(contactDto: CreateContactDto): Promise<Prisma.ContactCreateInput> {
	try {
		// Obtener los datos de los teléfonos del contacto
		const phoneData: Prisma.PhoneCreateWithoutContactInput[] = await this.getPhones(contactDto.phone);
		// Obtener los datos de las direcciones del contacto
		const addressData: Prisma.AddressCreateWithoutContactInput[] = await this.getAddresses(contactDto.address);

		// Crear el objeto de entrada de Prisma para crear un contacto
		const contactData: Prisma.ContactCreateInput = {
			firstName: contactDto.firstName,
			lastName: contactDto.lastName,
			documentType: contactDto.documentType,
			documentNumber: contactDto.documentNumber,
			age: contactDto.age,
			email: contactDto.email,
			phone: { create: phoneData },
			address: { 	create: addressData },
			};

			return contactData;
			
		} catch (error) {
			console.error('Error al tratar de convertir contactoDto a Prisma input:', error);
			throw new Error('Fallo en la conversion');
		}
	}

   /**
  	* Obtiene los datos de los telefonos del contacto en un formato adecuado para crear telefonos en Prisma.
  	* @param phoneDto Los datos de los teléfonos del contacto en el DTO.
  	* @returns Una promesa que se resuelve con los datos de los teléfonos en un formato compatible con Prisma.
  	*/
	private async getPhones(phoneDto: CreatePhoneDto[]): Promise<Prisma.PhoneCreateWithoutContactInput[]> {
	try {
		const phoneData: Prisma.PhoneCreateWithoutContactInput[] = phoneDto.map(phoneItem => ({
			type: phoneItem.type,
			numberPhone: phoneItem.numberPhone,
		}));

		return phoneData;
		
		} catch (error) {
			console.error('Error al convertir phoneDTOs:', error);
			throw new Error('Fallo en la conversion');
		}
	}

   /**
	* Obtiene los datos de las direcciones del contacto en un formato adecuado para crear direcciones en Prisma.
   	* @param addresses Los datos de las direcciones del contacto en el DTO.
   	* @returns Una promesa que se resuelve con los datos de las direcciones en un formato compatible con Prisma.
 	*/
	private async getAddresses(addresses: CreateAddressDto[]): Promise<Prisma.AddressCreateWithoutContactInput[]> {
	try {
		const addressData: Prisma.AddressCreateWithoutContactInput[] = addresses.map(addressItem => ({
			locality: addressItem.locality,
			street: addressItem.street,
			numberStreet: addressItem.numberStreet,
			description: addressItem?.description,
		}));

		return addressData;
		} catch (error) {
			console.error('Error al convertir addressDTOs:', error);
			throw new Error('Fallo en la conversion');
		}
	}
	
	private async getPhonesUpdate(update:UpdateContactDto) {
		
		if (update.phone && update.phone !== undefined) {
		    // Actualizar los números de teléfono del contacto
			return await Promise.all(
				update.phone.map(async (phone: Phone) => {
				  const updatedPhone = await this.prisma.phone.update({
					where: { id: phone.id },
					data: {
					  type: phone.type,
					  numberPhone: phone.numberPhone
					  
					},
				  });
				  return updatedPhone;
				}),
			  );
		} else {
			 return [];
		}	
	}

	private async getAddressUpdate(updateContact:UpdateContactDto) {
		
		if (updateContact.address && updateContact.address !== undefined) {

		    // Actualizar las direcciones del contacto
			return await Promise.all(
				updateContact.address.map(async (address: UpdateAddressDto) => {
				  const updatedAddress = await this.prisma.address.update({
					where: { id: address.id },
					data: {
					  locality: address?.locality,
					  street: address?.street,
					  numberStreet: address?.numberStreet,
					  description: address?.description,
					},
				  });
				  return updatedAddress;
				}),
			  );
			
		} else {
			return [];
		}
	}
}
