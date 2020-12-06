const fs = require('fs');
const settings = require("./settings.json");
const dir = settings.directory;

const collectData = async (context, word) => {
  const page = await context.newPage();
  await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
  await page.goto('https://www.lod.lu/');
  page.on('error', error => console.error(error));

  await page.fill('input[name="lodsearchbox"]', word);
  await page.press('input[name="lodsearchbox"]', 'Enter');
  const firstFinding = await page.frame({ name: 'res' }).innerText('body > div:nth-child(1) > a');
  const firstFindingPartOfSpeech = await page.frame({ name: 'res' }).innerText('body > div:nth-child(1) > a > span');
  word = firstFinding.replace(firstFindingPartOfSpeech, '').trim();

  const filePath = `${dir}/${word}.mp3`;
  page.on('response', response => {
    if (response.url().endsWith('mp3')) {
      response.body().then(file =>
        writeFile(file, filePath)
      );
    }
  });

  await page.frame({ name: 'res' }).click('body > div:nth-child(1) > a');
  await page.click('div[id="ContentBar-Languages"] >> text=/.*EN.*/');
  const enPage = await page.frame({ name: 'arten' });
  const en = await enPage.innerText('.et');
  const partOfSpeech = await enPage.innerText('.klass');
  const transcription = await enPage.innerText('#ipa');
  await page.close();
  return {
    lu: word, 
    en: en.trim() || '',
    partOfSpeech: partOfSpeech.trim() || '',
    transcription: transcription || '',
  }
};

const writeFile = (file, filePath) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.createWriteStream(filePath).write(file);
};

module.exports.collectData = collectData;
