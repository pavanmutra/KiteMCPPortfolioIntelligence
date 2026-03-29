#!/usr/bin/env node
/**
 * archive_reports.js — Archive Previous Days' Reports
 *
 * Moves all report files older than today into date-based subdirectories
 * for clean organization:
 *
 *   reports/
 *   ├── 2026-03-29_portfolio_snapshot.json   ← Today (stays here)
 *   ├── 2026-03-29_daily_report.docx         ← Today (stays here)
 *   └── archive/
 *       ├── 2026-03-28/
 *       │   ├── portfolio_snapshot.json
 *       │   ├── daily_report.docx
 *       │   ├── value_screen.json
 *       │   └── ...
 *       ├── 2026-03-27/
 *       │   └── ...
 *       └── undated/
 *           └── miscellaneous-files.md
 *
 * Usage:
 *   node archive_reports.js           # Archive all past reports
 *   node archive_reports.js --dry-run # Preview what would be moved
 *   node archive_reports.js --days 7  # Only archive files older than 7 days
 *   npm run archive                   # Via npm script
 */

const fs   = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, 'reports');
const ARCHIVE_DIR = path.join(REPORTS_DIR, 'archive');
const TODAY       = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const daysIdx = args.indexOf('--days');
const MIN_AGE_DAYS = daysIdx !== -1 ? parseInt(args[daysIdx + 1], 10) : 0; // default: archive everything before today

