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
        }
    ]
};
