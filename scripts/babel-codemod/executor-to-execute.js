"use strict";
module.exports = function(babel) {
    const { types: t } = babel;
    return {
        visitor: {
            CallExpression(path) {
                const isExecuteCallExpression = (path) => {
                    return path.node.callee &&
                        path.node.callee.property &&
                        path.node.callee.property.name === "execute" &&
                        path.node["arguments"] !== undefined
                };
                const findParentExecutorCalleePath = (path) => {
                    return path.findParent((path) => {
                        return path.node.type === "CallExpression" &&
                            path.node.callee &&
                            path.node.callee.type === "MemberExpression" &&
                            path.node.callee.property &&
                            path.node.callee.property.type === "Identifier" &&
                            path.node.callee.property.name === "executor"
                    });
                };
                if (!isExecuteCallExpression(path)) {
                    return;
                }
                const executorPath = findParentExecutorCalleePath(path);
                if (!executorPath) {
                    return;
                }
                // [object].executor(useCase => useCase.execute(args));
                // =>
                // [object].execute(args)
                const executeArgs = path.node["arguments"];
                executorPath.node.callee.property.name = "execute";
                executorPath.node["arguments"] = executeArgs
            }
        }
    };
};
