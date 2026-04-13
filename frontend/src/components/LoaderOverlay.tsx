import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderOverlayProps {
  message?: string;
  isProcessing: boolean;
}

export const LoaderOverlay: React.FC<LoaderOverlayProps> = ({
  message = 'Processing\u2026',
  isProcessing,
}) => {
  if (!isProcessing) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl animate-fade-in">
      <div className="absolute inset-0 bg-[#1E2021]/90 rounded-xl" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="bg-[#282828] border border-[#32302F] p-5 rounded-xl shadow-xl">
          <Loader2 className="w-10 h-10 text-[#D9542C] animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-[#EFE7DF] font-semibold text-lg">{message}</p>
          <p className="text-[#777068] text-sm mt-1">This may take a moment&hellip;</p>
        </div>
      </div>
    </div>
  );
};
