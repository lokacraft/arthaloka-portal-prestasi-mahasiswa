"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, X, Plus, CalendarIcon, ChevronDown, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { createPrestasi } from "@/server/prestasi-actions";
import { uploadFileToR2 } from "@/server/upload-actions";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface KategoriItem { id: string; nama: string; }
interface TingkatItem { id: string; nama: string; }
interface ProgramStudiItem { id: string; nama: string; }
interface TeamMember { nim: string; nama: string; angkatan: string; }
interface Wilayah { code: string; name: string; }

const HASIL_OPTIONS = ["Juara 1", "Juara 2", "Juara 3", "Lainnya"];

/**
 * Menentukan semester berdasarkan pola Tel-U:
 * GENAP: Februari–Juni (bulan 2–6)
 * GANJIL: September–Januari (bulan 9–1)
 * Ambigu (Jul–Agu): GANJIL (lebih dekat ke September)
 */
function detectSemester(mulai?: Date, selesai?: Date): "GANJIL" | "GENAP" {
  if (!mulai && !selesai) return "GANJIL";
  const ref = mulai || selesai!;
  const startM = mulai ? mulai.getMonth() + 1 : ref.getMonth() + 1;
  const endM   = selesai ? selesai.getMonth() + 1 : startM;

  const isGenap  = (m: number) => m >= 2 && m <= 6;
  const isGanjil = (m: number) => m >= 9 || m === 1;

  const genapScore  = (isGenap(startM) ? 1 : 0) + (isGenap(endM) ? 1 : 0);
  const ganjilScore = (isGanjil(startM) ? 1 : 0) + (isGanjil(endM) ? 1 : 0);

  if (genapScore > ganjilScore) return "GENAP";
  if (ganjilScore > genapScore) return "GANJIL";
  // ambigu: pakai endMonth
  return endM <= 6 ? "GENAP" : "GANJIL";
}

interface Props {
  mahasiswaId: string;
  nim: string;
  kategoriList: KategoriItem[];
  tingkatList: TingkatItem[];
  programStudiList: ProgramStudiItem[];
}

