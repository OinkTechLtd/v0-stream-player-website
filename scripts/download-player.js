import { writeFileSync } from 'fs';

const BASE = 'https://raw.githubusercontent.com/OinkTechLtd/cdnplayerjs/main';
const OUT = '/home/user';

const files = ['playerjs.js'];

for (const file of files) {
  console.log(`Downloading ${file}...`);
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) {
    console.error(`Failed to download ${file}: ${res.status}`);
    continue;
  }
  const text = await res.text();
  const outPath = `${OUT}/${file}`;
  writeFileSync(outPath, text);
  console.log(`Saved ${file} to ${outPath} (${text.length} bytes)`);
}

console.log('Done! All player files downloaded.');
