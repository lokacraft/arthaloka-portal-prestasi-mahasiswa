/**
 * lam-skor.ts
 * -----------
 * Utility fungsi perhitungan Skor LAM TEKNIK - Indikator
 * "Prestasi akademik dan nonakademik mahasiswa"
 *
 * Rumus:
 *  I   = skor kategori akademik
 *  II  = skor kategori non-akademik
 *  Skor Final = ((I x 3) + II) / 4
 *
 * Skor per kategori:
 *  - Jika RI > a DAN RN > b  ->  Skor = 4
 *  - Selain itu               ->  Skor = 3.75 x ((A+B+C/2) - A.B - A.C/2 - B.C/2 + A.B.C/2)
 *    dimana:
 *      A = min(RI/a, 1),  B = min(RN/b, 1),  C = min(RW/c, 1)
 *      a = targets.RI/100 (0.002),  b = targets.RN/100 (0.02),  c = targets.RW/100 (0.04)
 */

/** Target rasio yang disimpan DB sebagai persen (mis. RI=0.2, RN=2.0, RW=4.0) */
export interface LamTargets {
  RI: number;
  RN: number;
  RW: number;
}

/** Jumlah prestasi per level untuk satu kategori */
export interface NilaiCounts {
  NI: number; // internasional
  NN: number; // nasional
  NW: number; // wilayah/lokal
}

/**
 * Hitung skor satu kategori (Akademik atau Non-Akademik) per rumus Indikator .
 * @returns skor dalam range 0-4
 */
export function computeLamSkorKategori(
  counts: NilaiCounts,
  NM: number | null,
  targets: LamTargets,
): number {
  if (!NM || NM === 0) return 0;

  const a = targets.RI / 100; // batas internasional sebagai desimal
  const b = targets.RN / 100; // batas nasional sebagai desimal
  const c = targets.RW / 100; // batas wilayah sebagai desimal

  const RI = counts.NI / NM;
  const RN = counts.NN / NM;
  const RW = counts.NW / NM;

  // Kondisi langsung Skor 4
  if (RI > a && RN > b) return 4;

  // Rumus 3.75 x f(A, B, C) - cap A, B, C di 1
  const A = Math.min(RI / a, 1);
  const B = Math.min(RN / b, 1);
  const C = Math.min(RW / c, 1);

  const skor =
    3.75 *
    (A + B + C / 2 - A * B - (A * C) / 2 - (B * C) / 2 + (A * B * C) / 2);

  return Math.max(0, skor);
}

export interface Indikator43Result {
  skorAkad: number;
  skorNonAkad: number;
  /** Skor final = ((skorAkad x 3) + skorNonAkad) / 4, range 0-4 */
  skorFinal: number;
  /** true jika skorFinal >= 4 */
  isScore4: boolean;
}

/**
 * Gabungkan skor akademik & non-akademik menjadi skor final Indikator .
 * Skor Final = ((Akademik x 3) + Non-Akademik) / 4
 */
export function computeIndikator43(
  akad: NilaiCounts,
  nonAkad: NilaiCounts,
  NM: number | null,
  targets: LamTargets,
): Indikator43Result {
  const skorAkad = computeLamSkorKategori(akad, NM, targets);
  const skorNonAkad = computeLamSkorKategori(nonAkad, NM, targets);
  const skorFinal = (skorAkad * 3 + skorNonAkad) / 4;
  return {
    skorAkad,
    skorNonAkad,
    skorFinal,
    isScore4: skorFinal >= 4,
  };
}
