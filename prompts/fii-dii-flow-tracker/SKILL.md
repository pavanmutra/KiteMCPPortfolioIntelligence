# FII/DII Flow Tracker

Tracks and analyzes Foreign Institutional Investor (FII) and Domestic Institutional Investor (DII) daily buy/sell flows in Indian markets. Identifies smart money accumulation and distribution patterns.

## What This Skill Does

- Tracks FII/DII daily net buying/selling in NSE/BSE
- Analyzes multi-day and weekly trends
- Identifies accumulation/distribution patterns
- Correlates with market direction (Nifty, Sensex)
- No API key required - uses free data sources

## When to Use This Skill

- "track FII DII flows", "institutional flows India"
- "FII selling buying trend", "DII activity today"
- "institutional investor sentiment", "smart money flow"
- "FII DII net buy sell", "market direction institutional"
- Assessing FII/DII impact on Nifty/market direction

## Data Sources (All Free)

1. **MoneyControl** - Daily FII/DII data
   - URL: https://www.moneycontrol.com/stocks/marketstats/

2. **NSE India** - Institutional trading data
   - URL: https://www.nseindia.com/api/corporates-publish

3. **Economic Times** - FII flow news and data
   - URL: https://economictimes.indiatimes.com/markets

4. **TradingView** - Institutional flow charts
   - URL: https://in.tradingview.com/

## Analysis Framework

### Daily Flow Tracking

| Investor Type | Full Name | Typical Behavior |
|---------------|-----------|------------------|
| **FII** | Foreign Institutional Investors | Global macro driven, sentiment sensitive |
| **DII** | Domestic Institutional Investors | Insurance, PF, mutual funds, steady |
| **DI** | Domestic Individuals | Retail, often contrarian |

### Flow Interpretation Matrix

| FII Flow | DII Flow | Market Signal | Action |
|----------|----------|---------------|--------|
| BUY | BUY | Strong bullish | ADD |
| BUY | SELL | FII conviction | CAUTIOUS ADD |
| SELL | BUY | DII support | HOLD/REDUCE |
| SELL | SELL | Strong bearish | SELL/AVOID |

### Trend Analysis

#### Short-term (1-5 days)
- Daily net flows
- 3-day moving average
- Direction indicator

#### Medium-term (10-30 days)
- Weekly cumulative
- Trend direction (up/down/flat)
- Consistency score

#### Long-term (90 days+)
- Monthly aggregates
- Cycle position
- Historical comparison

### Flow Quality Indicators

| Indicator | Calculation | Signal |
|-----------|-------------|--------|
| **Flow Consistency** | % Days aligned with trend | High = reliable |
| **Concentration** | Single-day vs spread | Spread = steady |
| **Reversal Signal** | Extreme flow reversal | Contrarian entry |
| **Correlation** | Flow vs Nifty movement | Leading/lagging |

## Score System (0-100)

### Component Weights

| Component | Weight | Description |
|-----------|--------|-------------|
| **Flow Direction** | 30% | Net buying/selling intensity |
| **Trend Strength** | 25% | Consistency over 10 days |
| **DII Support** | 20% | DII vs FII alignment |
| **Market Correlation** | 15% | Flow correlation with Nifty |
| **Historical Context** | 10% | Comparison to typical patterns |

### Score Interpretation

| Score | Signal | Recommendation |
|-------|--------|----------------|
| **80-100** | Strong FII+DII buying | Aggressive equity allocation |
| **60-79** | Moderate buying | Cautious addition |
| **40-59** | Mixed/Unclear | Neutral, wait |
| **20-39** | Moderate selling | Reduce exposure |
| **0-19** | Strong selling | Defensive, cash priority |

## Workflow

### Step 1: Gather Data
```
1. Fetch today's FII/DII net flows
2. Get 10-day historical flows
3. Access Nifty correlation data
4. Calculate trend indicators
```

### Step 2: Analyze Patterns
```
1. Identify flow direction (buy/sell)
2. Calculate trend strength
3. Assess DII support level
4. Check correlation with Nifty
```

### Step 3: Generate Score
```
1. Apply scoring weights
2. Generate market posture
3. Create actionable recommendations
```

### Step 4: Report Output

