# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mahasiswa.spec.ts >> 🎓 Skenario Mahasiswa >> Skenario 4 - Partisipasi Tim >> Submit form tim dengan 2 anggota berhasil
- Location: e2e\mahasiswa.spec.ts:388:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('alertdialog')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('alertdialog')

```

```yaml
- heading "Portal Data Prestasi" [level=2]
- text: S1 Teknik Industri
- list:
  - listitem:
    - link "Dashboard":
      - /url: /dashboard
  - listitem:
    - link "Laporkan Prestasi":
      - /url: /lapor
  - listitem:
    - link "Riwayat Pengajuan":
      - /url: /riwayat
- list:
  - listitem:
    - button "Logout"
- main:
  - button "Toggle Sidebar":
    - img
    - text: Toggle Sidebar
  - button "2"
  - button "mahasiswa-test mahasiswa.test@telkomuniversity.ac.id"
  - main:
    - heading "Laporkan Prestasi Baru" [level=2]
    - paragraph: Isi semua data dengan benar sesuai dokumen pendukung.
    - text: Program Studi *
    - combobox: Manajemen Rekayasa Industri
    - text: NIM Mahasiswa
    - textbox: "282316"
    - text: Angkatan
    - button "2026":
      - button "2026"
    - text: Tahun Kegiatan
    - button "2026":
      - button "2026"
    - text: Semester
    - radiogroup:
      - radio "Ganjil"
      - text: Ganjil
      - radio "Genap" [checked]
      - text: Genap
    - paragraph:
      - img
      - text: Auto-detected dari tanggal pelaksanaan (Pola Semester Tel-U)
    - text: Nama Kegiatan
    - 'textbox "Contoh: Lomba Karya Tulis Ilmiah Nasional"'
    - text: Penyelenggara
    - 'textbox "Contoh: Kementerian Pendidikan"': Dikti E2E
    - text: Kategori Prestasi
    - radiogroup:
      - radio "Akademik" [checked]
      - text: Akademik
      - radio "Non Akademik"
      - text: Non Akademik
    - text: Jenis Lomba
    - radiogroup:
      - radio "BELMAWA"
      - text: BELMAWA
      - radio "MANDIRI" [checked]
      - text: MANDIRI
    - text: Tingkat / Level
    - radiogroup:
      - radio "Internasional" [checked]
      - text: Internasional
      - radio "Nasional"
      - text: Nasional
      - radio "Wilayah"
      - text: Wilayah
    - text: Hasil / Capaian
    - combobox: Juara 1
    - text: Waktu Mulai
    - button "5 Mei 2026":
      - button "5 Mei 2026"
    - text: Waktu Selesai
    - button "10 Mei 2026":
      - button "10 Mei 2026"
    - text: Tempat Pelaksanaan Provinsi
    - combobox [disabled]: N/A (Internasional)
    - text: Kota / Kabupaten
    - combobox [disabled]: N/A
    - text: Nama Lokasi / Gedung (opsional)
    - 'textbox "Contoh: Auditorium Universitas Indonesia"'
    - text: Tipe Partisipasi
    - paragraph: Regu / Tim
    - text: Individu
    - switch [checked]
    - text: Tim Anggota Tim
    - textbox "NIM": "111111111"
    - textbox "Nama lengkap": Anggota Satu Tim
    - textbox "Angkatan": "2022"
    - button
    - textbox "NIM": "222222222"
    - textbox "Nama lengkap": Anggota Dua Tim
    - textbox "Angkatan": "2021"
    - button
    - button "Tambah Anggota"
    - text: "Sertifikat/Dokumen Pendukung/SK Lomba *(Wajib: Sertifikat/SK + Bukti Pendukung)"
    - paragraph: Maks. 10 file, PDF/Word/JPG/PNG
    - text: "Seret atau klik untuk memilih file Wajib: Sertifikat/SK + Bukti Pendukung (1/10 file dipilih)"
    - link "Download Template Bukti Pendukung (.docx)":
      - /url: /assets/Template-Bukti-Pendukung.docx
      - img
      - text: Download Template Bukti Pendukung (.docx)
    - paragraph: sertifikat-tim-e2e.pdf
    - paragraph: 0.10 MB
    - button
    - button "Batal"
    - button "Submit untuk Verifikasi"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  336 |       const nimInputs = page.locator('input[placeholder="NIM"]');
  337 |       const namaInputs = page.locator('input[placeholder="Nama lengkap"]');
  338 |       const angkatanInputs = page.locator('input[placeholder="Angkatan"]');
  339 | 
  340 |       await nimInputs.nth(0).fill('123456789001');
  341 |       await namaInputs.nth(0).fill('Anggota Tim Pertama');
  342 |       await angkatanInputs.nth(0).fill('2022');
  343 | 
  344 |       // Tambah anggota ke-2
  345 |       await page.getByRole('button', { name: /tambah anggota/i }).click();
  346 |       await expect(nimInputs).toHaveCount(2);
  347 | 
  348 |       await nimInputs.nth(1).fill('123456789002');
  349 |       await namaInputs.nth(1).fill('Anggota Tim Kedua');
  350 |       await angkatanInputs.nth(1).fill('2022');
  351 | 
  352 |       // Verifikasi ada 2 baris anggota
  353 |       await expect(nimInputs).toHaveCount(2);
  354 |       await expect(page.locator('input[placeholder="NIM"]').nth(0)).toHaveValue('123456789001');
  355 |       await expect(page.locator('input[placeholder="NIM"]').nth(1)).toHaveValue('123456789002');
  356 |     });
  357 | 
  358 |     test('Hapus anggota tim berfungsi, tombol hapus nonaktif jika hanya 1 anggota', async ({ page }) => {
  359 |       await page.goto('/lapor');
  360 | 
  361 |       // Aktifkan Tim
  362 |       await page.locator('[role="switch"]').first().click();
  363 |       await expect(page.getByText('Anggota Tim')).toBeVisible();
  364 | 
  365 |       // Tombol X (hapus) dengan 1 anggota harus disabled
  366 |       const removeBtn = page.getByRole('button').filter({ has: page.locator('svg') }).last();
  367 |       // Cek disabled attribute (tombol terakhir di area anggota)
  368 |       const timSection = page.locator('text=Anggota Tim').locator('..');
  369 |       const deleteButtons = timSection.getByRole('button').filter({ hasText: '' }); // X buttons
  370 |       
  371 |       // Tambah 1 anggota dulu baru coba hapus
  372 |       await page.getByRole('button', { name: /tambah anggota/i }).click();
  373 |       await expect(page.locator('input[placeholder="NIM"]')).toHaveCount(2);
  374 | 
  375 |       // Hapus anggota ke-2 (index 1)
  376 |       const nimInputs = page.locator('input[placeholder="NIM"]');
  377 |       await nimInputs.nth(1).fill('987654321');
  378 |       // Klik tombol hapus pada baris ke-2
  379 |       const deleteBtns = page.locator('[data-testid="btn-remove-member"]').or(
  380 |         page.locator('button').filter({ has: page.locator('.lucide-x') })
  381 |       );
  382 |       if (await deleteBtns.count() >= 2) {
  383 |         await deleteBtns.nth(1).click();
  384 |         await expect(nimInputs).toHaveCount(1);
  385 |       }
  386 |     });
  387 | 
  388 |     test('Submit form tim dengan 2 anggota berhasil', async ({ page }) => {
  389 |       await page.goto('/lapor');
  390 |       await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
  391 | 
  392 |       // Isi data dasar
  393 |       await page.fill(
  394 |         'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
  395 |         'Lomba Robot Tim - E2E Test'
  396 |       );
  397 |       await page.fill(
  398 |         'input[placeholder="Contoh: Kementerian Pendidikan"]',
  399 |         'Dikti E2E'
  400 |       );
  401 | 
  402 |       // Pilih tanggal
  403 |       const mulaiBtns = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
  404 |       if (await mulaiBtns.count() > 0) {
  405 |         await mulaiBtns.first().click();
  406 |         await page.waitForSelector('[role="grid"]');
  407 |         await page.locator('[role="gridcell"]').filter({ hasText: /^5$/ }).first().click();
  408 |       }
  409 |       const selesaiBtns = page.locator('button').filter({ hasText: /pilih waktu selesai/i });
  410 |       if (await selesaiBtns.count() > 0) {
  411 |         await selesaiBtns.first().click();
  412 |         await page.waitForSelector('[role="grid"]');
  413 |         await page.locator('[role="gridcell"]').filter({ hasText: /^10$/ }).first().click();
  414 |       }
  415 | 
  416 |       // Aktifkan Tim & isi 2 anggota
  417 |       await page.locator('[role="switch"]').first().click();
  418 |       await expect(page.getByText('Anggota Tim')).toBeVisible();
  419 | 
  420 |       await page.locator('input[placeholder="NIM"]').nth(0).fill('111111111');
  421 |       await page.locator('input[placeholder="Nama lengkap"]').nth(0).fill('Anggota Satu Tim');
  422 |       await page.locator('input[placeholder="Angkatan"]').nth(0).fill('2022');
  423 | 
  424 |       await page.getByRole('button', { name: /tambah anggota/i }).click();
  425 |       await page.locator('input[placeholder="NIM"]').nth(1).fill('222222222');
  426 |       await page.locator('input[placeholder="Nama lengkap"]').nth(1).fill('Anggota Dua Tim');
  427 |       await page.locator('input[placeholder="Angkatan"]').nth(1).fill('2021');
  428 | 
  429 |       // Upload file
  430 |       const pdfFile = createDummyPdf('sertifikat-tim-e2e.pdf', 100);
  431 |       await page.locator('input[type="file"][multiple]').setInputFiles(pdfFile);
  432 |       await expect(page.getByText('sertifikat-tim-e2e.pdf')).toBeVisible({ timeout: 5000 });
  433 | 
  434 |       // Submit
  435 |       await page.getByRole('button', { name: /submit untuk verifikasi/i }).click();
> 436 |       await expect(page.getByRole('alertdialog')).toBeVisible({ timeout: 5000 });
      |                                                   ^ Error: expect(locator).toBeVisible() failed
  437 |       await page.getByRole('button', { name: /ya, kirim sekarang/i }).click();
  438 | 
  439 |       // Berhasil redirect ke dashboard
  440 |       await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
  441 |     });
  442 | 
  443 |   });
  444 | 
  445 |   // ──────────────────────────────────────────────────────────────────────────
  446 |   // UAT Case 2: Penghapusan Prestasi Terkunci
  447 |   // ──────────────────────────────────────────────────────────────────────────
  448 | 
  449 |   test.describe('UAT Case 2 - Penghapusan Prestasi Terkunci (APPROVED)', () => {
  450 | 
  451 |     test('Prestasi APPROVED tidak memiliki tombol hapus yang aktif di halaman detail', async ({ page }) => {
  452 |       // Navigasi ke riwayat, cari entri APPROVED
  453 |       await page.goto('/riwayat');
  454 |       await expect(page.getByText('Riwayat Pengajuan')).toBeVisible();
  455 | 
  456 |       // Filter berdasarkan status APPROVED jika ada filter
  457 |       const statusFilter = page.locator('[data-testid="filter-status"]').or(
  458 |         page.getByRole('combobox').filter({ hasText: /status|semua/i }).first()
  459 |       );
  460 |       if (await statusFilter.isVisible()) {
  461 |         await statusFilter.click();
  462 |         const approvedOption = page.getByRole('option', { name: /approved|valid/i });
  463 |         if (await approvedOption.isVisible()) {
  464 |           await approvedOption.click();
  465 |         }
  466 |       }
  467 | 
  468 |       // Klik "Lihat Detail" pada baris pertama
  469 |       const detailLink = page.getByRole('link', { name: /lihat detail/i }).first();
  470 |       if (await detailLink.isVisible()) {
  471 |         await detailLink.click();
  472 |         await page.waitForURL(/\/detail\//);
  473 | 
  474 |         // Halaman detail prestasi
  475 |         // Tombol hapus seharusnya tidak ada, atau jika ada, tidak bisa diklik
  476 |         const deleteBtn = page.getByRole('button', { name: /hapus/i });
  477 |         if (await deleteBtn.isVisible()) {
  478 |           // Jika tombol ada, coba klik dan verifikasi error muncul
  479 |           await deleteBtn.click();
  480 |           const errorToast = page.locator('[data-sonner-toast]');
  481 |           await expect(errorToast).toBeVisible({ timeout: 8000 });
  482 |           await expect(errorToast).toContainText(/tidak dapat dihapus|sudah divalidasi/i);
  483 |         } else {
  484 |           // Tombol hapus memang tidak ada untuk prestasi APPROVED — ini sudah benar
  485 |           expect(await deleteBtn.count()).toBe(0);
  486 |         }
  487 |       }
  488 |     });
  489 | 
  490 |   });
  491 | 
  492 |   // ──────────────────────────────────────────────────────────────────────────
  493 |   // Skenario 3: Notifikasi Balikan
  494 |   // ──────────────────────────────────────────────────────────────────────────
  495 | 
  496 |   test.describe('Skenario 3 - Notifikasi Balikan', () => {
  497 | 
  498 |     test('Dropdown notifikasi dapat dibuka dan menampilkan daftar notifikasi', async ({ page }) => {
  499 |       await page.goto('/dashboard');
  500 | 
  501 |       // Cari bell icon / tombol notifikasi
  502 |       const notifBtn = page.getByRole('button', { name: /notif|bell/i }).or(
  503 |         page.locator('[data-testid="btn-notification"]')
  504 |       ).first();
  505 | 
  506 |       if (await notifBtn.isVisible()) {
  507 |         await notifBtn.click();
  508 | 
  509 |         // Dropdown notifikasi harus muncul
  510 |         const notifDropdown = page.locator('[data-testid="notification-dropdown"]').or(
  511 |           page.getByRole('menu').filter({ hasText: /notif|prestasi/i })
  512 |         );
  513 |         await expect(notifDropdown).toBeVisible({ timeout: 5000 });
  514 |       }
  515 |     });
  516 | 
  517 |     test('Halaman notifikasi dapat diakses dan menampilkan konten', async ({ page }) => {
  518 |       await page.goto('/notifikasi');
  519 |       // Halaman notifikasi harus ter-render tanpa error
  520 |       await expect(page).not.toHaveURL(/\/sign-in/);
  521 |       await expect(page.locator('h1').or(page.locator('h2'))).toBeVisible({ timeout: 5000 });
  522 |     });
  523 | 
  524 |     test('Klik notifikasi "Prestasi Disetujui" mengarahkan ke detail prestasi', async ({ page }) => {
  525 |       await page.goto('/notifikasi');
  526 |       await page.waitForLoadState('networkidle');
  527 | 
  528 |       // Cari notifikasi dengan kata "Disetujui" atau "Approved"
  529 |       const notifItem = page.locator('li, article, [role="listitem"]').filter({
  530 |         hasText: /disetujui|approved/i,
  531 |       }).first();
  532 | 
  533 |       if (await notifItem.isVisible()) {
  534 |         await notifItem.click();
  535 |         // Harus diarahkan ke halaman detail
  536 |         await expect(page).toHaveURL(/\/detail\//, { timeout: 10000 });
```