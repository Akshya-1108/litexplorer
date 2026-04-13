import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

interface DropZoneProps {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
  disabled?: boolean;
  accept?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  file,
  onFile,
  onClear,
  disabled,
  accept = 'application/pdf',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={[
        'relative flex flex-col items-center justify-center w-full h-52 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden group',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        dragging
          ? 'border-[#0057FF] bg-[#0057FF]/10'
          : file
          ? 'border-[#A3B18A]/60 bg-[#A3B18A]/5'
          : 'border-[#1E2028] hover:border-[#0057FF]/50 hover:bg-[#111318]/40',
      ].join(' ')}
    >
      {dragging && (
        <div className="absolute inset-0 bg-[#0057FF]/10 pointer-events-none" />
      )}

      {file ? (
        <div className="flex flex-col items-center gap-3 px-6 w-full z-10">
          <div className="bg-[#A3B18A]/10 border border-[#A3B18A]/20 p-3 rounded-lg">
            <FileText className="w-7 h-7 text-[#A3B18A]" />
          </div>
          <p className="text-gray-200 font-semibold text-sm truncate w-full text-center px-4">
            {file.name}
          </p>
          <p className="text-[#6B7280] text-xs">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <X size={11} /> Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 z-10">
          <div className="bg-[#111318] border border-[#1E2028] group-hover:border-[#0057FF]/40 p-4 rounded-xl transition-colors">
            <UploadCloud className="w-7 h-7 text-[#6B7280] group-hover:text-[#0057FF] transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-gray-300 font-medium text-sm">
              Drop PDF here or <span className="text-[#0057FF]">browse</span>
            </p>
            <p className="text-[#6B7280] text-xs mt-1">Up to 50 MB</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};
