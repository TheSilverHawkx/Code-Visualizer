import acorn = require('acorn')
import { CodeDependency, CodeDependencySoruceType, CodePage } from '../code-parser/types/code-parser.types'
import { LOCAL_IMPORT_IDENTIFIER } from './consts/ast-parser.consts'
import { ASTImportDependencyNode } from './types/ast-parser.types'

export class ASTParser {
    private inferSourceType(sourceValue: string | undefined): CodeDependencySoruceType {
        if (!sourceValue) return CodeDependencySoruceType.UNKNOWN
        

        return LOCAL_IMPORT_IDENTIFIER.some(prefix => sourceValue.startsWith(prefix))
            ? CodeDependencySoruceType.LOCAL_IMPORT
            : CodeDependencySoruceType.PACKAGE_IMPORT

    }

    private parseImportSpecifier(
        specifier: acorn.ImportSpecifier | acorn.ImportDefaultSpecifier | acorn.ImportNamespaceSpecifier
    ): Pick<CodeDependency, 'identifier' | 'importedFunction'> {
        if ( specifier.type === 'ImportSpecifier') {
            return {
                identifier: specifier.local.name,
                importedFunction: specifier.imported.type === 'Identifier'
                    ? specifier.imported.name
                    : specifier.imported.value?.toString()
            }
        } else {
            return {
                identifier: specifier.local.name,
            }
        }
    }

    // Fit to handle require statements only at the moment
    private parseVariableDecleration(
        variableDeclaration: acorn.VariableDeclaration
    ): Array<CodeDependency> {
        const dependencies: Array<CodeDependency> = [];

        for (const decleration of variableDeclaration.declarations) {
            // Skip CallExpressions that are not require statements 
            if (! (
                decleration.init?.type === 'CallExpression' &&
                decleration.init.callee.type === 'Identifier' &&
                decleration.init.callee.name === 'require'
                )
            ) {
                continue;
            }


            if ( decleration.id.type === 'Identifier') {
                const source = decleration.init.arguments.at(0);
                if (!source) continue;

                if ( source.type === 'Literal' && source?.value ) {
                    dependencies.push({
                        identifier: decleration.id.name,
                        source: source.value?.toString(),
                        sourceType: this.inferSourceType(source.value.toString())
                    })

                }
            }
        }

        return dependencies;
    }

    parseDependency(node: ASTImportDependencyNode): Array<CodeDependency> | undefined {
        const dependencies: Array<CodeDependency> = [];
        switch (node.type) {
            case 'ImportDeclaration':
                if (! node.source?.value) {
                    console.warn(JSON.stringify(node))
                    throw new Error('Undefined import source found')
                }
                
                const stringValue = node?.source?.value.toString()
                const sourceType = this.inferSourceType(stringValue)
    
                for (const specifier of node.specifiers) {
                    dependencies.push({
                        ...this.parseImportSpecifier(specifier),
                        sourceType: sourceType,
                        source: stringValue
                    });
                }
                break;
            case 'VariableDeclaration':
                dependencies.push(...this.parseVariableDecleration(node));
                break;
        }

        return dependencies;

    }

    parse(fileName:string, ast: acorn.Program):CodePage | undefined {
        const codePage: CodePage = {
            fileName,
            dependencies: [],
            ast
        };

        if (! ast.body.length) {
            return undefined;
        }

        for (const node of ast.body) {
            if (node.type === 'ImportDeclaration' || node.type === 'VariableDeclaration') {
                const nodeDependencies = this.parseDependency(node);

                if (nodeDependencies?.length) {
                    codePage.dependencies.push(...nodeDependencies)
                }
            }
        }


        return codePage;
    }
}