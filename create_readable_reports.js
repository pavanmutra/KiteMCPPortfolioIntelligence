#!/usr/bin/env node
/**
 * create_readable_reports.js
 * Converts JSON reports to readable markdown format
 */

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, 'reports');
const TODAY = new Date().toISOString().split('T')[0];

const G = '\x1b[32m', R = '\x1b[31m', B = '\x1b[34m', X = '\x1b[0m', BOLD = '\x1b[1m';

function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatPercent(val) {
  const num = Number(val);
  const sign = num >= 0 ? '+' : '';
  return sign + num.toFixed(2) + '%';
}

function formatPortfolioSnapshot(json) {
  let md = `# Portfolio Snapshot — ${json.date}\n\n`;
  md += `**Market Status:** ${json.market_status}\n\n`;
  md += `**Total Value:** ${formatCurrency(json.total_market_value)}\n`;
  md += `**Total P&L:** ${formatCurrency(json.total_pnl)} (${formatPercent(json.total_pnl_percent)})\n`;
  md += `**Available Margin:** ${formatCurrency(json.available_margin)}\n\n`;
  
  md += `## Holdings\n\n`;
  md += `| Symbol | Qty | Avg Price | CMP | P&L | P&L % | Status |\n`;
  md += `|--------|-----|-----------|-----|-----|-------|--------|\n`;
  
  for (const h of json.holdings) {
    md += `| ${h.symbol} | ${h.quantity} | ${formatCurrency(h.average_price)} | ${formatCurrency(h.current_price)} | ${formatCurrency(h.pnl)} | ${formatPercent(h.pnl_percent)} | ${h.status} |\n`;
  }
  
  return md;
}

function formatValueScreen(json) {
  let md = `# Intrinsic Value Screen — ${json.date}\n\n`;
  
  md += `## Deep Discount Alerts (MoS > 25%)\n\n`;
  const deep = json.deep_discount_alerts || [];
  if (deep.length > 0) {
    for (const d of deep) {
      md += `### ${d.symbol}\n`;
      md += `- **Current Price:** ${formatCurrency(d.current_price)}\n`;
      md += `- **Intrinsic Value:** ${formatCurrency(d.intrinsic_value)}\n`;
      md += `- **Margin of Safety:** ${d.discount_percent.toFixed(1)}%\n`;
      md += `- **Priority:** ${d.priority}\n`;
      md += `- **Note:** ${d.note}\n\n`;
    }
  } else {
    md += `_None_\n\n`;
  }
  
  md += `## Overvalued Holdings (CMP > IV)\n\n`;
  const over = json.overvalued_alerts || [];
  if (over.length > 0) {
    for (const o of over) {
      md += `### ${o.symbol}\n`;
      md += `- **Current Price:** ${formatCurrency(o.current_price)}\n`;
      md += `- **Intrinsic Value:** ${formatCurrency(o.intrinsic_value)}\n`;
      md += `- **Premium:** ${o.premium_percent.toFixed(1)}%\n`;
      md += `- **Action:** ${o.action}\n\n`;
    }
  } else {
    md += `_None_\n\n`;
  }
  
  md += `## All Valuations\n\n`;
  md += `| Symbol | CMP | Graham | DCF | Fair (PE) | IV | MoS | Status |\n`;
  md += `|--------|-----|--------|-----|------------|----|-----|--------|\n`;
  
  for (const v of json.valuations) {
    const g = v.graham_number ? formatCurrency(v.graham_number) : '-';
    const d = v.dcf_estimate ? formatCurrency(v.dcf_estimate) : '-';
    const f = v.fair_value_pe ? formatCurrency(v.fair_value_pe) : '-';
    const i = v.intrinsic_value ? formatCurrency(v.intrinsic_value) : '-';
    const m = v.margin_of_safety ? formatPercent(v.margin_of_safety) : '-';
    md += `| ${v.symbol} | ${formatCurrency(v.current_price)} | ${g} | ${d} | ${f} | ${i} | ${m} | ${v.status} |\n`;
  }
  
  return md;
}

function formatGTTAudit(json) {
  let md = `# GTT Audit — ${json.date}\n\n`;
  
  md += `**Total GTTs:** ${json.gtts_found}\n\n`;
  
  md += `## Unprotected Holdings (HIGH RISK)\n\n`;
  const up = json.unprotected_holdings || [];
  if (up.length > 0) {
    md += `| Symbol | Qty | P&L % | GTTs | Stop-Loss? | Status |\n`;
    md += `|--------|-----|-------|------|-------------|--------|\n`;
    for (const u of up) {
      md += `| ${u.symbol} | ${u.holding_qty} | ${formatPercent(u.pnl_percent)} | ${u.gtt_count} | ${u.has_stop_loss ? 'Yes' : 'NO'} | ${u.status} |\n`;
    }
    md += `\n**Action Items:**\n`;
    for (const a of json.action_items) {
      md += `- ${a}\n`;
    }
  } else {
    md += `_All holdings protected_\n`;
  }
  
  return md;
}

