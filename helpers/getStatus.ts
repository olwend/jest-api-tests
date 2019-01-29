// call with paymentEndPoint, paymentToken, accessToken

function getStatus(expaymentEndPoint, expaymentToken, exaccessToken)

// setVariables from parameters
const paymentEndPoint = expaymentEndPoint;

const getStatusLink = paymentEndPoint.concat(paymentToken);
const authHeader = `Bearer ${accessToken}`;

// run and return request
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
                });
            });
