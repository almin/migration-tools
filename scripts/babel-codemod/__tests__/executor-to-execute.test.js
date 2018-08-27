"use strict";
const childProcess = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const exec = promisify(childProcess.exec)
const codemod = require.resolve(".bin/codemod");

const run = (pluginFilePath, filePath) => {
    if (!fs.existsSync(pluginFilePath)) {
        return Promise.reject(new Error(`Not exist ${pluginFilePath}`));
    }
    if (!fs.existsSync(filePath)) {
        return Promise.reject(new Error(`Not exist ${filePath}`));
    }
    // TODO: https://github.com/square/babel-codemod/issues/13
    return exec(`cat "${filePath}" | ${codemod} --plugin "${pluginFilePath}" --stdio`).then(result => {
        // TODO: IT IS DEBUG HACK
        if (result.stderr) {
            console.log(result.stderr);
        }
        return result.stdout;
    })
};

const testFile = (testName) => {
    it(testName, async () => {
        const filePath = path.join(__dirname, `../__testfixtures__/executor-to-execute/${testName}`);
        const inputContent = fs.readFileSync(filePath, "utf-8");
        const stdout = await run(
            path.join(__dirname, "../executor-to-execute.js"),
            filePath,
        );
        expect(`${inputContent}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
${stdout}`).toMatchSnapshot();
    });
};
jest.setTimeout(20000);
describe("executor-to-execute", () => {
    testFile("simple.js");
    testFile("simple.ts");
    testFile("evincive-return-execute.ts");
    testFile("return-function-expression.ts");
    testFile("no-arguments.ts");
    testFile("does-not-change-executor.ts");
});
