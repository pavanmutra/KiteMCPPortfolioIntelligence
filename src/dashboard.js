#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { findReport } = require('./lib/jsonUtils');

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

const today = new Date().toISOString().split('T')[0];

console.log(`\n${BOLD}${BLUE}═══════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}  KiteMCP Portfolio Dashboard — ${today}${RESET}`);
console.log(`${BOLD}${BLUE}═══════════════════════════════════════════════════${RESET}\n`);

// 1. Portfolio Data
const portfolio = findReport(today, 'portfolio_snapshot.json');
const Formatters = require('./utils/formatters');

if (portfolio && portfolio.holdings) {
    const normalizedHoldings = Formatters.normalizeHoldings(portfolio.holdings);
    const totalValue = normalizedHoldings.reduce((sum, h) => sum + (h.qty * h.last), 0);
    const invested = normalizedHoldings.reduce((sum, h) => sum + (h.qty * h.avg), 0);
    const pnl = totalValue - invested;
    const pnlPct = (pnl / invested) * 100;
    const pnlColor = pnl >= 0 ? GREEN : RED;

    console.log(`${BOLD}💰 PORTFOLIO SUMMARY${RESET}`);
    console.log(`   Total Value : ₹${totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
    console.log(`   Invested    : ₹${invested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
    console.log(`   Total P&L   : ${pnlColor}₹${pnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (${pnlPct.toFixed(2)}%)${RESET}`);
    console.log(`   Positions   : ${normalizedHoldings.length}`);
    console.log(`   Available Margin: ₹${(portfolio.available_margin || 0).toLocaleString('en-IN')}\n`);
} else {
    console.log(`${YELLOW}⚠️  Portfolio data not found for today. Run 'npm start' or GATE 1.${RESET}\n`);
}

// 2. Value Screen Data (Deep Discounts)
const valueScreen = findReport(today, 'value_screen.json');
if (valueScreen) {
    const stocks = valueScreen.stocks || valueScreen.valuations || [];
    const deepDiscounts = stocks.filter(s => s.margin_of_safety > 25);
    
    if (deepDiscounts.length > 0) {
        console.log(`${BOLD}🎯 DEEP DISCOUNT ALERTS (MoS > 25%)${RESET}`);
        deepDiscounts.forEach(s => {
            console.log(`   ${GREEN}▲${RESET} ${s.symbol.padEnd(10)} | CMP: ₹${s.current_price} | IV: ₹${Math.round(s.intrinsic_value || s.graham_number || 0)} | MoS: ${s.margin_of_safety.toFixed(1)}%`);
        });
        console.log();
    }
}

// 3. GTT Data (Unprotected)
const gttData = findReport(today, 'gtt_audit.json');
if (gttData && gttData.unprotected_holdings && gttData.unprotected_holdings.length > 0) {
    console.log(`${BOLD}⚠️  UNPROTECTED HOLDINGS (No GTT Stop-Loss)${RESET}`);
    console.log(`   ${RED}■${RESET} ${gttData.unprotected_holdings.join(', ')}\n`);
} else if (gttData) {
    console.log(`${BOLD}🛡️  GTT PROTECTION${RESET}`);
    console.log(`   ${GREEN}✅ All holdings protected by active GTT orders.${RESET}\n`);
}

console.log(`${BLUE}For full details, run 'npm run report' and view the generated md/xlsx files.${RESET}\n`);
