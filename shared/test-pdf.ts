import fs from 'fs';
import pdf = require('pdf-parse');

async function extractPages() {
  const dataBuffer = fs.readFileSync('content/Four blocks paperback book (full).pdf');
  const data = await pdf(dataBuffer);
  console.log('Pages:', data.numpages);
  console.log('Sample text from first 500 chars:');
  console.log(data.text.substring(0, 500));
}

extractPages().catch(console.error);
