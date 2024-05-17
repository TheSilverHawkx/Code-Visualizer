import * as acorn from 'acorn';
import acornWalk = require('acorn-walk');
import { CodeDependencySoruceType } from '../code-parser/types/code-parser.types';
import { LOCAL_IMPORT_IDENTIFIER } from './consts/ast-parser.consts';
import path = require('path');
import { ASTParserState, DependencySource } from './types/ast-parser.types';

export class ASTParser {
    constructor(private readonly filePath: string) {}

    private inferImportSourceType(
        sourceValue: string | undefined
    ): CodeDependencySoruceType {
        if (!sourceValue) return CodeDependencySoruceType.UNKNOWN;

        return LOCAL_IMPORT_IDENTIFIER.some((prefix) => sourceValue.startsWith(prefix))
            ? CodeDependencySoruceType.LOCAL_IMPORT
            : CodeDependencySoruceType.PACKAGE_IMPORT;
    }

    createASTParserStateObject(): ASTParserState {
        return {
            classes: {},
            functions: {},
            variables: {},
            dependencies: [],
        };
    }

    parseImportDecleration(
        node: acorn.ImportDeclaration,
        state: ASTParserState,
        callback: acornWalk.WalkerCallback<ASTParserState>
    ) {
        const source = this.parseImportSource(
            (node.source.value as string) ?? node.source.raw
        );

        for (const specifier of node.specifiers) {
            switch (specifier.type) {
                case 'ImportDefaultSpecifier':
                    this.handleDefaultImportSpecifier(
                        specifier,
                        state,
                        source.value,
                        source.type
                    );
                    break;
                case 'ImportNamespaceSpecifier':
                    this.handleImportNamespaceSpecifier(
                        specifier,
                        state,
                        source.value,
                        source.type
                    );
                    break;
                case 'ImportSpecifier':
                    this.handleRegularImportSpecifier(
                        specifier,
                        state,
                        source.value,
                        source.type
                    );
                    break;
            }
            callback(specifier, state);
        }
        callback(node.source, state);
    }

    praseVariableDecleration(
        node: acorn.VariableDeclaration,
        state: ASTParserState,
        callback: acornWalk.WalkerCallback<ASTParserState>
    ) {
        for (const decleration of node.declarations) {
            this.handleVariableDeclerator(decleration, state);
            callback(decleration, state);
        }
    }

    private handleVariableDeclerator(
        node: acorn.VariableDeclarator,
        state: ASTParserState
    ) {
        // Handle decleration and assignment
        if (node.init) {
            const expression = node.init as acorn.Expression;
            switch (expression.type) {
                case 'CallExpression':
                    this.handleCallExpression(expression, node.id, state);
                    break;
                default:
                    break;
            }
        }
        // Handle decleration only
        else {
        }
    }

    private handleCallExpression(
        expressionNode: acorn.CallExpression,
        identifierNode: acorn.Pattern,
        state: ASTParserState
    ) {
        // Handle require imports
        if (
            expressionNode.callee.type === 'Identifier' &&
            expressionNode.callee.name === 'require'
        ) {
            const source = this.parseImportSource(
                (expressionNode.arguments.at(0) as acorn.Literal).value as string
            );

            state.dependencies.push({
                identifier: (identifierNode as acorn.Identifier).name,
                source: source.value,
                sourceType: source.type,
            });
        }
    }

    private handleImportNamespaceSpecifier(
        node: acorn.ImportNamespaceSpecifier,
        state: ASTParserState,
        source: string,
        sourceType: CodeDependencySoruceType
    ) {
        state.dependencies.push({
            identifier: node.local.name,
            source,
            sourceType,
        });
    }

    private handleRegularImportSpecifier(
        node: acorn.ImportSpecifier,
        state: ASTParserState,
        source: string,
        sourceType: CodeDependencySoruceType
    ) {
        state.dependencies.push({
            identifier: node.local.name,
            source,
            sourceType,
            importedFunction:
                node.imported.type === 'Identifier'
                    ? node.imported.name
                    : (node.imported.value as string),
        });
    }

    private handleDefaultImportSpecifier(
        node: acorn.ImportDefaultSpecifier,
        state: ASTParserState,
        source: string,
        sourceType: CodeDependencySoruceType
    ) {
        state.dependencies.push({
            identifier: node.local.name,
            source,
            sourceType,
        });
    }

    private parseImportSource(sourceRawValue: string): DependencySource {
        const type = this.inferImportSourceType(sourceRawValue);

        // If source type is local package - resolve path
        const sourcePath =
            type === CodeDependencySoruceType.LOCAL_IMPORT
                ? path.resolve(path.dirname(this.filePath), sourceRawValue)
                : sourceRawValue;

        return { value: sourcePath, type };
    }
}
