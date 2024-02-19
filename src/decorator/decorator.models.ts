export interface ClassDecoratorContext {
    kind: "class";
    name: string | undefined;

    metadata?: Record<string | number | symbol, unknown>;

    addInitializer(initializer: () => void): void;
}

export interface ClassMethodDecoratorContext {
    kind: string;
    name: string | symbol;
    access: { get(): unknown };
    static: boolean;
    private: boolean;

    metadata?: Record<string | number | symbol, unknown>;

    addInitializer(initializer: () => void): void;
}

