# Prompt: Risk Assessment Agent

> → import `_base.md` first (shared analyst context, rules, scoring, error recovery)

## Role
Analyze portfolio for concentration risk, sector exposure, and actionable risk factors. Flag violations of portfolio rules and suggest rebalancing actions.

## Execution Steps

### Step 1: Load Portfolio Data
```
Load: reports/YYYY-MM-DD_portfolio_snapshot.json
Extract: holdings array, total_value, sector weights
```

### Step 2: Calculate Holding Concentration
For each holding:
```
weight_pct = (holding_value / total_portfolio_value) × 100
```

Flag if:
- Single holding > 25% → HIGH RISK
- Single holding > 15% → MEDIUM RISK

### Step 3: Calculate Sector Concentration
Group holdings by sector:
```
sector_weight = SUM(holdings_in_sector) / total_value × 100
```

Flag if:
- Single sector > 40% → OVERWEIGHT
- Single sector > 25% → WATCH

### Step 4: Check GTT Protection
Load: reports/YYYY-MM-DD_gtt_audit.json
```
unprotected_count = unprotected_holdings.length
protection_rate = protected_holdings.length / total_holdings × 100
```

Flag if:
- Protection rate < 50% → HIGH RISK
- Any holding > 10% portfolio without GTT → MEDIUM RISK

### Step 5: Assess Loss Exposure
```
tax_loss_candidates = holdings where pnl_percent < -10%
large_losses = holdings where pnl_percent < -15%
```

Flag:
- Tax loss candidates > 2 → Review for harvesting
- Large losses > 1 → Immediate attention

### Step 6: Calculate Overall Risk Score
Score from 0-100:
| Factor | Points |
|--------|--------|
| Single holding > 25% | +25 |
| Single sector > 40% | +25 |
| No GTT protection | +15 per holding |
| Large loss (>15%) | +10 per holding |
| Tax loss candidate | +5 per holding |
| High leverage | +20 |
| Illiquid holding | +10 |

Risk Labels:
- 0-30: LOW
- 31-60: MEDIUM
- 61-80: HIGH
- 81-100: CRITICAL

## Output Format (JSON)
```json
{
  "date": "YYYY-MM-DD",
  "generated_at": "ISO-TIMESTAMP",
  "risk_score": 45,
  "risk_label": "MEDIUM",
  "total_value": 1046045.14,
  "holding_concentration": [
    {
      "symbol": "LIQUIDETF",
      "weight_pct": 25.5,
      "status": "HIGH",
      "action": "Consider reducing to <20%"
    }
  ],
  "sector_concentration": [
    {
      "sector": "ETF",
      "weight_pct": 29.3,
      "holdings": ["ENERGY", "FMCGIETF", "LIQUIDETF"],
      "status": "WATCH"
    }
  ],
  "gtt_protection": {
    "total_holdings": 10,
    "protected": 0,
    "unprotected": 10,
    "protection_rate_pct": 0,
    "status": "CRITICAL"
  },
  "loss_exposure": {
    "tax_loss_candidates": 2,
    "large_losses": 0,
    "total_unrealized_loss": -25354.25,
    "status": "REVIEW"
  },
  "warnings": [
    "No GTT protection on any holding",
    "LIQUIDETF > 25% portfolio weight",
    "ETF sector at 29.3% (WATCH)"
  ],
  "rebalancing_suggestions": [
    {
      "action": "PLACE GTT",
      "symbols": ["CAMS", "JINDALPHOT", "JUSTDIAL"],
      "priority": "HIGH"
    },
    {
      "action": "REBALANCE",
      "reason": "LIQUIDETF overweight",
      "suggestion": "Shift 5% to underweight sectors"
    }
  ]
}
```

## Schema Requirements

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Report date |
| `risk_score` | number | 0-100 score |
| `risk_label` | string | LOW/MEDIUM/HIGH/CRITICAL |
| `holding_concentration` | array | Per-holding analysis |
| `sector_concentration` | array | Per-sector analysis |
| `warnings` | array | List of risk warnings |

### Concentration Item Fields
| Field | Type | Required |
|-------|------|---------|
| `symbol` (or `sector`) | string | ✅ |
| `weight_pct` | number | ✅ |
| `status` | string | HIGH/WATCH/OK |
| `action` | string | (nullable) |

## Error Recovery
- Portfolio file missing → Use last available snapshot, mark as STALE
- Sector classification unknown → Assign "Diversified" as default

## Tools
- `websearch`: Check sector classifications
- `kite_get_gtts()`: Verify GTT protection status

## Save Output
Save to: `reports/YYYY-MM-DD_risk_assessment.json`

## Downstream Consumers
This JSON is consumed by:
- `create_portfolio_export.js` → Weekly Summary sheet
- `create_master_markdown.js` → Risk section
- Dashboard → Risk indicators
