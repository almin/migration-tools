// MIT © 2017 azu
"use strict";
const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const tests = [
    'context'
];
describe('context-onhandler-to-events', () => {
    tests.forEach(test =>
        defineTest(
            __dirname,
            'context-onhandler-to-events',
            {
                dry: false
            },
            `context-onhandler-to-events/${ test }`
        )
    );
});