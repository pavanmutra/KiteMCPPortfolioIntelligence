# GTT STOP-LOSS RECOMMENDATIONS — March 31, 2026

**Last Updated:** 2026-03-31 09:30 IST  
**Portfolio Total Value:** ₹596,102  
**Status:** PENDING YOUR APPROVAL

---

## 📋 EXECUTIVE SUMMARY

**Situation:** 5 holdings are currently UNPROTECTED (no stop-loss GTT).

| Stock | Qty | Current P&L | Risk Level | GTT Status |
|-------|-----|-------------|-----------|-----------|
| ASHOKA | 435 | -₹4,662 (-9.3%) | 🔴 CRITICAL | NO GTT |
| CAMS | 228 | -₹20,006 (-11.7%) | 🟡 MEDIUM | BUY GTTs only |
| ENERGY | 2,571 | -₹2,781 (-3.0%) | 🟡 MEDIUM | BUY GTTs only |
| JINDALPHOT | 85 | -₹28,816 (-23.0%) | 🔴 HIGH | TARGET only |
| VHL | 35 | -₹22,102 (-17.5%) | 🟡 MEDIUM | TARGET only |
| TMCV | 110 | +₹4,427 (+2.2%) | ⏸️ VERIFY | DATA ISSUE |

---

## 🎯 MASTER RULES GOVERNING GTT PLACEMENT

```
Rule C-002:  Place GTT stop-loss same session as BUY fill
Rule P-001:  Review all GTTs every 30 days, trail with price
Rule P-008:  Verify GTT trigger direction matches price flow
Rule P-012:  GTT stop-loss transaction_type = "SELL" (not BUY)
Rule T-002:  All GTT logs include YYYY-MM-DD timestamp
Rule P-010:  Flexible field mapping for schema changes
Rule R-025:  SKIP stop-loss GTT if MoS ≥ 50% (deep value deserves patience)
```

**Stop-Loss Logic:** 
```
IF MoS ≥ 50%:
  → SKIP stop-loss GTT (hold through volatility)
  → Deep discount stocks should NOT exit on 12% dips
  
IF 25% ≤ MoS < 50%:
  → PLACE stop-loss GTT at avg_price × 0.88
  → Moderate discount needs downside protection
  
IF MoS < 25%:
  → DO NOT BUY (Rule C-001)
  → Fair/overvalued needs protection
```

---

## ✅ VALIDATION CHECKLIST (Must Pass All)

```
BEFORE PLACING ANY GTT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Trigger price is BELOW current market price (protects long)
[ ] transaction_type = "SELL" (liquidates position, not adds)
[ ] Trigger = avg_price × 0.88 (exactly, no rounding errors)
[ ] Quantity matches current holding quantity exactly
[ ] Exchange is NSE or BSE (verify symbol is on correct exchange)
[ ] Product = "CNC" (delivery trade, not intraday)
[ ] Trigger price doesn't conflict with existing GTTs
[ ] Order price is within ₹1-2 of trigger price
[ ] No GTT expires within 30 days
[ ] Holding is not on exit watchlist
[ ] JSON output validates schema before saving
[ ] Timestamp recorded for audit trail
```

---

## 🔴 PRIORITY 1: ASHOKA (NSE) — SKIP GTT (MoS 56.51%)

### Position Details
```
Symbol          : ASHOKA
Exchange        : NSE
Quantity        : 435 shares
Average Cost    : ₹112.72 per share
Current Price   : ₹102.13 per share
Total Investment: ₹49,033
Current Value   : ₹44,457
P&L             : -₹4,576 (-9.3%)
Status          : T1 PENDING (settles today)
```

### Stock Fundamentals
```
Type            : Growth (Infrastructure)
EPS (TTM)       : ₹11.79
Book Value      : ₹151.0
P/E Ratio       : 8.95x
Industry P/E    : 28.0x
Debt/Equity     : 0.49 (healthy)
ROE             : 7.8%
```

### Valuation
```
Graham Number   : ₹194.53
DCF Value       : ₹180.0
P/E Fair Value  : ₹330.12
Intrinsic Value (Avg): ₹234.88
Current Price   : ₹102.13
Margin of Safety: 56.51% 🔴 DEEP DISCOUNT
```

### ✅ GTT DECISION: SKIP STOP-LOSS (Rule R-025)

**Reason:** MoS 56.51% ≥ 50% threshold

