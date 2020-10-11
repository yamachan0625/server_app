import puppeteer from 'puppeteer';
import { serchKeyWord, puppeteerOptions } from './common';

// 毎回ブラウザを閉じずに同じブラウザにて検索させたい;
export const scrapingWantedly = async () => {
  const browser = await puppeteer.launch(puppeteerOptions);

  const page = await browser.newPage();

  // タイムアウトを無制限に
  await page.setDefaultNavigationTimeout(0);

  await page.goto(`https://www.wantedly.com/projects`);

  const inputBox = await page.$('.SearchBox--search');

  for (let i = 0; i < serchKeyWord.length; i++) {
    // 検索欄に入力
    await inputBox.type(serchKeyWord[i], {
      delay: 250,
    });

    await page.keyboard.press('Enter');

    // while()

    // ページ遷移を待つ
    await page
      // @ts-ignore
      .waitForTimeout(10000);

    const searchCount = await page.evaluate(async () => {
      return document.querySelector('.projects-count .total').innerHTML;
    });

    console.log(serchKeyWord[i], ':', 'count:', searchCount);

    const searchHistory = await page.$('.SelectedList--label');
    await searchHistory.click();

    // ページ遷移を待つ
    await page
      // @ts-ignore
      .waitForTimeout(3000);
  }

  await browser.close();
};

scrapingWantedly();
