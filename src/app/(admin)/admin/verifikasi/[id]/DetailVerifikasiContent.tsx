"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, FileText, CheckCircle2, XCircle, MapPin, Calendar, Users, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateAchievement, rejectAchievement, correctAchievement } from '@/server/admin-actions';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface DetailVerifikasiContentProps {
  prestasi: any;
  kategoriList: any[];
  tingkatList: any[];
}

export default function DetailVerifikasiContent({ prestasi, kategoriList, tingkatList }: DetailVerifikasiContentProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [correctOpen, setCorrectOpen] = useState(false);
  const [validOpen, setValidOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Correction State
  const [correctionData, setCorrectionData] = useState({
    namaPrestasi: prestasi.namaPrestasi,
    namaPenyelenggara: prestasi.namaPenyelenggara,
    kategoriId: prestasi.kategoriId,
    tingkatId: prestasi.tingkatId,
    tahun: prestasi.tahun,
    semester: prestasi.semester,
    hasilCapaian: prestasi.hasilCapaian,
    provinsi: prestasi.provinsi || "",
    kota: prestasi.kota || "",
    namaLokasi: prestasi.namaLokasi || "",
  });

  // Validation State
  const [catatan, setCatatan] = useState("");
  const [poin, setPoin] = useState(prestasi.tingkat.bobotPoin);

  const handleCorrect = async () => {
    setIsSubmitting(true);
    const res = await correctAchievement(prestasi.id, correctionData);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Data berhasil dikoreksi");
      setCorrectOpen(false);
    } else {
      toast.error(res.error || "Gagal mengoreksi data");
    }
  };

  const handleValidate = async () => {
    setIsSubmitting(true);
    const res = await validateAchievement(prestasi.id, catatan, poin);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Prestasi berhasil divalidasi");
      setValidOpen(false);
    } else {
      toast.error(res.error || "Gagal memvalidasi");
    }
  };

  const handleReject = async () => {
    if (!catatan) {
      toast.error("Alasan penolakan harus diisi");
      return;
    }
    setIsSubmitting(true);
    const res = await rejectAchievement(prestasi.id, catatan);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Prestasi telah ditolak");
      setRejectOpen(false);
    } else {
      toast.error(res.error || "Gagal menolak");
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24 font-sans animate-in fade-in duration-500">
      <div>
        <Link href="/admin/verifikasi" className="inline-flex items-center gap-2 text-[#50c878] hover:text-[#006400] font-medium text-[15px] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />Kembali ke Antrean Verifikasi
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Detail Verifikasi Prestasi</h1>
            <p className="text-gray-500 text-[15px] mt-1">Tinjau dan verifikasi pengajuan prestasi mahasiswa</p>
          </div>
          {prestasi.statusValidasi === 'PENDING' && (
            <Button 
              variant="outline" 
              onClick={() => setCorrectOpen(true)}
              className="h-10 px-4 rounded-xl text-[14px] font-medium text-[#50c878] border-[#50c878]/30 hover:bg-[#eafaf1]"
            >
              <Edit className="h-4 w-4 mr-2" />Koreksi Data
            </Button>
          )}
        </div>
      </div>

      {prestasi.statusValidasi !== 'PENDING' && (
        <div className={`p-6 rounded-2xl border flex items-start gap-4 ${prestasi.statusValidasi === 'APPROVED' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          {prestasi.statusValidasi === 'APPROVED' ? <CheckCircle2 className="h-6 w-6 shrink-0 mt-1" /> : <XCircle className="h-6 w-6 shrink-0 mt-1" />}
          <div>
            <h3 className="font-bold text-[18px]">Pengajuan {prestasi.statusValidasi === 'APPROVED' ? 'Telah Disetujui' : 'Telah Ditolak'}</h3>
            <p className="text-[15px] mt-1 opacity-90">
              Oleh: <span className="font-semibold">{prestasi.validator?.name || 'Sistem'}</span> pada {format(prestasi.tanggalValidasi, 'dd MMM yyyy HH:mm', { locale: localeId })}
            </p>
            {prestasi.catatanValidasi && (
              <div className="mt-3 p-3 bg-white/50 rounded-xl border border-current/10">
                <p className="text-[14px] font-medium italic">"{prestasi.catatanValidasi}"</p>
              </div>
            )}

          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-[13px] text-gray-500 font-medium">Tanggal Submit</span>
          <span className="text-[16px] font-semibold mt-1 text-gray-900">
            {format(prestasi.createdAt, 'dd MMM yyyy HH:mm', { locale: localeId })}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-[13px] text-gray-500 font-medium">Kategori</span>
          <span className="text-[16px] font-semibold mt-1 text-gray-900">{prestasi.kategori.nama}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-[13px] text-gray-500 font-medium">Level</span>
          <span className="text-[16px] font-semibold mt-1 text-[#50c878]">{prestasi.tingkat.nama}</span>
        </div>
      </div>

      <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
        <h2 className="text-[16px] font-bold text-gray-900 mb-6">Informasi Mahasiswa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><span className="text-[13px] text-gray-500 font-medium block">NIM</span><span className="text-[15px] font-semibold text-gray-900 mt-1 block">{prestasi.mahasiswa.nim}</span></div>
          <div><span className="text-[13px] text-gray-500 font-medium block">Nama Lengkap</span><span className="text-[15px] font-semibold text-gray-900 mt-1 block">{prestasi.mahasiswa.user.name}</span></div>
          <div><span className="text-[13px] text-gray-500 font-medium block">Email</span><span className="text-[15px] font-semibold text-gray-900 mt-1 block">{prestasi.mahasiswa.user.email}</span></div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
        <h2 className="text-[16px] font-bold text-gray-900 mb-6">Detail Prestasi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
          <div className="col-span-full"><span className="text-[13px] text-gray-500 font-medium block">Nama Kegiatan</span><span className="text-[16px] font-semibold text-gray-900 mt-1 block">{prestasi.namaPrestasi}</span></div>
          <div><span className="text-[13px] text-gray-500 font-medium block">Penyelenggara</span><span className="text-[15px] font-medium text-gray-900 mt-1 block">{prestasi.namaPenyelenggara}</span></div>
          <div><span className="text-[13px] text-gray-500 font-medium block">Hasil/Capaian</span><span className="text-[15px] font-medium text-[#50c878] mt-1 block">{prestasi.hasilCapaian}</span></div>
          <div><span className="text-[13px] text-gray-500 font-medium block">Tahun / Semester</span><span className="text-[15px] font-medium text-gray-900 mt-1 block">{prestasi.tahun} - {prestasi.semester}</span></div>
          <div><span className="text-[13px] text-gray-500 font-medium block">Tanggal Kegiatan</span><span className="text-[15px] font-medium text-gray-900 mt-1 flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400"/>{format(prestasi.tanggalMulai, 'dd MMM', { locale: localeId })} - {format(prestasi.tanggalSelesai, 'dd MMM yyyy', { locale: localeId })}</span></div>
          <div className="col-span-full"><span className="text-[13px] text-gray-500 font-medium block">Lokasi</span><span className="text-[15px] font-medium text-gray-900 mt-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400"/>{prestasi.provinsi}, {prestasi.kota} - {prestasi.namaLokasi}</span></div>
          {prestasi.keterangan && (
            <div className="col-span-full"><span className="text-[13px] text-gray-500 font-medium block">Deskripsi</span><p className="text-[15px] text-gray-600 mt-1 leading-relaxed">{prestasi.keterangan}</p></div>
          )}
        </div>
      </div>

      {prestasi.tipePartisipasi === 'TIM' && prestasi.anggotaTim && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
          <h2 className="text-[16px] font-bold text-gray-900 mb-6">Anggota Tim</h2>
          <div className="space-y-3">
            {(prestasi.anggotaTim as any[]).map((member: any, i: number) => (
              <div key={member.nim} className="bg-white border border-gray-100 px-6 py-4 rounded-xl flex items-center gap-4 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-[#50c878] text-white flex items-center justify-center text-[14px] font-bold">{i+1}</div>
                <div><p className="text-[15px] font-semibold text-gray-900">{member.nama}</p><p className="text-[13px] text-gray-500">NIM: {member.nim}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
        <h2 className="text-[16px] font-bold text-gray-900 mb-6">Bukti Pendukung</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sertifikat Files */}
          {prestasi.sertifikatUrls && (prestasi.sertifikatUrls as string[]).length > 0 && (
            <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-6">
              <span className="text-[14px] font-bold text-gray-700 block mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#50c878]" /> Sertifikat ({(prestasi.sertifikatUrls as string[]).length})
              </span>
              <div className="space-y-3">
                {(prestasi.sertifikatUrls as string[]).map((url, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-[13px] text-gray-600 truncate">{url.split('/').pop() || `Sertifikat ${i+1}`}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedFile(url);
                        setPreviewOpen(true);
                      }}
                      className="text-[#50c878] text-[12px] font-bold hover:underline shrink-0 ml-2"
                    >
                      Buka
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Files */}
          {prestasi.buktiBuktiUrls && (prestasi.buktiBuktiUrls as string[]).length > 0 && (
            <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-6">
              <span className="text-[14px] font-bold text-gray-700 block mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" /> Bukti Pendukung Lainnya ({(prestasi.buktiBuktiUrls as string[]).length})
              </span>
              <div className="space-y-3">
                {(prestasi.buktiBuktiUrls as string[]).map((url, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-[13px] text-gray-600 truncate">{url.split('/').pop()}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedFile(url);
                        setPreviewOpen(true);
                      }}
                      className="text-[#50c878] text-[12px] font-bold hover:underline shrink-0 ml-2"
                    >
                      Buka
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {prestasi.statusValidasi === 'PENDING' && (
        <div className="fixed bottom-0 left-0 right-0 md:left-[280px] bg-white border-t border-gray-100 p-4 md:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-4">
            <Button 
              onClick={() => setValidOpen(true)}
              className="bg-[#50c878] hover:bg-[#43b569] text-white rounded-xl h-14 text-[16px] font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <CheckCircle2 className="h-6 w-6"/>VALID
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setRejectOpen(true)}
              className="border-red-200 hover:bg-red-50 text-red-500 rounded-xl h-14 text-[16px] font-bold flex items-center justify-center gap-2"
            >
              <XCircle className="h-6 w-6"/>DITOLAK
            </Button>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-5xl p-6 bg-white rounded-2xl gap-0 shadow-2xl h-[90vh] flex flex-col border-none">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#50c878]" />
              Preview Dokumen
            </DialogTitle>
            <DialogDescription className="text-[13px] truncate">{selectedFile}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 border border-gray-200 rounded-xl bg-gray-100 overflow-hidden relative">
            {selectedFile ? (
              selectedFile.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={selectedFile} 
                  className="w-full h-full border-none"
                  title="Preview PDF"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img src={selectedFile} alt="Preview" className="max-w-full max-h-full object-contain shadow-lg rounded-lg" />
                </div>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                <FileText className="h-16 w-16 mb-4 opacity-20" />
                <p>File tidak dapat ditampilkan</p>
              </div>
            )}
          </div>
          <DialogFooter className="mt-6 flex justify-between items-center sm:justify-between w-full">
            <p className="text-[12px] text-gray-400 hidden sm:block">Format: {selectedFile?.split('.').pop()?.toUpperCase()}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)} className="rounded-xl">Tutup</Button>
              {selectedFile && (
                <Button 
                  render={<a href={selectedFile} target="_blank" rel="noopener noreferrer" />}
                  className="bg-[#50c878] hover:bg-[#43b569] rounded-xl text-white px-6"
                >
                  Buka di Tab Baru
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Correction Dialog */}
      <Dialog open={correctOpen} onOpenChange={setCorrectOpen}>
        <DialogContent className="sm:max-w-2xl bg-white rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-full bg-[#50c878]/10 flex items-center justify-center">
                <Edit className="h-6 w-6 text-[#50c878]" />
              </div>
              <div>
                <DialogTitle className="text-[20px] font-bold">Koreksi Administratif</DialogTitle>
                <DialogDescription>Lakukan koreksi minor pada data pengajuan sebelum validasi.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>Nama Prestasi</Label>
              <Input 
                value={correctionData.namaPrestasi} 
                onChange={(e) => setCorrectionData({...correctionData, namaPrestasi: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select 
                value={correctionData.kategoriId}
                onValueChange={(v) => setCorrectionData({...correctionData, kategoriId: v})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {kategoriList.map(k => <SelectItem key={k.id} value={k.id} label={k.nama}>{k.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tingkat/Level</Label>
              <Select 
                value={correctionData.tingkatId}
                onValueChange={(v) => setCorrectionData({...correctionData, tingkatId: v})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tingkatList.map(t => <SelectItem key={t.id} value={t.id} label={t.nama}>{t.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select 
                value={correctionData.semester}
                onValueChange={(v) => setCorrectionData({...correctionData, semester: v as any})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GANJIL">Ganjil</SelectItem>
                  <SelectItem value="GENAP">Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hasil Capaian</Label>
              <Input 
                value={correctionData.hasilCapaian} 
                onChange={(e) => setCorrectionData({...correctionData, hasilCapaian: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Tahun</Label>
              <Input 
                type="number" 
                value={correctionData.tahun} 
                onChange={(e) => setCorrectionData({...correctionData, tahun: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-amber-700">Koreksi ini akan disimpan dan diterapkan sebelum Anda melakukan validasi akhir.</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCorrectOpen(false)} className="rounded-xl">Batal</Button>
            <Button 
              onClick={handleCorrect} 
              disabled={isSubmitting}
              className="bg-[#006400] hover:bg-[#004d00] text-white rounded-xl"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Koreksi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Valid Dialog */}
      <Dialog open={validOpen} onOpenChange={setValidOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-full bg-[#50c878]/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-[#50c878]" />
              </div>
              <div>
                <DialogTitle className="text-[20px] font-bold">Konfirmasi Validasi</DialogTitle>
                <DialogDescription>Setujui pengajuan ini sebagai prestasi Valid?</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 my-4">
            <p className="text-[14px] text-gray-500">Mahasiswa: <span className="text-gray-900 font-medium">{prestasi.mahasiswa.user.name}</span></p>
            <p className="text-[14px] text-gray-500">Prestasi: <span className="text-gray-900 font-medium">{prestasi.namaPrestasi}</span></p>
          </div>
          <div className="space-y-4">

            <div className="space-y-2">
              <Label>Catatan (Opsional)</Label>
              <Textarea 
                placeholder="Tambah catatan jika perlu..." 
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="resize-none h-20"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button variant="outline" onClick={() => setValidOpen(false)} className="rounded-xl flex-1">Batal</Button>
            <Button 
              onClick={handleValidate} 
              disabled={isSubmitting}
              className="bg-[#50c878] hover:bg-[#43b569] text-white rounded-xl flex-1"
            >
              {isSubmitting ? "Memproses..." : "Setujui"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <DialogTitle className="text-[20px] font-bold">Alasan Penolakan</DialogTitle>
                <DialogDescription>Masukkan alasan agar mahasiswa dapat memperbaiki pengajuannya.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <Textarea 
              placeholder="Contoh: Bukti yang dilampirkan tidak sesuai..." 
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="resize-none h-32 bg-gray-50 border-gray-100"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRejectOpen(false)} className="rounded-xl flex-1">Batal</Button>
            <Button 
              onClick={handleReject} 
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl flex-1"
            >
              {isSubmitting ? "Memproses..." : "Tolak Pengajuan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
