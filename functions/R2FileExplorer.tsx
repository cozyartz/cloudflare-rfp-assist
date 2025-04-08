import { useEffect, useState } from 'react';

export default function R2FileExplorer() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    fetch('/functions/list-files')
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .catch(err => console.error('Error loading files:', err));
  }, []);

  return (
    <div className="p-4 border-t">
      <h2 className="font-bold mb-2">📂 Stored RFP Files</h2>
      <ul className="text-sm list-disc pl-4">
        {files.map((file, idx) => (
          <li key={idx}>
            <a
              href={`https://rfp.cozyartz.com/r2/${file}`}
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
  );
}
