#!/usr/bin/env node
/**
 * kite_login.js — Kite MCP Login Automator
 * 
 * Works just like OpenCode:
 * 1. Checks if a login is required by querying the Kite MCP server
 * 2. Fetches the dynamic login URL (with unique session_id)
 * 3. Automatically opens the browser for you to login
 * 4. Verifies current session status
 */

const https = require('https');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors
const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', B = '\x1b[34m', X = '\x1b[0m', BOLD = '\x1b[1m';

/**
 * Fetch Kite Profile or Check Status
 * This simulates calling an MCP tool directly via POST.
 */
async function callMcpTool(url, toolName, params = {}) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: params
            }
        });

        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.error) {
                        resolve({ success: false, error: json.error });
                    } else {
                        resolve({ success: true, result: json.result });
                    }
                } catch (e) {
                    reject(new Error('Invalid response from MCP server: ' + data));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(body);
        req.end();
    });
}

/**
 * Open URL in default browser
 */
function openBrowser(url) {
    const cmd = process.platform === 'win32' ? 'start' : 'open';
    try {
        spawn(cmd, [url], { detached: true, stdio: 'ignore', shell: true });
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Main Logic
 */
async function main() {
    console.log(`\n${BOLD}${B}╔═══════════════════════════════════════════════════════════════╗${X}`);
    console.log(`${BOLD}${B}║           Kite MCP Session Intelligence               ║${X}`);
    console.log(`${BOLD}${B}╚═══════════════════════════════════════════════════════════════╝${X}\n`);

    // 1. Get MCP URL from opencode.json
    let mcpUrl = 'https://mcp.kite.trade/mcp'; // Default
    try {
        const opencodeJsonPath = path.join(__dirname, 'opencode.json');
        if (fs.existsSync(opencodeJsonPath)) {
            const config = JSON.parse(fs.readFileSync(opencodeJsonPath, 'utf8'));
            if (config.mcp && config.mcp.kite && config.mcp.kite.url) {
                mcpUrl = config.mcp.kite.url;
            }
        }
    } catch (e) {}

    console.log(`${BOLD}Checking Kite MCP session status...${X}`);
    console.log(`${B}Server: ${mcpUrl}${X}\n`);

    try {
        const response = await callMcpTool(mcpUrl, 'kite_get_profile');
        
        if (response.success) {
            const profile = response.result.content?.[0]?.text;
            console.log(`${G}✅ SESSION ACTIVE${X}`);
            console.log(`${G}User profile fetched successfully.${X}`);
            if (profile) {
                try {
                    const p = JSON.parse(profile);
                    console.log(`Logged in as: ${BOLD}${p.user_name || p.user_id}${X} (${p.email || 'N/A'})\n`);
                } catch (e) {
                    console.log(`Profile: ${profile}\n`);
                }
            }
            console.log(`${G}You are ready to trade!${X}\n`);
        } else {
            const err = response.error;
            if (err.message === 'Kite Login Required' && err.data && err.data.login_url) {
                const loginUrl = err.data.login_url;
                
                console.log(`${Y}⚠️  LOGIN REQUIRED${X}`);
                console.log('Your session has expired or is invalid.\n');
                
                console.log(`${B}Action: Generating dynamic login URL... (OpenCode style)${X}`);
                console.log(`${G}URL: ${loginUrl}${X}\n`);
                
                console.log(`${Y}Opening default browser...${X}`);
                if (openBrowser(loginUrl)) {
                    console.log(`${G}✅ Browser opened successfully.${X}\n`);
                    console.log(`${BOLD}Next Steps:${X}`);
                    console.log('1. Finish the Zen login in your browser.');
                    console.log('2. Click \'Authorize\' when prompted.');
                    console.log('3. Once you see "Login Successful", return here.');
                    console.log('4. Run \'npm run login:status\' to verify.\n');
                } else {
                    console.log(`${R}❌ Failed to auto-open browser.${X}`);
                    console.log('Please copy the URL above manually to your browser.\n');
                }
            } else {
                console.log(`${R}❌ MCP ERROR: ${err.message}${X}`);
                if (err.data) {console.log(JSON.stringify(err.data, null, 2));}
                console.log();
            }
        }
    } catch (e) {
        console.log(`${R}❌ FAILED TO CONNECT TO MCP SERVER${X}`);
        console.log(`Error: ${e.message}\n`);
        console.log(`${Y}Troubleshooting:${X}`);
        console.log('1. Ensure your internet connection is active.');
        console.log('2. Verify the MCP URL in opencode.json is correct.');
        console.log('3. The Kite MCP server might be temporarily down.\n');
    }
}

// ─── Entry Point ─────────────────────────────────────────────────────────────
const action = process.argv[2];

if (action === 'status') {
    // Only check status, don't open browser if required
    main(); // For now, the main function handles both.
} else {
    main();
}
