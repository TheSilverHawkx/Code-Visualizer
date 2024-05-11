import { Path } from "glob";
import { BaseCodeParser } from "./base-code-parser";
import { readFileSync } from "fs";
import { JavascriptCodeParserOptions } from "./types/code-parser.types";
import * as acorn from 'acorn';
import { supportedEcmaVersions } from "./consts/js-code-parser.consts";
import { FileCrawler } from "../file-crawler/file-crawler.service";
import { ProgrammingLanguage } from "../file-crawler/consts/language-to-file-exntension.map";
import { UnknownESVersion } from "../error.types";

export class JavascriptCodeParser extends BaseCodeParser {
    private readonly ecmascriptVersion: acorn.ecmaVersion | undefined;
    private readonly fileEncoding: BufferEncoding;
    private readonly supportedEcmaVersions: number[] = supportedEcmaVersions
    private readonly fileCrawler: FileCrawler;

    constructor(
        options: JavascriptCodeParserOptions = {
            encoding: 'utf8',
            ecmaVersion: undefined
        }
    ) {
        super();

        this.fileEncoding = options.encoding ?? 'utf8';
        this.ecmascriptVersion = options.ecmaVersion;

        this.fileCrawler = new FileCrawler(ProgrammingLanguage.Javascript);
    }

    parseFile( filePath: string): any {
        try {
            const fileContents = readFileSync(filePath,{
                encoding: this.fileEncoding
            });
    
            let AST: acorn.Program | undefined = undefined;
    
            if (!this.ecmascriptVersion) {
                for (const version of this.supportedEcmaVersions) {
                    try {
                        AST = acorn.parse(fileContents,{ecmaVersion: version as acorn.ecmaVersion})
                        
                        break;
                    } catch (error) {
                        if (version === this.supportedEcmaVersions.at(-1)) {
                            throw new UnknownESVersion(filePath)
                        }
                    }
                }
            } else {
                AST = acorn.parse(fileContents, { ecmaVersion: this.ecmascriptVersion})
            }
            
            return AST;
        } catch (error) {
            console.warn(`Failed to prase code file '${filePath}'. Error: ${error}`);
            throw error;
        }
    }


    async scan(folderPath: string): Promise<acorn.Program | undefined> {
        const files = this.fileCrawler.getAllFilePathsByProgrammingLanguage(
            folderPath
        );

        if (files && files.length) {
            return this.parseFile(files[0].fullpath());
        }
    }

    
}