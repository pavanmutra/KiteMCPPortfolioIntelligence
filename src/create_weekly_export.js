const { Workbook } = require('exceljs');
const { readJsonFile } = require('./lib/jsonUtils');
const fs   = require('fs');
const path = require('path');

const today = new Date();
const weekEnd = today.toISOString().split('T')[0];
const weekStart = new Date(today);
weekStart.setDate(today.getDate() - 7);
const weekStartStr = weekStart.toISOString().split('T')[0];

const reportDate = weekEnd;
const weekStartDate = weekStartStr;

const REPORTS_DIR = path.join(__dirname, '../reports');

/**
 * Find a report file — check reports/ first, then archive/YYYY-MM-DD/
 * This ensures weekly comparisons work even after archiving.
 */
function findReport(date, filename) {
    // Check today's reports root first
    const rootPath = path.join(REPORTS_DIR, `${date}_${filename}`);
    if (fs.existsSync(rootPath)) {return readJsonFile(rootPath);}

    // Check archive/YYYY-MM-DD/ folder (date prefix stripped)
    const archivePath = path.join(REPORTS_DIR, 'archive', date, filename);
    if (fs.existsSync(archivePath)) {return readJsonFile(archivePath);}

    // Check archive with date prefix (in case not stripped)
    const archiveWithDate = path.join(REPORTS_DIR, 'archive', date, `${date}_${filename}`);
    if (fs.existsSync(archiveWithDate)) {return readJsonFile(archiveWithDate);}

    return null;
}

const currentPortfolio  = findReport(reportDate, 'portfolio_snapshot.json');
const lastWeekPortfolio = findReport(weekStartDate, 'portfolio_snapshot.json');
const valueData         = findReport(reportDate, 'value_screen.json');
const commodityData     = findReport(reportDate, 'commodity_opportunities.json');

const rawHoldings = currentPortfolio?.holdings || [
    { symbol: 'TMCV', quantity: 110, average_price: 355.37, last_price: 431.85, pnl: 8412.26, pnl_percent: 21.53 },
    { symbol: 'NXST-RR', quantity: 650, average_price: 135.19, last_price: 155.52, pnl: 13217.14, pnl_percent: 14.4 },
    { symbol: 'IOB', quantity: 7849, average_price: 38.51, last_price: 33.72, pnl: -37634, pnl_percent: -12.4 },
    { symbol: 'JINDALPHOT', quantity: 85, average_price: 1320.71, last_price: 1141.4, pnl: -15241, pnl_percent: -13.6 },
    { symbol: 'VHL', quantity: 35, average_price: 3608.39, last_price: 3148.2, pnl: -16107, pnl_percent: -12.8 },
    { symbol: 'CAMS', quantity: 228, average_price: 713.99, last_price: 644.20, pnl: -15912, pnl_percent: -9.8 }
];

const lastWeekHoldings = lastWeekPortfolio?.holdings || [];

const holdings = rawHoldings.map(h => {
    const qty = h.quantity || h.qty || 0;
    const avgPrice = h.average_price || h.avg_price || 0;
    const curPrice = h.current_price || h.last_price || 0;
    const pnl = h.pnl || ((curPrice - avgPrice) * qty);
    const pnlPct = h.pnl_percent || h.pnl_pct || (avgPrice > 0 ? ((curPrice - avgPrice) / avgPrice * 100) : 0);
    return {
        symbol: h.symbol,
        quantity: qty,
        avg_price: avgPrice,
        current_price: curPrice,
        invested: qty * avgPrice,
        current_value: qty * curPrice,
        pnl: pnl,
        pnl_percent: pnlPct
    };
});

const lastWeekMap = new Map(lastWeekHoldings.map(h => [h.symbol, h]));

const commodities = commodityData?.commodities || [
    { symbol: 'GOLD', price: 74500, change_percent: 0.52 },
    { symbol: 'SILVER', price: 89500, change_percent: -0.32 },
    { symbol: 'CRUDE', price: 5200, change_percent: 1.25 },
    { symbol: 'NATURALGAS', price: 180, change_percent: -2.15 }
];

