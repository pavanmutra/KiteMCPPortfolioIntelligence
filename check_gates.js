#!/usr/bin/env node
/**
 * check_gates.js — Pre-Flight Gate Status Checker
 * Run this before placing any order to verify all daily workflow gates passed.
 *
 * Usage: node check_gates.js   OR   npm run check
 */

const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const reportsDir = path.join(__dirname, 'reports');

const GATES = [
  {
    gate: 'GATE 0',
    label: 'Opportunity Scan',
    file: path.join(reportsDir, `${today}_opportunities.json`),
    required: false,   // warn but don't block
    tip: 'Ask AI: "Run opportunity-scanner for today"'
  },
  {
    gate: 'GATE 0.3',
    label: 'Commodity Scan',
    file: path.join(reportsDir, `${today}_commodity_opportunities.json`),
    required: false,
    tip: 'Ask AI: "Run commodity-scanner for today"'
  },
  {
    gate: 'GATE 0.5',
    label: 'News Scan',
    file: path.join(reportsDir, `${today}_news_opportunities.json`),
    required: false,
    tip: 'Ask AI: "Run news-scanner for today"'
  },
  {
    gate: 'GATE 1',
    label: 'Portfolio Scan',
    file: path.join(reportsDir, `${today}_portfolio_snapshot.json`),
    required: true,
    tip: 'Ask AI: "Run portfolio-scanner — fetch holdings from Kite"'
  },
  {
    gate: 'GATE 2',
    label: 'Intrinsic Value Screen',
    file: path.join(reportsDir, `${today}_value_screen.json`),
    required: true,
    tip: 'Ask AI: "Run intrinsic-value-scanner on today\'s holdings"'
  },
  {
    gate: 'GATE 3',
    label: 'GTT Audit',
    file: path.join(reportsDir, `${today}_gtt_audit.json`),
    required: true,
    tip: 'Ask AI: "Run gtt-manager audit for today"'
  },
  {
    gate: 'GATE 4',
    label: 'Daily Report (.docx)',
    file: path.join(reportsDir, `${today}_daily_report.docx`),
    required: true,
    tip: 'Run: npm run report'
  },
  {
    gate: 'GATE 4.5',
    label: 'Excel Export (.xlsx)',
    file: path.join(reportsDir, `Portfolio_${today}.xlsx`),
    required: true,
    tip: 'Run: npm run export'
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE   = '\x1b[34m';
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';

function fileAgeMinutes(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return Math.round((Date.now() - stat.mtimeMs) / 60000);
  } catch { return null; }
}

// ─── main ────────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${BLUE}═══════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}  KiteMCP Pre-Flight Gate Check — ${today}${RESET}`);
console.log(`${BOLD}${BLUE}═══════════════════════════════════════════════════${RESET}\n`);

let hardBlock = false;
let warnings  = 0;

for (const g of GATES) {
  const exists = fs.existsSync(g.file);
  const age    = exists ? fileAgeMinutes(g.file) : null;
  const stale  = age !== null && age > 240; // older than 4 hours

  if (exists && !stale) {
    console.log(`${GREEN}✅ ${g.gate}${RESET}  ${g.label}  ${BLUE}(${age}m ago)${RESET}`);
  } else if (exists && stale) {
    console.log(`${YELLOW}⚠️  ${g.gate}${RESET}  ${g.label}  ${YELLOW}(STALE — ${age}m ago)${RESET}`);
    console.log(`       Tip: ${g.tip}`);
    warnings++;
  } else {
    if (g.required) {
      console.log(`${RED}❌ ${g.gate}${RESET}  ${g.label}  ${RED}(MISSING — HARD BLOCK)${RESET}`);
      console.log(`       Tip: ${g.tip}`);
      hardBlock = true;
    } else {
      console.log(`${YELLOW}⚠️  ${g.gate}${RESET}  ${g.label}  ${YELLOW}(missing — optional)${RESET}`);
      console.log(`       Tip: ${g.tip}`);
      warnings++;
    }
  }
}

// ─── verdict ─────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${BLUE}═══════════════════════════════════════════════════${RESET}`);

if (hardBlock) {
  console.log(`\n${BOLD}${RED}🚫 TRADING BLOCKED — Complete missing required gates first.${RESET}`);
  console.log(`${RED}   Per Rule P-002: No orders without completed daily report.${RESET}\n`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`\n${BOLD}${YELLOW}⚠️  ${warnings} optional gates missing — proceed with caution.${RESET}`);
  console.log(`${YELLOW}   You may trade, but opportunity/news data may be incomplete.${RESET}\n`);
  process.exit(0);
} else {
  console.log(`\n${BOLD}${GREEN}✅ ALL GATES PASSED — Safe to proceed with order execution.${RESET}\n`);
  process.exit(0);
}
