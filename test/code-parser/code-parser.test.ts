import { FileCrawler } from '../../src/file-crawler/file-crawler.service';
import { ProgrammingLanguage } from '../../src/file-crawler/consts/language-to-file-exntension.map';
import {UnknownESVersion} from '../../src/error.types'
import {JavascriptCodeParser} from '../../src/code-parser/js-code-parser'
import { PathOrFileDescriptor } from 'fs';
// import { JavascriptCodeStub } from './code-parser.stub';
import { Path } from 'glob';

// jest.mock('fs', () => ({
//     readFileSync: jest.fn((path: PathOrFileDescriptor, options: BufferEncoding) => {
//         const pathString = path.toString()
//         return JavascriptCodeStub[pathString]
//   }),
// }));

describe('CodeParser', () => {
    // afterAll(() => {
    //     jest.restoreAllMocks()
    // })

    describe('Testing Programming Language Javascript', () => {
        const jsParser = new JavascriptCodeParser();
        test('File with unknown ES version throws error', () => {
            expect( () => {
                jsParser.parseFile(`test/code-parser/code-files/invalid.js`)
            }
            ).toThrow(UnknownESVersion)
        })

        test('File with valid ES version returns AST', () => {
            expect(
                jsParser.parseFile("test/code-parser/code-files/valid.js")
            ).toBeDefined()
        })
    })
})