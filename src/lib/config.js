/**
 * KiteMCP Configuration
 * Centralized configuration values
 */

module.exports = {
    // Portfolio defaults (fallback when JSON not available)
    portfolio: {
        defaultHoldings: [
            { symbol: 'CAMS',       quantity: 228,  average_price: 713.99,  last_price: 644.20,  pnl: -15912.05 },
            { symbol: 'ENERGY',     quantity: 2571, average_price: 36.08,   last_price: 35.71,   pnl: -955.87   },
            { symbol: 'JINDALPHOT', quantity: 85,   average_price: 1320.71, last_price: 1096.30, pnl: -19074.90 },
            { symbol: 'NXST-RR',    quantity: 650,  average_price: 135.19,  last_price: 155.52,  pnl: 13217.14  },
            { symbol: 'TMCV',       quantity: 110,  average_price: 355.37,  last_price: 431.85,  pnl: 8412.26   },
            { symbol: 'VHL',        quantity: 35,   average_price: 3608.39, last_price: 3143.40, pnl: -16274.50 }
        ],
        defaultAvailableMargin: 1999661.80
    },

    // Export defaults
    export: {
        commodityDefaults: [
            { symbol: 'GOLD', price: 74500, change_percent: 0.52, trend: 'BULLISH', recommendation: 'HOLD' },
            { symbol: 'SILVER', price: 89500, change_percent: -0.32, trend: 'NEUTRAL', recommendation: 'WATCH' },
            { symbol: 'CRUDE', price: 5200, change_percent: 1.25, trend: 'BULLISH', recommendation: 'BUY ON DIP' },
            { symbol: 'NATURALGAS', price: 180, change_percent: -2.15, trend: 'BEARISH', recommendation: 'SELL' }
        ],
        // Fallback holdings with all fields needed for export
        defaultHoldings: [
            { symbol: 'TMCV',       quantity: 110,  average_price: 355.37,  last_price: 431.85, pnl: 8412.26,  pnl_percent: 21.53, dividend_yield: 0.5, holding_period_days: 380 },
            { symbol: 'NXST-RR',   quantity: 650,  average_price: 135.19,  last_price: 155.52, pnl: 13217.14, pnl_percent: 14.4,  dividend_yield: 6.2, holding_period_days: 290 },
            { symbol: 'JINDALPHOT',quantity: 85,   average_price: 1320.71, last_price: 1141.4, pnl: -15241,   pnl_percent: -13.6, dividend_yield: 0.8, holding_period_days: 210 },
            { symbol: 'VHL',        quantity: 35,   average_price: 3608.39, last_price: 3148.2, pnl: -16107,   pnl_percent: -12.8, dividend_yield: 1.2, holding_period_days: 195 },
            { symbol: 'CAMS',       quantity: 228,  average_price: 713.99,  last_price: 644.20, pnl: -15912,   pnl_percent: -9.8,  dividend_yield: 1.5, holding_period_days: 420 },
            { symbol: 'ENERGY',     quantity: 2571, average_price: 36.08,   last_price: 35.71,  pnl: -955,     pnl_percent: -1.0,  dividend_yield: 0.0, holding_period_days: 150 }
        ]
    },

    // Gate check settings
    gates: {
        staleThresholdMinutes: 240,  // Files older than 4 hours marked stale
        pollIntervalMs: 5000,        // Poll every 5 seconds
        timeoutMs: 2 * 60 * 60 * 1000,  // 2 hour timeout
        scriptTimeoutMs: 60000       // 1 minute per script
    },

    // Risk thresholds
    risk: {
        maxPositionSizePercent: 10,
        maxSingleStockPercent: 25,
        maxSectorWeightPercent: 40,
        deepDiscountMos: 40,
        moderateDiscountMos: 25,
        overvaluedMos: -15,
        largeLossThreshold: -15,
        taxLossHarvestThreshold: -10
    },

    // Valuation
    valuation: {
        grahamMultiplier: 22.5,
        dcfDiscountRate: 0.12,
        dcfHorizonYears: 5,
        bankPbMultiple: 2.0,
        holdingCompanyPb: 1.0
    },

    // Document settings
    document: {
        // US Letter size in DXA (1 inch = 1440 DXA)
        pageWidth: 12240,
        pageHeight: 15840,
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        font: 'Arial',
        fontSize: 22  // 11pt = 22 half-points
    },

    // Time conversion
    time: {
        msPerMinute: 60000,
        msPerHour: 3600000
    }
};
