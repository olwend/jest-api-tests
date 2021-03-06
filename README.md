
E2E flow: 
![alt text](./Jarvis.jpg "Payments E2E flow")


# Dependencies
See https://medium.com/@assertis/creating-a-scraper-using-headless-chrome-ecbe4ade9f86 for installation 
* Jest test runner 
* Chromium Puppeteer headless environment
* Typescript - @types/puppeteer, @types/jest ts-jest, @types/expect-puppeteer and associated npm packages
* Node version >= 8.7.0
* npm >= 5.6.0

* Installation

When you have upgraded node and npm to meet above requirements run npm install to get packages listed in the package.json

npm install -g jest may be required to use jest from the command line

* Writing tests
Tests are stored in /__tests__ 
Browser events are coded via the Puppeteer API
Asserts are via expect giving access to Jest matchers

* Running tests
npm t or jest will run all tests in the __tests__ directory jest string will run all tests with names matching the regex /string/ (e.g. stringtest.js or teststring.js) 

npm t string or jest string will run only string (and other files with string in names)

Standard output of test run is to console window. The full jest_html_reporters.html is in the root directory.
These can be run to ramp up volume as background processes by
 ‘$jest dev_merchant & jest perf_merchant & jest local_merchantx’
Tests are excluded from running by prefixing dep_  (good idea to exclude local when running tests on dev or test)

* Debugging
To view the tests in progress uncomment settings in ./jest_config/setup.js
headless: false,
slowMo: 1000,

* Test structure
The tests are named by env_merchant-name.spec.js and sit in folders /local, /dev
These merchant clients are configured for payments in each environment.

N.B. perf_ tests are without the 'expect' statements on UI elements, which are functional test assertions.
The performance tests rely on payment status as sole assertion. 

*To do
Complete 'fake bank' to mock forge rock.
Log into Kubectl and monitor resource and in higher environments.

* Ascertain what output will be required to gain confidence of sandbox providers
This test can be used for low volume payment throughput to qualify with new banks if they require conformance. 

* Establish multiple payments per 'connection' e.g. use jest-each as per set up 
See 'dep_generic_merchant_each_spike.spec'
