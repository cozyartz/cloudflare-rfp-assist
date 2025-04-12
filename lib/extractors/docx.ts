import { unzip } from 'unzipit';

export async function extractTextFromDocx(buffer: Uint8Array): Promise<string> {
  const { entries } = await unzip(buffer);
  const document = await entries['word/document.xml'].text();

  // Strip out XML tags and normalize line breaks
  return document
    .replace(/<[^>]+>/g, '')         // Remove XML tags
    .replace(/\\n/g, '\n')           // Normalize line breaks
    .replace(/\\t/g, ' ')            // Normalize tabs
    .replace(/ +/g, ' ')             // Collapse spaces
    .trim();
}
