# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mahasiswa.spec.ts >> 🎓 Skenario Mahasiswa >> UAT Case 1 - Validasi File Upload (>20MB) >> Upload file melebihi 20MB menampilkan error dan mencegah submit
- Location: e2e\mahasiswa.spec.ts:113:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-sonner-toast]')
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('[data-sonner-toast]')

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
      - radio "Ganjil" [checked]
      - text: Ganjil
      - radio "Genap"
      - text: Genap
    - paragraph:
      - img
      - text: Auto-detected dari tanggal pelaksanaan (Pola Semester Tel-U)
    - text: Nama Kegiatan
    - 'textbox "Contoh: Lomba Karya Tulis Ilmiah Nasional"'
    - text: Penyelenggara
    - 'textbox "Contoh: Kementerian Pendidikan"'
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
    - button "Pilih waktu mulai":
      - button "Pilih waktu mulai"
    - text: Waktu Selesai
    - button "Pilih waktu selesai":
      - button "Pilih waktu selesai"
    - text: Tempat Pelaksanaan Provinsi
    - combobox [disabled]: N/A (Internasional)
    - text: Kota / Kabupaten
    - combobox [disabled]: N/A
    - text: Nama Lokasi / Gedung (opsional)
    - 'textbox "Contoh: Auditorium Universitas Indonesia"'
    - text: Tipe Partisipasi
    - paragraph: Individu
    - text: Individu
    - switch
    - text: "Tim Sertifikat/Dokumen Pendukung/SK Lomba *(Wajib: Sertifikat/SK + Bukti Pendukung)"
    - paragraph: Maks. 10 file, PDF/Word/JPG/PNG
    - text: "Seret atau klik untuk memilih file Wajib: Sertifikat/SK + Bukti Pendukung (0/10 file dipilih)"
    - link "Download Template Bukti Pendukung (.docx)":
      - /url: /assets/Template-Bukti-Pendukung.docx
      - img
      - text: Download Template Bukti Pendukung (.docx)
    - button "Batal"
    - button "Submit untuk Verifikasi"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  26  | // ─────────────────────────────────────────────────────────────────────────────
  27  | 
  28  | async function fillLaporForm(
  29  |   page: Page,
  30  |   options: {
  31  |     namaKegiatan?: string;
  32  |     penyelenggara?: string;
  33  |     hasilSelect?: string;
  34  |     dayMulai?: number;
  35  |     daySelesai?: number;
  36  |     isTim?: boolean;
  37  |   } = {}
  38  | ) {
  39  |   const {
  40  |     namaKegiatan = 'Juara 1 Lomba Coding Nasional E2E Test',
  41  |     penyelenggara = 'Kemendikbud E2E',
  42  |     hasilSelect = 'Juara 1',
  43  |     dayMulai = 15,
  44  |     daySelesai = 20,
  45  |     isTim = false,
  46  |   } = options;
  47  | 
  48  |   // Isi Nama Kegiatan
  49  |   await page.fill(
  50  |     'input[placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional"]',
  51  |     namaKegiatan
  52  |   );
  53  | 
  54  |   // Isi Nama Penyelenggara
  55  |   await page.fill(
  56  |     'input[placeholder="Contoh: Kementerian Pendidikan"]',
  57  |     penyelenggara
  58  |   );
  59  | 
  60  |   // Pilih Hasil/Capaian (combobox)
  61  |   // Klik trigger Select "Hasil / Capaian"
  62  |   const hasilTrigger = page.locator('[data-testid="select-hasil"]').or(
  63  |     page.getByRole('combobox').filter({ hasText: /juara|lainnya|pilih hasil/i }).first()
  64  |   );
  65  |   await hasilTrigger.click();
  66  |   await page.getByRole('option', { name: hasilSelect }).click();
  67  | 
  68  |   // Pilih tanggal mulai
  69  |   const tanggalMulaiBtns = page.locator('button').filter({ hasText: /pilih waktu mulai/i });
  70  |   if (await tanggalMulaiBtns.count() > 0) {
  71  |     await tanggalMulaiBtns.first().click();
  72  |     await page.waitForSelector('[role="grid"]');
  73  |     // Cari dan klik tanggal
  74  |     const dayCell = page.locator('[role="gridcell"]').filter({ hasText: new RegExp(`^${dayMulai}$`) }).first();
  75  |     await dayCell.click();
  76  |   }
  77  | 
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
> 126 |       await expect(errorToast).toBeVisible({ timeout: 8000 });
      |                                ^ Error: expect(locator).toBeVisible() failed
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
  178 |         while (!(await currentMonthHeader.textContent())?.includes('September') && attempts < 12) {
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
```