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
appContext.events.onWillExecuteEachUseCase((payload, meta) => {});
appContext.events.onDispatch((payload, meta) => {});
appContext.events.onDidExecuteEachUseCase((payload, meta) => {});
appContext.events.onCompleteEachUseCase((payload, meta) => {});
appContext.events.onErrorDispatch((payload, meta) => {});