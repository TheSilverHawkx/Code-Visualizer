import {
    CodeDependency,
    CodeDependencySoruceType,
} from '../../code-parser/types/code-parser.types';

export interface DependencySource {
    value: string;
    type: CodeDependencySoruceType;
}

export interface ASTParserState {
    dependencies: Array<CodeDependency>;
    functions: object;
    classes: object;
    variables: Record<string, any>;
}
