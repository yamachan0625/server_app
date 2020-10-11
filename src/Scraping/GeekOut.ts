import puppeteer from 'puppeteer';
import { Matter } from '../models/matter';
import { serchKeyWord, puppeteerOptions } from './common';

// 毎回ブラウザを閉じずに同じブラウザにて検索させたい;
export const scrapingGeekOut = async () => {
  const browser = await puppeteer.launch(puppeteerOptions);

  const page = await browser.newPage();

  // タイムアウトを無制限に
  await page.setDefaultNavigationTimeout(0);

  await page.goto(`https://geek-out.jp/job/`);

  const inputBox = await page.$('#f_keywords');

  for (let i = 0; i < serchKeyWord.length; i++) {
    // 検索欄リセット
    await page.$eval(
      '#f_keywords',
      // @ts-ignore
      (element) => (element.value = '')
    );

    await inputBox.type(serchKeyWord[i], {
      delay: 500,
    });
    const searchCount = await page.evaluate(async () => {
      return document.querySelector('.p-job-index__form-value span').innerHTML;
    });
    console.log(serchKeyWord[i], ':', 'count:', searchCount);
  }

  await browser.close();
};

scrapingGeekOut();
