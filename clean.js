import { chromium } from 'playwright';

export const cleanExtraAudio = async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://app.memrise.com/signin?next=/home/');
    await page.fill('input[data-testid="signinUsernameInput"]', process.env.MEMRISE_USERNAME);
    await page.fill('input[data-testid="signinPasswordInput"]', process.env.MEMRISE_PASSWORD);
    await Promise.all([
        page.waitForNavigation(),
        page.click('text="Log in"')
    ]);
    await page.goto('https://app.memrise.com/course/5830797/letzebuergesch/edit/');
    console.log("1");
    await page.waitForSelector('//td[normalize-space(.)=\'Upload Record 1 file\']');
    console.log("3");

    const selector = `//button[contains(., 'files')]`;

    // const duplicates = await page.$$('//td[normalize-space(.)=\'Upload Record 2 files\']');
    const duplicates = await page.$$(selector);
    console.log(duplicates);
    await browser.close();

};