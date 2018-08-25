#!/usr/bin/env node
"use strict";
const CodeMigrator = require("code-migrator").CodeMigrator;
const meow = require("meow");
const updateNotifier = require("update-notifier");
const migrationVersions = require("./migrations.js");
const cli = meow(`
    Usage
      $ almin-migration-tools [<file|glob>]

    Options:
      --script  Run with specified migration script
      --dry-run Enable dry run mode
      --force, -f    Bypass safety checks and forcibly run codemods

    Examples
      # Interactive mode
      $ almin-migration-tools
      # Interactive mode, but it has default targets
      $ almin-migration-tools  "src/**/*.js"
      # Non interactive mode, specified script name
      $ almin-migration-tools --script "store-group-arguments" "src/**/store/**/*.js"
`,
    {
        flags: {
            script: {
                type: "string"
            },
            dryRun: {
                type: "boolean"
            },
            force: {
                type: "boolean"
            },
            help: {
                type: "boolean",
                alias: "h"
            },
            version: {
                type: "boolean",
                alias: "v"
            }
        }
    }
);

updateNotifier({ pkg: cli.pkg }).notify();
// Initialize code migrator
const migrator = new CodeMigrator({
    moduleName: "almin",
    migrationList: migrationVersions,
    binCreator: ({ script, filePathList }) => {
        if (script.type === "babel-codemod") {
            const binArgs = cli.flags.dryRun ? ["--dry"] : [];
            return {
                binPath: require.resolve(".bin/codemod"),
                binArgs: binArgs.concat(["-p", script.filePath]).concat(filePathList)
            };
        }
        const binArgs = cli.flags.dryRun ? ["--dry"] : [];
        return {
            binPath: require.resolve(".bin/jscodeshift"),
            binArgs: binArgs.concat(["-t", script.filePath]).concat(filePathList)
        };
    }
});
// --help
if (cli.flags.help) {
    cli.showHelp();
}
// --version
if (cli.flags.version) {
    cli.showVersion();
}
// main
if (cli.flags.script && cli.input) {
    console.log(`Run migration: ${cli.flags.script}`);
    migrator
        .runScripts({
            force: cli.flags.force,
            scripts: [cli.flags.script],
            files: cli.input
        })
        .then((result) => {
            console.log("Migration results:");
            console.log("- scripts:", result.scripts.map(script => script.name));
            console.log("- files count:", result.filePathList.length);
            process.exit(0);
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
} else {
    migrator
        .run({
            force: cli.flags.force,
            defaultValue: {
                files: cli.input
            }
        })
        .then((result) => {
            console.log("Migration results:");
            console.log("- scripts:", result.scripts.map(script => script.name));
            console.log("- files count:", result.filePathList.length);
            process.exit(0);
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
