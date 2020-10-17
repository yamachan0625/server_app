import puppeteer from 'puppeteer';
import dayjs from 'dayjs';

import { Job } from '../models/job';
import { serchKeyWord, jobkey, puppeteerOptions } from './common';

export const scrapingLevtechCareer = async () => {
  try {
    const browser = await puppeteer.launch(puppeteerOptions);

    const page = await browser.newPage();

    // タイムアウトを無制限に
    await page.setDefaultNavigationTimeout(0);

    await page.goto(`https://career.levtech.jp/engineer/offer/search`);

    const jobData = {};

    for (let i = 0; i < serchKeyWord.length; i++) {
      const inputBox = await page.$('#keyword');

      // @ts-ignore // 検索欄リセット
      await page.$eval('#keyword', (element) => (element.value = ''));

      // 検索欄に入力
      await inputBox.type(serchKeyWord[i], {
        delay: 250,
      });

      const button = await page.$('.btnSearch');

      await Promise.all([
        page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }),
        button.click(),
      ]);

      const searchCount = await page.evaluate(async () => {
        return document.querySelector('.js-searchCount').innerHTML;
      });

      jobData[jobkey[i]] = searchCount;
    }

    const now = dayjs().add(9, 'hour');
    const date = now.format();

    const job = new Job({
      siteName: 'LevtechCareer',
      jobData: jobData,
      date: date,
    });

    await job.save();

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};
