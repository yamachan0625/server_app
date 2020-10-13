import { scrapingGeekOut } from './GeekOut';
import { scrapingGreen } from './Green';
import { scrapingLevtechCareer } from './LevtechCareer';
import { scrapingLevtechFreelance } from './LevtechFreelance';
import { scrapingWantedly } from './Wantedly';

const scrapingList = [
  scrapingGeekOut,
  scrapingGreen,
  scrapingLevtechCareer,
  scrapingLevtechFreelance,
  scrapingWantedly,
];

export const scrapingAll = async () => {
  scrapingList.forEach((scraping) => scraping());
};
