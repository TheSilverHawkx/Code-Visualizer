import {
    ASTNode,
    BaseCodeParserOptions,
    CodeDependency,
    CodePage,
} from './types/code-parser.types';
import acornWalk = require('acorn-walk');
import acorn = require('acorn');
import { ASTParser } from '../ast-parser/ast-praser.service';
import { readFileSync } from 'fs';
import { Path as GlobPath } from 'glob';
import path from 'path';
import { FileCrawler } from '../file-crawler/file-crawler.service';
import { ProgrammingLanguage } from '../file-crawler/consts/language-to-file-exntension.map';

export abstract class BaseCodeParser {
    private readonly codePagesMap: Map<string, CodePage> = new Map();

    constructor(
        private readonly language: ProgrammingLanguage,
        private readonly fileEncoding: BufferEncoding = 'utf8'
    ) {}

    abstract parseFileToAST(
        filePath: string,
        options?: BaseCodeParserOptions
    ): acorn.Program;

    scan(folderPath: string): void {
        for (const file of this.getAllFiles(folderPath)) {
            const filePath = file.fullpath();

            const codeAST = this.parseFileToAST(filePath);

            const dependencies = this.extractDependencies(filePath, codeAST);

            this.addCodePage({
                fileName: filePath.substring(0, filePath.lastIndexOf('.')),
                ast: codeAST,
                dependencies,
            });
        }
    }

    private *getAllFiles(folderPath: string): IterableIterator<GlobPath> {
        const fileCrawler = new FileCrawler();

        yield* fileCrawler.getAllFilePathsByProgrammingLanguage(
            folderPath,
            this.language
        );
    }

    protected extractDependencies(filePath: string, ast: ASTNode): CodeDependency[] {
        const astParser = new ASTParser(filePath);

        const state = astParser.createASTParserStateObject();

        acornWalk.recursive(ast, state, {
            ImportDeclaration(node, state, callback) {
                astParser.parseImportDecleration(node, state, callback);
            },
            VariableDeclaration(node, state, callback) {
                astParser.praseVariableDecleration(node, state, callback);
            },
        });

        return state.dependencies;
    }

    protected readCodeFile(filePath: string): string {
        return readFileSync(filePath, {
            encoding: this.fileEncoding,
        });
    }

    protected addCodePage(page: CodePage) {
        this.codePagesMap.set(page.fileName, page);
    }

    printDependenciesChains() {
        this.codePagesMap.forEach((codePage, fileName) => {
            const baseFileName = path.basename(fileName);

            if (!codePage.dependencies.length) {
                console.log(`File: ${baseFileName} is independent`);
            } else {
                console.log(
                    `File: ${baseFileName} depends on [${codePage.dependencies.map((dep) => dep.source)}]`
                );
            }
        });
    }
}
