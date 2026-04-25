# KiteMCP Portfolio Intelligence - Agent Guidelines

## MCP Configuration (OpenCode OAuth)

The Kite MCP is configured via `opencode.json` using OAuth authentication:
```json
{
  "mcp": {
    "kite": {
      "type": "remote",
      "url": "https://mcp.kite.trade/mcp",
      "oauth": {}
    }
  }
}
```

**Important:**
- NO API key required - uses OAuth browser-based login
- When a Kite tool is called, OpenCode will prompt for OAuth login
- A browser window opens to `https://kite.zerodha.com/connect/login?api_key=kitemcp&v=3&redirect_params=session_id%3D...`
- User logs in with Zerodha credentials and authorizes
- Session is cached automatically by OpenCode

**Troubleshooting:**
- "Invalid session ID" = need to complete OAuth login
- Use any Kite tool to trigger login prompt
- Session persists until manually logged out
- If order placement fails after "already logged in" → FORCE FRESH LOGIN:
  1. Log out from https://kite.zerodha.com completely
  2. Clear browser session/cookies
  3. Re-authorize via: https://kite.zerodha.com/connect/login?api_key=kitemcp&v=3
  4. Test with 1 small order first (READ works ≠ WRITE works)

This file is for agentic coding assistants working in this repository.
Follow the existing codebase conventions and keep changes minimal unless the task requires otherwise.

## Project Shape

The repo is a Node.js application for portfolio intelligence, reporting, and Kite workflow automation.
- Core code lives under `src/`
- Generated outputs land in `reports/`
- Web dashboard at `src/public/`
- Prompts for AI agents in `prompts/`

## ⚠️ MANDATORY WORKFLOW ORDER (ALWAYS MCP FIRST)

**ALWAYS follow this exact order — Kite MCP FIRST, then Node Scripts:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: KITE MCP TOOLS (ALWAYS FIRST - NO EXCEPTIONS)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. kite_get_holdings()     → Fetch current holdings with live prices       │
│ 2. kite_get_positions()   → Check current positions (day trades)          │
│ 3. kite_get_gtts()         → Check GTT status (protected/unprotected)      │
│ 4. kite_get_ltp()          → Optional: Get LTP for specific symbols       │
│                                                                             │
│ ⚠️ Node.js CANNOT call Kite MCP. They are separate systems.                │
│    Never run Node scripts BEFORE getting fresh data via MCP.                │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: UPDATE JSON FILES (via AI Agent using prompts)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Create/update these files in reports/YYYY-MM-DD/raw_data/:                  │
│                                                                             │
│ • 2026-MM-DD_portfolio_snapshot.json  ← from kite_get_holdings()           │
│ • 2026-MM-DD_gtt_audit.json           ← from kite_get_gtts()                │
│ • 2026-MM-DD_value_screen.json        ← AI calculates IV using prompts/     │
│   └─ prompts/intrinsic_value.md       ← Fetch fundamentals from web        │
│   └─ For each holding: web search screener.in {SYMBOL} for EPS, BV, P/E    │
│ • 2026-MM-DD_opportunities.json        ← AI scans via prompts/             │
│ • 2026-MM-DD_dividend_calendar.json    ← AI fetches via prompts/           │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: NODE SCRIPTS (ONLY AFTER Step 1 & 2 COMPLETE)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ npm run workflow           → Run full automated workflow                     │
│ npm run report             → Generate daily Markdown report                 │
│ npm run export             → Generate portfolio Excel                        │
│ npm run web                → Start web dashboard                            │
│                                                                             │
│ ⚠️ If JSON files are missing/incomplete, npm run workflow will FAIL.       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Quick Start Command Sequence:**
```
1. kite_get_holdings()     ← Start here
2. kite_get_gtts()         ← Check protection
3. Save JSON files         ← AI agent task
4. VERIFY all values       ← Cross-check data accuracy
5. npm run workflow        ← Only after Step 4
```

**Verification Checklist (MANDATORY before Step 3):**
```
□ Holdings count matches expected
□ Current prices are reasonable (not stale)
□ P&L percentages calculated correctly
□ T+1 quantities noted
□ GTT statuses verified
□ JSON schema matches requirements (no missing fields)
□ Data freshness: < 1 hour old
□ Total portfolio value matches UI display (cross-check)
□ Individual holding values (qty × price) match in UI
□ Day P&L and Total P&L are different values (not same)
```

## Commands

### Development
```bash
npm start              # Run daily workflow (interactive)
npm run web            # Start web dashboard (auto-opens browser)
npm run dev            # Start dev server
npm run refresh        # Refresh live prices via AI
npm run dashboard      # CLI dashboard (no browser)
```

### Reporting
```bash
npm run report         # Generate daily Markdown report
npm run export         # Generate portfolio Excel
npm run export:weekly  # Generate weekly export
npm run check         # Check gate status
npm run workflow       # Run automated workflow
```

### Testing
```bash
npm test               # Run all tests
npm run test:unit      # Unit tests only
npm run test:integration # Integration tests only
```

### Other
```bash
npm run login          # Kite login
npm run lint           # Lint code
npm run lint:fix       # Lint + fix
```

## JSON Schema Requirements

When creating daily report JSON files, always include ALL fields:

### portfolio_snapshot.json
- `total_value`, `day_pnl`, `day_pnl_pct`, `total_pnl`, `total_pnl_pct`
- Each holding: `pnl_percent`, `current_price`, `average_price`

