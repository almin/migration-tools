context.useCase(createMyUseCaseA()).executor(function (useCase) {
    return useCase.execute(1, 2, { key: "3" })
});
