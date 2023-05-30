import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Contact } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('contacts')
  async createUser(@Body() contactData: Contact) {
    return this.prisma.contact.create({ data: contactData });
  }
}
