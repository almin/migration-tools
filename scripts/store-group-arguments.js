// MIT © 2017 azu
"use strict";
/**
 * # Migration Scripts
 *
 * Migrate StoreGroup constructor arguments.
 *
 * This script migrate following using `store-state-mapping.json`.
 *
 * ```js
 * new StoreGroup([
 *   new CartStore(cartRepository),
 *   new CustomerStore(customerRepository),
 *   new ProductStore(productRepository)
 * ])
 * ```
 *
 * with
 *
 * ```js
 * new StoreGroup({
 *   "cart": new CartStore(cartRepository),
 *   "customer": new CustomerStore(customerRepository),
 *    "product": new ProductStore(productRepository)
 * });
 * ```
 *
 */
const path = require("path");
module.exports = function(file, api, options) {
    const outputJSONPath = options.mapping
        ? path.resolve(process.cwd(), options.mapping)
        : path.join(process.cwd(), "almin-store-state-mapping.json");
    let mapping = {};
    try {
        mapping = require(outputJSONPath);
    } catch (error) {
        mapping = {};
    }

    const j = api.jscodeshift;
    if (Object.keys(mapping).length === 0) {
        console.warn("Not found almin-store-state-mapping.json in current directory.");
        console.warn("This script need almin-store-state-mapping.json");
        console.warn("Please run store-get-state-return-object-to-flat.js before running this script.");
        return file.source;
    }
    // transform
    const isStoreGroupArguments = path => {
        const parent = path.parent;
        if (!parent) {
            return false;
        }
        if (parent.value.type !== "NewExpression") {
            return false;
        }
        const callee = parent.value.callee;
        if (callee && callee.type === "Identifier") {
            return callee.name === "StoreGroup";
        }
        return false;
    };

    // get store name
    const getStoreNameFromElement = element => {
        if (!element) {
            throw new Error(element + " is invalid");
        }
        if (element.callee && element.callee.type === "Identifier") {
            return element.callee.name;
        } else if (element.type === "Identifier") {
            return element.name;
        }
        throw new Error(element + " is invalid");
    };

    const getStateNameFromStoreName = storeName => {
        let result = null;
        const found = Object.keys(mapping).some(stateName => {
            const storeFilePath = mapping[stateName];
            // { AStore: new AStore() }
            if (storeName === storeFilePath) {
                result = stateName;
                return true;
            }
            // { AStateName: "/path/to/AStore.js" }
            const fileName = path.basename(storeFilePath, ".js");
            if (storeName === fileName || storeName.toLocaleLowerCase() === fileName.toLocaleLowerCase()) {
                result = stateName;
                return true;
            }
            return false;
        });
        if (!found) {
            throw new Error(`Not found mapping for ${storeName} in ${outputJSONPath}`);
        }
        return result;
    };
    return j(file.source)
        .find(j.ArrayExpression)
        .filter(path => {
            return isStoreGroupArguments(path);
        })
        .replaceWith(path => {
            const elements = path.value.elements;
            const objects = elements.map(element => {
                const storeName = getStoreNameFromElement(element);
                const stateName = getStateNameFromStoreName(storeName);
                // { stateName: new Store() }
                return j.property("init", j.literal(stateName), element);
            });
            return j.objectExpression(objects);
        })
        .toSource();
};
