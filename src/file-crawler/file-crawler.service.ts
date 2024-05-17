import { UnsupportedLanguage } from '../error.types';
import {
    PLToFileExtension,
    ProgrammingLanguage,
} from './consts/language-to-file-exntension.map';
import { GlobOptionsWithFileTypesTrue, globSync, Path } from 'glob';

export class FileCrawler {
    getAllFilePathsByProgrammingLanguage(
        rootFolder: string = '.',
        language: ProgrammingLanguage
    ): Path[] {
        const ext = PLToFileExtension.get(language);
        if (!ext) throw new UnsupportedLanguage(language);

        const pattern = `**/*${ext}`;

        const options: GlobOptionsWithFileTypesTrue = {
            cwd: rootFolder,
            nodir: true,
            withFileTypes: true,
        };

        try {
            return globSync(pattern, options);
        } catch (error) {
            console.error(`Failed lookup '${ext}' files. Error: ${error}`);
            throw error;
        }
    }
}
