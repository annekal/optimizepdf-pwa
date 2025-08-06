import { PDFDocument } from 'pdf-lib';

const fileInput = document.getElementById('fileInput');
const optimizeBtn = document.getElementById('optimizeBtn');

optimizeBtn.addEventListener('click', async () => {
  const files = fileInput.files;
  if (!files.length) return alert('Select PDF files');

  const merged = await PDFDocument.create();
  for (let f of files) {
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => {
      const content = p.getContentStream();
      if (content && content.getLength() > 0) merged.addPage(p);
    });
  }
  const out = await merged.save();
  const blob = new Blob([out], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'optimized.pdf';
  a.click();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(console.error);
}
