import {UseCase} from "almin";
export default class AsyncUseCase extends UseCase {
    // 1. call onWillExecuteEachUseCase
    execute() {
        // 2. call onDispatch
        this.dispatch({ type : "start" });
        return Promise.resolve().then(() => {
            // does async function
        }).then(() => {
            // 4. call onCompleteEachUseCase
        });
    }
    // 3. call onDidExecuteEachUseCase
}
// listen on*
context.onWillExecuteEachUseCase((payload, meta) => {});
context.onDispatch((payload, meta) => {});
context.onDidExecuteEachUseCase((payload, meta) => {});
context.onCompleteEachUseCase((payload, meta) => {});
context.onErrorDispatch((payload, meta) => {});