/**
 * API Routes for Portfolio Dashboard
 * REST endpoints to serve JSON data from reports/
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const REPORTS_DIR = path.join(__dirname, '../../reports');

/**
 * Helper: Get list of available report dates
 */
function getAvailableDates() {
    try {
        const entries = fs.readdirSync(REPORTS_DIR, { withFileTypes: true });
        return entries
            .filter(e => e.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(e.name))
            .map(e => e.name)
            .sort()
            .reverse(); // Most recent first
    } catch (e) {
        console.error("Error reading dates directory:", e);
        return [];
    }
}

/**
 * Helper: Read JSON file safely
 */
function readReportJSON(date, filename) {
    // Try different locations
    const locations = [
        path.join(REPORTS_DIR, `${date}_${filename}`),
        path.join(REPORTS_DIR, date, 'raw_data', `${date}_${filename}`),
        path.join(REPORTS_DIR, date, filename),
        path.join(REPORTS_DIR, 'archive', date, 'raw_data', `${date}_${filename}`),
    ];

    for (const loc of locations) {
        try {
            if (fs.existsSync(loc)) {
                return JSON.parse(fs.readFileSync(loc, 'utf8'));
            }
        } catch (e) {
            continue;
        }
    }
    return null;
}

/**
 * GET /api/dates - Get available report dates
 */
router.get('/dates', (req, res) => {
    const dates = getAvailableDates();
    res.json({ dates, count: dates.length });
});

/**
 * GET /api/portfolio/:date? - Get portfolio snapshot
 */
router.get('/portfolio', (req, res) => {
    const date = req.query.date || getAvailableDates()[0] || new Date().toISOString().split('T')[0];
    const data = readReportJSON(date, 'portfolio_snapshot.json');
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'Portfolio data not found', date });
    }
});

/**
 * GET /api/valuescreen/:date? - Get value screen/intrinsic value
 */
router.get('/valuescreen', (req, res) => {
    const date = req.query.date || getAvailableDates()[0] || new Date().toISOString().split('T')[0];
    const data = readReportJSON(date, 'value_screen.json');
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'Value screen data not found', date });
    }
});

/**
 * GET /api/gtt/:date? - Get GTT audit data
 */
router.get('/gtt', (req, res) => {
    const date = req.query.date || getAvailableDates()[0] || new Date().toISOString().split('T')[0];
    const data = readReportJSON(date, 'gtt_audit.json');
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'GTT audit data not found', date });
    }
});

/**
 * GET /api/opportunities/:date? - Get web-scanned opportunities
 */
router.get('/opportunities', (req, res) => {
    const date = req.query.date || getAvailableDates()[0] || new Date().toISOString().split('T')[0];
    const data = readReportJSON(date, 'opportunities.json');
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'Opportunities data not found', date });
    }
});

/**
 * GET /api/news/:date? - Get news-driven opportunities
 */
router.get('/news', (req, res) => {
    const date = req.query.date || getAvailableDates()[0] || new Date().toISOString().split('T')[0];
    const data = readReportJSON(date, 'news_opportunities.json');
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'News data not found', date });
    }
});

/**
 * GET /api/commodities/:date? - Get commodity prices
 */
router.get('/commodities', (req, res) => {
    const date = req.query.date || getAvailableDates()[0] || new Date().toISOString().split('T')[0];
    const data = readReportJSON(date, 'commodity_opportunities.json');
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'Commodity data not found', date });
    }
});

/**
 * GET /api/dashboard/:date? - Get all data for dashboard (single call)
 */
router.get('/dashboard', (req, res) => {
    const date = req.query.date || getAvailableDates()[0] || new Date().toISOString().split('T')[0];
    
    const portfolio = readReportJSON(date, 'portfolio_snapshot.json');
    const valuescreen = readReportJSON(date, 'value_screen.json');
    const gtt = readReportJSON(date, 'gtt_audit.json');
    const opportunities = readReportJSON(date, 'opportunities.json');
    const news = readReportJSON(date, 'news_opportunities.json');
    const commodities = readReportJSON(date, 'commodity_opportunities.json');
    
    res.json({
        date,
        portfolio,
        valuescreen,
        gtt,
        opportunities,
        news,
        commodities,
        availableDates: getAvailableDates()
    });
});

/**
 * GET /api/market-status - Get current market status
 */
router.get('/market-status', (req, res) => {
    const now = new Date();
    const istHour = (now.getUTCHours() + 5.5) % 24;
    const istMinute = now.getUTCMinutes() + 30;
    const istTotalMinutes = istHour * 60 + istMinute;
    
    const marketOpen = 9 * 60 + 15;  // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    const isWeekend = now.getUTCDay() === 0 || now.getUTCDay() === 6;
    const isMarketHours = istTotalMinutes >= marketOpen && istTotalMinutes <= marketClose && !isWeekend;
    
    res.json({
        isOpen: isMarketHours,
        currentTime: now.toISOString(),
        istTime: `${String(istHour).padStart(2, '0')}:${String(istMinute % 60).padStart(2, '0')}`,
        nextOpen: isMarketHours ? null : (istTotalMinutes < marketOpen ? 'Today 9:15 AM' : 'Next trading day'),
        nextClose: isMarketHours ? '3:30 PM' : null
    });
});

/**
 * GET /api/deep-value - Get static deep value screener data
 */
router.get('/deep-value', (req, res) => {
    const loc = path.join(REPORTS_DIR, 'deep_value_screener.json');
    try {
        if (fs.existsSync(loc)) {
            const data = JSON.parse(fs.readFileSync(loc, 'utf8'));
            res.json(data);
        } else {
            res.status(404).json({ error: 'Deep value screener data not found' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Error reading deep value data' });
    }
});

module.exports = router;
