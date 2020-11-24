const fs = require('fs');

const collectData = async (context, word) => {
  const page = await context.newPage();
  await page.goto('https://www.lod.lu/');
  await page.fill('input[name="lodsearchbox"]', word);
  await page.press('input[name="lodsearchbox"]', 'Enter');
  page.on('response', response => {
    if (response.url().endsWith('mp3')) {
      response.body().then(file => {
        const fileName = response.url().split('/').pop();
        writeFile(file, word);
      });
    }
  });
  await page.frame({ name: "res" }).click('body > div:nth-child(1) > a');
  await page.close();
  return word;
};

const writeFile = (file, word) => {
  const dir = './tmp';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const filePath = `${dir}/${word}.mp3`;
  fs.createWriteStream(filePath).write(file);
};

module.exports.collectData = collectData;