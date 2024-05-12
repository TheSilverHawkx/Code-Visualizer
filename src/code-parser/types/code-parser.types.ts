import * as acorn from 'acorn'

export interface BaseCodeParserOptions {
    encoding: BufferEncoding
}

export interface JavascriptCodeParserOptions extends BaseCodeParserOptions{
    ecmaVersion?: acorn.ecmaVersion
} 

export interface CodePage {
    fileName: string;
    dependencies: CodeDependency[];
    ast: acorn.Program

}

export enum CodeDependencySoruceType {
    UNKNOWN = 'Unknown',
    LOCAL_IMPORT = 'LocalImport',
    PACKAGE_IMPORT = 'PackageImport',
}

export interface CodeDependency {
    identifier: string;
    importedFunction?: string;
    sourceType: CodeDependencySoruceType;
    source: string;
}