// Colours
const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', B = '\x1b[34m', X = '\x1b[0m', BOLD = '\x1b[1m', DIM = '\x1b[2m';

console.log(`\n${BOLD}${B}═══════════════════════════════════════════════════${X}`);
console.log(`${BOLD}  KiteMCP Report Archiver${X}`);
console.log(`${BOLD}${B}═══════════════════════════════════════════════════${X}`);
console.log(`${DIM}  Today: ${TODAY}${X}`);
if (DRY_RUN) console.log(`${Y}  🔍 DRY RUN — no files will be moved${X}`);
if (MIN_AGE_DAYS > 0) console.log(`${DIM}  Only archiving files > ${MIN_AGE_DAYS} day(s) old${X}`);
console.log();

// ─── Date extraction patterns ────────────────────────────────────────────────
// Matches: YYYY-MM-DD at the start of filename
const DATE_PREFIX_RE = /^(\d{4}-\d{2}-\d{2})_/;
// Matches: Portfolio_YYYY-MM-DD or Portfolio_YYYY-MM-DD_v2
const PORTFOLIO_DATE_RE = /^Portfolio_(\d{4}-\d{2}-\d{2})/;
// Matches: older format like portfolio-report-YYYY-MM-DD
const LEGACY_DATE_RE = /(\d{4}-\d{2}-\d{2})/;

/**
 * Extract date string from a report filename.
 * Returns null if no date can be determined.
 */
function extractDate(filename) {
    let match;
    match = filename.match(DATE_PREFIX_RE);
    if (match) return match[1];

    match = filename.match(PORTFOLIO_DATE_RE);
    if (match) return match[1];

    match = filename.match(LEGACY_DATE_RE);
    if (match) return match[1];

    return null;
}

/**
 * Clean the date prefix from filename for the archived copy.
 * "2026-03-28_portfolio_snapshot.json" → "portfolio_snapshot.json"
 * "Portfolio_2026-03-28_v2.xlsx" → "Portfolio_v2.xlsx"  (keep as-is for Portfolio files)
 */
function cleanFilename(filename, date) {
    // For date-prefixed files: remove "YYYY-MM-DD_"
    if (filename.startsWith(date + '_')) {
        return filename.slice(date.length + 1);
    }
    // For Portfolio files: keep original name (it's already descriptive)
    return filename;
}

/**
 * Check if a date string is older than today by at least MIN_AGE_DAYS
 */
function isOldEnough(dateStr) {
    const fileDate = new Date(dateStr + 'T00:00:00');
    const todayDate = new Date(TODAY + 'T00:00:00');
    const diffDays = Math.floor((todayDate - fileDate) / (1000 * 60 * 60 * 24));
    return diffDays >= Math.max(1, MIN_AGE_DAYS); // Always at least 1 day old
}

// ─── Main ────────────────────────────────────────────────────────────────────
if (!fs.existsSync(REPORTS_DIR)) {
    console.log(`${R}✗ reports/ directory not found${X}`);
    process.exit(1);
}

// Get all files in reports/ (not subdirectories)
const allFiles = fs.readdirSync(REPORTS_DIR, { withFileTypes: true })
    .filter(d => d.isFile())
    .filter(d => !d.name.startsWith('~$'))  // Skip Excel temp files
    .map(d => d.name);

// Group files by date
const byDate = {};
const undated = [];

for (const file of allFiles) {
    const date = extractDate(file);
    if (date && date !== TODAY && isOldEnough(date)) {
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push(file);
    } else if (!date) {
        // Non-dated files left in reports/ — leave them alone
        // (they might be config files or templates)
    }
    // Files matching TODAY are skipped — they stay in reports/
}

const dates = Object.keys(byDate).sort();
if (dates.length === 0) {
    console.log(`${G}✅ Nothing to archive — reports/ is clean.${X}\n`);
    process.exit(0);
}

// Also handle files already in archive/ that aren't organized into date folders
const archiveLoose = [];
if (fs.existsSync(ARCHIVE_DIR)) {
    const looseFiles = fs.readdirSync(ARCHIVE_DIR, { withFileTypes: true })
        .filter(d => d.isFile())
        .filter(d => !d.name.startsWith('~$'))
        .map(d => d.name);

    for (const file of looseFiles) {
        const date = extractDate(file);
        if (date) {
            archiveLoose.push({ file, date });
        } else {
            archiveLoose.push({ file, date: 'undated' });
        }
    }
}

// Create archive directory
if (!DRY_RUN) {
    if (!fs.existsSync(ARCHIVE_DIR)) {
        fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    }
}

let movedCount = 0;

// Move reports/ files into archive/YYYY-MM-DD/ folders
for (const date of dates) {
    const dateDir = path.join(ARCHIVE_DIR, date);
    const files = byDate[date];

    console.log(`${B}📁 ${date}/${X}  (${files.length} files)`);

    if (!DRY_RUN && !fs.existsSync(dateDir)) {
        fs.mkdirSync(dateDir, { recursive: true });
    }

    for (const file of files) {
        const src = path.join(REPORTS_DIR, file);
        const cleanName = cleanFilename(file, date);
        const dst = path.join(dateDir, cleanName);

        if (DRY_RUN) {
            console.log(`  ${DIM}→ ${file}  ⟶  archive/${date}/${cleanName}${X}`);
        } else {
            // If destination exists, add a suffix
            let finalDst = dst;
            if (fs.existsSync(dst)) {
                const ext = path.extname(cleanName);
                const base = path.basename(cleanName, ext);
                finalDst = path.join(dateDir, `${base}_dup${ext}`);
            }
            fs.renameSync(src, finalDst);
            console.log(`  ${G}✓${X} ${file}  →  archive/${date}/${path.basename(finalDst)}`);
        }
        movedCount++;
    }
}

// Organize loose files in archive/ into date subdirectories
if (archiveLoose.length > 0) {
    console.log(`\n${B}📁 Organizing ${archiveLoose.length} loose files in archive/${X}`);

    for (const { file, date } of archiveLoose) {
        const targetDir = path.join(ARCHIVE_DIR, date);
        const src = path.join(ARCHIVE_DIR, file);
        const cleanName = date !== 'undated' ? cleanFilename(file, date) : file;
        const dst = path.join(targetDir, cleanName);

        if (DRY_RUN) {
            console.log(`  ${DIM}→ archive/${file}  ⟶  archive/${date}/${cleanName}${X}`);
        } else {
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            let finalDst = dst;
            if (fs.existsSync(dst)) {
                const ext = path.extname(cleanName);
                const base = path.basename(cleanName, ext);
                finalDst = path.join(targetDir, `${base}_dup${ext}`);
            }
            fs.renameSync(src, finalDst);
            console.log(`  ${G}✓${X} ${file}  →  archive/${date}/${path.basename(finalDst)}`);
        }
        movedCount++;
    }
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${B}═══════════════════════════════════════════════════${X}`);
if (DRY_RUN) {
    console.log(`${Y}  Would move ${movedCount} files into ${dates.length} date folders.${X}`);
    console.log(`${Y}  Run without --dry-run to execute.${X}`);
} else {
    console.log(`${G}  ✅ Archived ${movedCount} files into ${dates.length} date folders.${X}`);
    console.log(`${DIM}  Today's reports remain in reports/ for active use.${X}`);
}

// Show final tree
console.log(`\n${DIM}  reports/${X}`);
const remainingFiles = fs.readdirSync(REPORTS_DIR, { withFileTypes: true });
for (const entry of remainingFiles) {
    if (entry.isDirectory()) {
        if (entry.name === 'archive') {
            const archiveDirs = fs.readdirSync(path.join(REPORTS_DIR, 'archive'), { withFileTypes: true })
                .filter(d => d.isDirectory())
                .map(d => d.name)
                .sort()
                .reverse();
            console.log(`${DIM}  └── archive/  (${archiveDirs.length} days)${X}`);
            for (let i = 0; i < Math.min(5, archiveDirs.length); i++) {
                const dateDir = archiveDirs[i];
                const fileCount = fs.readdirSync(path.join(REPORTS_DIR, 'archive', dateDir)).length;
                const prefix = i === Math.min(5, archiveDirs.length) - 1 && archiveDirs.length <= 5 ? '└──' : '├──';
                console.log(`${DIM}      ${prefix} ${dateDir}/  (${fileCount} files)${X}`);
            }
            if (archiveDirs.length > 5) {
                console.log(`${DIM}      └── ... and ${archiveDirs.length - 5} more${X}`);
            }
        }
    } else {
        console.log(`${DIM}  ├── ${entry.name}${X}`);
    }
}

console.log();
