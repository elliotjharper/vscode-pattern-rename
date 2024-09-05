import { NodeObject } from './actual-types';
import { classFunctionToExportedFunction, isClassFunction } from './class-functions';
import { ensureTopLevelFunctionIsExported, isTopLevelFunction } from './top-level-functions';

export function getExportedNodeOutput(node: NodeObject): string {
    if (isClassFunction(node)) {
        return classFunctionToExportedFunction(node);
    }

    if (isTopLevelFunction(node)) {
        return ensureTopLevelFunctionIsExported(node);
    }

    return node.getFullText();
}
