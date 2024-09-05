import { FunctionDeclaration, isClassElement, isFunctionDeclaration } from 'typescript';
import { NodeObject } from './actual-types';
import { includesExportModifier } from './modifiers';

export function isTopLevelFunction(node: NodeObject): node is FunctionDeclaration {
    return isFunctionDeclaration(node) && !isClassElement(node);
}

export function ensureTopLevelFunctionIsExported(node: FunctionDeclaration): string {
    if (!includesExportModifier(node)) {
        return `export ${node.getFullText().trimStart()}`;
    }

    return node.getFullText();
}
