// MIT © 2017 azu
"use strict";
module.exports = function transformer(file, api) {
    const j = api.jscodeshift;
    const isContext = path => {
        const parent = path.parent;
        if (!parent) {
            return false;
        }
        const parentNode = parent.value;
        if (!parentNode) {
            return false;
        }
        if (parentNode.type !== "MemberExpression") {
            return false;
        }
        const callee = parentNode;
        if (callee.object.type !== "Identifier") {
            return false;
        }
        return callee.object.name === "context";
    };

    return j(file.source)
        .find(j.Identifier)
        .filter(path => {
            return isContext(path);
        })
        .replaceWith(p => {
            switch (p.value.name) {
                case "onWillExecuteEachUseCase":
                    return "events.onWillExecuteEachUseCase";
                case "onDispatch":
                    return "events.onDispatch";
                case "onDidExecuteEachUseCase":
                    return "events.onDidExecuteEachUseCase";
                case "onCompleteEachUseCase":
                    return "events.onCompleteEachUseCase";
                case "onErrorDispatch":
                    return "events.onErrorDispatch";
                default:
                    return p.value;
            }
        })
        .toSource();
};
