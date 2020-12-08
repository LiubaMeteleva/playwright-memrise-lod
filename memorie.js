import { existsSync, mkdirSync, createWriteStream } from 'fs';
import fetch from 'node-fetch';
const tempDir = './tmp/';

export const collectMemorieData = async (context, start, end) => {
  const page = await context.newPage();
  const data = [];
  let id = start;

  while (true) {
    const response = await page.goto(`https://d.3210.lu/library/words/${id}/`);
    if (response.status() === 404 && id <= end) {
      console.log(id, response.status())
      id++;
      continue;
    }
    if (id > end) {
      console.log(id, response.status())
      break;
    }
    try {
      const word = await collectWordData(page, id);
      await data.push(word);
    } catch (e) {
      console.error(id, e)
    }
    id++;
  }
  await Promise.all(data);
  page.close();
  return data;
}

const collectWordData = async (page, id) => {
  const lu = await page.innerText('h1');
  const en = await page.innerText('h2');
  const audioUrl = await page.$eval('source', el => el.src);
  const filePath = `${tempDir}/${id}.mp3`;

  downloadAudio(audio, filePath);

  return {
    lu: lu,
    en: en.replace(/,/g, ';'),
    partOfSpeech: '',
    transcription: '',
    audio: id,
  }
};

const downloadAudio = (url, filePath) => {
  if (!url) {
    return
  }
  const params = {
    method: 'GET',
    headers: { 'Accept': '*/*' }
  }
  fetch(audio, params)
    .then(res => res.buffer())
    .then(file => writeFile(file, filePath));
};

const writeFile = (file, filePath) => {
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir);
  }
  createWriteStream(filePath).write(file);
};
