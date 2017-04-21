// MIT © 2017 azu
"use strict";
const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const path = require("path");
const tests = [
    'StoreGroup-arguments',
    'StoreGroup-arguments-identifiers',
];
const fixtureDir = path.join(__dirname, "..", "__testfixtures__", "store-group-arguments");
describe('store-group-arguments', () => {
    tests.forEach(test =>
        defineTest(
            __dirname,
            'store-group-arguments',
            {
                dry: true,
                mapping: path.join(fixtureDir, test + ".json")
            },
            `store-group-arguments/${ test }`
        )
    );
});