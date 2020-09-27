import puppeteer from 'puppeteer';
// import { v4 as uuidv4 } from 'uuid';
import { Matter } from './models/matter';

export const continueScreemshot = async () => {
  const options = {
    fullPage: true, // フルページ読み込み
    headless: true, // ヘッドレスをオフに
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    // slowMo: 100, // 動作を遅く
  };
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  await page.goto('https://freelance.levtech.jp/');

  const topSearchCount = await page.evaluate(() => {
    return document.querySelector('#topSearchCount').innerHTML;
  });
  console.log(Number(topSearchCount));

  const matter = new Matter({
    numberOfCase: Number(topSearchCount),
  });

  await matter.save();

  // スクリーンショット
  // const rundomFileName = uuidv4();
  // await page.screenshot({ path: `${rundomFileName}.png`, fullPage: true });

  await browser.close();
};
