import * as ts from 'typescript';
import { NodeObject, SourceFile } from './actual-types';

export function nodeSurroundsPosition(nodeObject: NodeObject, position: number): boolean {
    return nodeObject.pos <= position && nodeObject.end >= position;
}

export function findDeepestMatchingNodeObject(
    sourceFile: SourceFile,
    selectionStart: number
): NodeObject {
    let lastMatch: NodeObject | null = null;

    for (const declaration of sourceFile.getNamedDeclarations().entries()) {
        //const nodeName = declaration[0];
        const nodeObject = declaration[1][0];

        if (nodeSurroundsPosition(nodeObject, selectionStart)) {
            lastMatch = nodeObject;
        } else if (lastMatch !== null) {
            // if node does not surround position but we already found a match we must now have moved past the target site so end.
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
