import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { ContactDto, } from '../dto/contact';
import { PhoneDto } from '../dto/phone';
import { AddressDto } from '../dto/address';
import { plainToClass } from 'class-transformer';
import { ContactRepository } from '../repository/contact.repository';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService, private contactRepository: ContactRepository) {}

  /**
   * Crea un nuevo contacto utilizando los datos proporcionados.
   * @param contactDto Los datos del contacto a crear.
   * @returns Contacto creado.
 */
  async createContact(contactDto: ContactDto): Promise<ContactDto> {    
   try {

    const contactData: Prisma.ContactCreateInput = await this.dtoToPrimaInput(contactDto);
    const createdContact = await this.contactRepository.createContact(contactData);

     // Transformar el objeto creado a ContactDto
    const contactToDto = plainToClass(ContactDto, createdContact);

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
  async findContactByEmail(email: string) {
    try {

      const contact = await this.contactRepository.findContactByEmail(email)

      const contactToDto = plainToClass(ContactDto, contact);
      
      return contactToDto;

    } catch (error) {
      console.error('Error al buscar el contacto por correo electronico:', error);
      throw new Error('No se pudo encontrar el contacto debido a un error');
    }
  }

  /**
  * Busca contactos por datos personales, numeros de telefono y dirección.
  * @param searchData Los datos de búsqueda que incluyen información personal, números de telefono y direccion.
  * @returns Los contactos encontrados que coinciden con los criterios de búsqueda, incluyendo sus telefonos y direcciones.
  */
  async searchContactsByPersonalData(searchData: ContactDto) {
    try {
      // Obtener los numeros de teléfono y tipos de teléfono de searchData
      const phoneNumbers = searchData.phone.map((phone) => phone.numberPhone);
      const phoneTypes = searchData.phone.map((phone) => phone.type);

      // Obtener las localidades, calles y números de calle de searchData.address
      const localities = searchData.address.map((address) => address.locality);
      const streets = searchData.address.map((address) => address.street);
      const numberStreets = searchData.address.map((address) => address.numberStreet);

      return await this.contactRepository.searchContactsByPersonalData(searchData);

    } catch (error) {
      console.error('Error al buscar los contactos por datos personales:', error);
      throw new Error('No se pudo encontrar los contactos debido a un error');
    }
  }

  /**
   * Obtiene los contactos que tienen un número de teléfono específico.
   * @param type El tipo de teléfono a buscar.
   * @param numberPhone El número de teléfono a buscar.
   * @returns Los contactos que tienen el número de teléfono específico, incluyendo sus teléfonos y direcciones.
 */
  async getContactsByPhone(type: string, numberPhone: string) {
    try {
      
      return await this.contactRepository.getContactsByPhone(type, numberPhone);

    } catch (error) {
      console.error('Error al obtener los contactos por numero de telefono:', error);
      throw new Error('No se pudieron obtener los contactos debido a un error');
    }
  }

  /**
   * Obtiene los contactos que tienen una direccion especifica.
   * @param locality La localidad de la dirección a buscar.
   * @param street La calle de la dirección a buscar.
   * @param numberStreet El numero de la calle de la direccion a buscar.
   * @returns Los contactos que tienen la direccion especifica, incluyendo sus telefonos y direcciones.
   * @throws NotFoundException si no se encuentran contactos con la dirección especificada.
 */
  async getContactsByAddress(locality: string): Promise<ContactDto[]> {
    try {

      return await this.contactRepository.getContactsByAddress(locality);

    } catch (error) {
      console.error('Error al intentar recuperar contacto por domicilio:', error);
      throw new Error('Fallo recuperación de contact');
    }
  }

 /**
  * Elimina un contacto por su tipo de documento y numero de documento.
  * @param documentType El tipo de documento del contacto a eliminar.
  * @param documentNumber El número de documento del contacto a eliminar.
  * @returns Una promesa que se resuelve cuando se elimina el contacto.
  * @throws NotFoundException si no se encuentra el contacto.
  */
  async deleteContact(documentType: string, documentNumber: string): Promise<void> {
    try {

       await this.contactRepository.deleteContact(documentType, documentNumber);
        
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      throw new Error('Fallo eliminación de contacto');
    }
  }

  /**
   * Actualiza un contacto buscado por tipo de documento y número de documento, una vez encontrado se puede actualizar sus datos personales,
   * telefonos y domicilios.
   * @param documentType El tipo de documento del contacto a actualizar.
   * @param documentNumber El número de documento del contacto a actualizar.
   * @returns Una promesa que se resuelve con los datos actualizados del contacto.
   * @throws NotFoundException si no se encuentra el contacto.
  */
  async updateContact(documentType:string, documentNumber:string,contactDto: ContactDto): Promise<ContactDto> {
    try {
      // Buscar el contacto existente para actualizar
      return await this.contactRepository.updateContact(documentType, documentNumber, contactDto);

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
  private async dtoToPrimaInput(contactDto: ContactDto): Promise<Prisma.ContactCreateInput> {
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
        phone: {
          create: phoneData,
        },
        address: {
          create: addressData,
        },
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
  private async getPhones(phoneDto: PhoneDto[]): Promise<Prisma.PhoneCreateWithoutContactInput[]> {
    try {
      const phoneData: Prisma.PhoneCreateWithoutContactInput[] = phoneDto.map((phoneItem) => ({
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
  private async getAddresses(addresses: AddressDto[]): Promise<Prisma.AddressCreateWithoutContactInput[]> {
    try {
      const addressData: Prisma.AddressCreateWithoutContactInput[] = addresses.map((addressItem) => ({
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
}