```markdown
# FII/DII Flow Analysis Report

## Overall Score: XX/100 (STATUS)

### Today's Flows
- FII Net: ₹XXX Cr (BUY/SELL)
- DII Net: ₹XXX Cr (BUY/SELL)
- DI Net: ₹XXX Cr (BUY/SELL)

### 10-Day Trend
| Date | FII (Cr) | DII (Cr) | Nifty Change |
|------|----------|----------|--------------|
| DD-MM | +XXX | +XXX | +X.XX% |
| ... | ... | ... | ... |

### Trend Analysis
- FII Trend: 5-day Bought/Sold
- DII Trend: 10-day Net
- Correlation: XX% with Nifty

### Flow Quality
- Consistency Score: XX%
- Reversal Signal: NONE/AT EXTREME

### Market Posture
RECOMMENDATION: [BUY / HOLD / REDUCE / SELL]

### Historical Context
- FII MTD: ₹XXX Cr (Net XXX)
- FII QTD: ₹XXX Cr (Net XXX)
- vs 3-month avg: +XX%

### Action Items
- [Action 1 based on flow analysis]
- [Action 2]
- [Action 3]
```

## Key Metrics to Track

### Daily Metrics
- FII Net (₹ Crores)
- DII Net (₹ Crores)
- Total Market Net

### Rolling Averages
- 5-day FII average
- 10-day DII average
- 20-day combined

### Cumulative
- Monthly FII total
- Quarterly FII total
- Year-to-date

### Market Impact
- Nifty correlation (1-day lag)
- Sector flow breakdown
- Delivery percentage impact

## Integration with Existing Skills

### Use With
- **india-market-breadth** - Confirm breadth with flows
- **weekly-fno-trade-planner** - Trade direction confirmation
- **exposure-coach** - Overall equity exposure
- **scenario-analyzer** - Macro regime confirmation

### Input From
- MoneyControl daily data (web)
- NSE India institutional data (web)
- Economic Times market data (web)

## India-Specific Considerations

### FII Behavior Patterns
- **Global risk-on**: Buy Indian equities
- **Global risk-off**: Sell aggressively
- **USD strength**: Sell (currency risk)
- **Emerging market outflows**: Sell India too

### DII Behavior Patterns
- **Counter-cyclical**: Buy when FII sell
- **Steady accumulation**: Regular monthly inflows
- **SIP flows**: Consistent MF buying
- **Insurance/EPFO**: Long-term steady

### Important Dates
- **Monthly FII data**: Around 1st of month
- **Quarterly results**: Apr, Jul, Oct, Jan
- **Union Budget**: February 1
- **RBI policy**: Bi-monthly (6 times/year)

### Seasonal Flow Patterns
- **Jan-Feb**: FII calendar year start, buying
- **Mar-Apr**: FII fiscal year end, possible selling
- **Sep-Oct**: FII emerging market rebalancing
- **Nov-Dec**: FII year-end positioning

## Skill Metadata

- **Type**: Institutional Flow Analysis
- **API Required**: No (free data sources)
- **Execution Time**: 3-5 minutes
- **Update Frequency**: Daily (after 16:00 IST)
- **Confidence Level**: High - direct flow data

## Error Handling

| Error | Handling |
|-------|----------|
| Data not updated | Show "Data as of [date/time]" |
| Website down | Use alternative source |
| Conflicting data | Show range, note discrepancy |

## Quick Reference

```
FII BUY + DII BUY = Strong Bullish (80-100)
FII BUY + DII SELL = FII Conviction (60-79)
FII SELL + DII BUY = DII Support (40-59)
FII SELL + DII SELL = Bearish (0-39)

FII extreme selling = Potential bottom (contrarian)
FII extreme buying = Potential top (contrarian)
```

## Output Schema

```json
{
  "score": "number (0-100)",
  "signal": "string (BULLISH/BEARISH/NEUTRAL)",
  "fii_net_today": "number (crores)",
  "dii_net_today": "number (crores)",
  "trend_5day": "string (BUYING/SELLING/FLAT)",
  "trend_10day": "string (BUYING/SELLING/FLAT)",
  "recommendation": "string (NEW_ENTRY_ALLOWED/REDUCE_ONLY/CASH_PRIORITY)",
  "confidence": "number (0-100)"
}
```