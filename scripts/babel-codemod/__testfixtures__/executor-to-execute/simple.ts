import { UseCase, Context } from "almin";

class MyUseCaseA extends UseCase {
    execute(_a: string) {
    }
}

const context = new Context({
    store: createStore({ name: "test" })
});

context.useCase(new MyUseCaseA()).executor(useCase => useCase.execute("A"));
