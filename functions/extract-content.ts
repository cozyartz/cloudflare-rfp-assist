import { onRequestPost } from 'itty-router';
import { extractTextFromPdf } from '../lib/extractors/pdf';
import { extractTextFromDocx } from '../lib/extractors/docx';

export const onRequestPost: PagesFunction = async (context) => {
  const formData = await context.request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const type = file.type || file.name.split('.').pop();

  try {
    let text = '';

    if (type.includes('pdf')) {
      text = await extractTextFromPdf(buffer);
    } else if (type.includes('word') || file.name.endsWith('.docx')) {
      text = await extractTextFromDocx(buffer);
    } else {
      return new Response('Unsupported file type', { status: 415 });
    }

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Extraction failed:', err);
    return new Response('Extraction failed', { status: 500 });
  }
};
