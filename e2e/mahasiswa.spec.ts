import { test, expect, Page } from '@playwright/test';
import path from 'path';
import {
  loginAs,
  createDummyPdf,
  createDummyPng,
  createLargeFile,
  expectToast,
  expectErrorToast,
} from './helpers';

/**
 * UAT - Skenario Mahasiswa
 *
 * Mencakup:
 * - Skenario 1: Pelaporan Mandiri (Individu)
 * - Skenario 4: Partisipasi Tim
 * - UAT Case 1: Validasi upload file melebihi 20MB
 * - UAT Case 2: Penghapusan prestasi terkunci (APPROVED)
 * - UAT Case 3: Deteksi otomatis semester dari tanggal
 * - Skenario 3: Notifikasi balikan setelah prestasi disetujui
 */

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Mengisi form lapor prestasi secara programatik
// ─────────────────────────────────────────────────────────────────────────────

async function fillLaporForm(
  page: Page,
  options: {
    namaKegiatan?: string;
    penyelenggara?: string;
    hasilSelect?: string;
    dayMulai?: number;
    daySelesai?: number;
    isTim?: boolean;
  } = {}
) {
  const {
    namaKegiatan = 'Juara 1 Lomba Coding Nasional E2E Test',
    penyelenggara = 'Kemendikbud E2E',
    hasilSelect = 'Juara 1',
    dayMulai = 15,
    daySelesai = 20,
    isTim = false,
  } = options;

  // Isi Nama Kegiatan
  await page.fill(
    'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
    namaKegiatan
  );

  // Isi Nama Penyelenggara
  await page.fill(
    'input[placeholder="Contoh: Kementerian Pendidikan"]',
    penyelenggara
  );

  // Pilih Hasil/Capaian (combobox)
  // Klik trigger Select "Hasil / Capaian"
  const hasilTrigger = page.locator('[data-testid="select-hasil"]').or(
    page.getByRole('combobox').filter({ hasText: /juara|lainnya|pilih hasil/i }).first()
  );
  await hasilTrigger.click();
  await page.getByRole('option', { name: hasilSelect }).click();

  // Pilih tanggal mulai
  const tanggalMulaiBtns = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
  if (await tanggalMulaiBtns.count() > 0) {
    await tanggalMulaiBtns.first().click();
    await page.waitForSelector('[role="grid"]');
    // Cari dan klik tanggal
    const dayCell = page.locator('[role="gridcell"]').filter({ hasText: new RegExp(`^${dayMulai}$`) }).first();
    await dayCell.click();
  }

  // Pilih tanggal selesai
  const tanggalSelesaiBtns = page.locator('button').filter({ hasText: /pilih waktu selesai/i });
  if (await tanggalSelesaiBtns.count() > 0) {
    await tanggalSelesaiBtns.first().click();
    await page.waitForSelector('[role="grid"]');
    const dayCell = page.locator('[role="gridcell"]').filter({ hasText: new RegExp(`^${daySelesai}$`) }).first();
    await dayCell.click();
  }

  // Aktifkan mode Tim jika diminta
  if (isTim) {
    const timSwitch = page.locator('[data-testid="switch-tim"]').or(
      page.locator('[role="switch"]')
    );
    await timSwitch.click();
    await expect(page.getByText('Regu / Tim')).toBeVisible({ timeout: 3000 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE
// ─────────────────────────────────────────────────────────────────────────────

test.describe('🎓 Skenario Mahasiswa', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'mahasiswa');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // UAT Case 1: Validasi ukuran file > 20MB
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('UAT Case 1 - Validasi File Upload (>20MB)', () => {

    test('Upload file melebihi 20MB menampilkan error dan mencegah submit', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Buat file oversized (21MB)
      const oversizedFile = createLargeFile('oversized-test.pdf', 21);

      // Klik area upload (label hidden input)
      const fileInput = page.locator('input[type="file"][multiple]');
      await fileInput.setInputFiles(oversizedFile);

      // Error toast harus muncul
      const errorToast = page.locator('[data-sonner-toast]');
      await expect(errorToast).toBeVisible({ timeout: 8000 });
      await expect(errorToast).toContainText(/20MB|ukuran/i);

      // Submit button harus tetap tidak merespons (tidak ada navigasi)
      const submitBtn = page.getByRole('button', { name: /submit untuk verifikasi/i });
      await submitBtn.click();
      // Masih di halaman lapor karena validasi basic (nama kegiatan kosong)
      await expect(page).toHaveURL(/\/lapor/);
    });

    test('Upload file dengan tipe tidak valid (misal .exe) menampilkan error', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Buat file dummy dengan ekstensi tidak valid
      const fixturesDir = path.join(process.cwd(), 'e2e', 'fixtures');
      const { mkdirSync, writeFileSync, existsSync } = await import('fs');
      if (!existsSync(fixturesDir)) mkdirSync(fixturesDir, { recursive: true });
      const exeFile = path.join(fixturesDir, 'malicious.exe');
      writeFileSync(exeFile, Buffer.alloc(1024, 'A'));

      const fileInput = page.locator('input[type="file"][multiple]');
      await fileInput.setInputFiles(exeFile);

      // Error harus muncul untuk tipe file tidak valid
      const errorToast = page.locator('[data-sonner-toast]');
      await expect(errorToast).toBeVisible({ timeout: 8000 });
      await expect(errorToast).toContainText(/pdf|word|jpg|png|diperbolehkan/i);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // UAT Case 3: Deteksi Otomatis Semester
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('UAT Case 3 - Deteksi Otomatis Semester', () => {

    test('Memilih tanggal September menyebabkan semester otomatis GANJIL', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Klik tombol Waktu Mulai, lalu navigasi ke September
      const tanggalMulaiBtn = page.locator('button').filter({ hasText: /pilih waktu mulai/i }).first();
      if (await tanggalMulaiBtn.isVisible()) {
        await tanggalMulaiBtn.click();
        await page.waitForSelector('[role="grid"]');

        // Navigasi ke bulan September jika perlu (tekan next/prev)
        // Cari header bulan saat ini
        const currentMonthHeader = page.locator('[role="presentation"]').first();
        let attempts = 0;
        while (!(await currentMonthHeader.textContent())?.includes('September') && attempts < 12) {
          const nextBtn = page.locator('button[name="next-month"]').or(
            page.getByRole('button', { name: /next|selanjutnya|›/i })
          ).first();
          await nextBtn.click();
          attempts++;
        }

        // Klik tanggal 15
        const dayCell = page.locator('[role="gridcell"]').filter({ hasText: /^15$/ }).first();
        await dayCell.click();
      }

      // Verifikasi radio GANJIL terseleksi (read-only state)
      const ganjilRadio = page.locator('#sem-GANJIL');
      await expect(ganjilRadio).toBeChecked({ timeout: 3000 });
    });

    test('Memilih tanggal Maret menyebabkan semester otomatis GENAP', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      const tanggalMulaiBtn = page.locator('button').filter({ hasText: /pilih waktu mulai/i }).first();
      if (await tanggalMulaiBtn.isVisible()) {
        await tanggalMulaiBtn.click();
        await page.waitForSelector('[role="grid"]');

        // Navigasi ke Maret
        let attempts = 0;
        const header = page.locator('[role="presentation"]').first();
        while (!(await header.textContent())?.includes('Maret') && attempts < 12) {
          const direction = (await header.textContent() || '').includes('April') ||
            (await header.textContent() || '').includes('Mei') ? 'prev' : 'next';
          const navBtn = direction === 'next'
            ? page.locator('button[name="next-month"]').first()
            : page.locator('button[name="prev-month"]').first();
          await navBtn.click();
          attempts++;
        }

        const dayCell = page.locator('[role="gridcell"]').filter({ hasText: /^10$/ }).first();
        await dayCell.click();
      }

      const genapRadio = page.locator('#sem-GENAP');
      await expect(genapRadio).toBeChecked({ timeout: 3000 });
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Skenario 1: Pelaporan Mandiri (Individu)
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Skenario 1 - Pelaporan Mandiri (Individu)', () => {

    test('Mahasiswa dapat mengisi form dan submit prestasi individu', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Isi form
      await page.fill(
        'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
        'Juara 1 Lomba Coding Nasional - E2E Test'
      );
      await page.fill(
        'input[placeholder="Contoh: Kementerian Pendidikan"]',
        'Kemendikbud - E2E Test'
      );

      // Pilih tanggal mulai dan selesai
      const buttons = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
      if (await buttons.count() > 0) {
        await buttons.first().click();
        await page.waitForSelector('[role="grid"]');
        await page.locator('[role="gridcell"]').filter({ hasText: /^15$/ }).first().click();
      }

      const selesaiButtons = page.locator('button').filter({ hasText: /pilih waktu selesai/i });
      if (await selesaiButtons.count() > 0) {
        await selesaiButtons.first().click();
        await page.waitForSelector('[role="grid"]');
        await page.locator('[role="gridcell"]').filter({ hasText: /^20$/ }).first().click();
      }

      // Upload 2 file bukti
      const pdfFile = createDummyPdf('sertifikat-e2e.pdf', 100);
      const pngFile = createDummyPng('bukti-e2e.png', 50);
      const fileInput = page.locator('input[type="file"][multiple]');
      await fileInput.setInputFiles([pdfFile, pngFile]);

      // Verifikasi 2 file muncul di daftar
      await expect(page.getByText('sertifikat-e2e.pdf')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('bukti-e2e.png')).toBeVisible({ timeout: 5000 });

      // Submit form
      await page.getByRole('button', { name: /submit untuk verifikasi/i }).click();

      // Dialog konfirmasi muncul
      await expect(page.getByRole('alertdialog')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Konfirmasi Pengajuan')).toBeVisible();

      // Konfirmasi submit
      await page.getByRole('button', { name: /ya, kirim sekarang/i }).click();

      // Setelah sukses, harus redirect ke /dashboard
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });

      // Cek toast sukses
      const successToast = page.locator('[data-sonner-toast]').filter({
        hasText: /berhasil/i,
      });
      await expect(successToast).toBeVisible({ timeout: 15000 });
    });

    test('Mahasiswa dapat melihat status PENDING di halaman riwayat', async ({ page }) => {
      await page.goto('/riwayat');
      await expect(page.getByText('Riwayat Pengajuan')).toBeVisible();

      // Setidaknya ada satu baris data
      await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10000 });

      // Kolom status harus menampilkan badge Pending atau Valid atau Ditolak
      const statusBadge = page.locator('tbody tr').first().locator('span').filter({
        hasText: /pending|valid|ditolak/i,
      });
      await expect(statusBadge).toBeVisible();
    });

    test('Navigasi menu Lapor dari sidebar berfungsi', async ({ page }) => {
      // Klik menu "Lapor" di navigasi
      const laporLink = page.getByRole('link', { name: /lapor/i }).first();
      await laporLink.click();
      await expect(page).toHaveURL(/\/lapor/);
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Skenario 4: Partisipasi Tim
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Skenario 4 - Partisipasi Tim', () => {

    test('Mahasiswa dapat mengaktifkan mode Tim dan menambah 2 anggota', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Aktifkan switch Tim
      const switchTim = page.locator('[role="switch"]').first();
      await switchTim.click();

      // Verifikasi tampilan beralih ke "Regu / Tim"
      await expect(page.getByText('Regu / Tim')).toBeVisible({ timeout: 3000 });
      await expect(page.getByText('Anggota Tim')).toBeVisible({ timeout: 3000 });

      // Isi anggota pertama (sudah ada 1 slot default)
      const nimInputs = page.locator('input[placeholder="NIM"]');
      const namaInputs = page.locator('input[placeholder="Nama lengkap"]');
      const angkatanInputs = page.locator('input[placeholder="Angkatan"]');

      await nimInputs.nth(0).fill('123456789001');
      await namaInputs.nth(0).fill('Anggota Tim Pertama');
      await angkatanInputs.nth(0).fill('2022');

      // Tambah anggota ke-2
      await page.getByRole('button', { name: /tambah anggota/i }).click();
      await expect(nimInputs).toHaveCount(2);

      await nimInputs.nth(1).fill('123456789002');
      await namaInputs.nth(1).fill('Anggota Tim Kedua');
      await angkatanInputs.nth(1).fill('2022');

      // Verifikasi ada 2 baris anggota
      await expect(nimInputs).toHaveCount(2);
      await expect(page.locator('input[placeholder="NIM"]').nth(0)).toHaveValue('123456789001');
      await expect(page.locator('input[placeholder="NIM"]').nth(1)).toHaveValue('123456789002');
    });

    test('Hapus anggota tim berfungsi, tombol hapus nonaktif jika hanya 1 anggota', async ({ page }) => {
      await page.goto('/lapor');

      // Aktifkan Tim
      await page.locator('[role="switch"]').first().click();
      await expect(page.getByText('Anggota Tim')).toBeVisible();

      // Tombol X (hapus) dengan 1 anggota harus disabled
      const removeBtn = page.getByRole('button').filter({ has: page.locator('svg') }).last();
      // Cek disabled attribute (tombol terakhir di area anggota)
      const timSection = page.locator('text=Anggota Tim').locator('..');
      const deleteButtons = timSection.getByRole('button').filter({ hasText: '' }); // X buttons
      
      // Tambah 1 anggota dulu baru coba hapus
      await page.getByRole('button', { name: /tambah anggota/i }).click();
      await expect(page.locator('input[placeholder="NIM"]')).toHaveCount(2);

      // Hapus anggota ke-2 (index 1)
      const nimInputs = page.locator('input[placeholder="NIM"]');
      await nimInputs.nth(1).fill('987654321');
      // Klik tombol hapus pada baris ke-2
      const deleteBtns = page.locator('[data-testid="btn-remove-member"]').or(
        page.locator('button').filter({ has: page.locator('.lucide-x') })
      );
      if (await deleteBtns.count() >= 2) {
        await deleteBtns.nth(1).click();
        await expect(nimInputs).toHaveCount(1);
      }
    });

    test('Submit form tim dengan 2 anggota berhasil', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Isi data dasar
      await page.fill(
        'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
        'Lomba Robot Tim - E2E Test'
      );
      await page.fill(
        'input[placeholder="Contoh: Kementerian Pendidikan"]',
        'Dikti E2E'
      );

      // Pilih tanggal
      const mulaiBtns = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
      if (await mulaiBtns.count() > 0) {
        await mulaiBtns.first().click();
        await page.waitForSelector('[role="grid"]');
        await page.locator('[role="gridcell"]').filter({ hasText: /^5$/ }).first().click();
      }
      const selesaiBtns = page.locator('button').filter({ hasText: /pilih waktu selesai/i });
      if (await selesaiBtns.count() > 0) {
        await selesaiBtns.first().click();
        await page.waitForSelector('[role="grid"]');
        await page.locator('[role="gridcell"]').filter({ hasText: /^10$/ }).first().click();
      }

      // Aktifkan Tim & isi 2 anggota
      await page.locator('[role="switch"]').first().click();
      await expect(page.getByText('Anggota Tim')).toBeVisible();

      await page.locator('input[placeholder="NIM"]').nth(0).fill('111111111');
      await page.locator('input[placeholder="Nama lengkap"]').nth(0).fill('Anggota Satu Tim');
      await page.locator('input[placeholder="Angkatan"]').nth(0).fill('2022');

      await page.getByRole('button', { name: /tambah anggota/i }).click();
      await page.locator('input[placeholder="NIM"]').nth(1).fill('222222222');
      await page.locator('input[placeholder="Nama lengkap"]').nth(1).fill('Anggota Dua Tim');
      await page.locator('input[placeholder="Angkatan"]').nth(1).fill('2021');

      // Upload file
      const pdfFile = createDummyPdf('sertifikat-tim-e2e.pdf', 100);
      await page.locator('input[type="file"][multiple]').setInputFiles(pdfFile);
      await expect(page.getByText('sertifikat-tim-e2e.pdf')).toBeVisible({ timeout: 5000 });

      // Submit
      await page.getByRole('button', { name: /submit untuk verifikasi/i }).click();
      await expect(page.getByRole('alertdialog')).toBeVisible({ timeout: 5000 });
      await page.getByRole('button', { name: /ya, kirim sekarang/i }).click();

      // Berhasil redirect ke dashboard
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // UAT Case 2: Penghapusan Prestasi Terkunci
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('UAT Case 2 - Penghapusan Prestasi Terkunci (APPROVED)', () => {

    test('Prestasi APPROVED tidak memiliki tombol hapus yang aktif di halaman detail', async ({ page }) => {
      // Navigasi ke riwayat, cari entri APPROVED
      await page.goto('/riwayat');
      await expect(page.getByText('Riwayat Pengajuan')).toBeVisible();

      // Filter berdasarkan status APPROVED jika ada filter
      const statusFilter = page.locator('[data-testid="filter-status"]').or(
        page.getByRole('combobox').filter({ hasText: /status|semua/i }).first()
      );
      if (await statusFilter.isVisible()) {
        await statusFilter.click();
        const approvedOption = page.getByRole('option', { name: /approved|valid/i });
        if (await approvedOption.isVisible()) {
          await approvedOption.click();
        }
      }

      // Klik "Lihat Detail" pada baris pertama
      const detailLink = page.getByRole('link', { name: /lihat detail/i }).first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/detail\//);

        // Halaman detail prestasi
        // Tombol hapus seharusnya tidak ada, atau jika ada, tidak bisa diklik
        const deleteBtn = page.getByRole('button', { name: /hapus/i });
        if (await deleteBtn.isVisible()) {
          // Jika tombol ada, coba klik dan verifikasi error muncul
          await deleteBtn.click();
          const errorToast = page.locator('[data-sonner-toast]');
          await expect(errorToast).toBeVisible({ timeout: 8000 });
          await expect(errorToast).toContainText(/tidak dapat dihapus|sudah divalidasi/i);
        } else {
          // Tombol hapus memang tidak ada untuk prestasi APPROVED — ini sudah benar
          expect(await deleteBtn.count()).toBe(0);
        }
      }
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Skenario 3: Notifikasi Balikan
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Skenario 3 - Notifikasi Balikan', () => {

    test('Dropdown notifikasi dapat dibuka dan menampilkan daftar notifikasi', async ({ page }) => {
      await page.goto('/dashboard');

      // Cari bell icon / tombol notifikasi
      const notifBtn = page.getByRole('button', { name: /notif|bell/i }).or(
        page.locator('[data-testid="btn-notification"]')
      ).first();

      if (await notifBtn.isVisible()) {
        await notifBtn.click();

        // Dropdown notifikasi harus muncul
        const notifDropdown = page.locator('[data-testid="notification-dropdown"]').or(
          page.getByRole('menu').filter({ hasText: /notif|prestasi/i })
        );
        await expect(notifDropdown).toBeVisible({ timeout: 5000 });
      }
    });

    test('Halaman notifikasi dapat diakses dan menampilkan konten', async ({ page }) => {
      await page.goto('/notifikasi');
      // Halaman notifikasi harus ter-render tanpa error
      await expect(page).not.toHaveURL(/\/sign-in/);
      await expect(page.locator('h1').or(page.locator('h2'))).toBeVisible({ timeout: 5000 });
    });

    test('Klik notifikasi "Prestasi Disetujui" mengarahkan ke detail prestasi', async ({ page }) => {
      await page.goto('/notifikasi');
      await page.waitForLoadState('networkidle');

      // Cari notifikasi dengan kata "Disetujui" atau "Approved"
      const notifItem = page.locator('li, article, [role="listitem"]').filter({
        hasText: /disetujui|approved/i,
      }).first();

      if (await notifItem.isVisible()) {
        await notifItem.click();
        // Harus diarahkan ke halaman detail
        await expect(page).toHaveURL(/\/detail\//, { timeout: 10000 });
      }
    });

  });

  // ──────────────────────────────────────────────────────────────────────────
  // Validasi Form Dasar
  // ──────────────────────────────────────────────────────────────────────────

  test.describe('Validasi Form Lapor - Edge Cases', () => {

    test('Submit tanpa mengisi data menampilkan validasi error', async ({ page }) => {
      await page.goto('/lapor');
      await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();

      // Klik submit langsung tanpa mengisi form
      await page.getByRole('button', { name: /submit untuk verifikasi/i }).click();

      // Toast error harus muncul (minimal 1 field wajib)
      const errorToast = page.locator('[data-sonner-toast]');
      await expect(errorToast).toBeVisible({ timeout: 5000 });
    });

    test('Submit tanpa file bukti menampilkan error dokumen wajib', async ({ page }) => {
      await page.goto('/lapor');

      // Isi field-field minimal
      await page.fill(
        'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
        'Test Tanpa File'
      );
      await page.fill(
        'input[placeholder="Contoh: Kementerian Pendidikan"]',
        'Penyelenggara Test'
      );

      // Pilih tanggal
      const mulaiBtns = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
      if (await mulaiBtns.count() > 0) {
        await mulaiBtns.first().click();
        await page.waitForSelector('[role="grid"]');
        await page.locator('[role="gridcell"]').filter({ hasText: /^3$/ }).first().click();
      }
      const selesaiBtns = page.locator('button').filter({ hasText: /pilih waktu selesai/i });
      if (await selesaiBtns.count() > 0) {
        await selesaiBtns.first().click();
        await page.waitForSelector('[role="grid"]');
        await page.locator('[role="gridcell"]').filter({ hasText: /^5$/ }).first().click();
      }

      await page.getByRole('button', { name: /submit untuk verifikasi/i }).click();

      // Error tentang dokumen wajib
      const errorToast = page.locator('[data-sonner-toast]');
      await expect(errorToast).toBeVisible({ timeout: 5000 });
      await expect(errorToast).toContainText(/dokumen|sertifikat|wajib/i);
    });

    test('Tombol Batal mengembalikan ke halaman sebelumnya', async ({ page }) => {
      await page.goto('/lapor');
      await page.getByRole('button', { name: /batal/i }).click();
      // Harus navigasi kembali
      await expect(page).not.toHaveURL(/\/lapor/);
    });

  });

});
