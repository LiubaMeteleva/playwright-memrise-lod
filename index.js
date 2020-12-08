import { chromium } from 'playwright';
import { collectData } from './lod.js';
import { uploadData } from './memrise.js';
import { collectData as _collectData } from './memorie.js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

export const tempDir = "./tmp/";
config();

const uploadWords = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  context.on('error', error => console.error(error));

  const words = readFileSync('words.csv', 'utf8').trim().split('\n');
  console.log('Words to add:', words);

  const data = await Promise.all(words.map(word => collectData(context, word)));
  console.log(data);
  await uploadData(context, data);
  await browser.close();
};

uploadWords();
