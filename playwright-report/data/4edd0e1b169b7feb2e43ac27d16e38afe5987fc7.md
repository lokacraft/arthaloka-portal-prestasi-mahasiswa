# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mahasiswa.spec.ts >> 🎓 Skenario Mahasiswa >> Skenario 3 - Notifikasi Balikan >> Halaman notifikasi dapat diakses dan menampilkan konten
- Location: e2e\mahasiswa.spec.ts:517:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').or(locator('h2'))
Expected: visible
Error: strict mode violation: locator('h1').or(locator('h2')) resolved to 2 elements:
    1) <h2 class="text-xl font-bold text-[#50C878]">…</h2> aka getByRole('heading', { name: 'Portal Data Prestasi' })
    2) <h1 class="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Notifikasi</h1> aka getByRole('heading', { name: 'Notifikasi', exact: true })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').or(locator('h2'))

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
            - button "Kembali" [ref=e66] [cursor=pointer]:
              - img [ref=e67]
              - text: Kembali
            - generic [ref=e69]:
              - generic [ref=e70]:
                - heading "Notifikasi" [level=1] [ref=e71]
                - paragraph [ref=e72]: 0 notifikasi belum dibaca
              - button "Hapus yang Dibaca" [ref=e74] [cursor=pointer]:
                - img
                - text: Hapus yang Dibaca
          - generic [ref=e75]:
            - generic [ref=e76]:
              - button "Semua (5)" [ref=e77] [cursor=pointer]
              - button "Belum Dibaca (2)" [ref=e78] [cursor=pointer]
            - generic [ref=e80]:
              - img [ref=e81]
              - heading "Belum Ada Notifikasi" [level=3] [ref=e84]
              - paragraph [ref=e85]: Anda belum memiliki notifikasi apapun saat ini.
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e91] [cursor=pointer]:
    - img [ref=e92]
  - alert [ref=e95]
```

# Test source

```ts
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
> 521 |       await expect(page.locator('h1').or(page.locator('h2'))).toBeVisible({ timeout: 5000 });
      |                                                               ^ Error: expect(locator).toBeVisible() failed
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
  555 |       // Toast error harus muncul (minimal 1 field wajib)
  556 |       const errorToast = page.locator('[data-sonner-toast]');
  557 |       await expect(errorToast).toBeVisible({ timeout: 5000 });
  558 |     });
  559 | 
  560 |     test('Submit tanpa file bukti menampilkan error dokumen wajib', async ({ page }) => {
  561 |       await page.goto('/lapor');
  562 | 
  563 |       // Isi field-field minimal
  564 |       await page.fill(
  565 |         'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
  566 |         'Test Tanpa File'
  567 |       );
  568 |       await page.fill(
  569 |         'input[placeholder="Contoh: Kementerian Pendidikan"]',
  570 |         'Penyelenggara Test'
  571 |       );
  572 | 
  573 |       // Pilih tanggal
  574 |       const mulaiBtns = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
  575 |       if (await mulaiBtns.count() > 0) {
  576 |         await mulaiBtns.first().click();
  577 |         await page.waitForSelector('[role="grid"]');
  578 |         await page.locator('[role="gridcell"]').filter({ hasText: /^3$/ }).first().click();
  579 |       }
  580 |       const selesaiBtns = page.locator('button').filter({ hasText: /pilih waktu selesai/i });
  581 |       if (await selesaiBtns.count() > 0) {
  582 |         await selesaiBtns.first().click();
  583 |         await page.waitForSelector('[role="grid"]');
  584 |         await page.locator('[role="gridcell"]').filter({ hasText: /^5$/ }).first().click();
  585 |       }
  586 | 
  587 |       await page.getByRole('button', { name: /submit untuk verifikasi/i }).click();
  588 | 
  589 |       // Error tentang dokumen wajib
  590 |       const errorToast = page.locator('[data-sonner-toast]');
  591 |       await expect(errorToast).toBeVisible({ timeout: 5000 });
  592 |       await expect(errorToast).toContainText(/dokumen|sertifikat|wajib/i);
  593 |     });
  594 | 
  595 |     test('Tombol Batal mengembalikan ke halaman sebelumnya', async ({ page }) => {
  596 |       await page.goto('/lapor');
  597 |       await page.getByRole('button', { name: /batal/i }).click();
  598 |       // Harus navigasi kembali
  599 |       await expect(page).not.toHaveURL(/\/lapor/);
  600 |     });
  601 | 
  602 |   });
  603 | 
  604 | });
  605 | 
```