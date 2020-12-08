import { chromium } from 'playwright';
import { collectLodData } from './lod.js';
import { uploadData } from './memrise.js';
import { collectMemorieData } from './memorie.js';
import { config } from 'dotenv';
import { readFileSync, stat } from 'fs';

export const tempDir = "./tmp/";
config();

const uploadWords = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  context.on('error', error => console.error(error));

  const words = readFileSync('words.csv', 'utf8').trim().split('\n');
  console.log('Words to add:', words);

  const data = await Promise.all(words.map(word => collectLodData(context, word)));
  console.log(data);
  await uploadData(context, data);
  await browser.close();
};

const uploadDataFromMemorie = (start = 0, end = 1320) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const data = await collectMemorieData(context, stat, end);
  await uploadData(context, data);
  await browser.close();
}

// uploadWords();
// uploadDataFromMemorie();
console.log('Done');