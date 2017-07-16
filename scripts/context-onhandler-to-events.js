// MIT © 2017 azu
"use strict";
/**
 * ## Context on handler migration (0.13~)
 *
 * Move event handler on Context to `context.events`.
 *
 * ```js
 * context.onWillExecuteEachUseCase((payload, meta) => {});
 * context.onDispatch((payload, meta) => {});
 * context.onDidExecuteEachUseCase((payload, meta) => {});
 * context.onCompleteEachUseCase((payload, meta) => {});
 * context.onErrorDispatch((payload, meta) => {});
 * ```
 *
 * to
 *
 * ```js
 * context.events.onWillExecuteEachUseCase((payload, meta) => {});
 * context.events.onDispatch((payload, meta) => {});
 * context.events.onDidExecuteEachUseCase((payload, meta) => {});
 * context.events.onCompleteEachUseCase((payload, meta) => {});
 * context.events.onErrorDispatch((payload, meta) => {});
 * ```
 *
 * ### Notes
 *
 * `Context.onChange` is still on `Context` prototype.
 * Because, it is not life-cycle events and it is optimized for updating UI.
 *
 */
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
        return callee.object.name === "context" || callee.object.name === "appContext";
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
