import * as request from "request";
import * as puppeteer from "puppeteer";
import * as expectPuppeteer from "puppeteer";
import { AuthCodeFactory } from "./common/auth-code.factory";
import { ResponseHelper } from "./common/response-helper";
import { HeadersHelper } from "./common/headers.factory";
import { retry } from "ts-retry-promise"
import JestEach from "jest-each";

jest.setTimeout(70000);

// switch clients - for loop to increment name string
// add test.each data set for payments
// set up test with variables
// add error handling

let accessToken: string = '';
let paymentAuthorizationUri1: string = '';
let paymentToken1: string = '';
let paymentAuthorizationUri2: string = '';
let paymentToken2: string = '';
let paymentAuthorizationUri3: string = '';
let paymentToken3: string = '';
let paymentAuthorizationUri4: string = '';
let paymentToken4: string = '';
let page: puppeteer.Page = undefined;
let browser: puppeteer.Browser = undefined;
let apiUrlRoot: string = 'https://dev.api.banking-gateway.jigpay.co.uk';
// let apiUrlRoot: string = 'https://test.api.banking-gateway.jigpay.co.uk';
// let apiUrlRoot: string = 'https://api.banking-gateway.sandbox.vibepay.com';
let factory = new AuthCodeFactory('fake-merchant', 'secret');
let creds = factory.create();

describe("Check version and get access token", () => {
    test("Check the api version", async done => {

        request
            .get(`${apiUrlRoot}/api/v1.0/version`)
            .on('response', (response) => ResponseHelper.handleResponse(response).then(v => {
                console.log(v);
                done();
            }));
    });

    test("get token", async done => {

        request
            .post(`${apiUrlRoot}/connect/token`,
                {
                    form: {
                        grant_type: 'client_credentials',
                        scope: 'payments'
                    },
                    // generate headers
                    headers: HeadersHelper.createAuth(creds),
                })
            .on('response', (response) => ResponseHelper
                .handleResponse(response)
                .then(data => {
                    const dt = JSON.parse(data);
                    accessToken = dt.access_token;
                    expect(accessToken).not.toBeNull();
                    done();
                }));
        // pull out data & save access token
    });
});