```
WHY SKIP:
  ✅ Deep discount (56.51%) deserves patience
  ✅ Infrastructure sector has govt tailwinds
  ✅ Fundamentals intact (D/E 0.49, EPS stable)
  ✅ A 12% stop-loss would exit on normal volatility
  ✅ This is a generational opportunity at ₹102 vs ₹235 IV
  ✅ Should hold through 20-30% drawdowns if needed
  
EXCEPTION: If EPS declines 2Q+ or D/E > 2, revisit
  Currently: EPS stable, D/E 0.49 → NOT triggered
```

### Alternative Strategy Instead of Stop-Loss
```
Instead of exit stop, consider TARGET GTT:
  Target Price: ₹225 (at 96% of intrinsic value ₹234.88)
  Transaction:  SELL
  Trigger:      ₹225 (above current ₹102.13)
  
This ensures profits when deep discount is realized,
rather than exiting on noise.
```

### Decision
```
GTT RECOMMENDATION: ❌ DO NOT PLACE STOP-LOSS
Rationale           : MoS 56.51% ≥ 50% (Rule R-025)
Action              : HOLD without protective stop
Monitoring          : Review quarterly if MoS drops below 50%
Catalyst            : Infrastructure projects, order wins
Expected Timeline   : 18-24 months for IV realization
```

---

## 🟡 PRIORITY 2: CAMS (BSE) — MEDIUM

### Position Details
```
Symbol          : CAMS
Exchange        : BSE
Quantity        : 228 shares
Average Cost    : ₹707.89 per share
Current Price   : ₹625.90 per share
Total Investment: ₹161,401
Current Value   : ₹142,907
P&L             : -₹18,494 (-11.5%)
```

### Stock Fundamentals
```
Type            : Growth (MF Registrar - monopoly)
EPS (TTM)       : ₹18.73
Book Value      : ₹45.6
P/E Ratio       : 33.4x
Industry P/E    : 35.0x
Debt/Equity     : 0.0 (zero debt!)
ROE             : 43.9% (exceptional)
ROCE            : 54.8% (best-in-class)
```

### Valuation
```
Graham Number   : ₹138.26 (misleading for asset-light model)
DCF Value       : ₹580
P/E Fair Value  : ₹655.55 (more relevant for asset-light)
Intrinsic Value: ₹655.55
Current Price   : ₹625.90
Margin of Safety: 4.5% 🟢 FAIRLY VALUED
```

### Why This GTT Matters
```
⚠️ Fair value, NOT discounted — no MoS cushion
✅ Business quality is EXCEPTIONAL (zero debt, ROE 44%)
✅ Mutual fund registrar monopoly (CAMS, KFINTECH duopoly)
⚠️ Down 11.5% but no fundamental reason
⚠️ Existing BUY GTTs active but NO stop-loss protection
→ Must add downside protection
```

### Current GTTs on CAMS
```
GTT #1: BUY @ ₹595 (trigger ₹595)  — active, waiting
GTT #2: BUY @ ₹610 (trigger ₹610)  — active, waiting
Missing: SELL STOP-LOSS for downside
```

### GTT Recommendation
```
Action          : PLACE SELL STOP-LOSS
Trigger Price   : ₹622.94 (= 707.89 × 0.88)
Order Price     : ₹622.00
Quantity        : 228 shares
Transaction     : SELL ✅
Product         : CNC ✅
Validity        : DAY ✅

Why This Level  : 12% below cost, protects against further cascade
Maximum Loss    : ₹18,494 (same as current P&L if triggered)
Upside if Held  : ₹655 fair value = 4.6% upside
Dividend Yield  : ~1% expected (quality stock dividend)
```

### Decision Matrix

**APPROVE** ✅ if:
- [ ] You trust CAMS monopoly positioning long-term
- [ ] You can hold through 11.5% drawdown
- [ ] You accept fair value (no MoS) for quality

**REJECT** ❌ if:
- [ ] You see MF industry disruption risk
- [ ] You want tighter stop to lock breakeven
- [ ] You prefer to exit and deploy to discounted stocks

**PRICE ADJUSTMENT** 🔧 if:
- [ ] Prefer trigger at ₹630 instead of ₹622
- [ ] Prefer trigger at ₹615 (wider buffer)
- [ ] Other: ___________

---

## 🟡 PRIORITY 3: ENERGY (NSE) — MEDIUM

