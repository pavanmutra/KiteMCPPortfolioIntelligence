# India Market Breadth Analyzer

Analyzes Indian market breadth health using NSE India data with a data-driven multi-component scoring system (0-100).

## What This Skill Does

- Fetches NSE advance/decline data, new highs/lows, and sector participation
- Calculates 6-component scoring: Overall Breadth, Sector Participation, Sector Rotation, Momentum, Mean Reversion Risk, Historical Context
- Measures how broadly the market is participating in a rally or decline (100 = maximum health, 0 = critical weakness)
- No API key required - uses freely available NSE India data

## When to Use This Skill

- "analyze Indian market breadth", "market breadth health"
- "NSE advance decline ratio", "Nifty breadth analysis"
- "India sector participation", "FII DII flow analysis"
- "NSE new highs new lows", "market rally quality"
- Assessing rally quality, market participation width, equity exposure levels for NSE/BSE

## Data Sources (All Free)

1. **NSE India Bhavcopy** - Daily equity bhavcopy with advances/declines
   - URL: https://www.nseindia.com/api/corporates-publish
   - Fallback: National Summary (nseindia.com)

2. **TradingView NSE** - Free charts for breadth indicators
   - URL: https://in.tradingview.com/markets/indices/

3. **Screener.in** - Free fundamentals (not needed for breadth)

4. **MoneyControl** - FII/DII daily data
   - URL: https://www.moneycontrol.com/stocks/marketstats/

## Analysis Framework

### 6-Component Scoring System

| Component | Weight | Data Points |
|------------|--------|-------------|
| **Overall Breadth** | 25% | Advances vs Declines, AD Ratio, % Stocks above MA50/MA200 |
| **Sector Participation** | 20% | % Sectors in uptrend, sector breadth distribution |
| **Sector Rotation** | 15% | Sector rotation patterns, leadership changes |
| **Momentum** | 15% | Nifty momentum, RSI, MACD trend |
| **Mean Reversion Risk** | 10% | Overbought/oversold indicators, divergence signals |
| **Historical Context** | 15% | Compare to historical averages, cycle position |

### Score Interpretation

| Score Range | Market Condition | Action |
|-------------|-----------------|--------|
| **80-100** | **Healthy Broad Rally** | ADD positions, high confidence |
| **60-79** | **Moderate Participation** | CAUTIOUS ADD, watch for deterioration |
| **40-59** | **Narrowing Rally** | REDUCE exposure, selective buying |
| **20-39** | **Distribution Phase** | SELL/AVOID, protect capital |
| **0-19** | **Critical Weakness** | FULL CASH, market bottom signals |

### Breadth Patterns

| Pattern | Description | Signal |
|---------|-------------|--------|
| **Healthy Breadth** | Majority of stocks advancing, broad participation | BULLISH |
| **Narrowing Breadth** | Few stocks carrying index, divergence | BEARISH |
| **Distribution** | Highs but declining breadth, institutional selling | BEARISH |
| **Accumulation** | Lows but rising breadth, smart money buying | BULLISH |
| **Sector Rotation** | Leadership changing, rotation to new sectors | NEUTRAL/CONFIRM |

## Workflow

### Step 1: Fetch Data

```
1. Access NSE India daily bhavcopy
2. Get advance/decline counts
3. Fetch FII/DII data from MoneyControl
4. Get Nifty 50 component data for sector analysis
```

### Step 2: Calculate Components

```
1. Calculate AD Ratio = Advances / Declines
2. Calculate % Stocks above MA50/MA200
3. Identify sector-level participation
4. Calculate momentum indicators
```

### Step 3: Generate Score

```
1. Weight each component
2. Apply historical context adjustments
3. Output final breadth score (0-100)
4. Generate market posture recommendation
```

### Step 4: Report Output

```markdown
# India Market Breadth Report

## Overall Score: XX/100 (STATUS)

### Component Breakdown
- Overall Breadth: XX/100
- Sector Participation: XX/100
- Sector Rotation: XX/100
- Momentum: XX/100
- Mean Reversion Risk: XX/100
- Historical Context: XX/100

## Key Metrics
- AD Ratio: X.XX
- Advances: XXX | Declines: XXX
- % Above MA50: XX%
- % Above MA200: XX%
- FII Net: ₹XXX Cr (X-day trend)
- DII Net: ₹XXX Cr (X-day trend)

## Market Posture
RECOMMENDATION: [NEW_ENTRY_ALLOWED / REDUCE_ONLY / CASH_PRIORITY]

## Action Items
- [Action 1]
- [Action 2]
- [Action 3]
```

## NSE-Specific Considerations

### Trading Hours (IST)
- Market Open: 09:15
- Market Close: 15:30
- Pre-market: 09:00-09:15
- Post-market: 15:30-16:00

### Key Indices to Monitor
1. **Nifty 50** - Large cap benchmark
2. **Nifty Midcap 100** - Mid cap breadth
3. **Nifty Smallcap 100** - Small cap breadth
4. **India VIX** - Fear gauge, inverse correlation

### FII/DII Data Timing
- Published daily around 16:00 IST
- Important for flow direction confirmation

### Seasonal Patterns
- **Q1 (Jan-Mar)** - Budget expectations, calendar year start
- **Q2 (Apr-Jun)** - FY end, earnings season
- **Q3 (Jul-Sep)** - Monsoon impact, Q2 results
- **Q4 (Oct-Dec)** - Festive season, year-end positioning

## Integration with Existing Skills

### Use With
- **india-news-tracker** - Confirm breadth with news flow
- **fii-dii-flow-tracker** - Institutional confirmation of breadth
- **weekly-fno-trade-planner** - Position sizing based on breadth
- **exposure-coach** - Overall equity exposure decision

### Input From
- NSE India bhavcopy (web)
- MoneyControl FII/DII (web)
- TradingView NSE (web)

## Skill Metadata

- **Type**: Market Timing / Breadth Analysis
- **API Required**: No (free data sources)
- **Execution Time**: 2-5 minutes
- **Update Frequency**: Daily (before market open or after close)
- **Confidence Level**: High when multiple sources confirm

## Error Handling

| Error | Handling |
|-------|----------|
| NSE website down | Use TradingView as fallback |
| FII/DII data delayed | Show "Data as of [date]" disclaimer |
| Incomplete bhavcopy | Partial analysis with warning |

## Quick Reference

```
India Market Breadth → Score 0-100 → Market Posture
Healthy (80-100) → NEW_ENTRY_ALLOWED
Moderate (60-79) → CAUTIOUS_ADD
Narrowing (40-59) → REDUCE_ONLY
Distribution (20-39) → SELL/AVOID
Critical (0-19) → CASH_PRIORITY
```