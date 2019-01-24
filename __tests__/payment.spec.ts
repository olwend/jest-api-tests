import * as request from "request"; 
// import * as puppeteer from "jest-environment-puppeteer";
import * as puppeteer from "puppeteer"

// create env file

jest.setTimeout(15000);


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
