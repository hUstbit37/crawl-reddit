// import { join } from 'path';

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const { join } = require('path');
/**
 * @type {import("puppeteer").Configuration}
 */
console.log(1, __dirname);

module.exports = {
  // Changes the cache location for Puppeteer.
  //cacheDirectory: join(__dirname, "node_modules", ".puppeteer_cache"),
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};