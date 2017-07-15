// MIT © 2017 azu
"use strict";
// context.onWillExecuteEachUseCase =>
export function renameHandler(name, newName, j, ast) {
    ast.find(j.CallExpression, {
        callee: {
            object: { name: 'context' },
            property: { name }
        }
    }).forEach(p => p.get('callee').get('property').replace(j.identifier(newName)));
}