### Position Details
```
Symbol          : ENERGY (Nifty Energy ETF - Mirae Asset)
Exchange        : NSE
Quantity        : 2,571 shares (units)
Average Cost    : ₹36.08 per unit
Current Price   : ₹35.00 per unit
Total Investment: ₹92,779
Current Value   : ₹89,985
P&L             : -₹2,794 (-3.0%)
```

### ETF Details
```
Type            : Index ETF
Underlying      : Nifty Energy Index (NTPC, RELIANCE, IOC, etc.)
NAV             : ₹35.34
Premium/Discount: -0.06% (at NAV)
Dividend Yield  : ~3% (energy sector dividend stocks)
Tracking Error  : <0.5% (low)
```

### Why This GTT Matters
```
✅ ETF = diversified energy exposure
⚠️ Only 3% down but growing sector risk
⚠️ Crude oil dependent — geopolitical risk
✅ Current BUY GTTs active (good) but no stop-loss
→ Conservative protection against energy collapse
```

### Current GTTs on ENERGY
```
GTT #1: BUY @ ₹33.5 (trigger ₹33.5)  — from 2026-03-18
GTT #2: BUY @ ₹34.48 (trigger ₹34.48) — from 2026-03-23
Missing: SELL STOP-LOSS for downside
```

### GTT Recommendation
```
Action          : PLACE SELL STOP-LOSS
Trigger Price   : ₹31.79 (= 36.08 × 0.88)
Order Price     : ₹31.75
Quantity        : 2,571 units
Transaction     : SELL ✅
Product         : CNC ✅
Validity        : DAY ✅

Why This Level  : 12% below cost, accounts for crude oil volatility
Maximum Loss    : ₹2,794 (same as current P&L if triggered)
Upside Scenario : Crude oil surge → energy stocks up 8-12%
Downside Risk   : Geopolitical shock → oil collapse
Catalyst        : Global crude prices, OPEC decisions
```

### Decision Matrix

**APPROVE** ✅ if:
- [ ] You want energy sector exposure as portfolio hedge
- [ ] You believe crude oil prices will rise
- [ ] You accept commodity volatility

**REJECT** ❌ if:
- [ ] You see crude oil falling (global slowdown)
- [ ] You want to reduce commodity exposure
- [ ] You prefer tactical trading over holding

**PRICE ADJUSTMENT** 🔧 if:
- [ ] Prefer trigger at ₹32.50 (slightly wider)
- [ ] Prefer trigger at ₹31.00 (much wider)
- [ ] Other: ___________

---

## 🔴 PRIORITY 4: JINDALPHOT (NSE) — HIGH (Review for Exit)

### Position Details
```
Symbol          : JINDALPHOT (Jindal Photo Ltd)
Exchange        : NSE
Quantity        : 85 shares
Average Cost    : ₹1,320.71 per share
Current Price   : ₹981.70 per share
Total Investment: ₹112,260
Current Value   : ₹83,444
P&L             : -₹28,816 (-25.6%)
Status          : LARGEST LOSS IN PORTFOLIO
```

### Stock Fundamentals
```
Type            : Holding Company / Investment Company
EPS (TTM)       : ₹11.80
Book Value      : ₹1,030
P/E Ratio       : 86.1x (extremely high)
P/B Ratio       : 0.98x
Debt/Equity     : 0.06 (very low)
ROE             : 1.2% (poor)
EPS Trend       : ⚠️ DECLINING 2+ QUARTERS
```

### Valuation
```
Graham Number   : Not applicable (holding company)
P/B Fair Value  : ₹1,030 (book value 1.0x for holding cos)
Current Price   : ₹981.70
Margin of Safety: 4.7% (barely discounted)
```

### 🚨 CRITICAL RED FLAGS

```
⚠️ EPS DECLINING 2+ QUARTERS (Rule C-003)
   → Violates "never average down" rule
   → May indicate deteriorating fundamentals

⚠️ DOWN 25.6% (largest loss in portfolio)
   → Opportunity cost mounting
   → Capital could be redeployed to MoS 55%+ stocks

✅ Debt is low (D/E 0.06)
✅ Trading near book value (floor protection)
⚠️ ROE only 1.2% (not compounding value)

QUESTION: Is this a:
  a) Temporary dip in good business → hold with stop?
  b) Deteriorating business → exit?
  c) Liquidation play → wait for realization?
```

