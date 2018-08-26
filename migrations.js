/**
 * @type {MigrationList}
 */
module.exports = {
    "scripts": [
        {
            name: "context-onhandler-to-events",
            filePath: require.resolve("./scripts/context-onhandler-to-events.js")
        },
        {
            name: "remove-ChangedPayload",
            filePath: require.resolve("./scripts/remove-ChangedPayload.js")
        },
        {
            name: "store-get-state-return-object-to-flat",
            filePath: require.resolve("./scripts/store-get-state-return-object-to-flat"),
        },
        {
            name: "store-group-arguments",
            filePath: require.resolve("./scripts/store-group-arguments"),
        },
        {
            name: "executor-to-execute",
            filePath: require.resolve("./scripts/babel-codemod/executor-to-execute.js"),
            type: "babel-codemod"
        }
    ],
    "versions": [
        {
            "version": "0.13.0",
            "scripts": [
                "context-onhandler-to-events"
            ]
        },
        {
            "version": "0.14.0",
            "scripts": []
        },
        {
            "version": "0.15.0",
            "scripts": [
                "remove-ChangedPayload"
            ]
        },

        {
            "version": "0.18.0",
            "scripts": [
                "executor-to-execute"
            ]
        }
    ]
};
