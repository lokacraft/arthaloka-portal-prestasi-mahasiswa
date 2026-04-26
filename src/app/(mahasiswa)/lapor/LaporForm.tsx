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
interface TeamMember { nim: string; nama: string; }
interface Wilayah { code: string; name: string; }

const HASIL_OPTIONS = ["Juara 1", "Juara 2", "Juara 3", "Lainnya"];

interface Props {
  mahasiswaId: string;
  kategoriList: KategoriItem[];
  tingkatList: TingkatItem[];
}

export default function LaporForm({ mahasiswaId, kategoriList, tingkatList }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const [semester, setSemester] = useState<"GANJIL" | "GENAP">("GANJIL");
  const [kategoriId, setKategoriId] = useState<string>(kategoriList[0]?.id ?? "");
  const [tingkatId, setTingkatId] = useState<string>(tingkatList[0]?.id ?? "");
  const [namaPrestasi, setNamaPrestasi] = useState("");
  const [namaPenyelenggara, setNamaPenyelenggara] = useState("");
  const [tanggal, setTanggal] = useState<Date | undefined>();
  const [showTanggalPicker, setShowTanggalPicker] = useState(false);
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ nim: "", nama: "" }]);

  // Confirmation Dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
  const [sertifikat, setSertifikat] = useState<File | null>(null);
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

  const addTeamMember = () => setTeamMembers([...teamMembers, { nim: "", nama: "" }]);
  const removeTeamMember = (i: number) => setTeamMembers(teamMembers.filter((_, idx) => idx !== i));
  const updateTeamMember = (i: number, field: keyof TeamMember, val: string) => {
    const updated = [...teamMembers];
    updated[i][field] = val;
    setTeamMembers(updated);
  };

  const handleBuktiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    
    // Validate types
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const hasInvalid = incoming.some((f) => !validTypes.includes(f.type));
    if (hasInvalid) {
      toast.error("Hanya file PDF, JPG, atau PNG yang diperbolehkan.");
      return;
    }

    if (buktiBukti.length + incoming.length > 5) {
      toast.error("Maksimal 5 file bukti pendukung."); return;
    }
    setBuktiBukti((prev) => [...prev, ...incoming]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal) { toast.error("Tanggal pelaksanaan wajib diisi."); return; }
    if (!namaPrestasi) { toast.error("Nama kegiatan wajib diisi."); return; }
    if (!namaPenyelenggara) { toast.error("Nama penyelenggara wajib diisi."); return; }
    const hasilCapaian = hasilSelect === "Lainnya" ? hasilCustom.trim() : hasilSelect;
    if (!hasilCapaian) { toast.error("Hasil/capaian wajib diisi."); return; }

    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmDialog(false);
    const hasilCapaian = hasilSelect === "Lainnya" ? hasilCustom.trim() : hasilSelect;
    
    startTransition(async () => {
      toast.loading("Mengupload file...", { id: "lapor-toast" });
      let sertifikatUrl: string | undefined;
      let buktiBuktiUrls: string[] | undefined;

      if (sertifikat) {
        const res = await uploadFileToR2(sertifikat, "sertifikat");
        if ("error" in res) { toast.error(res.error, { id: "lapor-toast" }); return; }
        sertifikatUrl = res.url;
      }
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
        kategoriId,
        tingkatId,
        tahun,
        semester,
        namaPrestasi,
        namaPenyelenggara,
        tanggalPelaksanaan: tanggal!,
        hasilCapaian,
        provinsi: provinsiName,
        kota: kotaName,
        namaLokasi: namaLokasi || undefined,
        tipePartisipasi: isTim ? "TIM" : "INDIVIDU",
        anggotaTim: isTim ? teamMembers.filter((m) => m.nim || m.nama) : undefined,
        sertifikatUrl,
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
              <RadioGroup value={semester} onValueChange={(v) => v && setSemester(v as "GANJIL" | "GENAP")} className="flex gap-6 pt-1">
                {(["GANJIL", "GENAP"] as const).map((s) => (
                  <div key={s} className="flex items-center space-x-2">
                    <RadioGroupItem value={s} id={`sem-${s}`} className="data-[state=checked]:border-[#50c878] data-[state=checked]:bg-[#50c878]" />
                    <label htmlFor={`sem-${s}`} className="text-[15px] text-gray-700 cursor-pointer">{s.charAt(0) + s.slice(1).toLowerCase()}</label>
                  </div>
                ))}
              </RadioGroup>
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
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Tanggal Pelaksanaan</label>
            <Popover open={showTanggalPicker} onOpenChange={setShowTanggalPicker}>
              <PopoverTrigger>
                <button type="button" className={`${inputClass} flex items-center gap-3 text-left`}>
                  <CalendarIcon className="h-5 w-5 text-gray-400 shrink-0" />
                  <span className={tanggal ? "text-gray-800" : "text-gray-400"}>
                    {tanggal ? format(tanggal, "d MMMM yyyy", { locale: localeId }) : "Pilih tanggal pelaksanaan"}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={tanggal}
                  onSelect={(d) => { setTanggal(d); setShowTanggalPicker(false); }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Tempat Pelaksanaan */}
          <div className="space-y-4">
            <label className="text-[14px] font-semibold text-[#1a1a1a] block">Tempat Pelaksanaan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] text-gray-500 font-medium">Provinsi</label>
                <Select value={provinsiCode} onValueChange={(v) => { if(v) { setProvinsiCode(v); setKotaCode(""); } }} disabled={isInternasional}>
                  <SelectTrigger className="w-full bg-[#f8f9fa] text-[15px] rounded-xl h-[48px] border-gray-200 focus:ring-[#50c878]/50 disabled:opacity-50">
                    <SelectValue placeholder={isInternasional ? "N/A (Internasional)" : "Pilih Provinsi"} />
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
                    <SelectValue placeholder={isInternasional ? "N/A" : provinsiCode ? "Pilih Kota" : "Pilih provinsi dulu"} />
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
                    <input type="text" value={member.nim} onChange={(e) => updateTeamMember(index, "nim", e.target.value)} placeholder="NIM anggota" className="flex-1 bg-white text-gray-800 placeholder-gray-400 text-[14px] rounded-lg px-4 h-11 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
                    <input type="text" value={member.nama} onChange={(e) => updateTeamMember(index, "nama", e.target.value)} placeholder="Nama lengkap anggota" className="flex-[2] bg-white text-gray-800 placeholder-gray-400 text-[14px] rounded-lg px-4 h-11 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" />
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

          {/* Sertifikat */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Sertifikat (1 file, PDF/JPG/PNG, Maks 5MB)</label>
            {sertifikat ? (
              <div className="border border-gray-200 rounded-xl p-3 bg-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
                    {sertifikat.type.includes("image") ? (
                      <ImageIcon className="h-5 w-5 text-[#50c878]" />
                    ) : (
                      <FileText className="h-5 w-5 text-[#50c878]" />
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-gray-900 truncate max-w-xs">{sertifikat.name}</p>
                    <p className="text-[12px] text-gray-500">{(sertifikat.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSertifikat(null)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl px-6 py-8 bg-[#f8f9fa] hover:border-[#50c878]/50 hover:bg-gray-50 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
                    if (!validTypes.includes(file.type)) {
                      toast.error("Hanya file PDF, JPG, atau PNG yang diperbolehkan.");
                      return;
                    }
                    setSertifikat(file);
                  }} 
                />
                <UploadCloud className="h-9 w-9 text-gray-400 mb-2" />
                <span className="text-[14px] font-semibold text-[#50c878]">Klik untuk pilih sertifikat</span>
                <span className="text-[13px] text-gray-400 mt-1">PDF, JPG, PNG (maks. 5MB)</span>
              </label>
            )}
          </div>

          {/* Bukti Pendukung */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Bukti Pendukung (maks. 5 file)</label>
            <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl px-6 py-8 bg-[#f8f9fa] transition-colors cursor-pointer ${buktiBukti.length >= 5 ? "opacity-50 pointer-events-none" : "hover:border-[#50c878]/50 hover:bg-gray-50"}`}>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple className="hidden" onChange={handleBuktiChange} disabled={buktiBukti.length >= 5} />
              <UploadCloud className="h-9 w-9 text-gray-400 mb-2" />
              <span className="text-[14px] font-semibold text-[#50c878]">Seret atau klik untuk memilih</span>
              <span className="text-[13px] text-gray-400 mt-1">{buktiBukti.length}/5 file dipilih</span>
            </label>
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
