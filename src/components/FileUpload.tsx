export default function FileUpload({ onExtracted }: FileUploadProps) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/extract-content', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    onExtracted(json.text);
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
