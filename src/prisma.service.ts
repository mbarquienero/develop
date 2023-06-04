import {Injectable} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService {
	private readonly prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	get contact() {
		return this.prisma.contact;
	}

	get address() {
		return this.prisma.address;
	}

	get phone() {
		return this.prisma.phone;
	}
}
