import { onRequestPost } from 'itty-router-openapi';
import { parsePdf, parseDocx } from '../lib/fileParsers';

export const onRequestPost = async (context) => {
  const formData = await context.request.formData();
  const file = formData.get('file');

  if (!file || typeof file !== 'object') {
    return new Response('Missing file', { status: 400 });
  }

  const contentType = file.type;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  let text = '';

  try {
    if (contentType.includes('pdf')) {
      text = await parsePdf(buffer);
    } else if (contentType.includes('word') || file.name.endsWith('.docx')) {
      text = await parseDocx(buffer);
    } else {
      return new Response('Unsupported file type', { status: 415 });
    }

    return Response.json({ text });
  } catch (err) {
    console.error('File parse error:', err);
    return new Response('Failed to extract content', { status: 500 });
  }
};
