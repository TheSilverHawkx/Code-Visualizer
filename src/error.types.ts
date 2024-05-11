import { ProgrammingLanguage } from "src/file-crawler/consts/language-to-file-exntension.map";

export class UnsupportedLanguage extends Error {
    constructor(language: ProgrammingLanguage) {
        super(`Unsupported Language '${language}'`)
    }
}

