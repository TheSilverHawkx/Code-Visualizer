import { BaseCodeParser } from './base-code-parser';
import { JavascriptCodeParser } from './js-code-parser';
import {
    BaseCodeParserOptions,
    JavascriptCodeParserOptions,
} from './types/code-parser.types';
import { UnsupportedLanguage } from '../error.types';
import { ProgrammingLanguage } from '../file-crawler/consts/language-to-file-exntension.map';

export function createCodeParser(
    language: ProgrammingLanguage,
    options: Partial<BaseCodeParserOptions> = {}
): BaseCodeParser {
    switch (language) {
        case ProgrammingLanguage.Javascript:
            return new JavascriptCodeParser(options as JavascriptCodeParserOptions);
        default:
            throw new UnsupportedLanguage(language);
    }
}
