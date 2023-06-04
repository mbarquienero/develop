import {Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {ContactsService} from './contacts/contacts.service';
import {ContactsController} from './contacts/contacts.controller';
import {PrismaModule} from './prisma/prisma.module';
import {ContactsModule} from './contacts/contacts.module';

@Module({
	controllers: [ContactsController],
	providers: [PrismaService, ContactsService],
	imports: [PrismaModule, ContactsModule],
})
export class AppModule {}
