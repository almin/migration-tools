// MIT © 2017 azu
"use strict";
/**
 * # Migration Scripts
 *
 * Store#getState return value migration.
 *
 * This script migrate following adn write stats to `almin-store-state-mapping.json`.
 *
 * Found Following pattern and replace
 *
 * ```js
 * getState() {
 *       return {
 *           stateName: state
 *       }
 * }
 *
 * with
 *
 * ```js
 * getState(){
 *     return state;
 * }
 * ```
 *
 */
const fs = require("fs");
const path = require("path");
const updateState = (outputJSONPath, stateName, storeFilePath) => {
    let output = {};
    try {
        output = require(outputJSONPath)
    } catch (error) {
        output = {};
    }
    output[stateName] = storeFilePath;
    fs.writeFileSync(outputJSONPath, JSON.stringify(output, null, 4), "utf-8");
};
module.exports = function(file, api, options) {
    let stateName = null;
    const filePath = file.path;
    const outputJSONPath = path.join(process.cwd(), "almin-store-state-mapping.json");
    const hasOneProperty = ({ node }) => {
        return node.properties && node.properties.length === 1;
    };
    const isReturnedValue = (path) => {
        const parentNode = path.parent;
        return parentNode.value.type === "ReturnStatement";
    };
    // look up to parent
    const isInGetStateMethod = (targetPath) => {
        const results = j(targetPath)
        .closest(j.MethodDefinition)
        .filter(path => {
            return j(path).find(j.Identifier, {
                name: "getState"
            });
        });
        return results.size() === 1;
    };
    const j = api.jscodeshift;
    const replaced = j(file.source)
    .find(j.ObjectExpression)
    .filter(path => {
        return hasOneProperty(path);
    })
    .filter(path => {
        return isReturnedValue(path)
    })
    .filter(path => {
        return isInGetStateMethod(path);
    })
    .replaceWith(path => {
        stateName = path.value.properties[0].key.name;
        // { stateName: state }
        // => state
        return path.value.properties[0].value;
    })
    .toSource();
    if (!options.dry) {
        updateState(outputJSONPath, stateName, filePath);
    }
    return replaced;
};