import { useEffect, useState } from 'react';

export default function R2FileExplorer() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    fetch('/functions/list-files')
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .catch(err => console.error('Error loading files:', err));
  }, []);

  async function handleParseFile(fileName: string) {
    try {
      const fileUrl = `https://rfp.cozyartz.com/r2/${fileName}`;
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const base64File = await blobToBase64(blob);

      const parseRes = await fetch('/functions/parse-rfp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, base64File }),
      });

      if (!parseRes.ok) {
        throw new Error(`API returned ${parseRes.status}`);
      }

      const result = await parseRes.json();
      console.log('✅ Parsed RFP Result:', result);
      alert('Parsed successfully! Check the console for the structured output.');
    } catch (err) {
      console.error('❌ Failed to parse file:', err);
      alert('Error parsing file. Check the console for details.');
    }
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return (
    <div className="p-4 border-t">
      <h2 className="font-bold mb-2">📂 Stored RFP Files</h2>
      <ul className="text-sm list-disc pl-4">
        {files.map((file, idx) => (
          <li key={idx} className="flex items-center justify-between gap-2">
            <a
              href={`https://rfp.cozyartz.com/r2/${file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {file}
            </a>
            <button
              className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
              onClick={() => handleParseFile(file)}
            >
              Parse
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
