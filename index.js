const { chromium } = require('playwright');
const lod = require('./lod.js');
const memrise = require('./memrise.js');
const dotenv = require('dotenv');

dotenv.config();

const uploadWords = async (words) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  context.on('error', error => console.error(error));

  const data = await Promise.all(words.map(word => lod.collectData(context, word)));
  console.log(data);
  await memrise.uploadData(context, data);
  await browser.close();
};

uploadWords(['sinn', 'bic', 'oft']);
