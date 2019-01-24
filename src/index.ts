import *  as puppeteer from "puppeteer";

const productUrls = [
    'https://www.amazon.co.uk/dp/B00UY2U93W/ref=cm_sw_r_tw_dp_x_HO5Yzb6HQ03ZN',
    'https://www.amazon.co.uk/dp/B00OTHF8VG/ref=cm_sw_r_tw_dp_x_tU5YzbVAYJNY2',
    ];

    const browser = await puppeteer.launch({ headless: false });

    async function main() {
       
        for (const url of productUrls) {
            
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: ‘load’ });
        const data = await page.evaluate(() => ({
            title: document.querySelector(‘#productTitle’).textContent.trim(),
            price: document.querySelector(‘.offer-price’).textContent.trim(),
            }));

            await page.close();
            console.log(`${data.title}: ${data.price}`);
        }
    browser.close();
    }
    main();