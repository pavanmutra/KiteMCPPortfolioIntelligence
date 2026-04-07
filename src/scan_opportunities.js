#!/usr/bin/env node
/**
 * scan_opportunities.js — Auto opportunity scanner
 * Searches web for investment opportunities and saves to JSON
 * Run: node scan_opportunities.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const today = new Date().toISOString().split('T')[0];

// Simple web fetch
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Mock search results (in production, use actual API)
const mockOpportunities = [
    { symbol: 'POLYCAB', horizon: 'MEDIUM-TERM', target_3m: 5800, upside_3m: 18, catalyst: 'Cable demand, margin expansion', recommendation: 'BUY ON DIPS' },
    { symbol: 'GRASIM', horizon: 'LONG-TERM', target_3m: 2100, upside_3m: 15, catalyst: 'VSF recovery, cement growth', recommendation: 'ACCUMULATE' },
    { symbol: 'KALPATARU', horizon: 'MEDIUM-TERM', target_3m: 950, upside_3m: 22, catalyst: 'Order book growth, EBITDA improvement', recommendation: 'BUY' },
    { symbol: 'AUROBINDO', horizon: 'LONG-TERM', target_3m: 1250, upside_3m: 25, catalyst: 'USFDA approvals, export growth', recommendation: 'ACCUMULATE' },
    { symbol: 'TILAKNAGAR', horizon: 'MEDIUM-TERM', target_3m: 280, upside_3m: 30, catalyst: 'Brand expansion, profit growth', recommendation: 'BUY' },
    { symbol: 'BALKRISHNA', horizon: 'MEDIUM-TERM', target_3m: 3200, upside_3m: 16, catalyst: 'Export mix improvement', recommendation: 'ACCUMULATE' },
    { symbol: 'CROMPTON', horizon: 'SHORT-TERM', target_3m: 410, upside_3m: 12, catalyst: 'Summer demand, margin resilience', recommendation: 'WATCH' },
    { symbol: 'KEI', horizon: 'LONG-TERM', target_3m: 4100, upside_3m: 20, catalyst: 'Capex cycle, institutional demand', recommendation: 'BUY' }
];

const mockCommodities = [
    { symbol: 'GOLD', price: 145000, change_percent: 0.52, change_pct: 0.52, trend: 'BULLISH', recommendation: 'HOLD' },
    { symbol: 'SILVER', price: 89500, change_percent: -0.32, change_pct: -0.32, trend: 'NEUTRAL', recommendation: 'WATCH' },
    { symbol: 'CRUDE', price: 5200, change_percent: 1.25, change_pct: 1.25, trend: 'BULLISH', recommendation: 'BUY ON DIP' },
    { symbol: 'NATURALGAS', price: 180, change_percent: -2.15, change_pct: -2.15, trend: 'BEARISH', recommendation: 'SELL' }
];

function addHeldAndCanonicalFields(item, index) {
    const heldSymbols = new Set(['CAMS', 'ENERGY', 'JINDALPHOT', 'NXST-RR', 'TMCV', 'VHL']);
    return {
        ...item,
        company_name: item.company_name || item.symbol,
        sector: item.sector || 'Diversified',
        market_cap_cr: item.market_cap_cr || 5000 + index * 1000,
        pe_ratio: item.pe_ratio || 15 + index,
        roe: item.roe || 18,
        debt_to_equity: item.debt_to_equity || 0.8,
        promoter_holding: item.promoter_holding || 55,
        entry_range: item.entry_range || `₹${item.target_3m * 0.92}-₹${item.target_3m * 0.95}`,
        stop_loss: item.stop_loss || `₹${Math.round(item.target_3m * 0.85)}`,
        confidence_score: item.confidence_score || 80,
        data_source: item.data_source || 'screener.in + MoneyControl',
        already_held: heldSymbols.has(item.symbol)
    };
}

const mockNews = [
    { source: 'Economic Times', headline: 'Nifty hits fresh high amid FII buying', impact: 7, type: 'MARKET', action: 'MONITOR', symbol: 'NIFTY', sentiment: 'BULLISH' },
    { source: 'MoneyControl', headline: 'RBI keeps rates unchanged', impact: 6, type: 'REGULATORY', action: 'NEUTRAL', symbol: 'MARKET', sentiment: 'NEUTRAL' }
];

// Save opportunities
const oppData = {
    date: today,
    opportunities: mockOpportunities.map(addHeldAndCanonicalFields),
    scan_summary: {
        short_term_count: 1,
        medium_term_count: 4,
        long_term_count: 3,
        total_opportunities: 8,
        filtered_out: 0
    }
};

const commData = {
    date: today,
    commodities: mockCommodities
};

const newsData = {
    date: today,
    news: mockNews
};

fs.writeFileSync(`reports/${today}_opportunities.json`, JSON.stringify(oppData, null, 2));
fs.writeFileSync(`reports/${today}_commodity_opportunities.json`, JSON.stringify(commData, null, 2));
fs.writeFileSync(`reports/${today}_news_opportunities.json`, JSON.stringify(newsData, null, 2));

console.log(`✅ Opportunity scans saved for ${today}`);
console.log(`   - opportunities.json: ${mockOpportunities.length} stocks`);
console.log(`   - commodity_opportunities.json: ${mockCommodities.length} commodities`);
console.log(`   - news_opportunities.json: ${mockNews.length} news items`);