// describe.each`
//         amount | transactionId | unstructured | reference
//         ${2700.00}|${11111111111111}|${4321}|${1414}
//         ${240.00} |${22222222222222}|${1234}|${2414}
//         ${300.00} |${33333333333333}|${3333}|${3414}
//         ${170.00}|${44444444444444}|${4444}|${4414}`
//     ('Processes payment $amount $transactionId $unstructured $reference', ({amount, transactionId, unstructured, reference}) =>  {

        // test("create payment and save paymentAuthorizationUri", async done => {

        //     console.log('Getting payment details .......')
        //     console.log('This is token ........' + accessToken);
        //     console.log(amount, transactionId);
            
            
        //     console.log(request
        //         .post(`${apiUrlRoot}/api/v1.0/payments`,
        //             {
        //                 // create payment via data table
        //                 body: JSON.stringify({
        //                     "amount": amount,
        //                     "transactionId": transactionId,
        //                     "unstructured": unstructured,
        //                     "reference": reference
        //                 }),
        //                 // generate headers
        //                 headers: HeadersHelper.createBearer(accessToken),
        //             })
         
        //         .on('response', (response) => ResponseHelper.handleResponse(response).then(data => {
        //             const dt = JSON.parse(data);
        //             paymentToken = dt.data.paymentToken;
        //             paymentAuthorizationUri = dt.data.paymentAuthorizationUri;
        //             expect(paymentAuthorizationUri).not.toBeUndefined();
        //             console.log('Payment link ' + paymentAuthorizationUri);
        //             done();
        //         })));

        test("create payments and save paymentAuthorizationUris", async done => {
            // let paymentAuthorizationUri = '';
            const authHeader = `Bearer ${accessToken}`;
            console.log('This is Auth Header ........' + authHeader);
            console.log('Getting payment details .......');
            console.log(amount, transactionId,unstructured, reference )
            request
                .post(`${apiUrlRoot}/api/v1.0/payments`,
                    {
                        body: JSON.stringify({
                            "amount": "2700.00",
                            "transactionId": "12000000000002",
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
                        paymentToken1 = dt.data.paymentToken;
                        paymentAuthorizationUri1 = dt.data.paymentAuthorizationUri;
                        expect(paymentAuthorizationUri1).not.toBeUndefined();
                        console.log('Payment link ' + paymentAuthorizationUri1);
                        done();
                    });
    
                });
                // ${240.00} |${22222222222222}|${1234}|${2414}
                request
                .post(`${apiUrlRoot}/api/v1.0/payments`,
                    {
                        body: JSON.stringify({
                            "amount": "240.00",
                            "transactionId": "22222222222222",
                            "unstructured": "1234",
                            "reference": "2414"
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
                        paymentToken2 = dt.data.paymentToken;
                        paymentAuthorizationUri2 = dt.data.paymentAuthorizationUri;
                        expect(paymentAuthorizationUri2).not.toBeUndefined();
                        console.log('Payment link ' + paymentAuthorizationUri2);
                        done();
                    });
    
                });

                // ${300.00} |${33333333333333}|${3333}|${3414}
                request
                .post(`${apiUrlRoot}/api/v1.0/payments`,
                    {
                        body: JSON.stringify({
                            "amount": "300.00",
                            "transactionId": "33333333333333",
                            "unstructured": "3333",
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
                        paymentToken2 = dt.data.paymentToken;
                        paymentAuthorizationUri2 = dt.data.paymentAuthorizationUri;
                        expect(paymentAuthorizationUri2).not.toBeUndefined();
                        console.log('Payment link ' + paymentAuthorizationUri2);
                        done();
                    });
    
                });

                // ${170.00}|${44444444444444}|${4444}|${4414}
                request
                .post(`${apiUrlRoot}/api/v1.0/payments`,
                    {
                        body: JSON.stringify({
                            "amount": "170.00",
                            "transactionId": "44444444444444",
                            "unstructured": "4444",
                            "reference": "4414"
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
                        paymentToken2 = dt.data.paymentToken;
                        paymentAuthorizationUri2 = dt.data.paymentAuthorizationUri;
                        expect(paymentAuthorizationUri2).not.toBeUndefined();
                        console.log('Payment link ' + paymentAuthorizationUri2);
                        done();
                    });
    
                });

        });

        
        xdescribe.each`
        paymentToken | paymentAuthorizationUri
        ${paymentToken1}|${paymentAuthorizationUri1}
        ${paymentToken2}|${paymentAuthorizationUri2}
        ${paymentToken3}|${paymentAuthorizationUri3}
        ${paymentToken4}|${paymentAuthorizationUri4}`
    ('Processes payment $paymentToken $paymentAuthorizationUri', ({paymentToken, paymentAuthorizationUri}) =>  {
        
        
        
        // per payment
        xtest("get payment status", async done => {

            const getStatusLink = `${apiUrlRoot}/api/v1.0/payments/${paymentToken}`;

            request
                .get(getStatusLink,
                    {
                        headers: HeadersHelper.createBearer(accessToken),
                    })
                //generic response handler method
                .on('response', (response) => ResponseHelper.handleResponse(response).then(data => {
                    const dt = JSON.parse(data);
                    let status = dt.data.status;
                    expect(status).toBe('Created');
                    console.log('Payment status is ' + status)
                    done();
                }));
        });

        xtest("progress to hosted payments page", async done => {

            // set up globals for use in rest of tests
            browser = await puppeteer.launch({ headless: false });
            page = await browser.newPage();
            await page.goto(paymentAuthorizationUri);
            await page.waitForSelector('h1');
            let returl = await page.url()
            expect(returl).toMatch(paymentAuthorizationUri);
            console.log('Reached VBG payment link dashboard');
            await page.screenshot({ path: './screenshot/SVBG.png', fullPage: true });
            done();
        });

        // this is provider specific
        xtest("navigate to provider", async done => {
            // TODO: provider 
            await page.click('body > app-root > div > main > app-payment > section.providers > div > app-provider:nth-child(1) > img');
            console.log('Moved through to Forge Rock')
            await page.waitForSelector('#IDToken1');
            let FRurl = await page.url();
            expect(FRurl).toContain('https://auth.ob.forgerock.financial');
            done();
        });


        // this is provider specific
        xtest("login on provider", async done => {
            await page.waitForSelector('#IDToken1');
            await expect(page).toFill('#IDToken1', 'vibefeature4@gmail.com');
            await expect(page).toFill('#mat-input-1', 'V1bePayTester');
            await page.screenshot({ path: './screenshot/SFRlogin.png', fullPage: true });
            await expect(page).toClick('button', { text: 'Sign in' });
            console.log('vibefeature user is logged in');

            done();
        });

        // this is provider specific await expect(page).toClick('#mat-radio-3') for EUR;
        xtest("select account on provider", async done => {
            await page.waitForSelector('#mat-radio-4');
            await expect(page).toClick('#mat-radio-4');
            await expect(page).toClick('button', { text: 'Allow' });
            console.log('account selected');
            await page.screenshot({ path: './screenshot/SAcctSelected.png', fullPage: true });
            done();
        });

        // this is provider specific
        xtest("redirect back to hosted payments processing page", async done => {
            await page.waitFor(6750);
            let VBGurl = await page.url();
            await page.screenshot({ path: './screenshot/paymentAuth.png', fullPage: true });
            expect(VBGurl).toContain('success');
            console.log('VBG Thankyou success splash');
            done();
        });

        // this is provider specific
        xtest("redirect back to merchant payment details", async done => {
            console.log('Merchant payment details page');
            await page.waitFor(6750);
            let Murl = await page.url();
            expect(Murl).toContain('Payment');
            let textContent = await page.evaluate(() => document.querySelector('h1').textContent);
            await expect(textContent).toContain('Payment Details');
            await page.screenshot({ path: './screenshot/SPaymentDetails.png', fullPage: true });
            await page.waitFor(24500);
            browser.close();
            done();
        });

        //         process.on('unhandledRejection', (reason, promise) => {
        //             console.log('Unhandled Rejection at:', reason.stack || reason)
        //             // Recommended: send the information to sentry.io
        //             // or whatever crash reporting service you use
        //         })


        // per payment
        xtest("retry until we get payment status Authorized or Completed", async done => {

            const getStatusLink = `${apiUrlRoot}/api/v1.0/payments/${paymentToken}`;

            console.log('in retry bits');
            await retry(
                async () => {
                    console.log('retrying');
                    return new Promise<string>((res) => {
                        request
                            .get(getStatusLink, { headers: HeadersHelper.createBearer(accessToken) })
                            .on('response', (response) => ResponseHelper
                                .handleResponse(response)
                                .then(data => {
                                    const dt = JSON.parse(data);
                                    console.log('Payment status is ' + dt.data.status)
                                    res(dt.data.status);
                                }));
                    });
                },
                { until:( (s) => s === 'Authorized' 
                    || s === 'Completed' )});

            done();
        });

    });
