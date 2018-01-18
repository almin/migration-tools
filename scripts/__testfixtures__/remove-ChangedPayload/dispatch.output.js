import { UseCase } from "almin";

export class ExampleUseCase extends UseCase {
    execute() {
        this.context.useCase({ type: "ChangedPayload" }).execute();
    }
}
