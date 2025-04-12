import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractTextFromPdf(buffer: Uint8Array): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const pages: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(' ');
    pages.push(text);
  }

  return pages.join('\n\n');
}
