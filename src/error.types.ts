import { ProgrammingLanguage } from 'src/file-crawler/consts/language-to-file-exntension.map';

export class UnsupportedLanguage extends Error {
    constructor(language: ProgrammingLanguage) {
        super(`Unsupported Language '${language}'`);
    }
}

export class UnknownESVersion extends Error {
    constructor(filePath: string) {
        super(`File '${filePath}' has an unsuppored ES version`);
    }
}
