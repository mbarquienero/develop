import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ContactService } from './contact-boock/service/contact.service';
import { ContactController } from './contact-boock/controller/contact.controller';
import { ContactRepository } from './contact-boock/repository/contact.repository';


@Module({
  controllers: [ContactController],
  providers: [PrismaService, ContactService, ContactRepository],
})
export class AppModule {}