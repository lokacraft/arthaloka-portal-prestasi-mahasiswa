# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mahasiswa.spec.ts >> 🎓 Skenario Mahasiswa >> Skenario 1 - Pelaporan Mandiri (Individu) >> Mahasiswa dapat melihat status PENDING di halaman riwayat
- Location: e2e\mahasiswa.spec.ts:293:9

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
  195 | 
  196 |     test('Memilih tanggal Maret menyebabkan semester otomatis GENAP', async ({ page }) => {
  197 |       await page.goto('/lapor');
  198 |       await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
  199 | 
  200 |       const tanggalMulaiBtn = page.locator('button').filter({ hasText: /pilih waktu mulai/i }).first();
  201 |       if (await tanggalMulaiBtn.isVisible()) {
  202 |         await tanggalMulaiBtn.click();
  203 |         await page.waitForSelector('[role="grid"]');
  204 | 
  205 |         // Navigasi ke Maret
  206 |         let attempts = 0;
  207 |         const header = page.locator('[role="presentation"]').first();
  208 |         while (!(await header.textContent())?.includes('Maret') && attempts < 12) {
  209 |           const direction = (await header.textContent() || '').includes('April') ||
  210 |             (await header.textContent() || '').includes('Mei') ? 'prev' : 'next';
  211 |           const navBtn = direction === 'next'
  212 |             ? page.locator('button[name="next-month"]').first()
  213 |             : page.locator('button[name="prev-month"]').first();
  214 |           await navBtn.click();
  215 |           attempts++;
  216 |         }
  217 | 
  218 |         const dayCell = page.locator('[role="gridcell"]').filter({ hasText: /^10$/ }).first();
  219 |         await dayCell.click();
  220 |       }
  221 | 
  222 |       const genapRadio = page.locator('#sem-GENAP');
  223 |       await expect(genapRadio).toBeChecked({ timeout: 3000 });
  224 |     });
  225 | 
  226 |   });
  227 | 
  228 |   // ──────────────────────────────────────────────────────────────────────────
  229 |   // Skenario 1: Pelaporan Mandiri (Individu)
  230 |   // ──────────────────────────────────────────────────────────────────────────
  231 | 
  232 |   test.describe('Skenario 1 - Pelaporan Mandiri (Individu)', () => {
  233 | 
  234 |     test('Mahasiswa dapat mengisi form dan submit prestasi individu', async ({ page }) => {
  235 |       await page.goto('/lapor');
  236 |       await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
  237 | 
  238 |       // Isi form
  239 |       await page.fill(
  240 |         'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
  241 |         'Juara 1 Lomba Coding Nasional - E2E Test'
  242 |       );
  243 |       await page.fill(
  244 |         'input[placeholder="Contoh: Kementerian Pendidikan"]',
  245 |         'Kemendikbud - E2E Test'
  246 |       );
  247 | 
  248 |       // Pilih tanggal mulai dan selesai
  249 |       const buttons = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
  250 |       if (await buttons.count() > 0) {
  251 |         await buttons.first().click();
  252 |         await page.waitForSelector('[role="grid"]');
  253 |         await page.locator('[role="gridcell"]').filter({ hasText: /^15$/ }).first().click();
  254 |       }
  255 | 
  256 |       const selesaiButtons = page.locator('button').filter({ hasText: /pilih waktu selesai/i });
  257 |       if (await selesaiButtons.count() > 0) {
  258 |         await selesaiButtons.first().click();
  259 |         await page.waitForSelector('[role="grid"]');
  260 |         await page.locator('[role="gridcell"]').filter({ hasText: /^20$/ }).first().click();
  261 |       }
  262 | 
  263 |       // Upload 2 file bukti
  264 |       const pdfFile = createDummyPdf('sertifikat-e2e.pdf', 100);
  265 |       const pngFile = createDummyPng('bukti-e2e.png', 50);
  266 |       const fileInput = page.locator('input[type="file"][multiple]');
  267 |       await fileInput.setInputFiles([pdfFile, pngFile]);
  268 | 
  269 |       // Verifikasi 2 file muncul di daftar
  270 |       await expect(page.getByText('sertifikat-e2e.pdf')).toBeVisible({ timeout: 5000 });
  271 |       await expect(page.getByText('bukti-e2e.png')).toBeVisible({ timeout: 5000 });
  272 | 
  273 |       // Submit form
  274 |       await page.getByRole('button', { name: /submit untuk verifikasi/i }).click();
  275 | 
  276 |       // Dialog konfirmasi muncul
  277 |       await expect(page.getByRole('alertdialog')).toBeVisible({ timeout: 5000 });
  278 |       await expect(page.getByText('Konfirmasi Pengajuan')).toBeVisible();
  279 | 
  280 |       // Konfirmasi submit
  281 |       await page.getByRole('button', { name: /ya, kirim sekarang/i }).click();
  282 | 
  283 |       // Setelah sukses, harus redirect ke /dashboard
  284 |       await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
  285 | 
  286 |       // Cek toast sukses
  287 |       const successToast = page.locator('[data-sonner-toast]').filter({
  288 |         hasText: /berhasil/i,
  289 |       });
  290 |       await expect(successToast).toBeVisible({ timeout: 15000 });
  291 |     });
  292 | 
  293 |     test('Mahasiswa dapat melihat status PENDING di halaman riwayat', async ({ page }) => {
  294 |       await page.goto('/riwayat');
> 295 |       await expect(page.getByText('Riwayat Pengajuan')).toBeVisible();
      |                                                         ^ Error: expect(locator).toBeVisible() failed
  296 | 
  297 |       // Setidaknya ada satu baris data
  298 |       await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10000 });
  299 | 
  300 |       // Kolom status harus menampilkan badge Pending atau Valid atau Ditolak
  301 |       const statusBadge = page.locator('tbody tr').first().locator('span').filter({
  302 |         hasText: /pending|valid|ditolak/i,
  303 |       });
  304 |       await expect(statusBadge).toBeVisible();
  305 |     });
  306 | 
  307 |     test('Navigasi menu Lapor dari sidebar berfungsi', async ({ page }) => {
  308 |       // Klik menu "Lapor" di navigasi
  309 |       const laporLink = page.getByRole('link', { name: /lapor/i }).first();
  310 |       await laporLink.click();
  311 |       await expect(page).toHaveURL(/\/lapor/);
  312 |       await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
  313 |     });
  314 | 
  315 |   });
  316 | 
  317 |   // ──────────────────────────────────────────────────────────────────────────
  318 |   // Skenario 4: Partisipasi Tim
  319 |   // ──────────────────────────────────────────────────────────────────────────
  320 | 
  321 |   test.describe('Skenario 4 - Partisipasi Tim', () => {
  322 | 
  323 |     test('Mahasiswa dapat mengaktifkan mode Tim dan menambah 2 anggota', async ({ page }) => {
  324 |       await page.goto('/lapor');
  325 |       await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
  326 | 
  327 |       // Aktifkan switch Tim
  328 |       const switchTim = page.locator('[role="switch"]').first();
  329 |       await switchTim.click();
  330 | 
  331 |       // Verifikasi tampilan beralih ke "Regu / Tim"
  332 |       await expect(page.getByText('Regu / Tim')).toBeVisible({ timeout: 3000 });
  333 |       await expect(page.getByText('Anggota Tim')).toBeVisible({ timeout: 3000 });
  334 | 
  335 |       // Isi anggota pertama (sudah ada 1 slot default)
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
```