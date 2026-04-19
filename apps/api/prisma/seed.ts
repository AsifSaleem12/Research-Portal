import { PrismaClient } from '@prisma/client';
import { seedDemoData } from '../src/prisma/demo-seed';

const prisma = new PrismaClient();

async function main() {
  await seedDemoData(prisma, { reset: true });
  console.log('LGU research portal seed completed.');
  console.log('Demo login: areeba.ahmed@lgu.edu.pk / Password123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
