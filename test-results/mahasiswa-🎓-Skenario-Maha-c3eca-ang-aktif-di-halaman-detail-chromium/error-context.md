# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mahasiswa.spec.ts >> 🎓 Skenario Mahasiswa >> UAT Case 2 - Penghapusan Prestasi Terkunci (APPROVED) >> Prestasi APPROVED tidak memiliki tombol hapus yang aktif di halaman detail
- Location: e2e\mahasiswa.spec.ts:451:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Riwayat Pengajuan')
Expected: visible
Error: strict mode violation: getByText('Riwayat Pengajuan') resolved to 2 elements:
    1) <span class="font-medium">Riwayat Pengajuan</span> aka getByRole('link', { name: 'Riwayat Pengajuan' })
    2) <h1 class="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Riwayat Pengajuan</h1> aka getByRole('heading', { name: 'Riwayat Pengajuan' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Riwayat Pengajuan')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e7]:
        - heading "Portal Data Prestasi" [level=2] [ref=e8]:
          - text: Portal Data
          - text: Prestasi
        - generic [ref=e9]: S1 Teknik Industri
      - list [ref=e13]:
        - listitem [ref=e14]:
          - link "Dashboard" [ref=e15] [cursor=pointer]:
            - /url: /dashboard
            - img [ref=e16]
            - generic [ref=e19]: Dashboard
        - listitem [ref=e20]:
          - link "Laporkan Prestasi" [ref=e21] [cursor=pointer]:
            - /url: /lapor
            - img [ref=e22]
            - generic [ref=e25]: Laporkan Prestasi
        - listitem [ref=e26]:
          - link "Riwayat Pengajuan" [ref=e27] [cursor=pointer]:
            - /url: /riwayat
            - img [ref=e28]
            - generic [ref=e32]: Riwayat Pengajuan
      - list [ref=e34]:
        - listitem [ref=e35]:
          - button "Logout" [ref=e36] [cursor=pointer]:
            - img [ref=e37]
            - generic [ref=e40]: Logout
    - main [ref=e41]:
      - generic [ref=e42]:
        - button "Toggle Sidebar" [ref=e44] [cursor=pointer]:
          - img
          - generic [ref=e45]: Toggle Sidebar
        - generic [ref=e46]:
          - button [ref=e47] [cursor=pointer]:
            - img [ref=e48]
          - button "mahasiswa-test mahasiswa.test@telkomuniversity.ac.id" [ref=e51] [cursor=pointer]:
            - generic [ref=e52]:
              - generic [ref=e53]:
                - generic [ref=e54]: mahasiswa-test
                - generic [ref=e55]: mahasiswa.test@telkomuniversity.ac.id
              - img [ref=e58]
              - img [ref=e61]
      - main [ref=e63]:
        - generic [ref=e64]:
          - generic [ref=e65]:
            - heading "Riwayat Pengajuan" [level=1] [ref=e66]
            - paragraph [ref=e67]: Lihat semua prestasi yang pernah Anda laporkan
          - generic [ref=e68]:
            - generic [ref=e69]:
              - generic [ref=e70]:
                - img [ref=e71]
                - textbox "Cari nama kegiatan..." [ref=e74]
              - generic [ref=e75]:
                - combobox [ref=e76] [cursor=pointer]:
                  - generic [ref=e77]: all
                  - img
                - textbox [ref=e78]: all
              - generic [ref=e79]:
                - combobox [ref=e80] [cursor=pointer]:
                  - generic [ref=e81]: all
                  - img
                - textbox [ref=e82]: all
            - table [ref=e84]:
              - rowgroup [ref=e85]:
                - row "Tahun Nama Kegiatan Kategori Tingkat Status Tanggal Submit Aksi" [ref=e86]:
                  - columnheader "Tahun" [ref=e87]
                  - columnheader "Nama Kegiatan" [ref=e88]
                  - columnheader "Kategori" [ref=e89]
                  - columnheader "Tingkat" [ref=e90]
                  - columnheader "Status" [ref=e91]
                  - columnheader "Tanggal Submit" [ref=e92]
                  - columnheader "Aksi" [ref=e93]
              - rowgroup [ref=e94]:
                - row "2026 Juara 1 Lomba Coding Nasional - E2E Test Akademik Internasional Pending 30 Mei 2026 Lihat Detail" [ref=e95]:
                  - cell "2026" [ref=e96]
                  - cell "Juara 1 Lomba Coding Nasional - E2E Test" [ref=e97]:
                    - generic [ref=e98]: Juara 1 Lomba Coding Nasional - E2E Test
                  - cell "Akademik" [ref=e99]
                  - cell "Internasional" [ref=e100]
                  - cell "Pending" [ref=e101]:
                    - generic [ref=e102]: Pending
                  - cell "30 Mei 2026" [ref=e103]
                  - cell "Lihat Detail" [ref=e104]:
                    - link "Lihat Detail" [ref=e105] [cursor=pointer]:
                      - /url: /detail/cmpr8vxwk000gvkw76miqqjdi
                      - img [ref=e106]
                      - text: Lihat Detail
                - row "2022 test 3 Akademik Internasional Valid 30 Mei 2026 Lihat Detail" [ref=e109]:
                  - cell "2022" [ref=e110]
                  - cell "test 3" [ref=e111]:
                    - generic [ref=e112]: test 3
                  - cell "Akademik" [ref=e113]
                  - cell "Internasional" [ref=e114]
                  - cell "Valid" [ref=e115]:
                    - generic [ref=e116]: Valid
                  - cell "30 Mei 2026" [ref=e117]
                  - cell "Lihat Detail" [ref=e118]:
                    - link "Lihat Detail" [ref=e119] [cursor=pointer]:
                      - /url: /detail/cmpr87m3q000avkw7fnuy0vzj
                      - img [ref=e120]
                      - text: Lihat Detail
                - row "2026 Juara 1 Lomba Coding Nasional - E2E Test Akademik Internasional Valid 29 Mei 2026 Lihat Detail" [ref=e123]:
                  - cell "2026" [ref=e124]
                  - cell "Juara 1 Lomba Coding Nasional - E2E Test" [ref=e125]:
                    - generic [ref=e126]: Juara 1 Lomba Coding Nasional - E2E Test
                  - cell "Akademik" [ref=e127]
                  - cell "Internasional" [ref=e128]
                  - cell "Valid" [ref=e129]:
                    - generic [ref=e130]: Valid
                  - cell "29 Mei 2026" [ref=e131]
                  - cell "Lihat Detail" [ref=e132]:
                    - link "Lihat Detail" [ref=e133] [cursor=pointer]:
                      - /url: /detail/cmpr0l0u00000ykw7ih8rlu9k
                      - img [ref=e134]
                      - text: Lihat Detail
            - generic [ref=e137]:
              - generic [ref=e138]: Menampilkan 1–3 dari 3 pengajuan
              - generic [ref=e139]:
                - generic [ref=e140]: "Per halaman:"
                - link "5" [ref=e141] [cursor=pointer]:
                  - /url: /riwayat?page=1&per_page=5
                - link "10" [ref=e142] [cursor=pointer]:
                  - /url: /riwayat?page=1&per_page=10
                - link "15" [ref=e143] [cursor=pointer]:
                  - /url: /riwayat?page=1&per_page=15
                - link "25" [ref=e144] [cursor=pointer]:
                  - /url: /riwayat?page=1&per_page=25
                - link "50" [ref=e145] [cursor=pointer]:
                  - /url: /riwayat?page=1&per_page=50
                - generic [ref=e147]: 1/1
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e153] [cursor=pointer]:
    - img [ref=e154]
  - alert [ref=e157]
```

# Test source

```ts
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
  436 |       await expect(page.getByRole('alertdialog')).toBeVisible({ timeout: 5000 });
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
> 454 |       await expect(page.getByText('Riwayat Pengajuan')).toBeVisible();
      |                                                         ^ Error: expect(locator).toBeVisible() failed
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
  537 |       }
  538 |     });
  539 | 
  540 |   });
  541 | 
  542 |   // ──────────────────────────────────────────────────────────────────────────
  543 |   // Validasi Form Dasar
  544 |   // ──────────────────────────────────────────────────────────────────────────
  545 | 
  546 |   test.describe('Validasi Form Lapor - Edge Cases', () => {
  547 | 
  548 |     test('Submit tanpa mengisi data menampilkan validasi error', async ({ page }) => {
  549 |       await page.goto('/lapor');
  550 |       await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
  551 | 
  552 |       // Klik submit langsung tanpa mengisi form
  553 |       await page.getByRole('button', { name: /submit untuk verifikasi/i }).click();
  554 | 
```