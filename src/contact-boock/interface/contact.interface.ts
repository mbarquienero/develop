
import { Contact } from '@prisma/client';
import { ContactDto } from '../dto/contact';

export interface IContact {
  createContact(contactData: Contact): Promise<Contact>;

  findContactByEmail(email: string);

  searchContactsByPersonalData(searchData: ContactDto);

  getContactsByPhone(type: string, numberPhone: string);

  getContactsByAddress(locality: string): Promise<ContactDto[]>;

  deleteContact(documentType: string, documentNumber: string): Promise<void>;
  
  updateContact(documentType:string, documentNumber:string, contactDto: ContactDto): Promise<ContactDto>;
}