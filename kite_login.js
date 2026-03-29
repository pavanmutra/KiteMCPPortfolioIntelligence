#!/usr/bin/env node
/**
 * kite_login.js — Kite MCP Login
 * 
 * How it works:
 * 1. Configure MCP in OpenCode with hosted URL
 * 2. Use any kite tool - it will give you a dynamic login URL
 * 3. Copy that URL → Browser → Login → Authorize
 * 4. Done! Session is established automatically
 */

const { spawn } = require('child_process');

// Colors
const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', B = '\x1b[34m', X = '\x1b[0m', BOLD = '\x1b[1m';

function showInstructions() {
    console.log(`${BOLD}╔═══════════════════════════════════════════════════${X}`);
    console.log(`${BOLD}║           KITE MCP LOGIN                   ${X}`);
    console.log(`${BOLD}╚═══════════════════════════════════════════════════${X}\n`);
    
    console.log(`${Y}Step 1: Configure OpenCode${X}`);
    console.log(`Add this to opencode.json:\n`);
    console.log(`${G}{
  "mcp": {
    "kite": {
      "type": "remote", 
      "url": "https://mcp.kite.trade/mcp"
    }
  }
}${X}\n`);
    
    console.log(`${Y}Step 2: Use a Kite tool in OpenCode${X}`);
    console.log(`Try asking: "Get my holdings" or "Get profile"\n`);
    
    console.log(`${Y}Step 3: Login URL will appear${X}`);
    console.log(`The MCP will give you a dynamic URL like:`);
    console.log(`${G}https://kite.zerodha.com/connect/login?api_key=kitemcp&v=3&redirect_params=...${X}\n`);
    
    console.log(`${Y}Step 4: Copy that URL to browser${X}`);
    console.log(`- Login to Kite`);
    console.log(`- Authorize the app`);
    console.log(`- Wait for "Login Successful" message\n`);
    
    console.log(`${Y}Step 5: Go back to OpenCode${X}`);
    console.log(`The tool will now work!\n`);
    
    console.log(`${B}Example dynamic URL:${X}`);
    console.log(`https://kite.zerodha.com/connect/login?api_key=kitemcp&v=3&redirect_params=session_id%3Dabc123...${X}\n`);
}

function openMcpPage() {
    // This is the base MCP endpoint
    const MCP_URL = 'https://mcp.kite.trade/mcp';
    
    console.log(`${BOLD}╔═══════════════════════════════════════════════════${X}`);
    console.log(`${BOLD}║           KITE MCP LOGIN                   ${X}`);
    console.log(`${BOLD}╚═══════════════════════════════════════════════════${X}\n`);
    
    console.log(`${Y}MCP Endpoint:${X} ${G}${MCP_URL}${X}\n`);
    
    console.log(`${Y}How to login:${X}`);
    console.log(`1. The login URL is DYNAMIC - it's generated when you use a kite tool`);
    console.log(`2. Ask OpenCode to get your profile or holdings`);
    console.log(`3. Copy the login URL from the response`);
    console.log(`4. Open that URL in browser → Login → Authorize`);
    console.log(`5. Go back to OpenCode - tools will work!\n`);
    
    // Try to open
    const cmd = process.platform === 'win32' ? 'start' : 'open';
    try {
        spawn(cmd, [MCP_URL], { detached: true, stdio: 'ignore', shell: true });
    } catch (e) {}
}

const args = process.argv.slice(2);
const action = args[0];

switch (action) {
    case 'login':
    case 'open':
    default:
        openMcpPage();
        showInstructions();
}
