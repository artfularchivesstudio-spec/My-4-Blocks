const fs = require('fs');
const pdf = require('pdf-parse');

async function getPageCount() {
  const dataBuffer = fs.readFileSync('../content/Four blocks paperback book (full).pdf');
  const data = await pdf(dataBuffer);
  console.log('Total Pages:', data.numpages);
}

getPageCount().catch(console.error);
