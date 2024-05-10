import {cli} from './utils';
jest.setTimeout(10000); 

describe("CLI -p --folder-path options", () => {

  test('Should error when flag is missing', async () => {
    let result = await cli([],'.');

    expect(result).toBeDefined()

    expect(result?.code).toEqual(1);
  });


  test(`Should error when file path doesn't exist`, async () => {
    let {code} = await cli(['-p','/asdasdasdasdasd'],'.');

    expect(code).toEqual(1);
  });


  test(`Should work if folder path is valid`, async () => {
    let {code} = await cli(['-p','examples/node-hello'],'.');

    expect(code).toEqual(0)

  })
});

// describe("CLI '-p --folder-path' option", () => {
//   let consoleOutput: string[] = [];
//   const originalConsoleLog = console.log;

//   beforeEach(() => {
//     consoleOutput = [];
//     console.log = (...args: string[]) => { consoleOutput.push(...args); };
//   });

//   afterEach(() => {
//     console.log = originalConsoleLog;
//   });

//   test('should error when -p flag is not provided', () => {
//     expect(() => {
//       program.parse(['node', 'cli', 'serve']);
//     }).toThrow();
//   });

//   test('should error when -p is provided with an invalid path', () => {
//     __setMockFiles([]);
//     expect(() => {
//       program.parse(['node', 'cli', 'serve', '-p', '/fake/path']);
//     }).toThrow();
//   });

//   test('should accept -p with a valid path', () => {
//     __setMockFiles(['/valid/path']);
//     program.parse(['node', 'cli', 'serve', '-p', '/valid/path']);
//     expect(consoleOutput.includes('Server running on port: /valid/path')).toBeTruthy();
//   });
// });
