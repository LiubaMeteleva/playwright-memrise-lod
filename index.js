const { chromium } = require('playwright');
const fs = require('fs');

const word = "sinn";


const writeFile = (file, fileName) => {
  const dir = './tmp';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const filePath = `${dir}/${fileName}`;
  const writeStream = fs.createWriteStream(filePath);
  writeStream.write(file);
  console.log('>>', filePath);
};
const downloadWordMp3 = async (word) => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.lod.lu/');
  await page.fill('input[name="lodsearchbox"]', word);
  await page.press('input[name="lodsearchbox"]', 'Enter');
  page.on('response', response => {
    if (response.url().endsWith('mp3')) {
      response.body().then(file => {
        const fileName = response.url().split('/').pop();
        writeFile(file, fileName);
      });

    }
  });
  await page.frame({ name: "res" })
    .click('body > div:nth-child(1) > a');
  await browser.close();
};

downloadWordMp3(word);

