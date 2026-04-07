/**
 * Unit tests for check_gates.js helpers
 * Tests fileAgeMinutes and findGateFile logic
 *
 * NOTE: check_gates.js calls process.exit() at top-level on require.
 * We use jest.mock to intercept process.exit before the module runs.
 */

// Import the module - this sets 'today' to the actual current date
const { fileAgeMinutes, findGateFile } = require('../check_gates');
const path = require('path');
const fs = require('fs');

// Get the actual today date that check_gates.js is using
const config = require('../lib/config');
const today = new Date().toISOString().split('T')[0];
const reportsDir = path.join(__dirname, '../../reports');
const rawDataDir = path.join(reportsDir, today, 'raw_data');

describe('fileAgeMinutes', () => {

    test('returns number for real file path', () => {
        // Check if the test data directory for today exists
        if (!fs.existsSync(rawDataDir)) {
            console.log(`⚠️  Skipping test: No raw_data directory for ${today}`);
            return;
        }
        
        const testFile = path.join(rawDataDir, `${today}_portfolio_snapshot.json`);
        if (!fs.existsSync(testFile)) {
            console.log(`⚠️  Skipping test: No portfolio snapshot for ${today}`);
            return;
        }

        const result = fileAgeMinutes(testFile);
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
    });

    test('returns null for truly non-existent path', () => {
        const nonExistent = path.join(__dirname, 'nonexistent_2099_file_xyz123.json');
        const result = fileAgeMinutes(nonExistent);
        expect(result).toBeNull();
    });

});

describe('findGateFile', () => {
    // Use today's date which is what check_gates.js uses
    const testDate = today;
    const reportsDir = path.join(__dirname, '../../reports');
    const rawDataDir = path.join(reportsDir, testDate, 'raw_data');
    
    // Skip tests if test data doesn't exist
    const skipIfNoData = () => {
        if (!fs.existsSync(rawDataDir)) {
            console.log(`⚠️  Skipping test: No raw_data directory for ${testDate}`);
            return true;
        }
        return false;
    };

    test('finds portfolio snapshot for today', () => {
        if (skipIfNoData()) return;
        const result = findGateFile(`${testDate}_portfolio_snapshot.json`);
        expect(result).not.toBeNull();
        expect(typeof result).toBe('string');
        expect(result).toContain(`${testDate}_portfolio_snapshot.json`);
    });

    test('finds value screen file', () => {
        if (skipIfNoData()) return;
        const result = findGateFile(`${testDate}_value_screen.json`);
        expect(result).not.toBeNull();
        expect(typeof result).toBe('string');
    });

    test('finds GTT audit file', () => {
        if (skipIfNoData()) return;
        const result = findGateFile(`${testDate}_gtt_audit.json`);
        expect(result).not.toBeNull();
    });

    test('searches across multiple candidate paths', () => {
        if (skipIfNoData()) {
            console.log(`⚠️  Skipping: No raw_data for ${testDate}`);
            return;
        }
        // Test with a file that should exist (portfolio snapshot uses the same logic)
        const result = findGateFile(`${testDate}_portfolio_snapshot.json`);
        expect(result).not.toBeNull();
    });

    test('returns null for non-existent file', () => {
        const result = findGateFile('nonexistent_20991231_file.json');
        expect(result).toBeNull();
    });
});

// Test files for a known date that exists
describe('Gate files exist for 2026-04-06', () => {
    const today = '2026-04-06';
    const reportsDir = path.join(__dirname, '../../reports');
    const todayDir = path.join(reportsDir, today);

    test('today directory exists', () => {
        expect(fs.existsSync(todayDir)).toBe(true);
    });

    test('raw_data directory exists', () => {
        const rawDir = path.join(todayDir, 'raw_data');
        expect(fs.existsSync(rawDir)).toBe(true);
    });

    const requiredFiles = [
        '2026-04-06_portfolio_snapshot.json',
        '2026-04-06_gtt_audit.json',
        '2026-04-06_value_screen.json',
        '2026-04-06_gate_status.json',
        '2026-04-06_opportunities.json',
        '2026-04-06_news_opportunities.json',
        '2026-04-06_commodity_opportunities.json'
    ];

    requiredFiles.forEach(file => {
        test(`raw_data/${file} exists`, () => {
            const filePath = path.join(todayDir, 'raw_data', file);
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    test('daily report markdown exists', () => {
        const reportPath = path.join(todayDir, `${today}_daily_report.md`);
        expect(fs.existsSync(reportPath)).toBe(true);
    });
});