const wb = new Workbook();
wb.creator = 'KiteMCP Portfolio Intelligence';
wb.created = new Date();

const summarySheet = wb.addWorksheet('Weekly Summary', {
    properties: { tabColor: { argb: '1565C0' } }
});

summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'This Week', key: 'this_week', width: 18 },
    { header: 'Last Week', key: 'last_week', width: 18 },
    { header: 'Change', key: 'change', width: 18 },
    { header: 'Change %', key: 'change_pct', width: 14 }
];

summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1565C0' } };
summarySheet.getRow(1).alignment = { horizontal: 'center' };

const thisWeekValue = holdings.reduce((sum, h) => sum + h.current_value, 0);
const thisWeekInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
const thisWeekPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);

const lastWeekValue = lastWeekHoldings.reduce((sum, h) => {
    const qty = h.quantity || h.qty || 0;
    const curPrice = h.current_price || h.last_price || 0;
    return sum + (qty * curPrice);
}, 0);
const lastWeekInvested = lastWeekHoldings.reduce((sum, h) => {
    const qty = h.quantity || h.qty || 0;
    const avgPrice = h.average_price || h.avg_price || 0;
    return sum + (qty * avgPrice);
}, 0);
const lastWeekPnl = lastWeekHoldings.reduce((sum, h) => {
    const qty = h.quantity || h.qty || 0;
    const curPrice = h.current_price || h.last_price || 0;
    const avgPrice = h.average_price || h.avg_price || 0;
    return sum + ((curPrice - avgPrice) * qty);
}, 0);

const valueChange = thisWeekValue - lastWeekValue;
const valueChangePct = lastWeekValue > 0 ? (valueChange / lastWeekValue * 100) : 0;
const pnlChange = thisWeekPnl - lastWeekPnl;

summarySheet.addRow({ metric: 'Portfolio Value', this_week: Math.round(thisWeekValue), last_week: Math.round(lastWeekValue), change: Math.round(valueChange), change_pct: parseFloat(valueChangePct.toFixed(1)) + '%' });
summarySheet.addRow({ metric: 'Total Investment', this_week: Math.round(thisWeekInvested), last_week: Math.round(lastWeekInvested) });
summarySheet.addRow({ metric: 'Unrealized P&L', this_week: Math.round(thisWeekPnl), last_week: Math.round(lastWeekPnl), change: Math.round(pnlChange) });
summarySheet.addRow({ metric: 'P&L %', this_week: thisWeekInvested > 0 ? parseFloat((thisWeekPnl / thisWeekInvested * 100).toFixed(1)) + '%' : 'N/A', last_week: lastWeekInvested > 0 ? parseFloat((lastWeekPnl / lastWeekInvested * 100).toFixed(1)) + '%' : 'N/A' });

const holdingsSheet = wb.addWorksheet('Holdings Comparison', {
    properties: { tabColor: { argb: '1F4E79' } }
});

holdingsSheet.columns = [
    { header: 'Symbol', key: 'symbol', width: 10 },
    { header: 'Qty', key: 'quantity', width: 8 },
    { header: 'Current (₹)', key: 'current_price', width: 12 },
    { header: 'P&L (₹)', key: 'pnl', width: 12 },
    { header: 'P&L %', key: 'pnl_percent', width: 10 },
    { header: 'WoW Change (₹)', key: 'wow_change', width: 14 },
    { header: 'Action', key: 'action', width: 14 }
];

holdingsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
holdingsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E79' } };
holdingsSheet.getRow(1).alignment = { horizontal: 'center' };

