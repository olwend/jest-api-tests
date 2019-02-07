import * as request from "request";
import * as puppeteer from "puppeteer";
import * as expectPuppeteer from "puppeteer";
import { AuthCodeFactory } from "./common/auth-code.factory";
import { ResponseHelper } from "./common/response-helper";
import { HeadersHelper } from "./common/headers.factory";

jest.setTimeout(45000);

// helper/variables to switch environments

// switch clients - for loop to increment name string

// generic response handler
// generate headers

// set up test with variables

describe("Test of the local merchant1-vibepay-api to payment Authorized", () => {

    let accessToken: string = '';
    let paymentAuthorizationUri: string = '';
    let paymentToken: string = '';
    let getStatusLink: string = '';
    let status: string = '';
    //let apiUrlRoot: string = 'https://dev.api.banking-gateway.jigpay.co.uk';
    // let apiUrlRoot: string = 'https://test.api.banking-gateway.jigpay.co.uk';
    let apiUrlRoot: string = 'https://api.banking-gateway.sandbox.vibepay.com';
    let factory = new AuthCodeFactory('fake-merchant', 'secret');
    let creds = factory.create();

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
                    console.log(accessToken);
                    expect(accessToken).not.toBeNull();
                    done();
                }));
        // pull out data & save access token
    });

    test("create payment and save paymentAuthorizationUri", async done => {

        console.log('Getting payment details .......')
        console.log('This is token ........' + accessToken);

        request
            .post(`${apiUrlRoot}/api/v1.0/payments`,
                {
                    // create payment via data table
                    body: JSON.stringify({
                        "amount": "2700.00",
                        "transactionId": "12000000000002",
                        "unstructured": "4321",
                        "reference": "3414"
                    }),
                    // generate headers
                    headers: HeadersHelper.createBearer(accessToken),
                })
            .on('response', (response) => ResponseHelper.handleResponse(response).then(data => {
                const dt = JSON.parse(data);
                paymentToken = dt.data.paymentToken;
                paymentAuthorizationUri = dt.data.paymentAuthorizationUri;
                expect(paymentAuthorizationUri).not.toBeUndefined();
                console.log('Payment link ' + paymentAuthorizationUri);
                done();
            }));

    });

    // per payment
    test("get payment status", async done => {

        const getStatusLink = `${apiUrlRoot}/api/v1.0/payments/${paymentToken}`;

        request
            .get(getStatusLink,
                {
                    headers: HeadersHelper.createBearer(accessToken),
                })
            //generic response handler method
            .on('response', (response) => ResponseHelper.handleResponse(response).then(data => {
                const dt = JSON.parse(data);
                status = dt.data.status;
                expect(status).toBe('Created');
                console.log('Payment status is ' + status)
                done();
            }));
    });


})