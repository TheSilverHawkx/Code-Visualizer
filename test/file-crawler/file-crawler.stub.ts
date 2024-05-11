import { PLToFileExtension, ProgrammingLanguage } from "../../src/repo-crawler/consts/language-to-file-exntension.map"

export const globMockFiles = (pattern: string): string[] => {
    const availableExtentions = PLToFileExtension.entries();

    for (const extension of availableExtentions) {
        if (pattern.includes(extension[1])) {
            switch (extension[0]) {
                case ProgrammingLanguage.Javascript: {
                    return [
                        "file1.js",
                        "file2.js",
                        "file3.js"
                    ]
                }
                case ProgrammingLanguage.Typescript: {
                    return [
                        "file1.ts",
                        "file2.ts",
                        "file3.ts"
                    ]
                }
                default: {
                    return [];
                }
            }
        }
    }
    return [];
}

export const ProgrammingLanguagesKeys: ReadonlyArray<string> = Object.keys(ProgrammingLanguage)