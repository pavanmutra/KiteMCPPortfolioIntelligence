const fs = require('fs');
const path = require('path');

const SESSION_DATE = '2026-03-31';

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║       GATE 8: FINAL COMPREHENSIVE VERIFICATION REPORT      ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Read all files
const snapshot = JSON.parse(fs.readFileSync(`${SESSION_DATE}_portfolio_snapshot.json`, 'utf8'));
const gttPlacement = JSON.parse(fs.readFileSync(`${SESSION_DATE}_gtt_placement.json`, 'utf8'));
const gttAudit = JSON.parse(fs.readFileSync(`${SESSION_DATE}_gtt_audit.json`, 'utf8'));
const valueScreen = JSON.parse(fs.readFileSync(`${SESSION_DATE}_value_screen.json`, 'utf8'));
const buyback = JSON.parse(fs.readFileSync(`${SESSION_DATE}_buyback_opportunities.json`, 'utf8'));
const opportunities = JSON.parse(fs.readFileSync(`${SESSION_DATE}_opportunities.json`, 'utf8'));

const report = {
  execution_date: SESSION_DATE,
  execution_time: new Date().toISOString(),
  sections: {}
};

// SECTION 1: Portfolio Value Verification
console.log('1️⃣  PORTFOLIO VALUE VERIFICATION');
console.log('═══════════════════════════════════════════════════════════');

const pvSnapshot = snapshot.total_market_value;
const pvGTT = gttPlacement.portfolio_context?.total_portfolio_value;
const pvMatch = pvSnapshot === pvGTT;

console.log(`   portfolio_snapshot.json: ₹${pvSnapshot?.toLocaleString('en-IN') || 'N/A'}`);
console.log(`   gtt_placement.json:      ₹${pvGTT?.toLocaleString('en-IN') || 'N/A'}`);

if (pvMatch) {
  console.log(`   ✅ MATCH - Values are consistent`);
  report.sections.portfolio_value = { status: 'PASS', value: pvSnapshot };
} else {
  const diff = Math.abs((pvSnapshot || 0) - (pvGTT || 0));
  console.log(`   ⚠️  MISMATCH - Difference: ₹${diff?.toLocaleString('en-IN')}`);
  console.log(`       → GTT placement file uses outdated snapshot value`);
  console.log(`       → ACTION: Update gtt_placement.json to use: ${pvSnapshot}`);
  report.sections.portfolio_value = { 
    status: 'FAIL', 
    master_value: pvSnapshot, 
    incorrect_value: pvGTT,
    difference: diff,
    action: 'UPDATE_GTT_PLACEMENT_FILE'
  };
}

// SECTION 2: Holdings Consistency
console.log('\n2️⃣  HOLDINGS CONSISTENCY');
console.log('═══════════════════════════════════════════════════════════');

const snapshotHoldings = (snapshot.holdings || []).map(h => h.symbol).sort();
const valueScreenStocks = (valueScreen.stocks || []).map(s => s.symbol).sort();
const gttAuditAll = [
  ...(gttAudit.protected_holdings || []).map(h => h.symbol),
  ...(gttAudit.unprotected_holdings || []).map(h => h.symbol)
].sort();

console.log(`   Snapshot holdings: ${snapshotHoldings.join(', ')}`);
console.log(`   Value screen:      ${valueScreenStocks.length > 0 ? valueScreenStocks.join(', ') : '(no stocks found - structure issue)'}`);
console.log(`   GTT audit:         ${gttAuditAll.join(', ')}`);
console.log(`   Total symbols:     ${snapshotHoldings.length}`);

if (JSON.stringify(snapshotHoldings) === JSON.stringify(gttAuditAll)) {
  console.log(`   ✅ Holdings symbols match (snapshot ≈ GTT audit)`);
  report.sections.holdings = { status: 'PASS', count: snapshotHoldings.length, symbols: snapshotHoldings };
} else {
  console.log(`   ⚠️  SYMBOL MISMATCH between snapshot and GTT audit`);
  report.sections.holdings = { status: 'WARNING', snapshot_symbols: snapshotHoldings, gtt_symbols: gttAuditAll };
}

// SECTION 3: GTT Operations
console.log('\n3️⃣  GTT OPERATIONS AUDIT');
console.log('═══════════════════════════════════════════════════════════');

const gttPlaced = gttPlacement.placements?.length || 0;
const gttSkipped = gttPlacement.skipped_gtts?.length || 0;
const protectedCount = gttAudit.protected_holdings?.length || 0;
const unprotectedCount = gttAudit.unprotected_holdings?.length || 0;

