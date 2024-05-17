import { BaseCodeParser } from './base-code-parser';
import { CodePage, JavascriptCodeParserOptions } from './types/code-parser.types';
import acorn = require('acorn');
import { supportedEcmaVersions } from './consts/js-code-parser.consts';
import { ProgrammingLanguage } from '../file-crawler/consts/language-to-file-exntension.map';
import { UnknownESVersion } from '../error.types';

export class JavascriptCodeParser extends BaseCodeParser {
    private readonly ecmascriptVersion: acorn.ecmaVersion | undefined;
    private readonly supportedEcmaVersions: number[] = supportedEcmaVersions;

    constructor({
        encoding = 'utf8',
        ecmaVersion = undefined,
    }: JavascriptCodeParserOptions) {
        super(ProgrammingLanguage.Javascript, encoding);
        this.ecmascriptVersion = ecmaVersion;
    }

    parseFileToAST(filePath: string): acorn.Program {
        try {
            const fileContents = this.readCodeFile(filePath);

            if (this.ecmascriptVersion) {
                return acorn.parse(fileContents, { ecmaVersion: this.ecmascriptVersion });
            } else {
                for (const version of this.supportedEcmaVersions) {
                    try {
                        return acorn.parse(fileContents, {
                            ecmaVersion: version as acorn.ecmaVersion,
                        });
                    } catch (error) {}
                }
                throw new UnknownESVersion(filePath);
            }
        } catch (error) {
            console.warn(`Failed to prase code file '${filePath}'. Error: ${error}`);
            throw error;
        }
    }
}