function formatOpportunities(json) {
  let md = `# Investment Opportunities — ${json.date}\n\n`;
  
  for (const o of json.opportunities) {
    md += `## ${o.symbol} — ${o.name}\n`;
    md += `- **Horizon:** ${o.horizon}\n`;
    md += `- **Sector:** ${o.sector}\n`;
    md += `- **Target:** ${o.target_3m}\n`;
    md += `- **Catalyst:** ${o.catalyst}\n`;
    md += `- **Source:** ${o.source}\n`;
    md += `- **Recommendation:** ${o.recommendation}\n\n`;
  }
  
  return md;
}

function formatCommodities(json) {
  let md = `# Commodity Watch — ${json.date}\n\n`;
  
  for (const c of json.commodities) {
    md += `## ${c.symbol} (${c.exchange})\n`;
    md += `- **Current Price:** ${c.current_price}\n`;
    md += `- **Trend:** ${c.trend}\n`;
    md += `- **Support:** ${c.support}\n`;
    md += `- **Resistance:** ${c.resistance}\n`;
    md += `- **Recommendation:** ${c.recommendation}\n\n`;
  }
  
  return md;
}

function formatNews(json) {
  let md = `# News Scanner — ${json.date}\n\n`;
  md += `**Market Sentiment:** ${json.market_sentiment}\n\n`;
  
  md += `## Key News\n\n`;
  for (const n of json.news) {
    md += `### ${n.headline}\n`;
    md += `- **Source:** ${n.source}\n`;
    md += `- **Date:** ${n.date}\n`;
    md += `- **Impact:** ${n.impact} (${n.impact_score}/10)\n`;
    md += `- **Type:** ${n.type}\n\n`;
  }
  
  md += `## Action Items\n`;
  for (const a of json.action_items) {
    md += `- ${a}\n`;
  }
  
  return md;
}

const converters = {
  'portfolio_snapshot': formatPortfolioSnapshot,
  'value_screen': formatValueScreen,
  'gtt_audit': formatGTTAudit,
  'opportunities': formatOpportunities,
  'commodity_opportunities': formatCommodities,
  'news_opportunities': formatNews,
};

console.log(`${B}Converting JSON reports to readable markdown...${X}\n`);

let converted = 0;
for (const [key, fn] of Object.entries(converters)) {
  const jsonFile = path.join(REPORTS_DIR, `${TODAY}_${key}.json`);
  const mdFile = path.join(REPORTS_DIR, `${TODAY}_${key}.md`);
  
  if (fs.existsSync(jsonFile)) {
    try {
      const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      const md = fn(json);
      fs.writeFileSync(mdFile, md, 'utf8');
      console.log(`${G}✓${X} ${TODAY}_${key}.md`);
      converted++;
    } catch (err) {
      console.log(`${R}✗${X} ${key}: ${err.message}`);
    }
  }
}

// Also create a readable/ subfolder with today's markdown reports
const readableDir = path.join(REPORTS_DIR, 'readable', TODAY);
if (!fs.existsSync(readableDir)) {
  fs.mkdirSync(readableDir, { recursive: true });
}

for (const [key] of Object.entries(converters)) {
  const jsonFile = path.join(REPORTS_DIR, `${TODAY}_${key}.json`);
  const mdFile = path.join(REPORTS_DIR, `${TODAY}_${key}.md`);
  
  if (fs.existsSync(mdFile)) {
    const dest = path.join(readableDir, `${TODAY}_${key}.md`);
    fs.copyFileSync(mdFile, dest);
    console.log(`${G}✓${X} Copied to readable/${TODAY}/${TODAY}_${key}.md`);
  }
}

// Also copy .docx and .xlsx files to readable folder
// Handle both "2026-03-30_*.docx" and "Portfolio_2026-03-30.xlsx" patterns
const docxFiles = fs.readdirSync(REPORTS_DIR).filter(f => 
  (f.startsWith(TODAY + '_') || f.includes(TODAY)) && f.endsWith('.docx')
);
for (const file of docxFiles) {
  const src = path.join(REPORTS_DIR, file);
  const dest = path.join(readableDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`${G}✓${X} Copied to readable/${TODAY}/${file}`);
  }
}

const xlsxFiles = fs.readdirSync(REPORTS_DIR).filter(f => 
  (f.startsWith('Portfolio_') || f.startsWith('Weekly_')) && f.includes(TODAY) && f.endsWith('.xlsx') && !f.includes('_1') // exclude timestamped temp files
);
for (const file of xlsxFiles) {
  const src = path.join(REPORTS_DIR, file);
  const dest = path.join(readableDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`${G}✓${X} Copied to readable/${TODAY}/${file}`);
  }
}

console.log(`\n${G}✅ Converted ${converted} JSON files to markdown${X}\n`);
console.log(`Readable reports saved to:`);
console.log(`  - reports/${TODAY}_*.md`);
console.log(`  - reports/readable/${TODAY}/`);
