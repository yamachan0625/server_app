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
  for (let i = 0; i < scrapingList.length; i++) {
    await scrapingList[i]();
  }
};
