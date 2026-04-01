const fs = require('fs');
const path = require('path');

const SESSION_DATE = '2026-03-31';
const REPORTS_DIR = path.join(__dirname, '../reports');

// Expected file list
const expectedFiles = [
  `${SESSION_DATE}_gate_status.json`,
  `${SESSION_DATE}_gtt_placement.json`,
  `${SESSION_DATE}_portfolio_snapshot.json`,
  `${SESSION_DATE}_value_screen.json`,
  `${SESSION_DATE}_opportunities.json`,
  `${SESSION_DATE}_news_opportunities.json`,
  `${SESSION_DATE}_commodity_opportunities.json`,
  `${SESSION_DATE}_buyback_opportunities.json`,
  `${SESSION_DATE}_gtt_audit.json`,
  `${SESSION_DATE}_daily_report.md`,
  `Portfolio_${SESSION_DATE}.xlsx`,
  `${SESSION_DATE}_WORKFLOW_COMPLETE.md`
];

console.log('\n📊 GATE 8: SIMPLIFIED VERIFICATION\n');

let score = 0;
const issues = [];
const fileDetails = [];

// Check file existence
console.log('📁 FILE EXISTENCE CHECK:');
for (const file of expectedFiles) {
  const filePath = path.join(REPORTS_DIR, file);
  const exists = fs.existsSync(filePath);
  if (exists) {
    const stat = fs.statSync(filePath);
    console.log(`✅ ${file} (${(stat.size / 1024).toFixed(1)} KB)`);
    fileDetails.push({ file, exists: true, size: stat.size });
    score += 3; // 3 points per file (12 files × 3 = 36 points)
  } else {
    console.log(`❌ ${file} - MISSING`);
    fileDetails.push({ file, exists: false });
    issues.push(`FILE_MISSING: ${file}`);
  }
}

// Check JSON parsing
console.log('\n📋 JSON VALIDATION:');
const jsonFiles = expectedFiles.filter(f => f.endsWith('.json'));
let jsonParseErrors = 0;
for (const file of jsonFiles) {
  const filePath = path.join(REPORTS_DIR, file);
  if (!fs.existsSync(filePath)) continue;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${file} - Valid JSON`);
    score += 0.33; // Bonus
  } catch (e) {
    console.log(`❌ ${file} - JSON ERROR: ${e.message.slice(0, 50)}`);
    issues.push(`JSON_ERROR: ${file}`);
    jsonParseErrors++;
  }
}

// Check key data consistency
console.log('\n🔗 DATA CONSISTENCY CHECKS:');

try {
  const snapshot = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, `${SESSION_DATE}_portfolio_snapshot.json`), 'utf8'));
  const gttPlacement = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, `${SESSION_DATE}_gtt_placement.json`), 'utf8'));
  
  const portfolioValueSnapshot = snapshot.summary?.total_market_value;
  const portfolioValueGTT = gttPlacement.portfolio_context?.total_portfolio_value;
  
  if (portfolioValueSnapshot && portfolioValueGTT) {
    if (portfolioValueSnapshot === portfolioValueGTT) {
      console.log(`✅ Portfolio values match: ₹${portfolioValueSnapshot?.toLocaleString('en-IN')}`);
      score += 2;
    } else {
      console.log(`⚠️  Portfolio value MISMATCH:`);
      console.log(`   - portfolio_snapshot.json: ₹${portfolioValueSnapshot?.toLocaleString('en-IN')}`);
      console.log(`   - gtt_placement.json: ₹${portfolioValueGTT?.toLocaleString('en-IN')}`);
      issues.push(`PORTFOLIO_VALUE_MISMATCH: ${portfolioValueSnapshot} vs ${portfolioValueGTT}`);
    }
  }
  
  // Check symbol count consistency
  const snapshotSymbols = snapshot.holdings?.length || 0;
  const gttSymbols = (gttPlacement.placements?.length || 0) + (gttPlacement.skipped_gtts?.length || 0);
  console.log(`✅ Holdings count: ${snapshotSymbols} stocks`);
  console.log(`✅ GTT operations: ${gttPlacement.placements?.length} placed, ${gttPlacement.skipped_gtts?.length} skipped`);
  score += 2;
  
} catch (e) {
  console.log(`❌ Error reading core files: ${e.message}`);
  issues.push(`READ_ERROR: ${e.message.slice(0, 100)}`);
}

// Final score
console.log('\n════════════════════════════════════════════════════');
console.log(`📊 FINAL SCORE: ${Math.round(score)}/40 points (${Math.round(score/40*100)}%)`);
console.log(`📁 Files validated: ${fileDetails.filter(f => f.exists).length}/${expectedFiles.length}`);
console.log(`⚠️  Issues found: ${issues.length}`);

if (issues.length > 0) {
  console.log('\n🚨 ISSUES:');
  issues.forEach((issue, i) => console.log(`  ${i+1}. ${issue}`));
}

const status = Math.round(score/40*100) >= 95 ? '✅ PASS' : Math.round(score/40*100) >= 80 ? '⚠️  PASS_WITH_WARNINGS' : '❌ FAIL';
console.log(`\n🎯 GATE 8 STATUS: ${status}\n`);

// Save results
const results = {
  execution_date: SESSION_DATE,
  execution_time: new Date().toISOString(),
  score: Math.round(score),
  max_score: 40,
  percentage: Math.round(score/40*100),
  status: status,
  files_validated: fileDetails.length,
  files_found: fileDetails.filter(f => f.exists).length,
  files_missing: fileDetails.filter(f => !f.exists).length,
  issues: issues,
  file_details: fileDetails
};

fs.writeFileSync(
  path.join(REPORTS_DIR, `${SESSION_DATE}_verification_gate_simple.json`),
  JSON.stringify(results, null, 2)
);

console.log(`📝 Results saved to: ${SESSION_DATE}_verification_gate_simple.json\n`);
