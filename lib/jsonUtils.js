const fs = require('fs');
const path = require('path');

/**
 * Safely read and parse a JSON file (synchronous)
 * @param {string} filepath - Path to JSON file
 * @returns {object|null} - Parsed JSON or null if error/not found
 */
function readJsonFile(filepath) {
    try {
        if (fs.existsSync(filepath)) {
            return JSON.parse(fs.readFileSync(filepath, 'utf8'));
        }
    } catch (e) {
        console.log(`Warning: Could not read ${filepath}`);
    }
    return null;
}

/**
 * Safely read and parse a JSON file (asynchronous)
 * @param {string} filepath - Path to JSON file
 * @returns {Promise<object|null>} - Parsed JSON or null if error/not found
 */
async function readJsonFileAsync(filepath) {
    try {
        if (fs.existsSync(filepath)) {
            const data = await fs.promises.readFile(filepath, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.log(`Warning: Could not read ${filepath}`);
    }
    return null;
}

/**
 * Check if a file is accessible for reading/writing
 * @param {string} filepath - Path to file
 * @returns {boolean} - True if accessible
 */
function isFileAccessible(filepath) {
    try {
        if (fs.existsSync(filepath)) {
            fs.accessSync(filepath, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        }
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * Ensure a directory exists
 * @param {string} dirpath - Path to directory
 */
function ensureDir(dirpath) {
    if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath, { recursive: true });
    }
}

/**
 * Write JSON to file with backup (synchronous)
 * @param {string} filepath - Path to file
 * @param {object} data - Data to write
 */
function writeJsonFile(filepath, data) {
    const dir = path.dirname(filepath);
    ensureDir(dir);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Write JSON to file (asynchronous)
 * @param {string} filepath - Path to file
 * @param {object} data - Data to write
 * @returns {Promise<void>}
 */
async function writeJsonFileAsync(filepath, data) {
    const dir = path.dirname(filepath);
    ensureDir(dir);
    await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    readJsonFile,
    readJsonFileAsync,
    isFileAccessible,
    ensureDir,
    writeJsonFile,
    writeJsonFileAsync
};
