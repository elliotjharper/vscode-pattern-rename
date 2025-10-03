import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';

// Mock the ViewHost createReplacementItem logic for testing
function createReplacementItem(
    fileName: string,
    matchType: string,
    matchPattern: string,
    replacement: string
): { currentFileName: string; newFileName: string | null } {
    // Import the token replacement function
    const { replaceTokens } = require('../../../src-shared/utils/token-replacement');
    
    const currentFileName = fileName;
    const replacementWithTokens = replaceTokens(replacement);

    let newFileName: string | null = null;
    if (matchPattern && replacement && matchType === 'Plain') {
        const replaced = currentFileName.replace(matchPattern, replacementWithTokens);
        if (replaced !== currentFileName) {
            newFileName = replaced;
        }
    }

    if (matchPattern && replacement && matchType === 'RegEx') {
        const replaced = currentFileName.replace(new RegExp(matchPattern), replacementWithTokens);
        if (replaced !== currentFileName) {
            newFileName = replaced;
        }
    }

    return { currentFileName, newFileName };
}

suite('Integration Test Suite - Token Replacement', () => {
    test('Should replace file name with date tokens in Plain mode', () => {
        const now = new Date();
        const expectedDay = String(now.getDate()).padStart(2, '0');
        const expectedMonth = String(now.getMonth() + 1).padStart(2, '0');
        const expectedYear = now.getFullYear().toString();
        
        const result = createReplacementItem(
            'test.txt',
            'Plain',
            'test',
            'backup-$DD-$MM-$YYYY'
        );
        
        assert.strictEqual(result.newFileName, `backup-${expectedDay}-${expectedMonth}-${expectedYear}.txt`);
    });

    test('Should replace file name with date tokens in RegEx mode', () => {
        const now = new Date();
        const expectedDay = String(now.getDate()).padStart(2, '0');
        const expectedMonth = String(now.getMonth() + 1).padStart(2, '0');
        const expectedYear = now.getFullYear().toString();
        
        const result = createReplacementItem(
            'file-2024.txt',
            'RegEx',
            '\\d{4}',
            '$YYYY-$MM-$DD'
        );
        
        assert.strictEqual(result.newFileName, `file-${expectedYear}-${expectedMonth}-${expectedDay}.txt`);
    });

    test('Should work with multiple files having same pattern', () => {
        const now = new Date();
        const expectedDay = String(now.getDate()).padStart(2, '0');
        
        const files = ['new-1.ts', 'new-2.ts', 'new-3.ts'];
        const results = files.map(fileName => 
            createReplacementItem(fileName, 'Plain', 'new', 'archive-$DD')
        );
        
        results.forEach(result => {
            assert.ok(result.newFileName);
            assert.ok(result.newFileName!.startsWith(`archive-${expectedDay}`));
        });
    });

    test('Should not replace when no match pattern found', () => {
        const result = createReplacementItem(
            'test.txt',
            'Plain',
            'notfound',
            'backup-$DD'
        );
        
        assert.strictEqual(result.newFileName, null);
    });
});
