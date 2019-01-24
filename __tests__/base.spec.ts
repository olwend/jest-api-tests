import *  as puppeteer from "puppeteer";
import { sampleFunction } from "../src/sampleFunction";

describe("This is a simple test", () => {

  test("Check the sampleFunction function", () => {

    expect(sampleFunction("hello")).toEqual("hellohello");
    console.log('When hello is input we get ' + sampleFunction("hello"));

  });


test("This is a non headless TS BBC browser test", () => {
    async function run () {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.bbc.co.uk/sounds');
        await page.screenshot({path: 'BBCscreenshot.png'});
        browser.close();
    }
    run();
    });
});