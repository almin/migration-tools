// MIT © 2017 azu
"use strict";
const isSourceAlmin = source => {
    if (!source) {
        return false;
    }
    return source.type === "Literal" && source.value === "almin";
};
const isChangedPayload = source => {
    if (!source) {
        return false;
    }
    return source.type === "Identifier" && source.name === "ChangedPayload";
};
/**
 * If found { ChangedPayload }, return ImportSpecifier
 * @param path
 * @returns {boolean}
 */
const isChangedPayloadImportSpecifier = path => {
    if (!path.node) {
        return false;
    }
    if (path.node.type !== "ImportSpecifier") {
        return false;
    }
    // from "almin"
    const parent = path.parent;
    if (!isSourceAlmin(parent.node.source)) {
        return false;
    }
    // import { ChangedPayload }
    return isChangedPayload(path.node.imported);
};

function isNewExpressionChangedPayload(path) {
    const node = path.node;
    if (!node || node.type !== "NewExpression") {
        return false;
    }
    const expression = node;
    console.log("expression", expression);
    return (
        expression &&
        expression.type === "NewExpression" &&
        expression.callee &&
        expression.callee.type === "Identifier" &&
        expression.callee.name === "ChangedPayload"
    );
}

module.exports = function transformer(file, api) {
    const j = api.jscodeshift;
    // Remove `import { ChangedPayload } from "almin"
    return (
        j(
            j(file.source)
                .find(j.ImportSpecifier)
                .filter(path => {
                    return isChangedPayloadImportSpecifier(path);
                })
                .remove()
                .toSource()
        )
            // Rewrite new ChangedPayload() => { type: "ChangedPayload" }
            .find(j.NewExpression)
            .filter(path => {
                let newExpressionChangedPayload = isNewExpressionChangedPayload(path);
                console.log(newExpressionChangedPayload);
                return newExpressionChangedPayload;
            })
            .replaceWith(path => {
                return `{ type: "ChangedPayload" }`;
                R;
            })
            .toSource()
    );
};
