import prisma from '../src/lib/prisma';

async function main() {
  console.log('Memulai eksekusi seeder database...');

  // =========================================================
  // 1. Seeder untuk Tabel ROLE
  // =========================================================
  const roles = [
    { name: 'MAHASISWA', description: 'Role akses standar untuk mahasiswa' },
    { name: 'ADMIN', description: 'Administrator sistem portal prestasi' },
    { name: 'AKREDITASI', description: 'Tim akreditasi untuk rekap dan pelaporan' },
    { name: 'WD', description: 'Wakil Dekan bidang kemahasiswaan' },
  ];

  console.log('\n[1/4] Menambahkan data Role...');
  for (const role of roles) {
    // Menggunakan upsert agar script aman dijalankan berulang kali (idempotent)
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
    console.log(`  ✔️ Role: ${role.name}`);
  }

  // =========================================================
  // 2. Seeder untuk Tabel PROGRAM STUDI (Contoh Master Data)
  // =========================================================
  const programStudiList = [
    { nama: 'S1 Teknik Informatika' },
    { nama: 'S1 Sistem Informasi' },
    { nama: 'S1 Sains Data' },
    { nama: 'D3 Manajemen Informatika' },
  ];

  console.log('\n[2/4] Menambahkan data Program Studi...');
  for (const prodi of programStudiList) {
    await prisma.programStudi.upsert({
      where: { nama: prodi.nama },
      update: {},
      create: prodi,
    });
    console.log(`  ✔️ Program Studi: ${prodi.nama}`);
  }

  // =========================================================
  // 3. Seeder untuk Tabel KATEGORI PRESTASI
  // =========================================================
  const kategoriList = [
    { nama: 'Akademik', keterangan: 'Olimpiade, Karya Tulis Ilmiah, Lomba Cerdas Cermat, dll.' },
    { nama: 'Seni', keterangan: 'Tari, Paduan Suara, Melukis, Fotografi, dll.' },
    { nama: 'Olahraga', keterangan: 'Futsal, Basket, E-Sports, Atletik, dll.' },
    { nama: 'Keagamaan', keterangan: 'MTQ, Hafiz Qur\'an, dll.' },
  ];

  console.log('\n[3/4] Menambahkan data Kategori Prestasi...');
  for (const kategori of kategoriList) {
    await prisma.kategoriPrestasi.upsert({
      where: { nama: kategori.nama },
      update: { keterangan: kategori.keterangan },
      create: kategori,
    });
    console.log(`  ✔️ Kategori: ${kategori.nama}`);
  }

  // =========================================================
  // 4. Seeder untuk Tabel TINGKAT PRESTASI
  // =========================================================
  const tingkatList = [
    { nama: 'Universitas', bobotPoin: 10 },
    { nama: 'Kabupaten/Kota', bobotPoin: 20 },
    { nama: 'Provinsi', bobotPoin: 30 },
    { nama: 'Nasional', bobotPoin: 40 },
    { nama: 'Internasional', bobotPoin: 50 },
  ];

  console.log('\n[4/4] Menambahkan data Tingkat Prestasi...');
  for (const tingkat of tingkatList) {
    await prisma.tingkatPrestasi.upsert({
      where: { nama: tingkat.nama },
      update: { bobotPoin: tingkat.bobotPoin },
      create: tingkat,
    });
    console.log(`  ✔️ Tingkat: ${tingkat.nama} (Poin: ${tingkat.bobotPoin})`);
  }

  console.log('\n🎉 Seeder berhasil dieksekusi dengan sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat menjalankan seeder:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
