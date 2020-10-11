import puppeteer from 'puppeteer';
import { Matter } from '../models/matter';
import { serchKeyWord, puppeteerOptions } from './common';

export const scrapingLevtechCareer = async () => {
  const browser = await puppeteer.launch(puppeteerOptions);

  const page = await browser.newPage();

  // タイムアウトを無制限に
  await page.setDefaultNavigationTimeout(0);

  await page.goto(`https://career.levtech.jp/engineer/offer/search`);

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
      // page.waitForSelector('.js-searchCount'),
      // page.waitForSelector('#keyword'),
    ]);

    const searchCount = await page.evaluate(async () => {
      return document.querySelector('.js-searchCount').innerHTML;
    });
    console.log(serchKeyWord[i], ':', 'count:', searchCount);
  }

  await browser.close();

  // const matter = new Matter({
  //   numberOfCase: Number(topSearchCount),
  // });

  // await matter.save();
};

scrapingLevtechCareer();
