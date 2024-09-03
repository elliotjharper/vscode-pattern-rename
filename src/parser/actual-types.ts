import * as ts from 'typescript';

// The typings for the typescript compiler API do not cover everything available at runtime.
// I believe this is because the typescript compiler API is listed as "not yet a stable API".
// This file contains types to strongly type extra parts that I am using.

export type NodeObject = ts.Node & {
    name: ts.Identifier;
};

export type SourceFile = ts.SourceFile & {
    getNamedDeclarations(): Map<string, NodeObject[]>;
};
