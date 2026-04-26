import prisma from '../src/lib/prisma';

async function main() {
  const cols = await prisma.$queryRawUnsafe(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'prestasi' ORDER BY column_name`
  );
  console.log(JSON.stringify(cols, null, 2));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
