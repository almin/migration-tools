// MIT © 2017 azu
"use strict";
const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const tests = [
    'import',
    'dispatch',
];
describe('remove-ChangedPayload', () => {
    tests.forEach(test =>
        defineTest(
            __dirname,
            'remove-ChangedPayload',
            {},
            `remove-ChangedPayload/${ test }`
        )
    );
});
