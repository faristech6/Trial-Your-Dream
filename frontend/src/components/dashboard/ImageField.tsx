import { useState } from 'react';
import { assetSrc, fileToImageData } from '../../lib/api';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxSize?: number;
}

/** Image URL box plus file upload; the value is either a URL/path or a data URL the API will store. */
export default function ImageField({ label, value, onChange, maxSize }: ImageFieldProps) {
  const [error, setError] = useState('');
  const pick = async (file?: File) => {
    if (!file) return;
    try {
      setError('');
      onChange(await fileToImageData(file, maxSize));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Upload failed.');
    }
  };
  return (
    <div className="block text-sm font-semibold">
      {label}
      <div className="mt-2 flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#dfe3e7] bg-[#f6f7f9]">
          {value ? <img src={value.startsWith('data:') ? value : assetSrc(value)} alt="" className="max-h-full max-w-full object-contain" /> : <span className="text-xs font-normal text-[#a0aab3]">None</span>}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void pick(event.target.files?.[0])} className="block w-full text-xs font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-[#edf3fb] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#07549a]" />
          <input value={value.startsWith('data:') ? '' : value} onChange={(event) => onChange(event.target.value)} placeholder="…or paste an image URL" className="w-full rounded-lg border border-[#dfe3e7] px-3 py-2 text-xs font-normal outline-none focus:border-[#07549a]" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs font-normal text-red-600">{error}</p>}
    </div>
  );
}
