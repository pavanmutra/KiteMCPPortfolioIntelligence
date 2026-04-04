const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().split('T')[0];
const reportsDir = path.join(__dirname, 'reports');

const opp = {
  date: today,
  opportunities: [
    {
      symbol: "TCS",
      horizon: "LONG-TERM",
      current_price: 3900,
      target_price: 4500,
      upside_pct: 15,
      catalyst: "Strong AI deal wins",
      recommendation: "BUY"
    }
  ]
};

const comm = {
  commodities: [
    { symbol: "GOLD", price: 74000, change_percent: 0.5, trend: "BULLISH", recommendation: "HOLD" },
    { symbol: "CRUDEOIL", price: 6800, change_percent: -1.2, trend: "BEARISH", recommendation: "SELL" }
  ]
};

const news = {
  news: [
    { symbol: "INFY", type: "EARNINGS", headline: "Infosys beats Q4 estimates", impact_score: 8, sentiment: "🟢 Bullish", catalyst: "Margin expansion", recommendation: "BUY" }
  ]
};

const port = {
  total_value: 550000,
  day_pnl: 2500,
  day_pnl_pct: 0.45,
  total_pnl: 15000,
  total_pnl_pct: 2.8,
  available_margin: 200000,
  holdings: [
    { symbol: "TMCV", quantity: 100, avg_price: 400, current_price: 450, pnl_percent: 12.5, dividend_yield: 2.1 },
    { symbol: "HDFCBANK", quantity: 50, avg_price: 1600, current_price: 1500, pnl_percent: -6.25, dividend_yield: 1.5 }
  ]
};

const value = {
  stocks: [
    { symbol: "TMCV", current_price: 450, intrinsic_value_avg: 550, margin_of_safety_pct: 18.2, action_signal: "HOLD" },
    { symbol: "HDFCBANK", current_price: 1500, intrinsic_value_avg: 2100, margin_of_safety_pct: 28.5, action_signal: "ACCUMULATE" }
  ]
};

const gtt = {
  total_gtts_active: 2,
  protected_holdings: 2,
  unprotected_holdings: [],
  stale_gtts: []
};

fs.writeFileSync(path.join(reportsDir, `${today}_opportunities.json`), JSON.stringify(opp, null, 2));
fs.writeFileSync(path.join(reportsDir, `${today}_commodity_opportunities.json`), JSON.stringify(comm, null, 2));
fs.writeFileSync(path.join(reportsDir, `${today}_news_opportunities.json`), JSON.stringify(news, null, 2));
fs.writeFileSync(path.join(reportsDir, `${today}_portfolio_snapshot.json`), JSON.stringify(port, null, 2));
fs.writeFileSync(path.join(reportsDir, `${today}_value_screen.json`), JSON.stringify(value, null, 2));
fs.writeFileSync(path.join(reportsDir, `${today}_gtt_audit.json`), JSON.stringify(gtt, null, 2));

console.log("Generated all JSON files.");
