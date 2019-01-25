import * as request from "request"; 
import * as puppeteer from "puppeteer"
import { SSL_OP_EPHEMERAL_RSA } from "constants";

// create env file

jest.setTimeout(25000);


describe("This is a test of the Merchant Payment API to payment created", () => {

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
                        "amount": "700.00",
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
                    console.log(dt.data.paymentAuthorizationUri);
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
        console.log('Get auth ' + authHeader);

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

    test("headless TS browser opens with paymentAuthorizationUri", async () => {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto(paymentAuthorizationUri);
        await page.waitFor(20000);
        let returl = await page.url()
          expect(returl).toMatch(paymentAuthorizationUri);
        await page.screenshot({path: 'VBG.png'});
        console.log('Reached ' + paymentAuthorizationUri);
        await page.click('body > app-root > div > main > app-payment > section.providers > div > app-provider:nth-child(1) > img');
        expect(page).toContain('ForgeRock');
        browser.close();

        process.on('unhandledRejection', (reason, promise) => {
          console.log('Unhandled Rejection at:', reason.stack || reason)
          // Recommended: send the information to sentry.io
          // or whatever crash reporting service you use
        })
  });
});