holdings.forEach(h => {
    const lastWeekHolding = lastWeekMap.get(h.symbol);
    const lastWeekPrice = lastWeekHolding ? (lastWeekHolding.current_price || lastWeekHolding.last_price || 0) : 0;
    const wowChange = lastWeekHolding ? (h.current_price - lastWeekPrice) * h.quantity : 0;
    const action = h.pnl_percent > 10 ? 'HOLD' : h.pnl_percent > 0 ? 'HOLD' : h.pnl_percent < -10 ? 'TAX LOSS HARVEST' : 'WATCH';
    
    holdingsSheet.addRow({
        symbol: h.symbol,
        quantity: h.quantity,
        current_price: parseFloat(h.current_price.toFixed(2)),
        pnl: Math.round(h.pnl),
        pnl_percent: parseFloat(h.pnl_percent.toFixed(1)),
        wow_change: Math.round(wowChange),
        action: action
    });
});

const performanceSheet = wb.addWorksheet('Performance', {
    properties: { tabColor: { argb: '2E7D32' } }
});

performanceSheet.columns = [
    { header: 'Stock', key: 'stock', width: 12 },
    { header: 'This Week %', key: 'this_week', width: 14 },
    { header: 'Last Week %', key: 'last_week', width: 14 },
    { header: 'Change', key: 'change', width: 12 }
];

performanceSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
performanceSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E7D32' } };

const sortedByPerformance = [...holdings].sort((a, b) => b.pnl_percent - a.pnl_percent);

sortedByPerformance.forEach(h => {
    const lastWeekHolding = lastWeekMap.get(h.symbol);
    const lwPrice = lastWeekHolding ? (lastWeekHolding.current_price || lastWeekHolding.last_price || 0) : 0;
    const lwAvg = lastWeekHolding ? (lastWeekHolding.average_price || lastWeekHolding.avg_price || 0) : 0;
    const lastWeekPnlPct = lastWeekHolding && lwAvg > 0 ? ((lwPrice - lwAvg) / lwAvg * 100) : 0;
    const change = h.pnl_percent - lastWeekPnlPct;
    
    performanceSheet.addRow({
        stock: h.symbol,
        this_week: parseFloat(h.pnl_percent.toFixed(1)) + '%',
        last_week: parseFloat(lastWeekPnlPct.toFixed(1)) + '%',
        change: (change > 0 ? '+' : '') + parseFloat(change.toFixed(1)) + '%'
    });
});

const commoditySheet = wb.addWorksheet('Commodities', {
    properties: { tabColor: { argb: 'C2185B' } }
});

commoditySheet.columns = [
    { header: 'Commodity', key: 'symbol', width: 14 },
    { header: 'Price', key: 'price', width: 14 },
    { header: 'Change %', key: 'change_percent', width: 12 },
    { header: 'Trend', key: 'trend', width: 12 }
];

commoditySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
commoditySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C2185B' } };

commodities.forEach(c => {
    const price = typeof c.current_price === 'number' ? c.current_price : (c.price || 0);
    const changePct = c.day_change_pct || c.change_percent || 0;
    commoditySheet.addRow({
        symbol: c.commodity || c.symbol || 'N/A',
        price: price,
        change_percent: typeof changePct === 'number' ? parseFloat(changePct.toFixed(2)) : changePct,
        trend: c.trend || 'NEUTRAL'
    });
});

const outputPath = path.join(__dirname, '../reports', `Weekly_Portfolio_${reportDate}.xlsx`);
wb.xlsx.writeFile(outputPath).then(() => {
    console.log(`Weekly Portfolio Excel saved to: ${outputPath}`);
    console.log('\n=== WEEKLY SUMMARY ===');
    console.log(`Week: ${weekStartStr} to ${weekEnd}`);
    console.log(`Portfolio Value: ₹${Math.round(thisWeekValue).toLocaleString('en-IN')}`);
    console.log(`WoW Change: ₹${Math.round(valueChange).toLocaleString('en-IN')} (${valueChangePct.toFixed(1)}%)`);
    console.log(`Total P&L: ₹${Math.round(thisWeekPnl).toLocaleString('en-IN')}`);
});
