"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Shield, Smartphone, Copy, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { useSession } from '@/lib/auth-client';
import { twoFactor } from '@/lib/auth-client';
import { uploadFileToR2 } from '@/server/upload-actions';
import { updateUserProfile, getCurrentUser } from '@/server/user-actions';
import { toast } from 'sonner';

export function PengaturanContent() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    nim: '',
    image: '',
  });

  // 2FA state
  const [is2FaEnabled, setIs2FaEnabled] = useState(false);
  const [mfaModalOpen, setMfaModalOpen] = useState(false);
  const [mfaModalType, setMfaModalType] = useState<'enable' | 'disable'>('enable');
  const [mfaSetupStep, setMfaSetupStep] = useState(0); // 0: password, 1: QR, 2: verify
  const [mfaPassword, setMfaPassword] = useState('');
  const [totpUri, setTotpUri] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser();
      if (user) {
        setProfile({
          name: user.name || '',
          email: user.email || '',
          nim: user.nim || '-',
          image: user.image || '',
        });
      }
      
      if (session?.user?.twoFactorEnabled) {
        setIs2FaEnabled(true);
      }
      
      setLoading(false);
    }
    
    if (!sessionLoading) {
      loadData();
    }
  }, [session, sessionLoading]);

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await updateUserProfile({ name: profile.name });
    if (error) {
      toast.error(error);
    } else {
      toast.success('Profil berhasil diperbarui');
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.info('Mengunggah foto...');
    const res = await uploadFileToR2(file, 'profil');
    
    if ('error' in res) {
      toast.error(res.error);
      return;
    }

    const imageUrl = res.url;
    setProfile(p => ({ ...p, image: imageUrl }));
    
    const { error } = await updateUserProfile({ image: imageUrl });
    if (error) toast.error("Gagal menyimpan foto ke database");
    else toast.success("Foto profil berhasil diperbarui");
  };

  const handle2FaToggle = async (checked: boolean) => {
    setMfaModalType(checked ? 'enable' : 'disable');
    setMfaModalOpen(true);
    setMfaSetupStep(0);
    setMfaPassword('');
  };

  const handleStartMfaAction = async () => {
    if (!mfaPassword) return toast.error("Silakan masukkan password Anda");

    toast.info("Memverifikasi...");
    try {
      if (mfaModalType === 'enable') {
        const { data, error } = await twoFactor.enable({ password: mfaPassword });

        if (error) {
          if (error.status === 400 || error.code === 'INVALID_PASSWORD') {
            toast.error("Password yang Anda masukkan salah.");
          } else {
            toast.error(error.message || "Gagal menginisiasi 2FA");
          }
          return;
        }
        
        if (data?.totpURI) {
          setTotpUri(data.totpURI);
          const secretMatch = data.totpURI.match(/secret=([^&]+)/);
          if (secretMatch) setTotpSecret(secretMatch[1]);
          setMfaSetupStep(1); // Proceed to QR code
        }
      } else {
        const { error } = await twoFactor.disable({ password: mfaPassword });
        if (error) {
          if (error.status === 400 || error.code === 'INVALID_PASSWORD') {
            toast.error("Password yang Anda masukkan salah.");
          } else {
            toast.error(error.message || "Gagal menonaktifkan 2FA");
          }
        } else {
          setIs2FaEnabled(false);
          setMfaModalOpen(false);
          toast.success("2FA berhasil dinonaktifkan");
        }
      }
    } catch (e) {
      toast.error("Kesalahan internal 2FA");
    }
  };

  const handleVerify2FaSetup = async () => {
    if (verifyCode.length < 6) return toast.error("Masukkan 6 digit kode");

    const { error } = await twoFactor.verifyTotp({ code: verifyCode });
    if (error) {
      toast.error("Kode verifikasi salah.");
    } else {
      setIs2FaEnabled(true);
      setMfaModalOpen(false);
      toast.success("Autentikasi Dua Faktor berhasil diaktifkan!");
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#50c878]" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      <div>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[#50c878] hover:text-[#006400] font-medium text-[15px] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />Kembali
        </button>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Pengaturan Akun</h1>
        <p className="text-gray-500 text-[15px] mt-1">Kelola informasi pribadi dan keamanan akun Anda</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <h2 className="text-[18px] font-semibold text-[#1a1a1a] mb-8">Informasi Profil</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
          <div className="relative">
            {profile.image ? (
              <img src={profile.image} alt="Profile" className="h-24 w-24 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-[#50c878] text-white flex items-center justify-center text-4xl font-semibold">
                {profile.name.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 shadow-sm transition-colors text-gray-600">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-gray-900">{profile.name || "Pengguna"}</h3>
            <p className="text-[14px] text-gray-500 mt-1">{profile.email}</p>
            {profile.nim !== '-' && <p className="text-[14px] text-gray-500">NIM: {profile.nim}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Nama Lengkap</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full text-[15px] rounded-xl px-4 py-3 border border-gray-200 bg-[#f8f9fa] text-gray-800 focus:ring-2 focus:ring-[#50c878]/50 focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1a1a1a]">Email (Tidak dapat diubah)</label>
            <input
              type="text"
              defaultValue={profile.email}
              disabled
              className="w-full text-[15px] rounded-xl px-4 py-3 border border-gray-200 bg-[#f0f2f5] text-gray-500 cursor-not-allowed transition-all"
            />
          </div>
          {profile.nim !== '-' && (
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1a1a1a]">NIM / ID</label>
              <input
                type="text"
                defaultValue={profile.nim}
                disabled
                className="w-full text-[15px] rounded-xl px-4 py-3 border border-gray-200 bg-[#f0f2f5] text-gray-500 cursor-not-allowed transition-all"
              />
            </div>
          )}
        </div>

        <Button onClick={handleSaveProfile} disabled={saving} className="mt-8 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 px-8 text-[15px] font-semibold transition-colors disabled:opacity-70">
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <div className="flex gap-4 items-start mb-6">
          <Shield className="h-6 w-6 text-[#50c878] mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-[18px] font-semibold text-[#1a1a1a]">Autentikasi Dua Faktor (2FA)</h2>
            <p className="text-[14px] text-gray-500 mt-1">Tingkatkan keamanan akun dengan autentikasi dua faktor menggunakan TOTP (Google Authenticator)</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-center justify-between">
          <div>
            <h4 className="text-[14px] font-semibold text-gray-900 mb-1">Status 2FA</h4>
            <p className="text-[13px] text-gray-500">Aktifkan untuk keamanan tambahan saat login</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${is2FaEnabled ? 'bg-[#eafaf1] text-[#50c878]' : 'bg-gray-200 text-gray-500'}`}>
              {is2FaEnabled ? 'Aktif' : 'Nonaktif'}
            </span>
            <Switch checked={is2FaEnabled} onCheckedChange={handle2FaToggle} className="data-[state=checked]:bg-[#50c878]" />
          </div>
        </div>
      </div>

      <Dialog open={mfaModalOpen} onOpenChange={(open) => { if (!open) { setMfaModalOpen(false); if (!is2FaEnabled) { setIs2FaEnabled(false); } } }}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[420px] p-6 bg-white rounded-2xl gap-0 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-[18px] font-semibold text-gray-900">
                {mfaModalType === 'enable' ? 'Setup Autentikasi Dua Faktor' : 'Nonaktifkan Autentikasi Dua Faktor'}
              </DialogTitle>
              <DialogDescription className="text-[14px] text-gray-500">
                {mfaModalType === 'enable'? 
                (mfaSetupStep === 0 ? 'Langkah 1: Verifikasi Identitas' : mfaSetupStep === 1 ? 'Langkah 2: Scan QR Code' : 'Langkah 3: Verifikasi Kode')
                  : 'Verifikasi Identitas'}
              </DialogDescription>
            </DialogHeader>
            {mfaSetupStep === 0 ? (
              <div className="mt-2 space-y-6">
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {mfaModalType === 'enable' 
                    ? 'Demi keamanan, silakan masukkan password akun Anda untuk melanjutkan pengaturan 2FA.'
                    : 'Silakan masukkan password akun Anda untuk menonaktifkan 2FA.'}
                </p>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={mfaPassword}
                    onChange={(e) => setMfaPassword(e.target.value)}
                    className="w-full text-[15px] rounded-xl px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#50c878]/50 focus:outline-none transition-all"
                    placeholder="Masukkan password"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => { setMfaModalOpen(false); if (mfaModalType === 'enable' && !is2FaEnabled) { setIs2FaEnabled(false); } }} className="flex-1 rounded-xl h-12 border-gray-200">Batal</Button>
                  <Button onClick={handleStartMfaAction} disabled={!mfaPassword} className="flex-1 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 font-semibold disabled:opacity-50">
                    Lanjutkan
                  </Button>
                </div>
              </div>
            ) : mfaSetupStep === 1 ? (
              <div className="mt-2 space-y-6">
                <p className="text-[14px] text-gray-600 leading-relaxed">Gunakan aplikasi authenticator (Google Authenticator, Authy, dll) untuk scan QR code di bawah ini:</p>
                <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-8 flex flex-col items-center gap-4">
                  {totpUri ? (
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(totpUri)}`} alt="QR Code" className="h-32 w-32" />
                  ) : (
                    <div className="h-32 w-32 bg-gray-200 rounded-xl flex items-center justify-center animate-pulse">
                      <Smartphone className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  {!totpUri && <span className="text-[13px] text-gray-400 font-medium">Memuat QR Code...</span>}
                </div>
                {totpSecret && (
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-gray-700">Atau masukkan kode manual:</label>
                    <div className="flex items-center relative">
                      <input type="text" readOnly value={totpSecret} className="w-full bg-white text-gray-800 text-[14px] font-mono rounded-lg px-4 py-3 border border-gray-200 pr-12 focus:outline-none" />
                      <button onClick={() => { navigator.clipboard.writeText(totpSecret); toast.success("Disalin!"); }} className="absolute right-3 text-gray-400 hover:text-gray-600"><Copy className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
                <Button disabled={!totpUri} onClick={() => setMfaSetupStep(2)} className="w-full bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 text-[15px] font-semibold mt-4 disabled:opacity-50">
                  Lanjut ke Verifikasi
                </Button>
              </div>
            ) : (
              <div className="mt-2 space-y-6">
                <p className="text-[14px] text-gray-600 leading-relaxed">Masukkan 6 digit kode dari aplikasi authenticator Anda untuk mengonfirmasi setup.</p>
                <div className="space-y-2">
                  <div className="flex items-center relative">
                    <Shield className="absolute left-4 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      maxLength={6}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ''))} 
                      className="w-full bg-white text-gray-800 text-center tracking-[0.5em] font-bold text-[18px] rounded-xl pl-12 pr-4 py-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#50c878]/50" 
                      placeholder="000000"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setMfaSetupStep(1)} className="flex-1 rounded-xl h-12 border-gray-200">Kembali</Button>
                  <Button onClick={handleVerify2FaSetup} disabled={verifyCode.length < 6} className="flex-1 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 font-semibold disabled:opacity-50">
                    Konfirmasi
                  </Button>
                </div>
              </div>
            )}

          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
