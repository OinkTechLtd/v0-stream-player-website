import { writeFileSync, mkdirSync } from 'fs';

const BASE = 'https://raw.githubusercontent.com/OinkTechLtd/cdnplayerjs/main';
const OUT = '/vercel/share/v0-project/public/embed';

mkdirSync(OUT, { recursive: true });

const files = ['index.html', 'playerjs.js', 'jquery.min.js'];

for (const file of files) {
  console.log(`Downloading ${file}...`);
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) {
    console.error(`Failed to download ${file}: ${res.status}`);
    continue;
  }
  const text = await res.text();
  writeFileSync(`${OUT}/${file}`, text);
  console.log(`Saved ${file} (${text.length} bytes)`);
}

console.log('Done! All player files downloaded.');