### value_screen.json
- Each stock: `current_price`, `intrinsic_value`, `margin_of_safety_pct`, `action_signal`

### gtt_audit.json
- `total_gtts_active`, `total_protected_holdings`, `protected_holdings[]`, `unprotected_holdings[]`

### opportunities.json
- Each opportunity: `current_price`, `target_price`, `upside_pct`

### dividend_calendar.json
- `buybacks[]`: [{symbol, company, current_price, buyback_price, premium_pct, record_date}]
- `sources`: {buybacks: string}

Field mismatch causes "undefined" values in reports.

## Data Files Location

All JSON data files go in:
```
reports/YYYY-MM-DD/raw_data/YYYY-MM-DD_*.json
```

## GTT Workflow

Before placing any GTT:
1. Fetch `kite_get_gtts()` to check existing GTTs
2. Verify NSE ticker via `kite_search_instruments()`
3. Check current holding qty matches GTT qty
4. Delete stale GTTs for stocks you no longer hold

Example: Aurobindo Pharma = APLLTD (not AUROBINDO)

## Fully Automated Daily Workflow

```bash
npm run workflow
```

This command:
1. Validates required JSON files exist
2. Runs `create_master_markdown.js` → `daily_report.md`
3. Runs `create_portfolio_export.js` → `Portfolio.xlsx`
4. Runs `create_dividend_calendar.js`
5. Runs `create_risk_assessment.js`
6. Runs `convert_deep_value.js`
7. Runs `fetch_commodities.js`

## Web Dashboard

The web dashboard (`npm run web`) provides a visual interface:

| Tab | Data Source | Purpose |
|-----|-------------|---------|
| Holdings | `portfolio_snapshot.json` | Full portfolio with P&L |
| Deep Discounts | `value_screen.json` | MoS > 25% stocks |
| Risk | `risk_assessment.json` | Risk scoring |
| Concentration | `risk_assessment.json` | Sector weights |
| Buyback Calendar | `dividend_calendar.json` | Confirmed buybacks |
| GTT Status | `gtt_audit.json` | Protection status |
| Opportunities | `opportunities.json` | Web-scanned ideas |
| Commodities | `commodity_opportunities.json` | MCX prices |
| Deep Value | `deep_value_screener.json` | Screener results |

## API Endpoints

| Endpoint | Returns |
|----------|---------|
| `/api/portfolio` | Holdings + P&L |
| `/api/valuescreen` | IV & MoS |
| `/api/gtt` | GTT status |
| `/api/dividends` | Buybacks + dividends |
| `/api/risk` | Risk assessment |
| `/api/commodities` | MCX prices |
| `/api/opportunities` | Opportunities |
| `/api/deepvalue` | Deep value stocks |
| `/api/data-status` | Freshness status |

## New India-Specific Skills (v1.2)

### Market Timing Skills

#### 1. India Market Breadth (`prompts/india-market-breadth/SKILL.md`)
- Fetches NSE advance/decline data, new highs/lows, sector participation
- 6-component scoring: Overall Breadth, Sector Participation, Sector Rotation, Momentum, Mean Reversion Risk, Historical Context
- Score 0-100 with market posture recommendations
- No API required - uses free NSE India data

**Trigger phrases:**
- "analyze Indian market breadth", "market breadth health"
- "NSE advance decline ratio", "Nifty breadth analysis"

#### 2. FII/DII Flow Tracker (`prompts/fii-dii-flow-tracker/SKILL.md`)
- Tracks Foreign Institutional Investor (FII) and Domestic Institutional Investor (DII) daily flows
- Multi-day trend analysis (5-day, 10-day, 30-day)
- Flow interpretation matrix with market signals
- Score 0-100 based on flow direction, trend strength, DII support

**Trigger phrases:**
- "track FII DII flows", "institutional flows India"
- "FII selling buying trend", "DII activity today"

#### 3. India News Tracker (`prompts/india-news-tracker/SKILL.md`)
- Fetches headlines from MoneyControl, Economic Times, LiveMint, BSE/NSE filings
- Categorizes by impact (1-10 scale): CRITICAL, HIGH, MEDIUM, LOW
- Filters for actionable opportunities (24-hour recency)
- Portfolio alerts for holdings

**Trigger phrases:**
- "Indian market news today", "latest stock news India"
- "BSE NSE announcements today", "quarterly results India"

## GTT Auto-Placement

Run `npm run gtt:auto` to:
1. Load portfolio and identify unprotected holdings
2. Calculate stop-loss (avg_price × 0.88) and target (IV × 0.90)
3. Generate GTT placement parameters
4. Provide kite_place_gtt_order() commands to execute

## Daily Workflow with New Skills

```bash
# Full daily workflow (recommended order)
npm run scan           # 1. Scan opportunities (new ideas)
npm run workflow      # 2. Generate reports from existing data
npm run gtt:auto      # 3. Identify unprotected holdings
# Then manually execute GTT orders via kite_place_gtt_order()
npm run web           # 4. View dashboard
```

## Skill Integration

| New Skill | Integrates With | Data Source |
|-----------|----------------|-------------|
| india-market-breadth | fii-dii-flow-tracker, weekly-fno-trade-planner | NSE India CSV |
| fii-dii-flow-tracker | india-market-breadth, exposure-coach | MoneyControl |
| india-news-tracker | india-market-breadth, fii-dii-flow-tracker | ET, MCX, BSE/NSE |
