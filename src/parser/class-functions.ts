import { isClassElement, isFunctionLike, SignatureDeclaration } from 'typescript';
import { NodeObject } from './actual-types';
import { includesAsyncModifier } from './modifiers';

export function isClassFunction(node: NodeObject): boolean {
    return isFunctionLike(node) && isClassElement(node);
}

function nameStartPosition(node: NodeObject): number {
    const nodeStartInFile = node.pos;
    const nameStartInFile = node.name?.pos;
    if (nameStartInFile === undefined) {
        throw new Error('nameStartInFile is undefined');
    }
    const nameStartWithinNodeText = nameStartInFile - nodeStartInFile;
    return nameStartWithinNodeText;
}

export function classFunctionToExportedFunction(node: NodeObject): string {
    let nodeText = node.getFullText();

    // dodge all modifiers like public/private
    nodeText = nodeText.substring(nameStartPosition(node));

    // turn into a function declaration
    nodeText = `function ${nodeText}`;

    // re apply async if it was dodged
    if (includesAsyncModifier(node)) {
        nodeText = `async ${nodeText}`;
    }

    nodeText = `export ${nodeText}`;
    return nodeText;
}
