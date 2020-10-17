import puppeteer from 'puppeteer';
import dayjs from 'dayjs';

import { Job } from '../models/job';
import { serchKeyWord, jobkey, puppeteerOptions } from './common';

export const scrapingGeekOut = async () => {
  try {
    const browser = await puppeteer.launch(puppeteerOptions);

    const page = await browser.newPage();

    // タイムアウトを無制限に
    await page.setDefaultNavigationTimeout(0);

    await page.goto(`https://geek-out.jp/job/`);

    const inputBox = await page.$('#f_keywords');

    const jobData = {};

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
        return document.querySelector('.p-job-index__form-value span')
          .innerHTML;
      });

      jobData[jobkey[i]] = searchCount;
    }

    const now = dayjs().add(9, 'hour');
    const date = now.format();

    const job = new Job({
      siteName: 'GeekOut',
      jobData: jobData,
      date: date,
    });

    await job.save();

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};
