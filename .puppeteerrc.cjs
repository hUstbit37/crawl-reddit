import { join } from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Lấy đường dẫn tuyệt đối đến thư mục chứa file hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  //cacheDirectory: join(__dirname, "node_modules", ".puppeteer_cache"),
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};