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
context.events.onWillExecuteEachUseCase((payload, meta) => {});
context.events.onDispatch((payload, meta) => {});
context.events.onDidExecuteEachUseCase((payload, meta) => {});
context.events.onCompleteEachUseCase((payload, meta) => {});
context.events.onErrorDispatch((payload, meta) => {});