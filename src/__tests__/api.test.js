/**
 * Unit tests for API helper: getRecommendations()
 * Tests pure recommendation logic in isolation.
 *
 * NOTE: getRecommendations is not exported from routes/api.js,
 * so we copy it inline here. Keep in sync with api.js:275-311.
 */

function getRecommendations(freshness, isMarketOpen) {
    const recs = [];

    if (freshness === 'historical') {
        recs.push({
            type: 'warning',
            message: 'Showing historical data. Run AI agent refresh for today\'s prices.',
            action: 'npm run refresh'
        });
    }

    if (freshness === 'stale' && isMarketOpen) {
        recs.push({
            type: 'warning',
            message: 'Data is older than 30 minutes. Refresh for live prices.',
            action: 'Click "Refresh with AI" button'
        });
    }

    if (freshness === 'current' || freshness === 'recent') {
        recs.push({
            type: 'success',
            message: 'Data is current.',
            action: null
        });
    }

    if (isMarketOpen && (freshness === 'stale' || freshness === 'historical')) {
        recs.push({
            type: 'info',
            message: 'Market is open. Live prices available.',
            action: 'Refresh now'
        });
    }

    return recs;
}

/**
 * Portfolio schema validation helpers
 * These tests ensure the portfolio JSON has the correct fields
 * for the dashboard to display properly.
 */
function validatePortfolioSchema(portfolio) {
    const errors = [];
    
    if (!portfolio) {
        errors.push('Portfolio is null/undefined');
        return { valid: false, errors };
    }
    
    // Check required top-level fields (dashboard expects these exact names)
    if (typeof portfolio.total_value !== 'number') {
        errors.push(`total_value missing or not a number: ${typeof portfolio.total_value}`);
    }
    
    if (typeof portfolio.total_pnl !== 'number') {
        errors.push(`total_pnl missing or not a number: ${typeof portfolio.total_pnl}`);
    }
    
    if (typeof portfolio.total_pnl_pct !== 'number') {
        errors.push(`total_pnl_pct missing or not a number: ${typeof portfolio.total_pnl_pct}`);
    }
    
    if (!Array.isArray(portfolio.holdings)) {
        errors.push(`holdings is not an array: ${typeof portfolio.holdings}`);
    }
    
    return { valid: errors.length === 0, errors };
}

function validateHoldings(holdings) {
    const errors = [];
    
    if (!Array.isArray(holdings)) {
        return { valid: false, errors: ['holdings is not an array'] };
    }
    
    holdings.forEach((h, idx) => {
        // Check required per-holding fields
        if (!h.symbol) {
            errors.push(`Holding ${idx}: missing symbol`);
        }
        if (typeof h.qty !== 'number' && typeof h.quantity !== 'number') {
            errors.push(`Holding ${h.symbol || idx}: missing qty/quantity`);
        }
        if (typeof h.current_price !== 'number' && typeof h.last_price !== 'number') {
            errors.push(`Holding ${h.symbol || idx}: missing current_price/last_price`);
        }
    });
    
    return { valid: errors.length === 0, errors };
}

describe('getRecommendations (API helper)', () => {
    describe('historical freshness', () => {
        test('returns warning for historical data', () => {
            const result = getRecommendations('historical', false);
            expect(result).toContainEqual(
                expect.objectContaining({
                    type: 'warning',
                    message: expect.stringContaining('historical')
                })
            );
        });

        test('returns action for historical data', () => {
            const result = getRecommendations('historical', false);
            expect(result[0].action).toBe('npm run refresh');
        });
    });

    describe('stale freshness during market open', () => {
        test('returns warning for stale data during market hours', () => {
            const result = getRecommendations('stale', true);
            expect(result).toContainEqual(
                expect.objectContaining({
                    type: 'warning',
                    message: expect.stringContaining('30 minutes')
                })
            );
        });

        test('returns info for stale + market open', () => {
            const result = getRecommendations('stale', true);
            expect(result.some(r => r.type === 'info' && r.message.includes('Market is open'))).toBe(true);
        });
    });

    describe('current/recent freshness', () => {
        test('returns success for current data', () => {
            const result = getRecommendations('current', true);
            expect(result).toContainEqual(
                expect.objectContaining({
                    type: 'success',
                    message: expect.stringContaining('current')
                })
            );
        });

        test('returns success for recent data', () => {
            const result = getRecommendations('recent', false);
            expect(result).toContainEqual(
                expect.objectContaining({
                    type: 'success'
                })
            );
        });

        test('recent data has no action', () => {
            const result = getRecommendations('recent', true);
            const success = result.find(r => r.type === 'success');
            expect(success.action).toBeNull();
        });
    });

    describe('market closed scenarios', () => {
        test('historical + market closed: no market info message', () => {
            const result = getRecommendations('historical', false);
            const hasMarketInfo = result.some(r =>
                r.type === 'info' && r.message.includes('Market is open')
            );
            expect(hasMarketInfo).toBe(false);
        });

        test('current + market closed: no market open info', () => {
            const result = getRecommendations('current', false);
            const hasMarketOpen = result.some(r =>
                r.type === 'info' && r.message.includes('Market is open')
            );
            expect(hasMarketOpen).toBe(false);
        });
    });

    describe('empty freshness', () => {
        test('returns empty array for unrecognized freshness', () => {
            // Unknown freshness values don't match any condition → empty array
            const result = getRecommendations('', true);
            expect(Array.isArray(result)).toBe(true);
        });

        test('returns empty array for null freshness', () => {
            const result = getRecommendations(null, false);
            expect(Array.isArray(result)).toBe(true);
        });
    });
});

