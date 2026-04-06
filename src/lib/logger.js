const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../reports', 'error.log');

/**
 * Ensures the reports directory exists
 */
function ensureDir() {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Appends a log message to the error.log file.
 * @param {string} level - Log level (INFO, WARN, ERROR)
 * @param {string} message - Message to log
 * @param {Error} [err] - Optional error object
 */
function logToFile(level, message, err = null) {
    try {
        ensureDir();
        const timestamp = new Date().toISOString();
        let logLine = `[${timestamp}] [${level}] ${message}`;
        if (err) {
            logLine += `\n    ${err.stack || err.message}`;
        }
        logLine += '\n';
        fs.appendFileSync(LOG_FILE, logLine, 'utf8');
    } catch (e) {
        console.error('Failed to write to log file:', e);
    }
}

module.exports = {
    info: (msg) => {
        logToFile('INFO', msg);
    },
    warn: (msg, err) => {
        console.warn(`\x1b[33m⚠️ WARNING: ${msg}\x1b[0m`);
        logToFile('WARN', msg, err);
    },
    error: (msg, err) => {
        console.error(`\x1b[31m❌ ERROR: ${msg}\x1b[0m`);
        logToFile('ERROR', msg, err);
    }
};
