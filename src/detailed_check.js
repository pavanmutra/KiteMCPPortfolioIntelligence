const fs = require('fs');
const path = require('path');

const SESSION_DATE = new Date().toISOString().split('T')[0];

console.log('\n🔍 DETAILED DATA CONSISTENCY AUDIT\n');

// Read all files
const snapshot = JSON.parse(fs.readFileSync(`${SESSION_DATE}_portfolio_snapshot.json`, 'utf8'));
const gttPlacement = JSON.parse(fs.readFileSync(`${SESSION_DATE}_gtt_placement.json`, 'utf8'));
const gttAudit = JSON.parse(fs.readFileSync(`${SESSION_DATE}_gtt_audit.json`, 'utf8'));
const valueScreen = JSON.parse(fs.readFileSync(`${SESSION_DATE}_value_screen.json`, 'utf8'));
const buyback = JSON.parse(fs.readFileSync(`${SESSION_DATE}_buyback_opportunities.json`, 'utf8'));

console.log('1️⃣  PORTFOLIO VALUE COMPARISON:');
console.log(`   portfolio_snapshot.json total_market_value: ₹${(snapshot.summary?.total_market_value || snapshot.total_market_value || snapshot.total_value)?.toLocaleString('en-IN')}`);
console.log(`   gtt_placement.json total_portfolio_value: ₹${gttPlacement.portfolio_context?.total_portfolio_value?.toLocaleString('en-IN')}`);

const discrepancy = Math.abs((snapshot.summary?.total_market_value || 0) - (gttPlacement.portfolio_context?.total_portfolio_value || 0));
if (discrepancy > 100) {
  console.log(`   ⚠️  DISCREPANCY: ₹${discrepancy.toLocaleString('en-IN')} (${((discrepancy/(snapshot.summary?.total_market_value || 1))*100).toFixed(2)}%)`);
} else {
  console.log('   ✅ Values match (diff < ₹100)');
}

console.log('\n2️⃣  HOLDINGS COUNT:');
console.log(`   portfolio_snapshot.json holdings: ${snapshot.holdings?.length || 0} stocks`);
console.log(`   value_screen.json stocks: ${(valueScreen.stocks || valueScreen.valuations || []).length} stocks`);
console.log(`   gtt_audit.json all stocks: ${(gttAudit.protected_holdings?.length || 0) + (gttAudit.unprotected_holdings?.length || 0)} stocks`);

const snapshotSymbols = (snapshot.holdings || []).map(h => h.symbol).sort();
const valueScreenSymbols = (valueScreen.stocks || []).map(s => s.symbol).sort();
console.log(`   Snapshot symbols: ${snapshotSymbols.join(', ')}`);
console.log(`   Value Screen symbols: ${valueScreenSymbols.join(', ')}`);
if (JSON.stringify(snapshotSymbols) === JSON.stringify(valueScreenSymbols)) {
  console.log('   ✅ Symbol lists match');
} else {
  console.log('   ⚠️  Symbol lists differ');
}

console.log('\n3️⃣  BUYBACK OPPORTUNITIES COUNT:');
console.log(`   Total opportunities: ${buyback.total_opportunities || buyback.buybacks?.length || 'unknown'}`);
console.log(`   Buyback list length: ${buyback.buybacks?.length || 0}`);
if ((buyback.buybacks || []).length > 0) {
  console.log(`   Companies: ${buyback.buybacks.map(b => b.symbol).join(', ')}`);
}

console.log('\n4️⃣  GTT CLASSIFICATION AUDIT:');
const protectedCount = gttAudit.protected_holdings?.length || 0;
const unprotectedCount = gttAudit.unprotected_holdings?.length || 0;
console.log(`   Protected holdings (with stop-loss): ${protectedCount}`);
console.log(`   Unprotected holdings (no GTT): ${unprotectedCount}`);
console.log(`   GTT Placements (active):  ${gttPlacement.placements?.length || 0}`);
console.log(`   GTT Skipped: ${gttPlacement.skipped_gtts?.length || 0}`);

// Check for "BUY_GTT_ONLY" vs "UNPROTECTED" issue
if (gttAudit.unprotected_holdings) {
  console.log('\n   Unprotected holdings details:');
  gttAudit.unprotected_holdings.forEach(h => {
    console.log(`   - ${h.symbol}: ${h.reason || 'no reason stated'}`);
  });
}

console.log('\n5️⃣  KITE IDs VERIFICATION:');
const gttIds = gttPlacement.summary?.kite_gtt_ids || [];
console.log(`   GTT Kite IDs in gtt_placement: [${gttIds.join(', ')}]`);
const placementIds = (gttPlacement.placements || []).map(p => p.kite_gtt_id).sort();
console.log(`   Extracted from placements: [${placementIds.join(', ')}]`);
if (JSON.stringify(gttIds.sort()) === JSON.stringify(placementIds)) {
  console.log('   ✅ IDs match');
} else {
  console.log('   ⚠️  IDs differ');
}

console.log('\n6️⃣  MARKET DATA CONSISTENCY:');
const marketDataFields = ['sensex', 'nifty50', 'vix', 'fii_flow'];
for (const field of marketDataFields) {
  const val = snapshot.market_data?.[field] || 'missing';
  console.log(`   ${field}: ${val}`);
}

console.log('\n════════════════════════════════════════════════════\n');
