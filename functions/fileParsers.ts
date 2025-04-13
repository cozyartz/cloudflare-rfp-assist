import { parsePdf, parseDocx } from '../fileParsers';
import mammoth from 'mammoth';

export async function parsePdf(buffer: Uint8Array): Promise<string> {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();
  return pages.map(p => p.getTextContent()).join('\n');
}

export async function parseDocx(buffer: Uint8Array): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
}
