const value: string = "asasea";
context.useCase(createMyUseCaseA()).executor(useCase => {
    return useCase.execute(value)
});
