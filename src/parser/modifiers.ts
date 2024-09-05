import { SyntaxKind } from 'typescript';
import { NodeObject } from './actual-types';

export function includesAsyncModifier(node: NodeObject): boolean {
    return (
        node.modifiers?.some((modifier): boolean => {
            return modifier.kind === SyntaxKind.AsyncKeyword;
        }) ?? false
    );
}

export function includesExportModifier(node: NodeObject): boolean {
    return (
        node.modifiers?.some((modifier): boolean => {
            return modifier.kind === SyntaxKind.ExportKeyword;
        }) ?? false
    );
}

export function includesPublicOrPrivateModifier(node: NodeObject): boolean {
    return (
        node.modifiers?.some((modifier): boolean => {
            return (
                modifier.kind === SyntaxKind.PublicKeyword ||
                modifier.kind === SyntaxKind.PrivateKeyword
            );
        }) ?? false
    );
}
