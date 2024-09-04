import * as ts from 'typescript';
import { NodeObject, SourceFile } from './actual-types';

export function nodeSurroundsPosition(nodeObject: NodeObject, position: number): boolean {
    return nodeObject.pos <= position && nodeObject.end >= position;
}

export function nodeIsAfterPosition(nodeObject: NodeObject, position: number): boolean {
    return nodeObject.pos > position;
}

export function findDeepestMatchingNodeObject(
    sourceFile: SourceFile,
    selectionStart: number
): NodeObject {
    let lastMatch: NodeObject | null = null;

    const namedDeclarations = Array.from(sourceFile.getNamedDeclarations().entries());
    for (const declaration of namedDeclarations) {
        //const nodeName = declaration[0];
        const nodeObject = declaration[1][0];

        if (nodeSurroundsPosition(nodeObject, selectionStart)) {
            lastMatch = nodeObject;
        }

        if (nodeIsAfterPosition(nodeObject, selectionStart)) {
            break;
        }
    }

    if (!lastMatch) {
        throw new Error('Did not find a declaration that wrapped the selection start position');
    }

    return lastMatch;
}

export function findNodeInSourceAtPosition(sourceFileText: string, position: number): NodeObject {
    const compiledSourceFile = ts.createSourceFile(
        'name-does-not-matter.ts',
        sourceFileText,
        ts.ScriptTarget.ESNext,
        true
    );

    const matchingNode = findDeepestMatchingNodeObject(compiledSourceFile as SourceFile, position);

    return matchingNode;
}
