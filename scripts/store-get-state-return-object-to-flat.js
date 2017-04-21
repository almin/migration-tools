// MIT © 2017 azu
"use strict";
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
    const outputJSONPath = path.join(process.cwd(), "store-state-mapping.json");
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
    // found Following pattern
    /*
    getState() {
        return {
            stateName: state
        }
    }
     */
    // Replace with Following
    /*
    getState(){
        return state;
    }
     */
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