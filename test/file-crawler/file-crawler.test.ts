import { FileCrawler } from '../../src/file-crawler/file-crawler.service';
import { ProgrammingLanguage } from '../../src/file-crawler/consts/language-to-file-exntension.map';
import { UnsupportedLanguage } from '../../src/error.types';
import * as glob from 'glob';
import { globMockFiles, ProgrammingLanguagesKeys } from './file-crawler.stub';

jest.mock('glob', () => ({
    globSync: jest.fn(
        (
            pattern: string | string[],
            options:
                | glob.GlobOptions
                | glob.GlobOptionsWithFileTypesTrue
                | glob.GlobOptionsWithFileTypesFalse
        ) => {
            if ('withFileTypes' in options && options.withFileTypes === true) {
                const patternString = Array.isArray(pattern)
                    ? pattern.join(',')
                    : pattern;

                const filesPaths = globMockFiles(patternString);
                return filesPaths.map((file) => ({
                    name: file,
                    isFile: () => true,
                    isDirectory: () => false,
                }));
            } else {
                // Return a Promise of string array otherwise
                return [];
            }
        }
    ) as any,
}));

describe('FileCrawler', () => {
    describe.each(ProgrammingLanguagesKeys)(
        `Testing Programming Language %s`,
        (language: string) => {
            const fileCrawler = new FileCrawler();

            test(`Should return file paths for a valid programming language`, () => {
                const result = fileCrawler.getAllFilePathsByProgrammingLanguage(
                    '.',
                    <ProgrammingLanguage>language
                );
                expect(result).toBeDefined();
                expect(result.length).toBeGreaterThan(0);
            });
        }
    );

    test('Should throw an error when the programming language is not supported', () => {
        expect(() => {
            const fileCrawler = new FileCrawler();
            fileCrawler.getAllFilePathsByProgrammingLanguage(
                '.',
                'UnsupportedLanguage' as ProgrammingLanguage
            );
        }).toThrow(UnsupportedLanguage);
    });
});
