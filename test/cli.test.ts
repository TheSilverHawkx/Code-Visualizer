import { runCommand } from "./utils";

describe("CLI -p --folder-path options", () => {
  beforeAll(() => {
    process.exit = jest.fn() as never;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Invalid Input Tests", () => {
    test("Should fail with invalid path", async () => {
      const exitCode = await runCommand("-p", "./sssssssssssa");

      expect(exitCode).toBe(1);
    });

    test("Should fail with missing -p", async () => {
      const exitCode = await runCommand();

      expect(exitCode).toBe(1);
    });
  });

  describe("Valid input Tests", () => {
    test("Should run with valid path", async () => {
      const exitCode = await runCommand("-p", "./examples/node-hello");

      expect(exitCode).toBe(0);
    });
  });
});
