/**
 * Common formatting utilities
 */
class Formatters {
    static formatCurrency(value) {
        if (value == null || isNaN(value)) return "₹0.00";
        
        const absValue = Math.abs(value);
        if (absValue >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
        if (absValue >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
        
        return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
    }

    static formatPercent(value) {
        if (value == null || isNaN(value)) return "0.00%";
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    }

    static normalizeHoldings(rawHoldings = []) {
        return rawHoldings.map(h => ({
            symbol: h.symbol || h.tradingsymbol || 'UNKNOWN',
            qty: h.quantity || h.qty || 0,
            avg: h.average_price || h.avg || h.avg_price || 0,
            last: h.current_price || h.last_price || h.last || 0,
            pnl: h.pnl || 0
        }));
    }
}

module.exports = Formatters;
