import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { findDeepestMatchingNodeObject } from './node-matching';
import { SourceFile } from './actual-types';

// Proof of concept code... no longer needed...

function runParseTest() {
    const targetFilePath = './src/parser/test-source.ts';
    const targetFileText = readFileSync(targetFilePath);
    const compiledSourceFile = ts.createSourceFile(
        'name-does-not-matter.ts',
        targetFileText.toString(),
        ts.ScriptTarget.ESNext,
        true
    );

    const selectionStartPosition = 95;
    const matchingNode = findDeepestMatchingNodeObject(
        compiledSourceFile as SourceFile,
        selectionStartPosition
    );

    console.log('blah');
}

runParseTest();
