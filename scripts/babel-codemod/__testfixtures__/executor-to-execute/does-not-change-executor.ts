const expression = useCase => useCase.execute("A");
context.useCase(new MyUseCaseA()).executor(expression);
