# Apify API client for JavaScript

[![Build Status](https://travis-ci.org/apifytech/apify-client-js.svg)](https://travis-ci.org/apifytech/apify-client-js)
[![npm version](https://badge.fury.io/js/apify-client.svg?branch=master)](http://badge.fury.io/js/apify-client)

This library implements a JavaScript / Node.js client for the <a href="https://www.apify.com/docs/api">Apify API</a>.
The main philosophy is that the library is just a thin wrapper around the API - its functions should exactly correspond
to the API endpoints and have the same parameters.

The full <a href="https://www.apify.com/docs/sdk/apify-client-js/latest/" target="_blank">Apify client documentation</a>
is available on a separate web page.
For more complex operations with the Apify platform,
see the <a href="https://github.com/apifytech/apify-js">Apify SDK</a>.

## Table of Content

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [Global configuration](#global-configuration)
- [Promises, await, callbacks](#promises-await-callbacks)
- [Parsing of date fields](#parsing-of-date-fields)
- [Package maintenance](#package-maintenance)
- [License](#license)

<!-- tocstop -->

## Installation

```bash
npm install apify-client --save
```

## Usage

```javascript
const ApifyClient = require('apify-client');

// Configuration
const apifyClient = new ApifyClient({
    userId: 'jklnDMNKLekk',
    token: 'SNjkeiuoeD443lpod68dk',
});

// Storage
const store = await apifyClient.keyValueStores.getOrCreateStore({ storeName: 'my-store' });
apifyClient.setOptions({ storeId: store._id });
await apifyClient.keyValueStores.putRecord({
    key: 'foo',
    body: 'bar',
    contentType: 'text/plain',
});
const record = await apifyClient.keyValueStores.getRecord({ key: 'foo' });
const keys = await apifyClient.keyValueStores.getRecordsKeys();
await apifyClient.keyValueStores.deleteRecord({ key: 'foo' });

// Crawlers
const crawler = await apifyClient.crawlers.getCrawlerSettings({ crawlerId: 'DNjkhrkjnri' });
const execution = await apifyClient.crawlers.startExecution({ crawlerId: 'DNjkhrkjnri' });
apifyClient.setOptions({ crawlerId: 'DNjkhrkjnri' });
const execution = await apifyClient.crawlers.startExecution();

// Actors
const act = await apifyClient.acts.getAct({ actId: 'kjnjknDDNkl' });
apifyClient.setOptions({ actId: 'kjnjknDDNkl' });
const build = await apifyClient.acts.buildAct();
const run = await apifyClient.acts.runAct();

```

## Global configuration

You can set global parameters when you are creating instance of ApifyClient:

```javascript
const apifyClient = new ApifyClient({
    userId: 'jklnDMNKLekk', // Your Apify user ID
    token: 'SNjkeiuoeD443lpod68dk', // Your API token
    promise: Promise, // Promises dependency to use (default is native Promise)
    expBackOffMillis: 500, // Wait time in milliseconds before making a new request in a case of error
    expBackOffMaxRepeats: 8, // Maximum number of repeats in a case of error
});
```

Tp obtain your user ID and API token please visit your [Apify Account page](https://my.apify.com/account#/integrations).

## Promises, await, callbacks

Every method can be used as either **promise** or with **callback**. If your Node version supports await/async then you can await promise result.

```javascript
const options = { crawlerId: 'DNjkhrkjnri' };

// Awaited promise
try {
    const crawler = await apifyClient.crawlers.getCrawlerSettings(options);

    // Do something crawler ...
} catch (err) {
    // Do something with error ...
}

// Promise
apifyClient.crawlers.getCrawlerSettings(options)
    .then((crawler) => {
        // Do something crawler ...
    })
    .catch((err) => {
        // Do something with error ...
    });

// Callback
apifyClient.crawlers.getCrawlerSettings(options, (err, crawler) => {
    // Do something with error and crawler ...
});
```

## Parsing of date fields

Apify client automatically parses fields that ends with `At` such as `modifiedAt` or `createdAt` to `Date` object.
This does not apply to user generated content such as:

* Crawler results
* Dataset content
* Key-value store records

## Package maintenance

* `npm run test` to run tests
* `npm run test-cov` to generate test coverage
* `npm run build` to transform ES6/ES7 to ES5 by Babel
* `npm run clean` to clean `build/` directory
* `npm run lint` to lint js using ESLint in Airbnb's Javascript style
* `npm publish` to run Babel, run tests and publish the package to NPM

## License

Apache 2.0
