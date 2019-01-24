const puppeteer = require('puppeteer');

test("This is a non headless JS Google browser test", () => {
  async function run () {
      const browser = await puppeteer.launch({headless: false});
      const page = await browser.newPage();
      await page.goto('https://google.com');
      await page.screenshot({path: 'Googlescreenshot.png'});
      browser.close();
  }
  run();
  });

  test("This is a headless JS Google browser test", () => {
    async function run () {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://google.com');
        await page.screenshot({path: 'Googlescreenshot.png'});
        browser.close();
    }
    run();
    });

