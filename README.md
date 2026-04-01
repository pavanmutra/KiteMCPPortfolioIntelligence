# KiteMCP Portfolio Intelligence (NSE/BSE)

An AI-powered institutional-grade portfolio management and market intelligence system for the Indian equity markets. This system automates the daily morning scan, calculates intrinsic value using verified data, and generates professional analytical reports to ensure data-driven investment decisions.

---

## 🚀 DAILY WORKFLOW GUIDE (Read This First!)

The KiteMCP system works in **Two Distinct Phases**. 
If your generated reports are coming out **empty**, it means you skipped Phase 1! The terminal commands do *not* fetch market data themselves; they only format the data that the AI fetches for you.

### Phase 1: AI Data Gathering (Do this in the Chat)
You must ask the AI to gather live market data and save it as JSON files *before* you can generate any reports.

1. **Open your AI Chat** (OpenCode / Antigravity).
2. **Copy and paste this exact prompt** into the chat (or simply type `"Run daily workflow"`):
   > "Run the KiteMCP daily workflow for today. Execute ALL agents in sequence: opportunity-scanner (GATE 0), commodity-scanner (GATE 0.3), news-scanner (GATE 0.5), portfolio-scanner (GATE 1), intrinsic-value-scanner (GATE 2), and gtt-manager (GATE 3). Save all outputs to reports/YYYY-MM-DD_*.json"
3. **Wait for the AI to finish**. You will see it using tools to search the web, check stock prices, calculate intrinsic values, and write `.json` files into your `reports/` folder.
4. **Do not proceed** to Phase 2 until the AI explicitly tells you it has finished saving all the JSON files.

### Phase 2: Generating the Reports (Do this in the Terminal)
Once the AI has successfully created the `.json` files in Phase 1, you use your terminal to convert that raw data into beautiful, readable Markdown and Excel reports.

1. **Open your Terminal** (Command Prompt / VSCode Terminal) in the `kitemcp` folder.
2. **Run the master orchestrator**:
   ```bash
   npm start
   ```
3. **Check your `reports/` folder**. You will now see your fully populated `Latest_Report.md` and `Latest_Portfolio.xlsx` shortcuts, neatly pointing to today's data!

> 💡 **Why are my reports empty?** 
> If you run `npm start` without doing Phase 1 first, the formatting scripts won't find any new data for today, so they will generate blank or incomplete reports. **Always let the AI fetch the data first!**

---

## 📄 REPORTING ENGINE

Every session produces a clean, clutter-free daily folder containing three layers of reporting:

### 1. Daily Report (.md)
*   **Shortcut**: `reports/Latest_Report.md`
*   **Location**: `reports/YYYY-MM-DD/YYYY-MM-DD_daily_report.md`
*   **Content**: A professional executive summary.
*   **Key Sections**: Immediate Priority Actions, Portfolio Snapshot, Deep Discount Alerts, Commodity Review, and Scanned Opportunities.

### 2. Portfolio Intelligence (.xlsx)
*   **Shortcut**: `reports/Latest_Portfolio.xlsx`
*   **Location**: `reports/YYYY-MM-DD/Portfolio_YYYY-MM-DD.xlsx`
*   **Content**: Detailed spreadsheet with formulas for deep-diving.
*   **Sheets**:
    *   **Holdings**: P&L tracking vs Intrinsic Value.
    *   **Market Intelligence**: Full breakdown of News, Commodities, and Scanned Stocks.
    *   **Tax Summary**: Identifies candidates for tax-loss harvesting.
    *   **Dividend Tracker**: Expected annual income analysis.

### 3. Raw Intelligence (.json)
*   **Location**: `reports/YYYY-MM-DD/raw_data/YYYY-MM-DD_[gate].json`
*   **Content**: High-granularity data used by the reporting engine. Neatly tucked away so they don't clutter your folder.

---

## 🛡️ CORE RULES & GUARDRAILS (Learnings)

This system operates under strict financial guardrails derived from `learnings.md`:

*   **Rule #1**: Never buy a stock without a **Margin of Safety (MoS) > 25%**.
*   **Rule #2**: Every position **MUST** have a GTT stop-loss trigger below current price.
*   **Rule #3**: No "Averaging Down" if EPS is declining for 2 consecutive quarters.
*   **Rule #4**: Sector headwinds are checked daily before news recommendations.
*   **Rule #5**: All company names must be verified via Screener.in before calculation.

---

## ⚙️ SYSTEM ARCHITECTURE

*   **`run_daily.js`**: Master orchestrator for automated reporting and folder organization.
*   **`create_master_markdown.js`**: Markdown document generator.
*   **`create_portfolio_export.js`**: Excel workbook builder (using `exceljs`).
*   **`AGENTS.md`**: Definitive rulebook for the AI Analyst.
*   **`learnings.md`**: Historical mistake log and prevention rules.

---

## 💻 COMMAND REFERENCE

Use these commands in your terminal to interact with the system:

*   `npm start` : Runs the full daily workflow, consolidates json, and generates your 2 master files.
*   `npm run dashboard` : Prints a quick CLI summary of your portfolio.
*   `npm run check` : Checks the status of all workflow gates.
*   `npm run report` : Manually regenerates the master daily Markdown report.
*   `npm run export` : Manually regenerates the portfolio Excel file.
*   `npm run help` : Lists all available commands.

---

## 📖 GLOSSARY OF TERMS

*   **MoS (Margin of Safety)**: The percentage difference between a stock's Intrinsic Value and its Current Market Price. A higher MoS means lower risk.
*   **IV (Intrinsic Value)**: The estimated true worth of a stock based on fundamentals, using Graham, DCF, and P/E models.
*   **Graham Number**: A defensive valuation metric devised by Benjamin Graham: `√(22.5 × EPS × Book Value)`.
*   **GTT (Good Till Triggered)**: An automated order type used heavily in this system to set trailing stop-losses and profit targets without daily monitoring.

---

## 🔧 TROUBLESHOOTING

*   **Tool Access Failed**: If the KiteMCP remote server is offline, the AI will prompt for manual data input. Provide a snapshot of your holdings to continue.
*   **Excel File Locked (`EBUSY` error)**: Ensure all reports are closed before running the `npm start` command. If locked, the system will try to save a timestamped version.
*   **Missing JSON Files**: If report generation skips data, ensure you ran the correct AI Gate and that the AI saved the file as `YYYY-MM-DD_[gate].json`.
*   **JSON Schema Mismatch**: If report generation fails, verify that fields like `quantity` and `last_price` are correctly mapped in the snapshot JSON.
*   **Stray Files**: Run `npm run clean` to remove invisible temporary Word locks if the folder feels cluttered.

---

> **Analyst Note**: This system is a decision-support tool. It does not execute trades automatically. All trade executions must be reviewed manually against the generated reports.
