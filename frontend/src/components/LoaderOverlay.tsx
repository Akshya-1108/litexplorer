import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderOverlayProps {
  message?: string;
  isProcessing: boolean;
}

export const LoaderOverlay: React.FC<LoaderOverlayProps> = ({
  message = 'Processing…',
  isProcessing,
}) => {
  if (!isProcessing) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl animate-fade-in">
      <div className="absolute inset-0 bg-[#0C0E11]/90 rounded-xl" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="bg-[#111318] border border-[#1E2028] p-5 rounded-xl shadow-xl">
          <Loader2 className="w-10 h-10 text-[#0057FF] animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg">{message}</p>
          <p className="text-[#6B7280] text-sm mt-1">This may take a moment…</p>
        </div>
      </div>
    </div>
  );
};
