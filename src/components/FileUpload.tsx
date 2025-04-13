interface FileUploadProps {
  onExtracted: (text: string) => void;
}

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
    <label className="upload-btn cursor-pointer">
      📎 Upload RFP
      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />
    </label>
  );
}
