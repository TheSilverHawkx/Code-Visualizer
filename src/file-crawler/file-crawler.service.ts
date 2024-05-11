import { UnsupportedLanguage } from "../error.types";
import { PLToFileExtension, ProgrammingLanguage } from "./consts/language-to-file-exntension.map";
import {GlobOptionsWithFileTypesTrue, globSync,Path} from 'glob'

export class FileCrawler {
    private readonly fileExtension: string;

    constructor(
        language : ProgrammingLanguage
    ) {
        const ext = PLToFileExtension.get(language);

        if (!ext) throw new UnsupportedLanguage(language)
        this.fileExtension = ext;
    }


    getAllFilePathsByProgrammingLanguage(
        rootFolder: string = '.'
    ): Path[] {
        
        const pattern = `**/*${this.fileExtension}`;

        const options: GlobOptionsWithFileTypesTrue = {
            cwd: rootFolder,
            nodir: true,
            withFileTypes: true
        }

        try {
            return globSync(pattern,options);

        } catch (error) {
            console.error(`Failed lookup '${this.fileExtension}' files. Error: ${error}`)
            throw error
        }
    }
}