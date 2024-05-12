import acorn = require('acorn');

export type ASTImportDependencyNode = acorn.ImportDeclaration | acorn.VariableDeclaration