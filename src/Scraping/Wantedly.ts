import puppeteer from 'puppeteer';
import dayjs from 'dayjs';

import { Job } from '../models/job';
import { serchKeyWord, jobkey, puppeteerOptions } from './common';

// 毎回ブラウザを閉じずに同じブラウザにて検索させたい;
export const scrapingWantedly = async () => {
  try {
    const browser = await puppeteer.launch(puppeteerOptions);

    const page = await browser.newPage();

    // タイムアウトを無制限に
    await page.setDefaultNavigationTimeout(0);

    await page.goto(`https://www.wantedly.com/projects`);

    const inputBox = await page.$('.SearchBox--search');

    const jobData = {};

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

      jobData[jobkey[i]] = searchCount;

      const searchHistory = await page.$('.SelectedList--label');
      await searchHistory.click();

      // ページ遷移を待つ
      await page
        // @ts-ignore
        .waitForTimeout(3000);
    }

    const now = dayjs().add(9, 'hour');
    const date = now.format();

    const job = new Job({
      siteName: 'Wantedly',
      jobData: jobData,
      date: date,
    });

    await job.save();

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};
