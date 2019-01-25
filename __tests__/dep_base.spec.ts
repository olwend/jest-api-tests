import *  as puppeteer from "puppeteer";

jest.setTimeout(10000);

describe("This is a simple test", () => {

//   test("Check the sampleFunction function", () => {

//     expect(sampleFunction("hello")).toEqual("hellohello");
//     console.log('When hello is input we get ' + sampleFunction("hello"));

//   });

  test("headless TS browser opens with page", async () => {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('http://www.nhm.ac.uk/');
        let returl = await page.url()
          expect(returl).toMatch('http://www.nhm.ac.uk');
        await page.screenshot({path: 'NHMscreenshot.png'});
        browser.close();

        process.on('unhandledRejection', (reason, promise) => {
          console.log('Unhandled Rejection at:', reason.stack || reason)
          // Recommended: send the information to sentry.io
          // or whatever crash reporting service you use
        })
  });
});