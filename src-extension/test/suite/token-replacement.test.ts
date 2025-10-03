import * as assert from 'assert';
import { replaceTokens } from '../../../src-shared/utils/token-replacement';

suite('Token Replacement Test Suite', () => {
    test('Should replace $DD with day', () => {
        const now = new Date();
        const expectedDay = String(now.getDate()).padStart(2, '0');
        const result = replaceTokens('file-$DD.txt');
        assert.strictEqual(result, `file-${expectedDay}.txt`);
    });

    test('Should replace $MM with month', () => {
        const now = new Date();
        const expectedMonth = String(now.getMonth() + 1).padStart(2, '0');
        const result = replaceTokens('file-$MM.txt');
        assert.strictEqual(result, `file-${expectedMonth}.txt`);
    });

    test('Should replace $YYYY with full year', () => {
        const now = new Date();
        const expectedYear = now.getFullYear().toString();
        const result = replaceTokens('file-$YYYY.txt');
        assert.strictEqual(result, `file-${expectedYear}.txt`);
    });

    test('Should replace $YY with two-digit year', () => {
        const now = new Date();
        const expectedYear = now.getFullYear().toString().slice(-2);
        const result = replaceTokens('file-$YY.txt');
        assert.strictEqual(result, `file-${expectedYear}.txt`);
    });

    test('Should replace multiple tokens', () => {
        const now = new Date();
        const expectedDay = String(now.getDate()).padStart(2, '0');
        const expectedMonth = String(now.getMonth() + 1).padStart(2, '0');
        const expectedYear = now.getFullYear().toString();
        
        const result = replaceTokens('backup-$DD-$MM-$YYYY.txt');
        assert.strictEqual(result, `backup-${expectedDay}-${expectedMonth}-${expectedYear}.txt`);
    });

    test('Should replace time tokens', () => {
        const now = new Date();
        const expectedHour = String(now.getHours()).padStart(2, '0');
        const expectedMin = String(now.getMinutes()).padStart(2, '0');
        const expectedSec = String(now.getSeconds()).padStart(2, '0');
        
        const result = replaceTokens('log-$HH-$MIN-$SS.txt');
        assert.strictEqual(result, `log-${expectedHour}-${expectedMin}-${expectedSec}.txt`);
    });

    test('Should not replace non-token strings', () => {
        const result = replaceTokens('regular-file.txt');
        assert.strictEqual(result, 'regular-file.txt');
    });

    test('Should handle empty string', () => {
        const result = replaceTokens('');
        assert.strictEqual(result, '');
    });

    test('Should replace all occurrences of the same token', () => {
        const now = new Date();
        const expectedYear = now.getFullYear().toString();
        const result = replaceTokens('$YYYY-data-$YYYY.txt');
        assert.strictEqual(result, `${expectedYear}-data-${expectedYear}.txt`);
    });
});
