import * as acorn from 'acorn'

export interface BaseCodeParserOptions {
    encoding: BufferEncoding
}

export interface JavascriptCodeParserOptions extends BaseCodeParserOptions{
    ecmaVersion?: acorn.ecmaVersion
} 

export interface CodePage {
    fileName: string;
    dependencies: string[];

}