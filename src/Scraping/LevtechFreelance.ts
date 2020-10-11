import puppeteer from 'puppeteer';
import { Matter } from '../models/matter';
import { serchKeyWord, puppeteerOptions } from './common';

export const scrapingLevtechFreelance = async () => {
  const browser = await puppeteer.launch(puppeteerOptions);

  const page = await browser.newPage();

  // タイムアウトを無制限に
  await page.setDefaultNavigationTimeout(0);

  await page.goto(`https://freelance.levtech.jp/project/search/`);

  const inputBox = await page.$('.sideSearchPanel__condition__input');

  for (let i = 0; i < serchKeyWord.length; i++) {
    // 検索欄リセット
    await page.$eval(
      '.sideSearchPanel__condition__input',
      // @ts-ignore
      (element) => (element.value = '')
    );

    // 検索欄に入力
    await inputBox.type(serchKeyWord[i], {
      delay: 250,
    });

    // 検索結果反映に若干ラグがある為5000ms待機
    await page
      // @ts-ignore
      .waitForTimeout(10000);

    const searchCount = await page.evaluate(async () => {
      return document.querySelector('.fixedResult__wrapper__txt span')
        .innerHTML;
    });

    console.log(serchKeyWord[i], ':', 'count:', searchCount);
  }

  await browser.close();
};

scrapingLevtechFreelance();
