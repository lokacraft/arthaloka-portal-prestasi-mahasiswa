"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/lib/prisma"));
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
        { name: 'KAPRODI', description: 'Kepala Program Studi Teknik Industri' },
    ];
    console.log('\n[1/5] Menambahkan data Role...');
    for (const role of roles) {
        await prisma_1.default.role.upsert({
            where: { name: role.name },
            update: { description: role.description },
            create: role,
        });
        console.log(`  ✔️ Role: ${role.name}`);
    }
    // =========================================================
    // 2. Seeder untuk Tabel PROGRAM STUDI
    // =========================================================
    const programStudiList = [
        { nama: 'Teknik Logistik' },
        { nama: 'Teknik Industri' },
        { nama: 'Manajemen Rekayasa Industri' },
    ];
    console.log('\n[2/5] Menambahkan data Program Studi...');
    for (const prodi of programStudiList) {
        await prisma_1.default.programStudi.upsert({
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
        { nama: 'Non Akademik', keterangan: 'Tari, Paduan Suara, Melukis, Fotografi, dll.' }
    ];
    console.log('\n[3/5] Menambahkan data Kategori Prestasi...');
    for (const kategori of kategoriList) {
        await prisma_1.default.kategoriPrestasi.upsert({
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
        { nama: 'Wilayah', bobotPoin: 30 },
        { nama: 'Nasional', bobotPoin: 40 },
        { nama: 'Internasional', bobotPoin: 50 },
    ];
    console.log('\n[4/5] Menambahkan data Tingkat Prestasi...');
    for (const tingkat of tingkatList) {
        await prisma_1.default.tingkatPrestasi.upsert({
            where: { nama: tingkat.nama },
            update: { bobotPoin: tingkat.bobotPoin },
            create: tingkat,
        });
        console.log(`  ✔️ Tingkat: ${tingkat.nama} (Poin: ${tingkat.bobotPoin})`);
    }
    // =========================================================
    // 5. Seeder untuk TARGET AKREDITASI (default)
    // =========================================================
    const targetList = [
        { kodeTarget: 'RI', nama: 'Target Rasio Internasional', nilaiPersen: 0.2 },
        { kodeTarget: 'RN', nama: 'Target Rasio Nasional', nilaiPersen: 2.0 },
        { kodeTarget: 'RW', nama: 'Target Rasio Wilayah/Lokal', nilaiPersen: 4.0 },
    ];
    console.log('\n[5/5] Menambahkan data Target Akreditasi...');
    for (const target of targetList) {
        await prisma_1.default.targetAkreditasi.upsert({
            where: { kodeTarget: target.kodeTarget },
            update: { nilaiPersen: target.nilaiPersen },
            create: target,
        });
        console.log(`  ✔️ Target: ${target.kodeTarget} = ${target.nilaiPersen}%`);
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
    await prisma_1.default.$disconnect();
});