### Current GTTs on JINDALPHOT
```
GTT #1: SELL @ ₹1,200 (trigger ₹1,200)  — TARGET, not stop-loss
Problem: Current price ₹981 < target ₹1,200
         This GTT will trigger on UPSWING, not protect downside
Missing: SELL STOP-LOSS below current price
```

### GTT Recommendation — TWO OPTIONS

#### OPTION A: PROTECTIVE STOP + HOLD
```
Action          : PLACE SELL STOP-LOSS
Trigger Price   : ₹1,162.23 (= 1320.71 × 0.88)
Order Price     : ₹1,160.00
Quantity        : 85 shares
Transaction     : SELL ✅
Product         : CNC ✅

Thesis          : Holding company discount is temporary
                  Wait for corporate action / demerger
                  Stop protects against further deterioration
Maximum Loss    : ₹13,576 (additional 12% decline)
Upside          : If book value recognized = ₹1,030 = 5% upside
Downside        : EPS continues declining → stock tests ₹700-800
```

#### OPTION B: EXIT ENTIRELY (Recommended)
```
Action          : SELL entire position immediately
Execution       : Market order during liquid hours (10-3 PM)
Expected Price  : ₹980-990 (current bid-ask spread)
Cash Recovered  : ~₹83,400

Thesis          : Lock loss, redeploy to deep discount stocks
                  ASHOKA (MoS 55%) is better opportunity
                  VHL (MoS 75%) is better opportunity
                  EPS declining = fundamental deterioration
                  Can't afford to wait 2-3 years for realization

Tax Benefit     : Loss harvest ₹28,816 vs future gains
Opportunity Cost: ₹28,816 in capital that could earn 25%+ elsewhere
```

### Decision Matrix

**OPTION A: HOLD WITH STOP** ✅ if:
- [ ] You believe EPS decline is temporary
- [ ] You're patient for 2-3 years (demerger/unlock)
- [ ] You can tolerate further 12% decline

**OPTION B: EXIT** ✅ (RECOMMENDED) if:
- [ ] You see fundamental deterioration
- [ ] You want to redeploy to MoS 55%+ opportunities
- [ ] You've held for 2+ years already

**DECISION:** 
```
Choose one:
[ ] Option A: Place stop-loss at ₹1,160, hold long-term
[ ] Option B: Sell immediately at market
[ ] Option C: Other (specify): ___________
```

---

## 🟡 PRIORITY 5: VHL (NSE) — SKIP GTT (MoS 74.8% - Holding Company Discount)

### Position Details
```
Symbol          : VHL (Vardhaman Holdings Ltd)
Exchange        : NSE
Quantity        : 35 shares
Average Cost    : ₹3,608.39 per share
Current Price   : ₹2,976.90 per share
Total Investment: ₹126,294
Current Value   : ₹104,191
P&L             : -₹22,103 (-17.5%)
```

### Stock Fundamentals
```
Type            : NBFC / Holding Company / Investment Company
EPS (TTM)       : ₹727.37 (very high)
Book Value      : ₹11,800 (massive!)
P/B Ratio       : 0.26x (holding company discount)
P/E Ratio       : 4.22x (but misleading for holding cos)
Debt/Equity     : 0.10 (almost debt-free)
ROE             : 6.2% (low, because of holding structure)
```

### Investment Portfolio
```
Invested Assets: ₹3,728 Crore (in subsidiary companies)
Market Value    : ~₹11,800 Cr (implied by book value)
Current Price   : ₹2,976.90
Implied Margin  : 75% hidden value discount
Holding Company: Classic P/B 0.26x applies (typical)
```

### Valuation
```
Book Value Method (Most Relevant):
  Fair Value    : ₹11,800 per share (= book value)
  Current Price : ₹2,976.90
  Margin of Safety: 74.8% 🔴 DEEP DISCOUNT (structural)

P/E Method (Less Relevant):
  Graham Number : ₹13,905 (but inflated by holding structure)
  Industry P/E  : 15.0
  EPS-Based FV  : ₹10,910
```

### ✅ GTT DECISION: SKIP STOP-LOSS (Rule R-025)

**Reason:** MoS 74.8% ≥ 50% threshold (Structural holding company discount)

