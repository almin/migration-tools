// MIT © 2017 azu
"use strict";
const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const tests = [
    'store-get-state-return-object',
    'not-replaced',
];
describe('store-getState', () => {
    tests.forEach(test =>
        defineTest(
            __dirname,
            'store-get-state-return-object-to-flat',
            {
                dry: false
            },
            `store-get-state-return-object-to-flat/${ test }`
        )
    );
});