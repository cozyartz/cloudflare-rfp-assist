import { useRef } from 'react';

export default function FileUpload({ onExtracted }: { onExtracted: (text: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      const { text } = await res.json();
      onExtracted(text);
    } catch (err) {
      console.error('Error extracting file:', err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="mt-6">
      <label
        htmlFor="upload"
        className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded inline-block"
      >
        📎 Upload RFP PDF
      </label>
      <input
        ref={fileInputRef}
        id="upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
