import { PLToFileExtension, ProgrammingLanguage } from "./consts/language-to-file-exntension.map";
import { glob, GlobOptionsWithFileTypesTrue, Path } from "glob";
export class FileCrawler {
    constructor() {}


    async getAllFilePathsByProgrammingLanguage(
        langauge: ProgrammingLanguage,
        rootFolder: string = '.'
    ): Promise<Path[]> {
        const fileExtension = PLToFileExtension.get(langauge);

        if (! fileExtension) {
            throw Error(`Could not find file extension for language '${langauge}'`)
        }

        const pattern = `**/*${fileExtension}`;

        const options: GlobOptionsWithFileTypesTrue = {
            cwd: rootFolder,
            nodir: true,
            withFileTypes: true
        }

        try {
            return await glob(pattern,options);
        } catch (error) {
            console.error(`Failed lookup ${langauge} files. Error: ${error}`)
            throw error
        }
    }
}