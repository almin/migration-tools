#!/usr/bin/env node
"use strict";
const CodeMigrator = require("code-migrator").CodeMigrator;
const meow = require("meow");
const updateNotifier = require("update-notifier");
const migrationVersions = require("./migrations.js");
const cli = meow(
    `
    Usage
      $ almin-migration-tools [<file|glob>]

    Options:
      --dry-run Enable dry run mode
      --force, -f    Bypass safety checks and forcibly run codemods

    Examples
      $ almin-migration-tools "src/**/*.js"
`,
    {
        flags: {
            dryRun: {
                type: "boolean"
            },
            force: {
                type: "boolean"
            }
        }
    }
);

updateNotifier({ pkg: cli.pkg }).notify();

const migrator = new CodeMigrator({
    moduleName: "almin",
    migrationList: migrationVersions,
    binCreator: () => {
        const binArgs = cli.flags.dryRun ? ["--dry"] : [];
        return {
            binPath: require.resolve(".bin/jscodeshift"),
            binArgs
        };
    }
});
migrator
    .run({
        filePatterns: cli.input
    })
    .then(() => {
        console.log("Done");
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
