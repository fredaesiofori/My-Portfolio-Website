// Simple test script for local dev server endpoints
// Usage: `node scripts/test-endpoints.js`

const root = 'http://localhost:3000';

async function tryRoot() {
  const res = await fetch(root + '/');
  console.log('Root status:', res.status);
  const text = await res.text();
  console.log('Root preview:', text.slice(0, 200).replace(/\n/g, ' '));
}

async function testGenerateImage() {
  const payload = { prompt: 'Afrofuturist portrait of a woman', size: '1024x1024' };
  try {
    const res = await fetch(root + '/api/gemini/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('\n/generate-image status:', res.status);
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const js = await res.json();
      console.log('Response JSON keys:', Object.keys(js));
      console.log('Preview:', JSON.stringify(js).slice(0, 1000));
    } else {
      const txt = await res.text();
      console.log('Response (text) preview:', txt.slice(0, 1000));
    }
  } catch (err) {
    console.error('/generate-image error:', err);
  }
}

async function main() {
  await tryRoot();
  await testGenerateImage();
}

main().catch(err => { console.error(err); process.exit(1); });