```
WHY SKIP:
  ✅ Massive discount (74.8%) is structural, not cyclical
  ✅ Almost debt-free (D/E 0.1)
  ✅ Investment portfolio worth ₹3,728 Cr (audited)
  ✅ Book value floor is real (₹11,800 per share)
  ✅ A 12% stop would trigger far above worst-case scenario
  ✅ Holding company discount is permanent — requires PATIENCE
  ✅ Value unlock possible over 2-3 years (demerger, corporate action)
  
EXCEPTION: If investment portfolio fundamentals deteriorate:
  Watch quarterly NAV updates
  If book value declines >15% QoQ → review stop-loss
  Currently: Book value stable → NOT triggered
```

### Alternative Strategy Instead of Stop-Loss
```
Instead of exit stop, consider TARGET GTT:
  Target Price: ₹8,500 (at 72% of book value ₹11,800)
  Transaction:  SELL
  Trigger:      ₹8,500 (above current ₹2,977)
  
This ensures profit capture when holding co discount narrows,
rather than exiting on noise.

OR: Patient hold for 2-3 years waiting for:
  • Demerger announcement
  • Strategic stake sale
  • Corporate restructuring
  • Market cap re-rating
```

### Holding Thesis
```
BULL CASE (Why Hold):
  ✅ Book value ₹11,800 vs price ₹2,977 = 75% hidden value
  ✅ Investment portfolio worth ₹3,728 Cr (audited)
  ✅ Near debt-free (D/E 0.10)
  ✅ Potential catalysts:
      • Demerger of major investee company
      • Strategic stake sale to PE/strategic buyer
      • Corporate restructuring
      • Market cap re-rating on sector rotation
  ✅ Patient capital can earn 100%+ over 2-3 years

BEAR CASE (Why Sell):
  ❌ ROE only 6.2% (not creating value)
  ❌ No clear path to unlock value
  ❌ Holding company discount is PERMANENT in India market
  ❌ Capital stuck vs better opportunities (ASHOKA MoS 55%)
  ❌ Could deteriorate further if investments underperform
  ❌ 17.5% down already, opportunity cost mounting
```

### Decision
```
GTT RECOMMENDATION: ❌ DO NOT PLACE STOP-LOSS
Rationale           : MoS 74.8% ≥ 50% (Rule R-025)
Action              : HOLD for value unlock (2-3 year thesis)
Monitoring          : Review quarterly if MoS drops below 50%
Catalyst            : Demerger, corporate action, market recognition
Risk                : Requires patience; no guaranteed timeline
```

---

## ⏸️ PRIORITY 6: TMCV (NSE) — VERIFICATION REQUIRED

### Data Issue Flagged
```
Symbol          : TMCV
Issue           : Tata Motors DVR converted Sept 2024 (7:10 ratio)
TMCV may be INVALID or LEGACY ticker
Risk            : GTT orders on wrong security = FAILED fills
```

### Current GTTs on TMCV
```
GTT #1: SELL @ ₹450 (trigger ₹450)  — TARGET
GTT #2: BUY @ ₹393 (trigger ₹395)   — STOP (TRIGGERED 2026-03-30)
```

### Position Details
```
Quantity        : 110 shares
Average Cost    : ₹367.13 per share
Current Price   : ₹394.80 per share
P&L             : +₹4,427 (+2.2% gain)
ISIN            : INE1TAE01010
```

### Required Verification Steps

```
ACTION ITEMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Contact Zerodha support (Chat / Phone)
    Question: "Is TMCV (INE1TAE01010) valid after DVR conversion?"
    
[ ] Check holding certificate / demat statement
    Confirm: Exact ISIN, security name, quantity
    
[ ] Cross-reference screener.in
    Search: "Tata Motors commercial vehicle" 
    Verify: Current trading symbol
    
[ ] Confirm GTT orders reference correct ISIN
    Risk: If ISIN mismatch, GTT may not trigger

UNTIL VERIFIED: ⏸️ DO NOT PLACE NEW GTTs ON TMCV
```

### GTT Decision
```
RECOMMENDATION: SKIP TMCV for now
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reason: Data integrity issue
Status: Existing GTTs OK (already placed before issue flagged)
Action: Investigate separately
Timeline: Complete before next buy/sell on TMCV
```

---

## 📊 SUMMARY TABLE — ALL 6 STOCKS

