# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mahasiswa.spec.ts >> 🎓 Skenario Mahasiswa >> UAT Case 3 - Deteksi Otomatis Semester >> Memilih tanggal September menyebabkan semester otomatis GANJIL
- Location: e2e\mahasiswa.spec.ts:164:9

# Error details

```
TimeoutError: locator.textContent: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('[role="presentation"]').first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "2"
          - generic [ref=e15]: "3"
        - generic [ref=e16]:
          - text: Issue
          - generic [ref=e17]: s
      - button "Collapse issues badge" [ref=e18]:
        - img [ref=e19]
  - generic [ref=e21]:
    - generic [ref=e24]:
      - generic [ref=e26]:
        - heading "Portal Data Prestasi" [level=2] [ref=e27]:
          - text: Portal Data
          - text: Prestasi
        - generic [ref=e28]: S1 Teknik Industri
      - list [ref=e32]:
        - listitem [ref=e33]:
          - link "Dashboard" [ref=e34] [cursor=pointer]:
            - /url: /dashboard
            - img [ref=e35]
            - generic [ref=e38]: Dashboard
        - listitem [ref=e39]:
          - link "Laporkan Prestasi" [ref=e40] [cursor=pointer]:
            - /url: /lapor
            - img [ref=e41]
            - generic [ref=e44]: Laporkan Prestasi
        - listitem [ref=e45]:
          - link "Riwayat Pengajuan" [ref=e46] [cursor=pointer]:
            - /url: /riwayat
            - img [ref=e47]
            - generic [ref=e51]: Riwayat Pengajuan
      - list [ref=e53]:
        - listitem [ref=e54]:
          - button "Logout" [ref=e55] [cursor=pointer]:
            - img [ref=e56]
            - generic [ref=e59]: Logout
    - main [ref=e60]:
      - generic [ref=e61]:
        - button "Toggle Sidebar" [ref=e63] [cursor=pointer]:
          - img
          - generic [ref=e64]: Toggle Sidebar
        - generic [ref=e65]:
          - button "2" [ref=e66] [cursor=pointer]:
            - img [ref=e67]
            - generic [ref=e70]: "2"
          - button "mahasiswa-test mahasiswa.test@telkomuniversity.ac.id" [ref=e71] [cursor=pointer]:
            - generic [ref=e72]:
              - generic [ref=e73]:
                - generic [ref=e74]: mahasiswa-test
                - generic [ref=e75]: mahasiswa.test@telkomuniversity.ac.id
              - img [ref=e78]
              - img [ref=e81]
      - main [ref=e83]:
        - generic [ref=e85]:
          - generic [ref=e86]:
            - heading "Laporkan Prestasi Baru" [level=2] [ref=e87]
            - paragraph [ref=e88]: Isi semua data dengan benar sesuai dokumen pendukung.
          - generic [ref=e89]:
            - generic [ref=e90]:
              - generic [ref=e91]: Program Studi *
              - combobox [ref=e92] [cursor=pointer]:
                - generic [ref=e93]: Manajemen Rekayasa Industri
                - img
              - textbox [ref=e94]: cmpqywr7v0007r8w72myslojm
            - generic [ref=e95]:
              - generic [ref=e96]:
                - text: NIM Mahasiswa
                - textbox [ref=e97]: "282316"
              - generic [ref=e98]:
                - text: Angkatan
                - button "2026" [ref=e99] [cursor=pointer]:
                  - button "2026" [ref=e100]:
                    - generic [ref=e101]: "2026"
                    - img [ref=e102]
            - generic [ref=e104]:
              - generic [ref=e105]:
                - text: Tahun Kegiatan
                - button "2026" [ref=e106] [cursor=pointer]:
                  - button "2026" [ref=e107]:
                    - generic [ref=e108]: "2026"
                    - img [ref=e109]
              - generic [ref=e111]:
                - text: Semester
                - generic [ref=e112]:
                  - radiogroup:
                    - generic:
                      - radio "Ganjil" [checked]
                      - radio [checked]
                      - generic: Ganjil
                    - generic:
                      - radio "Genap"
                      - radio
                      - generic: Genap
                  - paragraph [ref=e113]:
                    - img [ref=e114]
                    - text: Auto-detected dari tanggal pelaksanaan (Pola Semester Tel-U)
            - generic [ref=e116]:
              - generic [ref=e117]:
                - text: Nama Kegiatan
                - 'textbox "Contoh: Lomba Karya Tulis Ilmiah Nasional" [ref=e118]'
              - generic [ref=e119]:
                - text: Penyelenggara
                - 'textbox "Contoh: Kementerian Pendidikan" [ref=e120]'
            - generic [ref=e121]:
              - generic [ref=e122]: Kategori Prestasi
              - radiogroup [ref=e123]:
                - generic [ref=e124]:
                  - radio "Akademik" [checked] [ref=e125]
                  - radio [checked] [ref=e128]
                  - generic [ref=e129] [cursor=pointer]: Akademik
                - generic [ref=e130]:
                  - radio "Non Akademik" [ref=e131]
                  - radio [ref=e132]
                  - generic [ref=e133] [cursor=pointer]: Non Akademik
            - generic [ref=e134]:
              - generic [ref=e135]: Jenis Lomba
              - radiogroup [ref=e136]:
                - generic [ref=e137]:
                  - radio "BELMAWA" [ref=e138]
                  - radio [ref=e139]
                  - generic [ref=e140] [cursor=pointer]: BELMAWA
                - generic [ref=e141]:
                  - radio "MANDIRI" [checked] [ref=e142]
                  - radio [checked] [ref=e145]
                  - generic [ref=e146] [cursor=pointer]: MANDIRI
            - generic [ref=e147]:
              - generic [ref=e148]: Tingkat / Level
              - radiogroup [ref=e149]:
                - generic [ref=e150]:
                  - radio "Internasional" [checked] [ref=e151]
                  - radio [checked] [ref=e154]
                  - generic [ref=e155] [cursor=pointer]: Internasional
                - generic [ref=e156]:
                  - radio "Nasional" [ref=e157]
                  - radio [ref=e158]
                  - generic [ref=e159] [cursor=pointer]: Nasional
                - generic [ref=e160]:
                  - radio "Wilayah" [ref=e161]
                  - radio [ref=e162]
                  - generic [ref=e163] [cursor=pointer]: Wilayah
            - generic [ref=e164]:
              - text: Hasil / Capaian
              - combobox [ref=e165] [cursor=pointer]:
                - generic [ref=e166]: Juara 1
                - img
              - textbox [ref=e167]: Juara 1
            - generic [ref=e168]:
              - generic [ref=e169]:
                - text: Waktu Mulai
                - button "Pilih waktu mulai" [ref=e170] [cursor=pointer]:
                  - button "Pilih waktu mulai" [ref=e171]:
                    - img [ref=e172]
                    - generic [ref=e174]: Pilih waktu mulai
              - generic [ref=e175]:
                - text: Waktu Selesai
                - button "Pilih waktu selesai" [ref=e176] [cursor=pointer]:
                  - button "Pilih waktu selesai" [ref=e177]:
                    - img [ref=e178]
                    - generic [ref=e180]: Pilih waktu selesai
            - generic [ref=e181]:
              - generic [ref=e182]: Tempat Pelaksanaan
              - generic [ref=e183]:
                - generic [ref=e184]:
                  - text: Provinsi
                  - combobox [disabled] [ref=e185]:
                    - generic [ref=e186]: N/A (Internasional)
                    - img
                  - textbox [disabled] [ref=e187]
                - generic [ref=e188]:
                  - text: Kota / Kabupaten
                  - combobox [disabled] [ref=e189]:
                    - generic [ref=e190]: N/A
                    - img
                  - textbox [disabled] [ref=e191]
              - generic [ref=e192]:
                - text: Nama Lokasi / Gedung (opsional)
                - 'textbox "Contoh: Auditorium Universitas Indonesia" [ref=e193]'
            - generic [ref=e195]:
              - generic [ref=e196]:
                - text: Tipe Partisipasi
                - paragraph [ref=e197]: Individu
              - generic [ref=e198]:
                - generic [ref=e199]: Individu
                - switch [ref=e200]
                - checkbox [ref=e201]
                - generic [ref=e202]: Tim
            - generic [ref=e203]:
              - generic [ref=e204]: "Sertifikat/Dokumen Pendukung/SK Lomba *(Wajib: Sertifikat/SK + Bukti Pendukung)"
              - paragraph [ref=e205]: Maks. 10 file, PDF/Word/JPG/PNG
              - generic [ref=e206] [cursor=pointer]:
                - img [ref=e207]
                - generic [ref=e210]: Seret atau klik untuk memilih file
                - generic [ref=e211]: "Wajib: Sertifikat/SK + Bukti Pendukung (0/10 file dipilih)"
              - link "Download Template Bukti Pendukung (.docx)" [ref=e212] [cursor=pointer]:
                - /url: /assets/Template-Bukti-Pendukung.docx
                - img [ref=e213]
                - text: Download Template Bukti Pendukung (.docx)
            - generic [ref=e215]:
              - button "Batal" [ref=e216] [cursor=pointer]
              - button "Submit untuk Verifikasi" [ref=e217] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=e218]
```

