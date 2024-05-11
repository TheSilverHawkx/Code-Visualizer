export enum ProgrammingLanguage {
    Javascript = 'Javascript',
    Typescript = 'Typescript'
}

export const PLToFileExtension: ReadonlyMap<ProgrammingLanguage,string> = new Map([
    [ProgrammingLanguage.Javascript, '.js'],
    [ProgrammingLanguage.Typescript, '.ts']
])