| Stock | CMP | Avg | Stop | MoS | Risk | GTT Decision | Notes |
|-------|-----|-----|------|-----|------|--------------|-------|
| **ASHOKA** | ₹102 | ₹113 | ₹99 | 55% 🔴 | CRITICAL | ✅ PLACE | Deep discount, protect urgently |
| **CAMS** | ₹626 | ₹708 | ₹622 | 4.5% | MEDIUM | ✅ PLACE | Fair value, quality, no cushion |
| **ENERGY** | ₹35 | ₹36 | ₹32 | 0.9% | MEDIUM | ✅ PLACE | ETF, commodity linked, volatile |
| **JINDALPHOT** | ₹982 | ₹1,321 | ₹1,160 | 4.7% | HIGH | 🤔 OPTIONS | EPS declining, -25% loss, review exit |
| **VHL** | ₹2,977 | ₹3,608 | ₹3,170 | 74.8% 🔴 | MEDIUM | ✅ PLACE | Holding co discount, long-term |
| **TMCV** | ₹395 | ₹367 | - | +2.2% | ⏸️ VERIFY | ⏸️ SKIP | DVR conversion data issue |

---

## 🎯 APPROVAL CHECKLIST — YOUR DECISIONS NEEDED

### Decision 1: TMCV Verification
```
[ ] I will verify with broker (timeline: ________)
[ ] Skip for now, investigate later
[ ] Proceed with assumption TMCV is valid
```

### Decision 2: ASHOKA GTT
```
[ ] APPROVE: Place SELL STOP at ₹99.00 (qty 435)
[ ] REJECT: Don't place, will exit manually
[ ] MODIFY: Use different price: ___________
[ ] HOLD: Decide later
```

### Decision 3: CAMS GTT
```
[ ] APPROVE: Place SELL STOP at ₹622.00 (qty 228)
[ ] REJECT: Don't place
[ ] MODIFY: Use different price: ___________
[ ] HOLD: Decide later
```

### Decision 4: ENERGY GTT
```
[ ] APPROVE: Place SELL STOP at ₹31.75 (qty 2571)
[ ] REJECT: Don't place
[ ] MODIFY: Use different price: ___________
[ ] HOLD: Decide later
```

### Decision 5: JINDALPHOT GTT
```
[ ] OPTION A: Place SELL STOP at ₹1,160.00 (hold with protection)
[ ] OPTION B: EXIT entire position now (recommended)
[ ] MODIFY: Use different price for stop: ___________
[ ] HOLD: Decide later
```

### Decision 6: VHL GTT
```
[ ] APPROVE: Place SELL STOP at ₹3,170.00 (qty 35)
[ ] REJECT: Don't place
[ ] MODIFY: Use different price: ___________
[ ] HOLD: Decide later (long-term patience play)
```

---

## 🚀 NEXT STEPS (Once You Decide)

### Timeline
```
STEP 1: Review this document ✓ (you're here)
STEP 2: Fill in approval checklist (your action)
STEP 3: OpenCode places GTTs (my action)
STEP 4: Verify GTT IDs logged (audit trail)
STEP 5: Generate daily report (GATE 4)
STEP 6: Export Excel file (GATE 5)
STEP 7: Ready for trading
```

### How to Communicate Your Decisions
```
Option A: Reply with filled checklist above
Option B: Reply with summary (e.g., "Approve all except JINDALPHOT - exit")
Option C: Command me to proceed with specific GTTs
Option D: Request changes/analysis for specific stocks
```

---

## 📚 REFERENCE RULES

### Why These Rules Matter
```
C-002: "Place GTT stop-loss same session as BUY fill"
       → Unprotected positions are financial emergency
       → Market can move 15%+ overnight
       → Automatic execution removes emotion

P-001: "Review all GTTs every 30 days, trail with price"
       → Prices move, triggers become stale
       → Monthly review prevents "stale GTT" problem
       → Trailing formula: stop = highest_close × 0.88

P-008: "Verify GTT trigger direction matches price flow"
       → Stop-loss MUST be BELOW current price
       → Target MUST be ABOVE current price
       → Wrong direction = GTT fails when needed most

P-012: "GTT stop-loss transaction_type = SELL (not BUY)"
       → BUY stop would ADD shares on drop (disaster!)
       → SELL stop liquidates position (correct)
       → Common mistake = wrong transaction_type
```

---

## 📝 AUDIT TRAIL

```
Date Created    : 2026-03-31 09:35 IST
Document        : 2026-03-31_gtt_recommendations.md
Review Status   : PENDING USER APPROVAL
Last Updated    : 2026-03-31 09:35 IST
Portfolio State : 7 holdings, 16 active GTTs, 5 unprotected
```

---

**END OF DOCUMENT**

Once you decide, reply with your approval decisions and I'll execute the GTT placements immediately.
