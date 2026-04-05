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
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl animate-fade-in">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md rounded-2xl" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-30 animate-pulse rounded-full" />
          <div className="relative bg-gray-900 border border-indigo-500/30 p-5 rounded-2xl shadow-2xl shadow-indigo-900/50">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg">{message}</p>
          <p className="text-gray-400 text-sm mt-1">This may take a moment…</p>
        </div>
      </div>
    </div>
  );
};
