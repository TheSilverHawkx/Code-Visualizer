import { FileCrawler } from '../../src/repo-crawler/file-crawler.service';
import { ProgrammingLanguage, PLToFileExtension } from '../../src/repo-crawler/consts/language-to-file-exntension.map';
import * as glob from 'glob';
import { globMockFiles, ProgrammingLanguagesKeys } from './file-crawler.stub';

jest.mock('glob', () => ({
  glob: jest.fn((pattern: string | string[], options: glob.GlobOptions | glob.GlobOptionsWithFileTypesTrue | glob.GlobOptionsWithFileTypesFalse) => {
    if ('withFileTypes' in options && options.withFileTypes === true) {
      const patternString = Array.isArray(pattern) ? pattern.join(',') : pattern;

      const filesPaths = globMockFiles(patternString);
      return Promise.resolve(
        filesPaths.map(file => ({name: file, isFile: () => true, isDirectory: () => false}))
      );
    } else {
      // Return a Promise of string array otherwise
      return Promise.resolve([]);
    }
  }) as any,
}));


describe('FileCrawler', () => {
  let fileCrawler: FileCrawler;

  beforeAll(() => {
    fileCrawler = new FileCrawler();
  });

  describe.each(ProgrammingLanguagesKeys)(`Testing Programming Language '$language'`, (language: string) => {
    
    test(`Should return file paths for a valid programming language`,  async () => {
      const enumValue = <ProgrammingLanguage>language;
      const result = await fileCrawler.getAllFilePathsByProgrammingLanguage(enumValue);
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    });
  });

  test('Should throw an error when the programming language is not supported', async () => {
    expect(
      fileCrawler.getAllFilePathsByProgrammingLanguage("UnsupportedLanguage" as ProgrammingLanguage)
    ).rejects.toThrow("Could not find file extension for language 'UnsupportedLanguage'");
  });
});
