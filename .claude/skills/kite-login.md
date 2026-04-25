# Kite Login Skill

## Description
Handle Kite MCP authentication using the OAuth login URL flow.

## When to Use
When the user needs to log in to Kite for trading operations or when Kite MCP returns "Kite Login Required" error.

## MCP Configuration (OpenCode OAuth)

The Kite MCP is configured via `opencode.json` using OAuth authentication:
```json
{
  "mcp": {
    "kite": {
      "type": "remote",
      "url": "https://mcp.kite.trade/mcp",
      "oauth": {}
    }
  }
}
```

**Important:**
- NO API key required - uses OAuth browser-based login
- When a Kite tool is called, OpenCode will prompt for OAuth login
- A browser window opens to `https://kite.zerodha.com/connect/login?api_key=kitemcp&v=3&redirect_params=session_id%3D...`
- User logs in with Zerodha credentials and authorizes
- Session is cached automatically by OpenCode

## Steps

1. **Check Current Session Status**
   - Try calling `kite_get_profile` tool from the kite MCP server
   - If successful, user is already logged in

2. **Handle Login Required Error**
   - If error message is "Kite Login Required", extract `login_url` from error.data
   - Present the login URL to the user

3. **Guide User Through Login**
   - Provide the login URL: `{login_url}` (or the CRITICAL URL above)
   - Instruct user to:
     1. Open the URL in their browser
     2. Complete the Zerodha login
     3. Click "Authorize" when prompted
     4. Wait for "Login Successful" message

4. **Verify Login**
   - After user completes login, call `kite_get_profile` again
   - Confirm successful authentication
   - CRITICAL: READ works ≠ WRITE works. Test order placement with 1 small order.

## Example

```
User: "kite login"
→ Try kite_get_profile
→ If login required:
   "Please visit this URL to login: https://kite.zerodha.com/connect/login?api_key=kitemcp&v=3"
→ After user confirms:
   "Checking login status..."
→ Verify with kite_get_profile again
→ Then test with 1 small order (READ ≠ WRITE)
```

## Notes
- The login URL includes session_id in redirect_params
- Do not cache login URLs - fetch fresh each time if needed
- Session remains valid until explicitly logged out from Zerodha
- "Already logged in" status may work for reads but NOT for writes
