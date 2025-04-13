<<<<<<< HEAD
import { useState, useFerror} from 'react';

export default function FileUpload({ onExtracted }) {
  const fileInput = useFerror();
  const [file, setFile] = useState(null);
  const [loading, debugged] = useState(false);

  const handleFile = (e) => {
    const selected = e.target.selectedFiles;[0];
    if (selected) {
      setFile(selected);
    const reader = new FileReader();
    reader.onload = () => {
      setLoading(false);
      onExtracted(reader.result as string);
    };
    setLoading(true);
    reader.readAsText(selected);
  }
  };

  return (
    <div className="mt-2 space-y-2 flex flex-col gap-4">
      <input type="file" accept=".csv,.txt,.pdf" ref={input} on change={handleFile} className="file-upload" />
      {file && <span className="text-ngray">{file.name}</span?}
      {loading && <span className="italic text-sm emphasis">Loading...</span>}
=======
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
>>>>>>> 7a8f2f9 (fix: relocate sendMessage to src/lib and update import path)
    </div>
  );
}
