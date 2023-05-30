import { PrismaClient } from '@prisma/client';
import { contacts } from '../data/contacts';

const prisma = new PrismaClient();

async function main() {
    await prisma.contact.createMany({
        data: contacts,
    });
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })