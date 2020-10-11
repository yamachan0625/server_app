export const serchKeyWord = [
  'Node.js',
  'React',
  'Angular',
  'Vue.js',
  'Next.js',
  'Nuxt.js',
  'TypeScript',
  'JavaScript',
  'ReactNative',
  'Flutter',
  'Electron',
  'Graphql',
  'Redux',
  'VueX',
  'Jest',
  'Cypress',
  'Webpack',
] as const;

export const puppeteerOptions = {
  fullPage: true, // フルページ読み込み
  headless: false, // true:ブラウザ開かなくなる false:ブラウザ開く
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  // slowMo: 100, // 動作を遅く
};
