const fs = require('fs').promises;
const tempDir = './tmp/';

const toCsv = words => {
    const lines = words.map(word => `${word.lu},${word.en},${word.partOfSpeech},${word.transcription}`);
    return lines.join('\n');
};

const uploadData = async (context, words) => {
    const page = await context.newPage();
    await page.goto('https://app.memrise.com/signin?next=/home/');
    await page.fill('input[data-testid="signinUsernameInput"]', process.env.MEMRISE_USERNAME);
    await page.fill('input[data-testid="signinPasswordInput"]', process.env.MEMRISE_PASSWORD);
    await Promise.all([
        page.waitForNavigation(),
        page.click('text="Log in"')
    ]);
    await page.goto('https://app.memrise.com/course/5830797/letzebuergesch/edit/');
    await page.click('text=/.*Advanced.*/');
    await page.click('text=/.*Bulk add words.*/');
    await page.click('text="Comma"');
    await page.fill('//textarea', toCsv(words));
    await page.click('text="Add"');
    const files = await fs.readdir(tempDir);
    console.log('files', files)
    const promises = files.map(async mp3 => {
        const word = mp3.slice(0, -4);
        const selector = `//tr[contains(., '${word}') and contains(., 'no audio file')]/td[4]/div/div/input`;
        const filePath = `${tempDir}${mp3}`;
        try {
            await page.setInputFiles(selector, filePath);
            console.log('>>>', mp3);
            return await page.waitForResponse('https://app.memrise.com/ajax/thing/cell/upload_file/');
        }
        catch (e) {
            console.warn('Can not fine input for', word);
            return Promise.resolve();
        }
    })
    await Promise.all(promises);
    await page.innerText('text="Save and continue"');
    await page.click('text="Save and continue"');
    fs.rmdir(tempDir, { recursive: true })
        .then(_ => console.log('Clean up all audio files'));
    await page.close();
};

module.exports.uploadData = uploadData;
