import { BaseCodeParser } from "./base-code-parser";
import { readFileSync } from "fs";
import { CodePage, JavascriptCodeParserOptions } from "./types/code-parser.types";
import acorn = require('acorn');
import { supportedEcmaVersions } from "./consts/js-code-parser.consts";
import { FileCrawler } from "../file-crawler/file-crawler.service";
import { ProgrammingLanguage } from "../file-crawler/consts/language-to-file-exntension.map";
import { UnknownESVersion } from "../error.types";
import { ASTParser } from "../ast-parser/ast-parser.service";

export class JavascriptCodeParser extends BaseCodeParser {
    private readonly ecmascriptVersion: acorn.ecmaVersion | undefined;
    private readonly fileEncoding: BufferEncoding;
    private readonly supportedEcmaVersions: number[] = supportedEcmaVersions
    private readonly fileCrawler: FileCrawler;
    private readonly astParser: ASTParser;

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
        this.astParser = new ASTParser();
    }

    parseFile( filePath: string): CodePage | undefined {
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
            return AST
                ? this.astParser.parse(filePath,AST)
                : undefined;
            
        } catch (error) {
            console.warn(`Failed to prase code file '${filePath}'. Error: ${error}`);
            throw error;
        }
    }


    scan(folderPath: string): void {
        const files = this.fileCrawler.getAllFilePathsByProgrammingLanguage(
            folderPath
        );
        const codePages: Array<CodePage> = [];

        for (const file of files) {
            const filePath = file.fullpath();
            const codePage = this.parseFile(filePath);

            if (codePage) {
                codePages.push(codePage)
            }
        }

        codePages.forEach( page=> console.log(JSON.stringify(page)))


    }

    
}