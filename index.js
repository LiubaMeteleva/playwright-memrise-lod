const { chromium } = require('playwright');
const lod = require('./lod.js');

const uploadWords = async (words) => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });
  const context = await browser.newContext();

  const data = await Promise.all(words.map(word => lod.collectData(context, word)));
  console.log(data);
  await browser.close();
};

uploadWords(['sinn']);
