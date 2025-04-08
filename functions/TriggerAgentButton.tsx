import { useState } from 'react';

export function TriggerAgentButton() {
  const [response, setResponse] = useState(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleClick = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Content = (reader.result as string).split(',')[1];

      const payload = {
        businessContext: 'Cozyartz Media Group',
        documentContent: base64Content,
        fileName: file.name,
        fileType: file.type,
      };

      const res = await fetch('/functions/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setResponse(result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      <label className="cursor-pointer inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
        Upload RFP File
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>

      <button
        onClick={handleClick}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        Run Cloudflare AI Agent
      </button>

      {response && (
        <div className="mt-4">
          <h2 className="font-bold mb-2">📂 Stored RFP Files</h2>
          <ul className="text-sm list-disc pl-4">
            {response.files?.map((file: string, idx: number) => (
              <li key={idx}>
                <a
                  href={`https://pub-216128cf63fc4675b58e1f8c0162ef6c.r2.dev/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {file}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}