# Test source

```ts
  78  |   // Pilih tanggal selesai
  79  |   const tanggalSelesaiBtns = page.locator('button').filter({ hasText: /pilih waktu selesai/i });
  80  |   if (await tanggalSelesaiBtns.count() > 0) {
  81  |     await tanggalSelesaiBtns.first().click();
  82  |     await page.waitForSelector('[role="grid"]');
  83  |     const dayCell = page.locator('[role="gridcell"]').filter({ hasText: new RegExp(`^${daySelesai}$`) }).first();
  84  |     await dayCell.click();
  85  |   }
  86  | 
  87  |   // Aktifkan mode Tim jika diminta
  88  |   if (isTim) {
  89  |     const timSwitch = page.locator('[data-testid="switch-tim"]').or(
  90  |       page.locator('[role="switch"]')
  91  |     );
  92  |     await timSwitch.click();
  93  |     await expect(page.getByText('Regu / Tim')).toBeVisible({ timeout: 3000 });
  94  |   }
  95  | }
  96  | 
  97  | // ─────────────────────────────────────────────────────────────────────────────
  98  | // TEST SUITE
  99  | // ─────────────────────────────────────────────────────────────────────────────
  100 | 
  101 | test.describe('🎓 Skenario Mahasiswa', () => {
  102 | 
  103 |   test.beforeEach(async ({ page }) => {
  104 |     await loginAs(page, 'mahasiswa');
  105 |   });
  106 | 
  107 |   // ──────────────────────────────────────────────────────────────────────────
  108 |   // UAT Case 1: Validasi ukuran file > 20MB
  109 |   // ──────────────────────────────────────────────────────────────────────────
  110 | 
  111 |   test.describe('UAT Case 1 - Validasi File Upload (>20MB)', () => {
  112 | 
  113 |     test('Upload file melebihi 20MB menampilkan error dan mencegah submit', async ({ page }) => {
  114 |       await page.goto('/lapor');
  115 |       await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
  116 | 
  117 |       // Buat file oversized (21MB)
  118 |       const oversizedFile = createLargeFile('oversized-test.pdf', 21);
  119 | 
  120 |       // Klik area upload (label hidden input)
  121 |       const fileInput = page.locator('input[type="file"][multiple]');
  122 |       await fileInput.setInputFiles(oversizedFile);
  123 | 
  124 |       // Error toast harus muncul
  125 |       const errorToast = page.locator('[data-sonner-toast]');
  126 |       await expect(errorToast).toBeVisible({ timeout: 8000 });
  127 |       await expect(errorToast).toContainText(/20MB|ukuran/i);
  128 | 
  129 |       // Submit button harus tetap tidak merespons (tidak ada navigasi)
  130 |       const submitBtn = page.getByRole('button', { name: /submit untuk verifikasi/i });
  131 |       await submitBtn.click();
  132 |       // Masih di halaman lapor karena validasi basic (nama kegiatan kosong)
  133 |       await expect(page).toHaveURL(/\/lapor/);
  134 |     });
  135 | 
  136 |     test('Upload file dengan tipe tidak valid (misal .exe) menampilkan error', async ({ page }) => {
  137 |       await page.goto('/lapor');
  138 |       await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
  139 | 
  140 |       // Buat file dummy dengan ekstensi tidak valid
  141 |       const fixturesDir = path.join(process.cwd(), 'e2e', 'fixtures');
  142 |       const { mkdirSync, writeFileSync, existsSync } = await import('fs');
  143 |       if (!existsSync(fixturesDir)) mkdirSync(fixturesDir, { recursive: true });
  144 |       const exeFile = path.join(fixturesDir, 'malicious.exe');
  145 |       writeFileSync(exeFile, Buffer.alloc(1024, 'A'));
  146 | 
  147 |       const fileInput = page.locator('input[type="file"][multiple]');
  148 |       await fileInput.setInputFiles(exeFile);
  149 | 
  150 |       // Error harus muncul untuk tipe file tidak valid
  151 |       const errorToast = page.locator('[data-sonner-toast]');
  152 |       await expect(errorToast).toBeVisible({ timeout: 8000 });
  153 |       await expect(errorToast).toContainText(/pdf|word|jpg|png|diperbolehkan/i);
  154 |     });
  155 | 
  156 |   });
  157 | 
  158 |   // ──────────────────────────────────────────────────────────────────────────
  159 |   // UAT Case 3: Deteksi Otomatis Semester
  160 |   // ──────────────────────────────────────────────────────────────────────────
  161 | 
  162 |   test.describe('UAT Case 3 - Deteksi Otomatis Semester', () => {
  163 | 
  164 |     test('Memilih tanggal September menyebabkan semester otomatis GANJIL', async ({ page }) => {
  165 |       await page.goto('/lapor');
  166 |       await expect(page.getByText('Laporkan Prestasi Baru')).toBeVisible();
  167 | 
  168 |       // Klik tombol Waktu Mulai, lalu navigasi ke September
  169 |       const tanggalMulaiBtn = page.locator('button').filter({ hasText: /pilih waktu mulai/i }).first();
  170 |       if (await tanggalMulaiBtn.isVisible()) {
  171 |         await tanggalMulaiBtn.click();
  172 |         await page.waitForSelector('[role="grid"]');
  173 | 
  174 |         // Navigasi ke bulan September jika perlu (tekan next/prev)
  175 |         // Cari header bulan saat ini
  176 |         const currentMonthHeader = page.locator('[role="presentation"]').first();
  177 |         let attempts = 0;
> 178 |         while (!(await currentMonthHeader.textContent())?.includes('September') && attempts < 12) {
      |                                           ^ TimeoutError: locator.textContent: Timeout 15000ms exceeded.
  179 |           const nextBtn = page.locator('button[name="next-month"]').or(
  180 |             page.getByRole('button', { name: /next|selanjutnya|›/i })
  181 |           ).first();
  182 |           await nextBtn.click();
  183 |           attempts++;
  184 |         }
  185 | 
  186 |         // Klik tanggal 15
  187 |         const dayCell = page.locator('[role="gridcell"]').filter({ hasText: /^15$/ }).first();
  188 |         await dayCell.click();
  189 |       }
  190 | 
  191 |       // Verifikasi radio GANJIL terseleksi (read-only state)
  192 |       const ganjilRadio = page.locator('#sem-GANJIL');
  193 |       await expect(ganjilRadio).toBeChecked({ timeout: 3000 });
  194 |     });
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
```