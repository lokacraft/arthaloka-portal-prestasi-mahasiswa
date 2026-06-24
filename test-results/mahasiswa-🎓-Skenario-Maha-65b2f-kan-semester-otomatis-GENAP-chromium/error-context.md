# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mahasiswa.spec.ts >> 🎓 Skenario Mahasiswa >> UAT Case 3 - Deteksi Otomatis Semester >> Memilih tanggal Maret menyebabkan semester otomatis GENAP
- Location: e2e\mahasiswa.spec.ts:196:9

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button[name="next-month"]').first()

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
                - button "Pilih waktu mulai" [expanded] [ref=e171] [cursor=pointer]:
                  - button "Pilih waktu mulai" [ref=e172]:
                    - img [ref=e173]
                    - generic [ref=e175]: Pilih waktu mulai
                - dialog [ref=e179]:
                  - generic [ref=e181]:
                    - navigation "Navigation bar" [ref=e182]:
                      - button "Go to the Previous Month" [active] [ref=e183] [cursor=pointer]:
                        - img
                      - button "Go to the Next Month" [ref=e184] [cursor=pointer]:
                        - img
                    - generic [ref=e185]:
                      - status [ref=e187]: May 2026
                      - grid "May 2026" [ref=e188]:
                        - rowgroup [ref=e189]:
                          - row [ref=e190]:
                            - columnheader [ref=e191]: Su
                            - columnheader [ref=e192]: Mo
                            - columnheader [ref=e193]: Tu
                            - columnheader [ref=e194]: We
                            - columnheader [ref=e195]: Th
                            - columnheader [ref=e196]: Fr
                            - columnheader [ref=e197]: Sa
                        - rowgroup [ref=e198]:
                          - row "Sunday, April 26th, 2026 Monday, April 27th, 2026 Tuesday, April 28th, 2026 Wednesday, April 29th, 2026 Thursday, April 30th, 2026 Friday, May 1st, 2026 Saturday, May 2nd, 2026" [ref=e199]:
                            - gridcell "Sunday, April 26th, 2026" [ref=e200]:
                              - button "Sunday, April 26th, 2026" [ref=e201] [cursor=pointer]: "26"
                            - gridcell "Monday, April 27th, 2026" [ref=e202]:
                              - button "Monday, April 27th, 2026" [ref=e203] [cursor=pointer]: "27"
                            - gridcell "Tuesday, April 28th, 2026" [ref=e204]:
                              - button "Tuesday, April 28th, 2026" [ref=e205] [cursor=pointer]: "28"
                            - gridcell "Wednesday, April 29th, 2026" [ref=e206]:
                              - button "Wednesday, April 29th, 2026" [ref=e207] [cursor=pointer]: "29"
                            - gridcell "Thursday, April 30th, 2026" [ref=e208]:
                              - button "Thursday, April 30th, 2026" [ref=e209] [cursor=pointer]: "30"
                            - gridcell "Friday, May 1st, 2026" [ref=e210]:
                              - button "Friday, May 1st, 2026" [ref=e211] [cursor=pointer]: "1"
                            - gridcell "Saturday, May 2nd, 2026" [ref=e212]:
                              - button "Saturday, May 2nd, 2026" [ref=e213] [cursor=pointer]: "2"
                          - row "Sunday, May 3rd, 2026 Monday, May 4th, 2026 Tuesday, May 5th, 2026 Wednesday, May 6th, 2026 Thursday, May 7th, 2026 Friday, May 8th, 2026 Saturday, May 9th, 2026" [ref=e214]:
                            - gridcell "Sunday, May 3rd, 2026" [ref=e215]:
                              - button "Sunday, May 3rd, 2026" [ref=e216] [cursor=pointer]: "3"
                            - gridcell "Monday, May 4th, 2026" [ref=e217]:
                              - button "Monday, May 4th, 2026" [ref=e218] [cursor=pointer]: "4"
                            - gridcell "Tuesday, May 5th, 2026" [ref=e219]:
                              - button "Tuesday, May 5th, 2026" [ref=e220] [cursor=pointer]: "5"
                            - gridcell "Wednesday, May 6th, 2026" [ref=e221]:
                              - button "Wednesday, May 6th, 2026" [ref=e222] [cursor=pointer]: "6"
                            - gridcell "Thursday, May 7th, 2026" [ref=e223]:
                              - button "Thursday, May 7th, 2026" [ref=e224] [cursor=pointer]: "7"
                            - gridcell "Friday, May 8th, 2026" [ref=e225]:
                              - button "Friday, May 8th, 2026" [ref=e226] [cursor=pointer]: "8"
                            - gridcell "Saturday, May 9th, 2026" [ref=e227]:
                              - button "Saturday, May 9th, 2026" [ref=e228] [cursor=pointer]: "9"
                          - row "Sunday, May 10th, 2026 Monday, May 11th, 2026 Tuesday, May 12th, 2026 Wednesday, May 13th, 2026 Thursday, May 14th, 2026 Friday, May 15th, 2026 Saturday, May 16th, 2026" [ref=e229]:
                            - gridcell "Sunday, May 10th, 2026" [ref=e230]:
                              - button "Sunday, May 10th, 2026" [ref=e231] [cursor=pointer]: "10"
                            - gridcell "Monday, May 11th, 2026" [ref=e232]:
                              - button "Monday, May 11th, 2026" [ref=e233] [cursor=pointer]: "11"
                            - gridcell "Tuesday, May 12th, 2026" [ref=e234]:
                              - button "Tuesday, May 12th, 2026" [ref=e235] [cursor=pointer]: "12"
                            - gridcell "Wednesday, May 13th, 2026" [ref=e236]:
                              - button "Wednesday, May 13th, 2026" [ref=e237] [cursor=pointer]: "13"
                            - gridcell "Thursday, May 14th, 2026" [ref=e238]:
                              - button "Thursday, May 14th, 2026" [ref=e239] [cursor=pointer]: "14"
                            - gridcell "Friday, May 15th, 2026" [ref=e240]:
                              - button "Friday, May 15th, 2026" [ref=e241] [cursor=pointer]: "15"
                            - gridcell "Saturday, May 16th, 2026" [ref=e242]:
                              - button "Saturday, May 16th, 2026" [ref=e243] [cursor=pointer]: "16"
                          - row "Sunday, May 17th, 2026 Monday, May 18th, 2026 Tuesday, May 19th, 2026 Wednesday, May 20th, 2026 Thursday, May 21st, 2026 Friday, May 22nd, 2026 Saturday, May 23rd, 2026" [ref=e244]:
                            - gridcell "Sunday, May 17th, 2026" [ref=e245]:
                              - button "Sunday, May 17th, 2026" [ref=e246] [cursor=pointer]: "17"
                            - gridcell "Monday, May 18th, 2026" [ref=e247]:
                              - button "Monday, May 18th, 2026" [ref=e248] [cursor=pointer]: "18"
                            - gridcell "Tuesday, May 19th, 2026" [ref=e249]:
                              - button "Tuesday, May 19th, 2026" [ref=e250] [cursor=pointer]: "19"
                            - gridcell "Wednesday, May 20th, 2026" [ref=e251]:
                              - button "Wednesday, May 20th, 2026" [ref=e252] [cursor=pointer]: "20"
                            - gridcell "Thursday, May 21st, 2026" [ref=e253]:
                              - button "Thursday, May 21st, 2026" [ref=e254] [cursor=pointer]: "21"
                            - gridcell "Friday, May 22nd, 2026" [ref=e255]:
                              - button "Friday, May 22nd, 2026" [ref=e256] [cursor=pointer]: "22"
                            - gridcell "Saturday, May 23rd, 2026" [ref=e257]:
                              - button "Saturday, May 23rd, 2026" [ref=e258] [cursor=pointer]: "23"
                          - row "Sunday, May 24th, 2026 Monday, May 25th, 2026 Tuesday, May 26th, 2026 Wednesday, May 27th, 2026 Thursday, May 28th, 2026 Friday, May 29th, 2026 Today, Saturday, May 30th, 2026" [ref=e259]:
                            - gridcell "Sunday, May 24th, 2026" [ref=e260]:
                              - button "Sunday, May 24th, 2026" [ref=e261] [cursor=pointer]: "24"
                            - gridcell "Monday, May 25th, 2026" [ref=e262]:
                              - button "Monday, May 25th, 2026" [ref=e263] [cursor=pointer]: "25"
                            - gridcell "Tuesday, May 26th, 2026" [ref=e264]:
                              - button "Tuesday, May 26th, 2026" [ref=e265] [cursor=pointer]: "26"
                            - gridcell "Wednesday, May 27th, 2026" [ref=e266]:
                              - button "Wednesday, May 27th, 2026" [ref=e267] [cursor=pointer]: "27"
                            - gridcell "Thursday, May 28th, 2026" [ref=e268]:
                              - button "Thursday, May 28th, 2026" [ref=e269] [cursor=pointer]: "28"
                            - gridcell "Friday, May 29th, 2026" [ref=e270]:
                              - button "Friday, May 29th, 2026" [ref=e271] [cursor=pointer]: "29"
                            - gridcell "Today, Saturday, May 30th, 2026" [ref=e272]:
                              - button "Today, Saturday, May 30th, 2026" [ref=e273] [cursor=pointer]: "30"
                          - row "Sunday, May 31st, 2026 Monday, June 1st, 2026 Tuesday, June 2nd, 2026 Wednesday, June 3rd, 2026 Thursday, June 4th, 2026 Friday, June 5th, 2026 Saturday, June 6th, 2026" [ref=e274]:
                            - gridcell "Sunday, May 31st, 2026" [ref=e275]:
                              - button "Sunday, May 31st, 2026" [ref=e276] [cursor=pointer]: "31"
                            - gridcell "Monday, June 1st, 2026" [ref=e277]:
                              - button "Monday, June 1st, 2026" [ref=e278] [cursor=pointer]: "1"
                            - gridcell "Tuesday, June 2nd, 2026" [ref=e279]:
                              - button "Tuesday, June 2nd, 2026" [ref=e280] [cursor=pointer]: "2"
                            - gridcell "Wednesday, June 3rd, 2026" [ref=e281]:
                              - button "Wednesday, June 3rd, 2026" [ref=e282] [cursor=pointer]: "3"
                            - gridcell "Thursday, June 4th, 2026" [ref=e283]:
                              - button "Thursday, June 4th, 2026" [ref=e284] [cursor=pointer]: "4"
                            - gridcell "Friday, June 5th, 2026" [ref=e285]:
                              - button "Friday, June 5th, 2026" [ref=e286] [cursor=pointer]: "5"
                            - gridcell "Saturday, June 6th, 2026" [ref=e287]:
                              - button "Saturday, June 6th, 2026" [ref=e288] [cursor=pointer]: "6"
              - generic [ref=e291]:
                - text: Waktu Selesai
                - button "Pilih waktu selesai" [ref=e292] [cursor=pointer]:
                  - button "Pilih waktu selesai" [ref=e293]:
                    - img [ref=e294]
                    - generic [ref=e296]: Pilih waktu selesai
            - generic [ref=e297]:
              - generic [ref=e298]: Tempat Pelaksanaan
              - generic [ref=e299]:
                - generic [ref=e300]:
                  - text: Provinsi
                  - combobox [disabled] [ref=e301]:
                    - generic [ref=e302]: N/A (Internasional)
                    - img
                  - textbox [disabled] [ref=e303]
                - generic [ref=e304]:
                  - text: Kota / Kabupaten
                  - combobox [disabled] [ref=e305]:
                    - generic [ref=e306]: N/A
                    - img
                  - textbox [disabled] [ref=e307]
              - generic [ref=e308]:
                - text: Nama Lokasi / Gedung (opsional)
                - 'textbox "Contoh: Auditorium Universitas Indonesia" [ref=e309]'
            - generic [ref=e311]:
              - generic [ref=e312]:
                - text: Tipe Partisipasi
                - paragraph [ref=e313]: Individu
              - generic [ref=e314]:
                - generic [ref=e315]: Individu
                - switch [ref=e316]
                - checkbox [ref=e317]
                - generic [ref=e318]: Tim
            - generic [ref=e319]:
              - generic [ref=e320]: "Sertifikat/Dokumen Pendukung/SK Lomba *(Wajib: Sertifikat/SK + Bukti Pendukung)"
              - paragraph [ref=e321]: Maks. 10 file, PDF/Word/JPG/PNG
              - generic [ref=e322] [cursor=pointer]:
                - img [ref=e323]
                - generic [ref=e326]: Seret atau klik untuk memilih file
                - generic [ref=e327]: "Wajib: Sertifikat/SK + Bukti Pendukung (0/10 file dipilih)"
              - link "Download Template Bukti Pendukung (.docx)" [ref=e328] [cursor=pointer]:
                - /url: /assets/Template-Bukti-Pendukung.docx
                - img [ref=e329]
                - text: Download Template Bukti Pendukung (.docx)
            - generic [ref=e331]:
              - button "Batal" [ref=e332] [cursor=pointer]
              - button "Submit untuk Verifikasi" [ref=e333] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=e334]
```

# Test source

```ts
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
> 214 |           await navBtn.click();
      |                        ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
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
  295 |       await expect(page.getByText('Riwayat Pengajuan')).toBeVisible();
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
```