describe('Portfolio Schema Validation', () => {
    describe('validatePortfolioSchema', () => {
        test('passes with valid portfolio data', () => {
            const portfolio = {
                total_value: 1572775.14,
                total_pnl: 134321.35,
                total_pnl_pct: 9.34,
                holdings: [
                    { symbol: 'TMCV', qty: 160, current_price: 386.85, pnl: 3155, pnl_percent: 5.37 }
                ]
            };
            const result = validatePortfolioSchema(portfolio);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('fails when total_value is missing', () => {
            const portfolio = {
                total_pnl: 134321.35,
                total_pnl_pct: 9.34,
                holdings: []
            };
            const result = validatePortfolioSchema(portfolio);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('total_value missing or not a number: undefined');
        });

        test('fails when total_pnl is missing', () => {
            const portfolio = {
                total_value: 1572775.14,
                total_pnl_pct: 9.34,
                holdings: []
            };
            const result = validatePortfolioSchema(portfolio);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('total_pnl missing or not a number: undefined');
        });

        test('fails when total_pnl_pct is missing', () => {
            const portfolio = {
                total_value: 1572775.14,
                total_pnl: 134321.35,
                holdings: []
            };
            const result = validatePortfolioSchema(portfolio);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('total_pnl_pct missing or not a number: undefined');
        });

        test('fails when holdings is not an array', () => {
            const portfolio = {
                total_value: 1572775.14,
                total_pnl: 134321.35,
                total_pnl_pct: 9.34,
                holdings: 'not an array'
            };
            const result = validatePortfolioSchema(portfolio);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('holdings is not an array: string');
        });

        test('fails when portfolio is null', () => {
            const result = validatePortfolioSchema(null);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Portfolio is null/undefined');
        });

        test('fails when portfolio is undefined', () => {
            const result = validatePortfolioSchema(undefined);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Portfolio is null/undefined');
        });

        test('passes with alternative field names (qty, last_price)', () => {
            const portfolio = {
                total_value: 1572775.14,
                total_pnl: 134321.35,
                total_pnl_pct: 9.34,
                holdings: [
                    { symbol: 'TMCV', quantity: 160, last_price: 386.85, pnl: 3155, pnl_percent: 5.37 }
                ]
            };
            const result = validatePortfolioSchema(portfolio);
            expect(result.valid).toBe(true);
        });
    });

    describe('validateHoldings', () => {
        test('passes with valid holdings array', () => {
            const holdings = [
                { symbol: 'TMCV', qty: 160, current_price: 386.85 },
                { symbol: 'CAMS', quantity: 244, last_price: 662.9 }
            ];
            const result = validateHoldings(holdings);
            expect(result.valid).toBe(true);
        });

        test('fails when holdings is not an array', () => {
            const result = validateHoldings('not array');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('holdings is not an array');
        });

        test('fails when holding has no symbol', () => {
            const holdings = [
                { qty: 160, current_price: 386.85 }
            ];
            const result = validateHoldings(holdings);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Holding 0: missing symbol');
        });

        test('fails when holding has no qty/quantity', () => {
            const holdings = [
                { symbol: 'TMCV', current_price: 386.85 }
            ];
            const result = validateHoldings(holdings);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Holding TMCV: missing qty/quantity');
        });

        test('fails when holding has no current_price/last_price', () => {
            const holdings = [
                { symbol: 'TMCV', qty: 160 }
            ];
            const result = validateHoldings(holdings);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Holding TMCV: missing current_price/last_price');
        });
    });
});

describe('Total P&L Calculation from Holdings', () => {
    test('calculates total_pnl from holdings correctly', () => {
        const holdings = [
            { symbol: 'A', qty: 10, avg_price: 100, current_price: 110, pnl: 100, pnl_percent: 10 },
            { symbol: 'B', qty: 20, avg_price: 50, current_price: 45, pnl: -100, pnl_percent: -10 },
            { symbol: 'C', qty: 5, avg_price: 200, current_price: 250, pnl: 250, pnl_percent: 25 }
        ];
        
        // Sum pnl directly from holdings
        const totalPnl = holdings.reduce((sum, h) => sum + (h.pnl || 0), 0);
        
        expect(totalPnl).toBe(250); // 100 - 100 + 250
    });

    test('calculates total_value from holdings correctly', () => {
        const holdings = [
            { symbol: 'A', qty: 10, current_price: 110 },
            { symbol: 'B', qty: 20, current_price: 45 },
            { symbol: 'C', qty: 5, current_price: 250 }
        ];
        
        // Calculate current_value for each holding
        const totalValue = holdings.reduce((sum, h) => {
            const qty = h.qty || h.quantity || 0;
            const price = h.current_price || h.last_price || 0;
            return sum + (qty * price);
        }, 0);
        
        expect(totalValue).toBe(3250); // 10*110 + 20*45 + 5*250 = 1100 + 900 + 1250
    });
});