export default function LaporForm({ mahasiswaId, nim, kategoriList, tingkatList, programStudiList }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [programStudiId, setProgramStudiId] = useState<string>(programStudiList[0]?.id ?? "");
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const [angkatan, setAngkatan] = useState<number>(new Date().getFullYear());
  const [showAngkatanPicker, setShowAngkatanPicker] = useState(false);
  const angkatanOptions = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - i);

  // Semester dideteksi otomatis — read-only
  const [semester, setSemester] = useState<"GANJIL" | "GENAP">("GANJIL");
  const [kategoriId, setKategoriId] = useState<string>(kategoriList[0]?.id ?? "");
  const [jenisLomba, setJenisLomba] = useState<"BELMAWA" | "MANDIRI">("MANDIRI");
  const [tingkatId, setTingkatId] = useState<string>(tingkatList[0]?.id ?? "");
  const [namaPrestasi, setNamaPrestasi] = useState("");
  const [namaPenyelenggara, setNamaPenyelenggara] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState<Date | undefined>();
  const [tanggalSelesai, setTanggalSelesai] = useState<Date | undefined>();
  const [showTanggalMulaiPicker, setShowTanggalMulaiPicker] = useState(false);
  const [showTanggalSelesaiPicker, setShowTanggalSelesaiPicker] = useState(false);
  const [hasilSelect, setHasilSelect] = useState("Juara 1");
  const [hasilCustom, setHasilCustom] = useState("");

  // Wilayah
  const [provinsiList, setProvinsiList] = useState<Wilayah[]>([]);
  const [kotaList, setKotaList] = useState<Wilayah[]>([]);
  const [provinsiCode, setProvinsiCode] = useState("");
  const [kotaCode, setKotaCode] = useState("");
  const [namaLokasi, setNamaLokasi] = useState("");

  // Partisipasi
  const [isTim, setIsTim] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ nim: "", nama: "", angkatan: "" }]);

  // Confirmation Dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Auto-detect semester saat tanggal mulai/selesai berubah
  useEffect(() => {
    setSemester(detectSemester(tanggalMulai, tanggalSelesai));
  }, [tanggalMulai, tanggalSelesai]);

  // Internasional check
  const isInternasional = tingkatList.find(t => t.id === tingkatId)?.nama.toLowerCase().includes("internasional");

  // Clear wilayah if Internasional is selected
  useEffect(() => {
    if (isInternasional) {
      setProvinsiCode("");
      setKotaCode("");
    }
  }, [isInternasional]);

  // Files
  const [buktiBukti, setBuktiBukti] = useState<File[]>([]);

  // Load provinces on mount via internal proxy (avoids CORS)
  useEffect(() => {
    fetch("/api/wilayah?path=provinces")
      .then((r) => r.json())
      .then((json) => setProvinsiList(json.data ?? []))
      .catch(() => {});
  }, []);

  // Load cities when province changes via internal proxy (avoids CORS)
  useEffect(() => {
    if (!provinsiCode) { setKotaList([]); setKotaCode(""); return; }
    fetch(`/api/wilayah?path=regencies/${provinsiCode}`)
      .then((r) => r.json())
      .then((json) => setKotaList(json.data ?? []))
      .catch(() => {});
  }, [provinsiCode]);

  const addTeamMember = () => setTeamMembers([...teamMembers, { nim: "", nama: "", angkatan: "" }]);
  const removeTeamMember = (i: number) => setTeamMembers(teamMembers.filter((_, idx) => idx !== i));
  const updateTeamMember = (i: number, field: keyof TeamMember, val: string) => {
    const updated = [...teamMembers];
    updated[i][field] = val;
    setTeamMembers(updated);
  };

  const handleBuktiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    
    // Validasi tipe: hanya PDF, Word, dan gambar
    const validTypes = [
      "application/pdf", 
      "image/jpeg", 
      "image/png", 
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const hasInvalid = incoming.some((f) => !validTypes.includes(f.type));
    if (hasInvalid) {
      toast.error("Hanya file PDF, Word, JPG, atau PNG yang diperbolehkan.");
      return;
    }

    // Validasi Ukuran: Total maksimal 20MB
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB
    const currentTotalSize = buktiBukti.reduce((acc, f) => acc + f.size, 0);
    const incomingTotalSize = incoming.reduce((acc, f) => acc + f.size, 0);

    if (currentTotalSize + incomingTotalSize > MAX_SIZE) {
      toast.error("Total ukuran file dokumen tidak boleh melebihi 20MB.");
      return;
    }

    // Check individual file size (optional but good practice)
    const largeFile = incoming.find(f => f.size > MAX_SIZE);
    if (largeFile) {
      toast.error(`File ${largeFile.name} melebihi batas 20MB.`);
      return;
    }

    if (buktiBukti.length + incoming.length > 10) {
      toast.error("Maksimal 10 file dokumen pendukung."); return;
    }
    setBuktiBukti((prev) => [...prev, ...incoming]);
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggalMulai || !tanggalSelesai) { toast.error("Tanggal pelaksanaan (mulai & selesai) wajib diisi."); return; }
    if (tanggalMulai > tanggalSelesai) { toast.error("Waktu mulai tidak boleh lebih dari waktu selesai."); return; }
    if (!namaPrestasi) { toast.error("Nama kegiatan wajib diisi."); return; }
    if (!namaPenyelenggara) { toast.error("Nama penyelenggara wajib diisi."); return; }
    const hasilCapaian = hasilSelect === "Lainnya" ? hasilCustom.trim() : hasilSelect;
    if (!hasilCapaian) { toast.error("Hasil/capaian wajib diisi."); return; }
    if (buktiBukti.length === 0) { toast.error("Dokumen pendukung (Sertifikat/SK) wajib diunggah."); return; }

    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmDialog(false);
    const hasilCapaian = hasilSelect === "Lainnya" ? hasilCustom.trim() : hasilSelect;
    
    startTransition(async () => {
      toast.loading("Mengupload file...", { id: "lapor-toast" });
      let buktiBuktiUrls: string[] | undefined;

      if (buktiBukti.length > 0) {
        const urls: string[] = [];
        for (const file of buktiBukti) {
          const res = await uploadFileToR2(file, "bukti");
          if ("error" in res) {
            toast.error(`Gagal mengunggah ${file.name}: ${res.error}`, { id: "lapor-toast" });
            return;
          }
          urls.push(res.url);
        }
        buktiBuktiUrls = urls;
      }

      toast.loading("Menyimpan data prestasi...", { id: "lapor-toast" });
      const provinsiName = provinsiList.find((p) => p.code === provinsiCode)?.name;
      const kotaName = kotaList.find((k) => k.code === kotaCode)?.name;

      const result = await createPrestasi({
        mahasiswaId,
        programStudiId: programStudiId || undefined,
        kategoriId,
        tingkatId,
        angkatan,
        tahun,
        semester,
        namaPrestasi,
        jenisLomba,
        namaPenyelenggara,
        tanggalMulai: tanggalMulai!,
        tanggalSelesai: tanggalSelesai!,
        hasilCapaian,
        provinsi: provinsiName,
        kota: kotaName,
        namaLokasi: namaLokasi || undefined,
        tipePartisipasi: isTim ? "TIM" : "INDIVIDU",
        anggotaTim: isTim ? teamMembers.filter((m) => m.nim || m.nama).map(m => ({ ...m, angkatan: parseInt(m.angkatan) || new Date().getFullYear() })) : undefined,
        sertifikatUrls: undefined,
        buktiBuktiUrls,
      });

      if ("error" in result) {
        toast.error(result.error, { id: "lapor-toast" });
      } else {
        toast.success("Pengajuan berhasil dikirim!", { id: "lapor-toast" });
        router.push("/dashboard");
      }
    });
  };

  const inputClass = "w-full bg-[#f8f9fa] text-gray-800 placeholder-gray-400 text-[15px] rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50 transition-all";

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h2 className="text-[20px] font-bold text-[#1a1a1a]">Laporkan Prestasi Baru</h2>
          <p className="text-gray-500 text-[14px] mt-1">Isi semua data dengan benar sesuai dokumen pendukung.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-7">

          {/* Row -1: Program Studi */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Program Studi <span className="text-red-500">*</span></label>
            <Select value={programStudiId} onValueChange={(v) => v && setProgramStudiId(v)}>
              <SelectTrigger className="w-full bg-[#f8f9fa] text-[15px] rounded-xl h-[48px] border-gray-200 focus:ring-[#50c878]/50">
                <SelectValue placeholder="Pilih Program Studi">
                  {programStudiId ? programStudiList.find((p) => p.id === programStudiId)?.nama : "Pilih Program Studi"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {programStudiList.map((p) => (
                  <SelectItem key={p.id} value={p.id} label={p.nama}>{p.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 0: NIM & Angkatan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">NIM Mahasiswa</label>
              <input type="text" value={nim} readOnly className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`} />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Angkatan</label>
              <Popover open={showAngkatanPicker} onOpenChange={setShowAngkatanPicker}>
                <PopoverTrigger>
                  <button type="button" className={`${inputClass} flex items-center justify-between`}>
                    <span>{angkatan}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {angkatanOptions.map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => { setAngkatan(y); setShowAngkatanPicker(false); }}
                        className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${angkatan === y ? "bg-[#006400] text-white" : "hover:bg-gray-100 text-gray-700"}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Row 1: Tahun & Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Tahun Kegiatan</label>
              <Popover open={showYearPicker} onOpenChange={setShowYearPicker}>
                <PopoverTrigger>
                  <button type="button" className={`${inputClass} flex items-center justify-between`}>
                    <span>{tahun}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {yearOptions.map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => { setTahun(y); setShowYearPicker(false); }}
                        className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${tahun === y ? "bg-[#006400] text-white" : "hover:bg-gray-100 text-gray-700"}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Semester</label>
              <div className="pt-1 space-y-2">
                <RadioGroup value={semester} className="flex gap-6 pointer-events-none opacity-70">
                  {(["GANJIL", "GENAP"] as const).map((s) => (
                    <div key={s} className="flex items-center space-x-2">
                      <RadioGroupItem value={s} id={`sem-${s}`} className="data-[state=checked]:border-[#50c878] data-[state=checked]:bg-[#50c878]" />
                      <label htmlFor={`sem-${s}`} className="text-[15px] text-gray-700">{s.charAt(0) + s.slice(1).toLowerCase()}</label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-[12px] text-[#50c878] font-medium flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  Auto-detected dari tanggal pelaksanaan (Pola Semester Tel-U)
                </p>
              </div>
            </div>
          </div>

          {/* Nama Kegiatan & Penyelenggara */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Nama Kegiatan</label>
              <input type="text" value={namaPrestasi} onChange={(e) => setNamaPrestasi(e.target.value)} placeholder="Contoh: Lomba Karya Tulis Ilmiah Nasional" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Penyelenggara</label>
              <input type="text" value={namaPenyelenggara} onChange={(e) => setNamaPenyelenggara(e.target.value)} placeholder="Contoh: Kementerian Pendidikan" className={inputClass} />
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-3">
            <label className="text-[14px] font-semibold text-[#1a1a1a] block">Kategori Prestasi</label>
            <RadioGroup value={kategoriId} onValueChange={(v) => v && setKategoriId(v)} className="flex flex-wrap gap-5">
              {kategoriList.map((k) => (
                <div key={k.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={k.id} id={`kat-${k.id}`} className="data-[state=checked]:border-[#50c878] data-[state=checked]:bg-[#50c878]" />
                  <label htmlFor={`kat-${k.id}`} className="text-[15px] text-gray-700 cursor-pointer">{k.nama}</label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Jenis Lomba */}
          <div className="space-y-3">
            <label className="text-[14px] font-semibold text-[#1a1a1a] block">Jenis Lomba</label>
            <RadioGroup value={jenisLomba} onValueChange={(v) => v && setJenisLomba(v as "BELMAWA" | "MANDIRI")} className="flex gap-6">
              {(["BELMAWA", "MANDIRI"] as const).map((j) => (
                <div key={j} className="flex items-center space-x-2">
                  <RadioGroupItem value={j} id={`jenis-${j}`} className="data-[state=checked]:border-[#50c878] data-[state=checked]:bg-[#50c878]" />
                  <label htmlFor={`jenis-${j}`} className="text-[15px] text-gray-700 cursor-pointer">{j}</label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Tingkat */}
          <div className="space-y-3">
            <label className="text-[14px] font-semibold text-[#1a1a1a] block">Tingkat / Level</label>
            <RadioGroup value={tingkatId} onValueChange={(v) => v && setTingkatId(v)} className="flex flex-wrap gap-5">
              {tingkatList.map((t) => (
                <div key={t.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={t.id} id={`tk-${t.id}`} className="data-[state=checked]:border-[#50c878] data-[state=checked]:bg-[#50c878]" />
                  <label htmlFor={`tk-${t.id}`} className="text-[15px] text-gray-700 cursor-pointer">{t.nama}</label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Hasil / Capaian */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Hasil / Capaian</label>
            <Select value={hasilSelect} onValueChange={(v) => v && setHasilSelect(v)}>
              <SelectTrigger className="w-full bg-[#f8f9fa] text-[15px] rounded-xl h-[48px] border-gray-200 focus:ring-[#50c878]/50">
                <SelectValue placeholder="Pilih hasil" />
              </SelectTrigger>
              <SelectContent>
                {HASIL_OPTIONS.map((o) => <SelectItem key={o} value={o} label={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {hasilSelect === "Lainnya" && (
              <input
                type="text"
                value={hasilCustom}
                onChange={(e) => setHasilCustom(e.target.value.slice(0, 250))}
                placeholder="Tulis capaian Anda (maks. 250 karakter)"
                className={`${inputClass} mt-2`}
              />
            )}
          </div>

          {/* Tanggal Pelaksanaan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Waktu Mulai</label>
              <Popover open={showTanggalMulaiPicker} onOpenChange={setShowTanggalMulaiPicker}>
                <PopoverTrigger>
                  <button type="button" className={`${inputClass} flex items-center gap-3 text-left w-full`}>
                    <CalendarIcon className="h-5 w-5 text-gray-400 shrink-0" />
                    <span className={tanggalMulai ? "text-gray-800" : "text-gray-400"}>
                      {tanggalMulai ? format(tanggalMulai, "d MMMM yyyy", { locale: localeId }) : "Pilih waktu mulai"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={tanggalMulai}
                    onSelect={(d) => { setTanggalMulai(d); setShowTanggalMulaiPicker(false); }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">Waktu Selesai</label>
              <Popover open={showTanggalSelesaiPicker} onOpenChange={setShowTanggalSelesaiPicker}>
                <PopoverTrigger>
                  <button type="button" className={`${inputClass} flex items-center gap-3 text-left w-full`}>
                    <CalendarIcon className="h-5 w-5 text-gray-400 shrink-0" />
                    <span className={tanggalSelesai ? "text-gray-800" : "text-gray-400"}>
                      {tanggalSelesai ? format(tanggalSelesai, "d MMMM yyyy", { locale: localeId }) : "Pilih waktu selesai"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={tanggalSelesai}
                    onSelect={(d) => { setTanggalSelesai(d); setShowTanggalSelesaiPicker(false); }}
                    disabled={(date) => {
                      if (!tanggalMulai) return false;
                      const d = new Date(date);
                      d.setHours(0, 0, 0, 0);
                      const tm = new Date(tanggalMulai);
                      tm.setHours(0, 0, 0, 0);
                      return d < tm;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tempat Pelaksanaan */}
          <div className="space-y-4">
            <label className="text-[14px] font-semibold text-[#1a1a1a] block">Tempat Pelaksanaan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] text-gray-500 font-medium">Provinsi</label>
                <Select value={provinsiCode} onValueChange={(v) => { if(v) { setProvinsiCode(v); setKotaCode(""); } }} disabled={isInternasional}>
                  <SelectTrigger className="w-full bg-[#f8f9fa] text-[15px] rounded-xl h-[48px] border-gray-200 focus:ring-[#50c878]/50 disabled:opacity-50">
                    <SelectValue placeholder={isInternasional ? "N/A (Internasional)" : "Pilih Provinsi"}>
                      {provinsiCode && !isInternasional ? provinsiList.find((p) => p.code === provinsiCode)?.name : (isInternasional ? "N/A (Internasional)" : "Pilih Provinsi")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {provinsiList.map((p) => <SelectItem key={p.code} value={p.code} label={p.name}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] text-gray-500 font-medium">Kota / Kabupaten</label>
                <Select value={kotaCode} onValueChange={(v) => v && setKotaCode(v)} disabled={!provinsiCode || isInternasional}>
                  <SelectTrigger className="w-full bg-[#f8f9fa] text-[15px] rounded-xl h-[48px] border-gray-200 focus:ring-[#50c878]/50 disabled:opacity-50">
                    <SelectValue placeholder={isInternasional ? "N/A" : provinsiCode ? "Pilih Kota" : "Pilih provinsi dulu"}>
                      {kotaCode && !isInternasional ? kotaList.find((k) => k.code === kotaCode)?.name : (isInternasional ? "N/A" : (provinsiCode ? "Pilih Kota" : "Pilih provinsi dulu"))}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {kotaList.map((k) => <SelectItem key={k.code} value={k.code} label={k.name}>{k.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] text-gray-500 font-medium">Nama Lokasi / Gedung (opsional)</label>
              <input type="text" value={namaLokasi} onChange={(e) => setNamaLokasi(e.target.value)} placeholder="Contoh: Auditorium Universitas Indonesia" className={inputClass} />
            </div>
          </div>

          {/* Tipe Partisipasi */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between gap-6">
              <div>
                <label className="text-[14px] font-semibold text-[#1a1a1a]">Tipe Partisipasi</label>
                <p className="text-[13px] text-gray-500">{isTim ? "Regu / Tim" : "Individu"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[14px] ${!isTim ? "font-medium text-[#1a1a1a]" : "text-gray-400"}`}>Individu</span>
                <Switch checked={isTim} onCheckedChange={setIsTim} className="data-[state=checked]:bg-[#50c878]" />
                <span className={`text-[14px] ${isTim ? "font-medium text-[#1a1a1a]" : "text-gray-400"}`}>Tim</span>
              </div>
            </div>

            {isTim && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                <label className="text-[14px] font-semibold text-[#1a1a1a]">Anggota Tim</label>
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input type="text" value={member.nim} onChange={(e) => updateTeamMember(index, "nim", e.target.value)} placeholder="NIM" className="flex-1 bg-white text-gray-800 placeholder-gray-400 text-[14px] rounded-lg px-4 h-11 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
                    <input type="text" value={member.nama} onChange={(e) => updateTeamMember(index, "nama", e.target.value)} placeholder="Nama lengkap" className="flex-[2] bg-white text-gray-800 placeholder-gray-400 text-[14px] rounded-lg px-4 h-11 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
                    <input type="text" value={member.angkatan} onChange={(e) => updateTeamMember(index, "angkatan", e.target.value.replace(/\D/g, '').slice(0,4))} placeholder="Angkatan" className="w-24 bg-white text-gray-800 placeholder-gray-400 text-[14px] rounded-lg px-4 h-11 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
                    <Button type="button" variant="ghost" onClick={() => removeTeamMember(index)} disabled={teamMembers.length === 1} className="h-11 w-11 p-0 text-red-400 hover:text-red-600 hover:bg-red-50">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTeamMember} className="border-dashed border-2 border-gray-200 text-[#50c878] hover:bg-[#eafaf1] font-medium">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Anggota
                </Button>
              </div>
            )}
          </div>



          {/* Sertifikat/Dokumen Pendukung/SK Lomba */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">
              Sertifikat/Dokumen Pendukung/SK Lomba <span className="text-red-500">*</span>
              <span className="ml-1.5 text-[#50c878] font-medium">(Wajib: Sertifikat/SK + Bukti Pendukung)</span>
            </label>
            <p className="text-[13px] text-gray-400 -mt-1">Maks. 10 file, PDF/Word/JPG/PNG</p>
            <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl px-6 py-8 bg-[#f8f9fa] transition-colors cursor-pointer ${buktiBukti.length >= 10 ? "opacity-50 pointer-events-none" : "hover:border-[#50c878]/50 hover:bg-gray-50"}`}>
              <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" multiple className="hidden" onChange={handleBuktiChange} disabled={buktiBukti.length >= 10} />
              <UploadCloud className="h-9 w-9 text-gray-400 mb-2" />
              <span className="text-[14px] font-semibold text-[#50c878]">Seret atau klik untuk memilih file</span>
              <span className="text-[13px] text-gray-400 mt-1">Wajib: Sertifikat/SK + Bukti Pendukung ({buktiBukti.length}/10 file dipilih)</span>
            </label>
            {/* Template Download */}
            <a
              href="/assets/Template-Bukti-Pendukung.docx"
              download="Template-Bukti-Pendukung.docx"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#006400] hover:bg-emerald-100 transition-colors text-[13px] font-semibold"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              Download Template Bukti Pendukung (.docx)
            </a>
            {buktiBukti.length > 0 && (
              <div className="mt-3 space-y-2">
                {buktiBukti.map((f, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-3 bg-white flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
                        {f.type.includes("image") ? (
                          <ImageIcon className="h-4 w-4 text-[#50c878]" />
                        ) : (
                          <FileText className="h-4 w-4 text-[#50c878]" />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900 truncate max-w-xs">{f.name}</p>
                        <p className="text-[11px] text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setBuktiBukti((prev) => prev.filter((_, i) => i !== idx))} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-xl h-12 px-6 text-[15px] font-medium border-gray-200 text-gray-600 hover:bg-gray-50">
              Batal
            </Button>
            <Button type="submit" disabled={isPending} className="bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 px-6 text-[15px] font-semibold shadow-md disabled:opacity-60">
              {isPending ? "Memproses..." : "Submit untuk Verifikasi"}
            </Button>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pengajuan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin data yang diisi sudah benar? Pastikan semua dokumen bukti sudah sesuai sebelum mengirim.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} className="bg-[#006400] hover:bg-[#004d00]">
              Ya, Kirim Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
