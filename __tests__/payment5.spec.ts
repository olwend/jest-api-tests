import * as request from "request"; 
import * as puppeteer from "puppeteer";
import * as expectPuppeteer from "puppeteer";

// create env file

jest.setTimeout(45000);


describe("Test 5 of the Merchant Payment API to payment Authorized", () => {

    let accessToken: string = '';
    let paymentAuthorizationUri = '';
    let paymentToken = '';
    let getStatusLink = '';
    let paymentEndPoint = 'https://api.banking-gateway.sandbox.vibepay.com/api/v1.0/payments/';
    let status = '';

    test("Check the api.jigpay version", async done => {

        request
            .get('https://dev.api.jigpay.co.uk/api/version')
            .on('response', (response) => {
                expect(response.statusCode).toBe(200);
                let data = '';
                response.on('data', _data => (data += _data));
                response.on('end', () => {
                    console.log('Version number is ' + data)
                    done();
                });
            });
    });

    test("get token", async done => {

        request
            .post('https://api.banking-gateway.sandbox.vibepay.com/connect/token',
                {
                    form: {
                        grant_type: 'client_credentials',
                        scope: 'payments'
                    },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ZmFrZS1tZXJjaGFudDpzZWNyZXQ='
                    },
                })
            .on('response', (response) => {
                expect(response.statusCode).toBe(200);
                let data: any = '';
                response.on('data', _data => (data += _data));
                response.on('end', () => {
                    const dt = JSON.parse(data);
                    accessToken = dt.access_token;
                    expect(accessToken).not.toBeNull();
                    done();
                });

            });
    });

    test("create payment and save paymentAuthorizationUri", async done => {
        // let paymentAuthorizationUri = '';
        const authHeader = `Bearer ${accessToken}`;
        console.log('This is Auth Header ........' + authHeader);
        console.log('Getting payment details .......')
        request
            .post('https://api.banking-gateway.sandbox.vibepay.com/api/v1.0/payments',
                {
                    body: JSON.stringify({
                        "amount": "3700.00",
                        "transactionId": "120000000000037",
                        "unstructured": "4321",
                        "reference": "3414"
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authHeader
                    },
                })
            .on('response', (response) => {
                expect(response.statusCode).toBe(200);
                let data: any = '';
                response.on('data', _data => (data += _data));
                response.on('end', () => {
                    console.log(data)
                    let dt = JSON.parse(data);
                    paymentToken = dt.data.paymentToken;
                    paymentAuthorizationUri = dt.data.paymentAuthorizationUri;
                    expect(paymentAuthorizationUri).not.toBeUndefined();
                    console.log('Payment link ' + paymentAuthorizationUri);
                    done();
                });

            });

    });

    test("get payment status", async done => {

        getStatusLink = paymentEndPoint.concat(paymentToken);
        console.log(getStatusLink);
        const authHeader = `Bearer ${accessToken}`;
   
        request
            .get(getStatusLink,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authHeader
                    },
                })
            .on('response', (response) => {
                expect(response.statusCode).toBe(200);
                let data: any = '';
                response.on('data', _data => (data += _data));
                response.on('end', () => {
                    const dt = JSON.parse(data);
                    status = dt.data.status;
                    expect(status).toBe('Created');
                    console.log('Payment status is ' + status)
                });

                done();

            });
    });

    test("progress pAuthUri through bank to allow payment then back to merchant", async () => {
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        await page.goto(paymentAuthorizationUri);
        await page.waitFor(6750);
        let returl = await page.url()
          expect(returl).toMatch(paymentAuthorizationUri);
        await page.screenshot({path:'./screenshot/SVBG.png',fullPage: true });
        console.log('Reached ' + paymentAuthorizationUri);
        await page.click('body > app-root > div > main > app-payment > section.providers > div > app-provider:nth-child(1) > img');
        console.log('Moved through to Forge Rock')
        await page.waitFor(6750);
        let FRurl = await page.url();
            expect(FRurl).toContain('https://auth.ob.forgerock.financial');
      
        await expect(page).toFill('#IDToken1', 'vibefeature4@gmail.com');
        await expect(page).toFill('#mat-input-1', 'V1bePayTester');
        await page.screenshot({path:'./screenshot/SFRlogin.png',fullPage: true });
        await expect(page).toClick('button', { text: 'Sign in' });
        console.log('vibefeature user is logged in');
        await page.waitFor(6750);

        await expect(page).toClick('#mat-radio-4');
        await expect(page).toClick('button', { text: 'Allow'});
        console.log('account selected');
        await page.screenshot({path:'./screenshot/SAcctSelected.png',fullPage: true });

        await page.waitFor(5000);
        let VBGurl = await page.url();
        expect(VBGurl).toContain('success');   
        console.log('VBG Thankyou success splash');
        await page.waitFor(5000);
        let Murl = await page.url();
        expect(Murl).toContain('Payment');  
 
        let textContent = await page.evaluate(() => document.querySelector('h1').textContent);
        await expect(textContent).toContain('Payment Details');
        await page.screenshot({path:'./screenshot/SPaymentDetails.png',fullPage: true });
        console.log('Merchant payment details page');
        browser.close();

        process.on('unhandledRejection', (reason, promise) => {
          console.log('Unhandled Rejection at:', reason.stack || reason)
          // Recommended: send the information to sentry.io
          // or whatever crash reporting service you use
        })
  });

  test("payment status is Authorized", async done => {

    getStatusLink = paymentEndPoint.concat(paymentToken);

    const authHeader = `Bearer ${accessToken}`;

    request
        .get(getStatusLink,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authHeader
                },
            })
        .on('response', (response) => {
            expect(response.statusCode).toBe(200);
            let data: any = '';
            response.on('data', _data => (data += _data));
            response.on('end', () => {
                const dt = JSON.parse(data);
                status = dt.data.status;
                expect(status).toBe('Authorized');
                console.log('Payment status is ' + status)
            });

            done();

        });
});
test("payment status is Completed", async done => {
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.waitFor(32500);
    getStatusLink = paymentEndPoint.concat(paymentToken);

    const authHeader = `Bearer ${accessToken}`;

    request
        .get(getStatusLink,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authHeader
                },
            })
        .on('response', (response) => {
            expect(response.statusCode).toBe(200);
            let data: any = '';
            response.on('data', _data => (data += _data));
            response.on('end', () => {
                const dt = JSON.parse(data);
                status = dt.data.status;
                expect(status).toBe('Completed');
                console.log('Payment status is ' + status)
            });
        browser.close();
        done();

        });
    });

});

