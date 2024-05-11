const requireCLICommand = () => require("../src/index");

export async function runCommand(
    ...args: string[]
): Promise<number | undefined> {
    const originalArgv = process.argv;
    process.argv = ["node", "./dist/index.js", ...args];
    let exitCode: number | undefined;

    // Mock process.exit using spyOn
    // @ts-ignore exit code is always a number
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((code?: number | string | null) => {
        exitCode = code as number;
        return undefined as never;
    });

    try {
        requireCLICommand();
    } finally {
        process.argv = originalArgv;
        exitSpy.mockRestore();
    }

    return exitCode;
}
