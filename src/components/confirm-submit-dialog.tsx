import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmSubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function ConfirmSubmitDialog({ isOpen, onClose, onSubmit }: ConfirmSubmitDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="flex flex-col">
          <h2 className="text-[20px] font-bold text-gray-900 mb-3 tracking-tight">
            Konfirmasi Submit
          </h2>
          
          <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
            Apakah Anda yakin data dan evidence yang diunggah sudah benar?
          </p>

          <div className="flex items-center justify-end gap-3 w-full">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-12 px-6 text-[15px] font-medium border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button 
              type="button"
              onClick={onSubmit}
              className="bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-12 px-6 text-[15px] font-semibold transition-all shadow-sm"
            >
              Ya, Kirim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
