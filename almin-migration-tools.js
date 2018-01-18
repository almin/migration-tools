#!/usr/bin/env node
"use strict";
const execa = require("execa");
const meow = require("meow");
const updateNotifier = require("update-notifier");
const arrify = require("arrify");
const globby = require("globby");
const inquirer = require("inquirer");
const npmRunPath = require("npm-run-path");
const utils = require("./cli-utils");
const migrationVersions = require("./migrations.json");

function runScripts(scripts, files) {
    const spawnOptions = {
        env: Object.assign({}, process.env, { PATH: npmRunPath({ cwd: __dirname }) }),
        stdio: "inherit"
    };

    scripts.forEach(script => {
        const result = execa.sync(require.resolve(".bin/jscodeshift"), ["-t", script].concat(files), spawnOptions);

        if (result.error) {
            throw result.error;
        }
    });
}

const cli = meow(
    `
	Usage
	  $ almin-migration-tools [<file|glob> ...]

	Options
	  --help         Show help.
	  --force, -f    Bypass safety checks and forcibly run codemods

	Available upgrades
	  - 0.12.x → 0.13.x
	  - 0.14.x → 0.15.x
`,
    {
        boolean: ["force"],
        string: ["_"],
        alias: {
            f: "force",
            h: "help"
        }
    }
);

updateNotifier({ pkg: cli.pkg }).notify();

if (!utils.checkGitStatus(cli.flags.force)) {
    process.exit(1);
}

migrationVersions.sort(utils.sortByVersion);

const versions = utils.getVersions(migrationVersions);
const defaultFiles = "src/**/*.js";

const questions = [
    {
        type: "list",
        name: "currentVersion",
        message: "What version of Almin are you currently using?",
        choices: versions.slice(0, -1)
    },
    {
        type: "list",
        name: "nextVersion",
        message: "What version of Almin are you moving to?",
        choices: versions.slice(1)
    },
    {
        type: "input",
        name: "files",
        message: "On which files should the codemods be applied?",
        default: defaultFiles,
        when: !cli.input.length,
        filter: files => files.trim().split(/\s+/).filter(v => v)
    }
];

inquirer.prompt(questions).then(answers => {
    const files = answers.files || cli.input;
    if (!files.length) {
        return;
    }

    const scripts = utils.selectScripts(migrationVersions, answers.currentVersion, answers.nextVersion);

    runScripts(scripts, globby.sync(files));
});
