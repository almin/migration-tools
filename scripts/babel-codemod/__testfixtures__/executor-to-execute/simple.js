import { UseCase, Context } from "almin";

class MyUseCaseA extends UseCase {
    execute(_a) {
        console.log(_a)
    }
}

const context = new Context({
    store: createStore({ name: "test" })
});

context.useCase(new MyUseCaseA()).executor(useCase => useCase.execute("A"));
