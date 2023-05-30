import { NotFoundException } from '@nestjs/common';
import { Contact, Prisma, Address, Phone } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { IContact } from '../interface/contact.interface';
import { ContactDto } from '../dto/contact';

export class ContactRepository implements IContact {

    constructor(private prisma: PrismaService) { 
      this.prisma = new PrismaService();
    }


  async createContact(contactData: Prisma.ContactCreateInput): Promise<Contact> {
    try {
        return await this.prisma.contact.create({
          data: contactData,
        });
      
      } catch (error) {
        console.error('Error al crear el contacto:', error);
        throw new Error('No se pudo crear el contacto debido a un error');
        }
  }

  async findContactByEmail(email: string) {
    try {
        return await this.prisma.contact.findFirst({
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

  async searchContactsByPersonalData(searchData: ContactDto) {
    try {
      // Obtener los numeros de teléfono y tipos de teléfono de searchData
      const phoneNumbers = searchData.phone.map((phone) => phone.numberPhone);
      const phoneTypes = searchData.phone.map((phone) => phone.type);

      // Obtener las localidades, calles y números de calle de searchData.address
      const localities = searchData.address.map((address) => address.locality);
      const streets = searchData.address.map((address) => address.street);
      const numberStreets = searchData.address.map((address) => address.numberStreet);

      return await this.prisma.contact.findMany({
        where: {
          OR: [
          { firstName: searchData?.firstName },
          { lastName: searchData?.lastName },
          { documentType: searchData?.documentType },
          { documentNumber: searchData?.documentNumber },
          { age: searchData?.age },
          { phone: { some: { numberPhone: { in: phoneNumbers }, type: { in: phoneTypes } } } }, 
          { address: { some: { 
            locality: { in: localities },
            street: { in: streets },
            numberStreet: { in: numberStreets },
                } } },
          ],
        },
        include: {
            phone: true,
            address: true,
        },
      });

    } catch (error) {
      console.error('Error al buscar los contactos por datos personales:', error);
      throw new Error('No se pudo encontrar los contactos debido a un error');
    }
  }

  async getContactsByPhone(type: string, numberPhone: string) {
    try {
      return await this.prisma.contact.findMany({
        where: {
          phone: {
            some: {
              type,
              numberPhone,
            },
          },
        },
        include: {
          phone: true,
          address: true,
        },
      });

    } catch (error) {
      console.error('Error al obtener los contactos por numero de telefono:', error);
      throw new Error('No se pudieron obtener los contactos debido a un error');
    }
  }

  async getContactsByAddress(locality: string): Promise<ContactDto[]> {
    try {
      const contacts =  await this.prisma.contact.findMany({
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

      if (!contacts) {
        throw new NotFoundException('Contacts not found');
      }

      // Prisma.Contact to ContactDto (arrays)
      const contactDtos = contacts.map((contact) => {
        const contactDto: ContactDto = {
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          documentType: contact.documentType,
          documentNumber: contact.documentNumber,
          age: contact.age,
          email: contact.email,
          phoneId: contact.phone[0].id,
          addressId: contact.address[0].id,
          phone: contact.phone.map((phone) => ({
            id: phone.id,
            type: phone.type,
            numberPhone: phone.numberPhone,
            Contact: contact,
            contactId: contact.id,
          })),
          address: contact.address.map((address) => ({
            id: address.id,
            locality: address.locality,
            street: address.street,
            numberStreet: address.numberStreet,
            description: address.description,
            Contact: contact,
            contactId: contact.id
          })),
        };
        return contactDto;
      });

      return contactDtos;

    } catch (error) {
      console.error('Error al intentar recuperar contacto por domicilio:', error);
      throw new Error('Fallo recuperación de contact');
    }
  }

  async deleteContact(documentType: string, documentNumber: string): Promise<void> {
    try {
      const contact = await this.prisma.contact.findFirst({
        where: {
          documentType,
          documentNumber: parseInt(documentNumber, 10),
        },
      });

      if (!contact) {
        throw new NotFoundException('Contact not found');
      }

      await this.prisma.contact.delete({
        where: {
          id: contact.id,
        },
      });

    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      throw new Error('Fallo eliminación de contacto');
    }
  }

  async updateContact(documentType:string, documentNumber:string, contactDto: ContactDto): Promise<ContactDto> {
    try {
    // Buscar el contacto existente para actualizar
    const existingContact = await this.prisma.contact.findFirst({
      where: {
        documentType,
        documentNumber: parseInt(documentNumber, 10),
      },
      include: { phone: true, address: true },
    });

    if (!existingContact) {
      throw new NotFoundException('Contact not found');
    }

    // Actualizar los números de teléfono del contacto
    const updatedPhones = await Promise.all(
      existingContact.phone.map(async (phone: Phone) => {
        const updatedPhone = await this.prisma.phone.update({
          where: { id: phone.id },
          data: {
            type: phone.type,
            numberPhone: phone.numberPhone,
          },
        });
        return updatedPhone;
      }),
    );

    // Actualizar las direcciones del contacto
    const updatedAddresses = await Promise.all(
      existingContact.address.map(async (address: Address) => {
        const updatedAddress = await this.prisma.address.update({
          where: { id: address.id },
          data: {
            locality: address.locality,
            street: address.street,
            numberStreet: address.numberStreet,
            description: address.description,
          },
        });
        return updatedAddress;
      }),
    );

    // Actualizar los datos generales del contacto
    const updatedContact = await this.prisma.contact.update({
      where: { id: existingContact.id },
      data: {
        firstName: existingContact.firstName,
        lastName: existingContact.lastName,
        age: existingContact.age,
        email: existingContact.email,
        
        phone: {
          set: updatedPhones.map((phone) => ({ id: phone.id })),
        },
        address: {
          set: updatedAddresses.map((address) => ({ id: address.id })),
        },
      },
      include: { phone: true, address: true },
    });

    // retorna el contacto actualizado con sus datos que fueron modificados
    return {
      id: updatedContact.id,
      firstName: updatedContact.firstName,
      lastName: updatedContact.lastName,
      documentType: updatedContact.documentType,
      documentNumber: updatedContact.documentNumber,
      age: updatedContact.age,
      email: updatedContact.email,
      phoneId: updatedContact.phone[0].id,
      addressId: updatedContact.address[0].id,
      phone: updatedContact.phone.map((phone) => ({
        id: phone.id,
        type: phone.type,
        numberPhone: phone.numberPhone,
        Contact: existingContact,
        contactId: existingContact.id,
      })),
      address: updatedContact.address.map((address) => ({
        id: address.id,
        locality: address.locality,
        street: address.street,
        numberStreet: address.numberStreet,
        description: address.description,
        Contact: existingContact,
        contactId: existingContact.id
      })),
    };

    } catch (error) {
      console.error('Error al actualizar contacto:', error);
      throw new Error('Fallo actualizacion de contacto');
    }
  }
}