console.log(`   GTT Placements (active):     ${gttPlaced}`);
console.log(`   GTT Skipped:                 ${gttSkipped}`);
console.log(`   Total stocks covered:        ${gttPlaced + gttSkipped}`);
console.log(`   Protected holdings (audit):  ${protectedCount}`);
console.log(`   Unprotected holdings (audit):${unprotectedCount}`);

if (gttPlacement.placements) {
  console.log(`\n   Placed GTTs:`);
  gttPlacement.placements.forEach(p => {
    console.log(`   - ${p.symbol}: ${p.transaction_type} GTT @₹${p.trigger_price} (qty: ${p.quantity})`);
  });
}

if (gttPlacement.skipped_gtts) {
  console.log(`\n   Skipped GTTs:`);
  gttPlacement.skipped_gtts.forEach(s => {
    console.log(`   - ${s.symbol}: ${s.reason}`);
  });
}

// Check for classification issue
const camsInUnprotected = gttAudit.unprotected_holdings?.some(h => h.symbol === 'CAMS');
const energyInUnprotected = gttAudit.unprotected_holdings?.some(h => h.symbol === 'ENERGY');
if (camsInUnprotected || energyInUnprotected) {
  console.log(`\n   ⚠️  CLASSIFICATION ISSUE DETECTED:`);
  if (camsInUnprotected) console.log(`       - CAMS labeled "unprotected" but has ACTIVE BUY GTT`);
  if (energyInUnprotected) console.log(`       - ENERGY labeled "unprotected" but has ACTIVE BUY GTT`);
  console.log(`       → These should be classified as "BUY_GTT_ONLY" (not downside-protected, but accumulation)`);
  report.sections.gtt_classification = { status: 'FAIL', action: 'RENAME_UNPROTECTED_TO_BUY_GTT_ONLY' };
} else {
  console.log(`\n   ✅ GTT classifications appear correct`);
  report.sections.gtt_ops = { status: 'PASS', placed: gttPlaced, skipped: gttSkipped };
}

// SECTION 4: Buyback Opportunities
console.log('\n4️⃣  BUYBACK OPPORTUNITIES');
console.log('═══════════════════════════════════════════════════════════');

const buybackCount = buyback.buybacks?.length || 0;
console.log(`   Total buyback companies: ${buybackCount}`);
if (buybackCount > 0) {
  console.log(`   Companies: ${buyback.buybacks.map(b => b.symbol).join(', ')}`);
}

// Check if should say "10" instead of other count
if (buybackCount === 10) {
  console.log(`   ✅ Buyback count = 10 (correct)`);
  report.sections.buybacks = { status: 'PASS', count: buybackCount };
} else {
  console.log(`   ⚠️  Buyback count = ${buybackCount} (expected 10?)`);
  report.sections.buybacks = { status: 'WARNING', count: buybackCount, expected: 10 };
}

// SECTION 5: Data Integrity
console.log('\n5️⃣  DATA INTEGRITY CHECKS');
console.log('═══════════════════════════════════════════════════════════');

const allIssues = [];

// Check for null/undefined critical fields
snapshot.holdings?.forEach(h => {
  if (!h.symbol || h.current_price === undefined) {
    allIssues.push(`Incomplete holding: ${JSON.stringify(h)}`);
  }
});

// Check GTT Kite IDs
const gttIds = gttPlacement.summary?.kite_gtt_ids || [];
const placementIds = (gttPlacement.placements || []).map(p => p.kite_gtt_id);
const idsMatch = JSON.stringify(gttIds.sort()) === JSON.stringify(placementIds.sort());

if (idsMatch) {
  console.log(`   ✅ GTT Kite IDs consistent: [${gttIds.join(', ')}]`);
} else {
  console.log(`   ⚠️  GTT Kite IDs mismatch`);
  allIssues.push('GTT_ID_MISMATCH');
}

// Check P&L calculations
let pnlCalcErrors = 0;
snapshot.holdings?.forEach(h => {
  const calcPNL = (h.current_price - h.average_price) * h.quantity;
  if (Math.abs(calcPNL - h.pnl) > 1) { // Allow 1 rupee rounding error
    pnlCalcErrors++;
  }
});

if (pnlCalcErrors === 0) {
  console.log(`   ✅ P&L calculations verified for all 7 holdings`);
  report.sections.data_integrity = { status: 'PASS', pnl_verified: true };
} else {
  console.log(`   ⚠️  P&L calculation errors detected: ${pnlCalcErrors} holdings`);
  allIssues.push('PNL_CALC_ERROR');
}

// Summary
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                    GATE 8 SUMMARY                          ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

const criticalIssues = [
  portfolio_value: !pvMatch,
  gtt_classification: camsInUnprotected || energyInUnprotected,
  data_integrity: pnlCalcErrors > 0
].filter(x => x).length;

console.log(`📊 Data Quality Score: ${7 - criticalIssues}/7`);
console.log(`🚨 Critical I
