import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

// Ensure screenshot directory exists
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Get URL and optional label from command line arguments
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

// Find next screenshot number
let screenshotNum = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${screenshotNum}${label}.png`))) {
  screenshotNum++;
}

const screenshotPath = path.join(screenshotDir, `screenshot-${screenshotNum}${label}.png`);

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`Screenshot saved: ${screenshotPath}`);
    process.exit(0);
  } catch (error) {
    console.error('Screenshot error:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();