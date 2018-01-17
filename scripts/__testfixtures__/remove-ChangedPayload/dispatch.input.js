import { UseCase, ChangedPayload } from "almin";

export class ExampleUseCase extends UseCase {
    execute() {
        this.context.useCase(new ChangedPayload()).execute();
    }
}
