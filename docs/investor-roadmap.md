# Investor Feature Roadmap

## Goal
Build a practical investor workflow that helps review positions, spot risk, and make better buy/add/exit decisions.

## Step-by-Step Plan

### Step 1: MoS Alerts
- Trigger alerts when margin of safety crosses buy/add thresholds.
- Show the stock, current price, intrinsic value, and MoS.
- Manual verification: confirm alert values match the dashboard.

### Step 2: Watchlist
- Track thesis, target price, and next review date.
- Manual verification: add one stock and confirm it appears in the watchlist.

### Step 3: Risk Tracker
- Show position size, stop-loss, and max drawdown.
- Manual verification: open a holding and verify the risk values.

### Step 4: Concentration View
- Break down exposure by stock, sector, and theme.
- Manual verification: confirm totals match the portfolio.

### Step 5: Earnings and Dividend Calendar
- Surface upcoming earnings and dividend dates.
- Generate `reports/YYYY-MM-DD/raw_data/YYYY-MM-DD_dividend_calendar.json` from the workflow.
- Manual verification: verify one upcoming event.

### Step 6: Valuation History
- Chart P/E, P/B, and MoS over time.
- Manual verification: compare one stock across two dates.

### Step 7: Rebalancing Suggestions
- Recommend trim/add actions based on rules.
- Manual verification: confirm the recommendation logic for one holding.

### Step 8: Tax-Loss Harvesting
- Flag eligible positions for tax optimization.
- Manual verification: confirm one candidate is correctly flagged.

### Step 9: News Impact Summary
- Summarize relevant news against holdings.
- Manual verification: verify a news item maps to the correct holding.

### Step 10: Investment Journal
- Save buy/sell reason, thesis, and post-mortem notes.
- Manual verification: create one entry and reopen it.

## MVP Order
1. MoS alerts
2. Watchlist
3. Risk tracker
4. Concentration view
