# Investor Portfolio Report Template — Generation Package

## Contents
- `Investor_Portfolio_Report_Template.xlsx` — The ready-to-use Excel report
- `build_investor_template.py` — Python script to regenerate/customize the Excel file
- `scripts/` — LibreOffice recalculation utilities (required for formula values)

## Requirements
```bash
pip install openpyxl
```

## How to Regenerate
```bash
python build_investor_template.py
python scripts/recalc.py Investor_Portfolio_Report_Template.xlsx
```

## How to Customize
Open `build_investor_template.py` and edit:
- `sample_port` list → change your stock holdings
- `buy_data` list → update buy suggestions
- `bb_data` list → update buyback opportunities
- `gtt_data` list → update GTT orders
- `sw_data` list → update swing trades
- `sectors` list → update sector allocation
- Color constants at the top → change color theme

## Sheet Guide
| Sheet | Purpose |
|-------|---------|
| 📊 Dashboard | Live overview — KPIs + all summaries |
| 📋 Portfolio | Enter CMP in yellow cells → auto P&L |
| 💡 Buy Suggestions | Fundamental + technical analysis table |
| 🔁 Buyback Opps | Buyback arbitrage tracker |
| 🎯 GTT Plan | Good Till Triggered order planner |
| 🔄 Swing Trading | Buyback deep-value swing setups |
| 📈 Charts & Analysis | Pie + Line charts + Risk scorecard |
| 📝 Watchlist & Notes | Watchlist, rules & trade journal |

## Color Coding (Industry Standard)
- **Blue text** = Hardcoded inputs (you change these)
- **Yellow background** = CMP input cells (update daily)
- **Black text** = Formulas (auto-calculated)
- **Green background** = Positive P&L
- **Red background** = Negative P&L
