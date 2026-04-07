# KiteMCP Portfolio Intelligence — Agent Guidelines

> This file provides guidance for AI coding agents operating in this repository.
> It covers build/test commands, code style, error handling, testing patterns, and file organization.

---

## Quick Commands

```bash
# Development
npm start          # Run full daily workflow
npm run web       # Start dashboard server (auto-opens browser)
npm run dev       # Alias for npm run web
npm run refresh   # Refresh live prices via AI agent

# Reporting
npm run report    # Generate daily Markdown report
npm run export   # Generate portfolio Excel
npm run check    # Gate status verification (PASS = safe to trade)

# Testing (Jest)
npm test                    # Unit + integration tests
npm run test:unit          # Unit tests only (~116 tests)
npm run test:api           # API/integration tests only
npx jest --testPathPattern=<pattern>    # Run single test file
npx jest src/__tests__/formatters.test.js  # Run specific test file
npx jest -t "test name"    # Run tests matching name pattern

# Linting
npm run lint      # Run ESLint on src/
npm run lint:fix  # Auto-fix lint errors
```

---

## Code Style Guidelines

### ESLint Rules (enforced)
- **Curly braces**: Required on all blocks (`if { ... }`)
- **Quotes**: Single quotes only (`'string'`)
- **Semicolons**: Always required
- **No trailing commas**: Forbidden in objects/arrays
- **No var**: Use `const` by default, `let` when reassignment needed

### Naming Conventions
- **Variables/functions**: `camelCase` (`formatCurrency`, `totalValue`)
- **Classes**: `PascalCase` (`PortfolioAnalyzer`, `GTTManager`)
- **Constants**: `SCREAMING_SNAKE_CASE` (`MAX_POSITION_SIZE`)
- **Files**: `kebab-case` (`create-portfolio-export.js`, `api.test.js`)

### Module System
- Use `require()` for Node.js modules
- Use `module.exports` for exports
- Group requires: built-in → external → local

```javascript
const fs = require('fs');
const path = require('path');
const express = require('express');
const Formatters = require('./utils/formatters');
```

### ES6+ Features (preferred)
- Arrow functions for callbacks
- Template literals for string interpolation
- Destructuring for objects/arrays
- Async/await for asynchronous code

---

## Error Handling Patterns

### Standard Try-Catch Pattern
```javascript
try {
    const data = fs.readFileSync('file.txt', 'utf8');
} catch (err) {
    console.error('Failed to read file:', err.message);
    throw err;
}
```

### Async Error Handling
```javascript
async function fetchData() {
    try {
        const result = await externalCall();
        return result;
    } catch (err) {
        console.error('Fetch failed:', err.message);
        throw new Error('Data fetch failed');
    }
}
```

### Graceful Degradation
```javascript
function getValue(data, fallback = null) {
    try {
        return data?.value ?? fallback;
    } catch {
        return fallback;
    }
}
```

---

## Testing Patterns

### Test Structure (Jest)
```javascript
const Formatters = require('../utils/formatters');

describe('Formatters', () => {
    describe('formatCurrency', () => {
        test('returns ₹0.00 for null', () => {
            expect(Formatters.formatCurrency(null)).toBe('₹0.00');
        });
    });
});
```

### Mocking External Dependencies
```javascript
jest.mock('../lib/kite-api', () => ({
    getHoldings: jest.fn().mockResolvedValue([])
}));
```

### Assertion Patterns
- `toBe()` / `toEqual()` for values
- `toContain()` for arrays/strings
- `toThrow()` for error cases
- `toHaveBeenCalled()` for mocks

---

## File Organization

### Source Structure
```
src/
├── __tests__/           # Test files (*.test.js)
│   ├── api.test.js
│   ├── formatters.test.js
│   └── config.test.js
├── lib/                  # Core utilities
│   ├── config.js
│   ├── logger.js
│   └── jsonUtils.js
├── routes/              # Express routes
│   └── api.js
├── scripts/             # Standalone scripts
│   └── refresh_live_prices.js
├── utils/                # Helper functions
│   └── formatters.js
├── public/               # Static assets
│   ├── index.html
│   └── js/
├── create_*.js           # Report generators
├── check_gates.js        # Gate verification
├── dashboard.js          # CLI dashboard
└── server.js             # Web server
```

### Report Output Structure
```
reports/
├── YYYY-MM-DD_*.json     # Agent outputs
├── YYYY-MM-DD_*.md       # Daily reports
├── YYYY-MM-DD_*.docx     # Word exports
├── Portfolio_YYYY-MM-DD.xlsx
└── Weekly_Portfolio_YYYY-MM-DD.xlsx
```

---

## Key Libraries

| Library | Purpose | Usage |
|---------|---------|-------|
| express | Web server | `src/server.js` |
| exceljs | Excel export | `src/create_portfolio_export.js` |
| jest | Unit testing | `src/__tests__/*.test.js` |
| eslint | Code linting | `eslint.config.js` |

---

## Common Workflows

### Running Daily Report
1. AI agent generates JSON files via MCP tools
2. `npm run report` → Creates Markdown report
3. `npm run export` → Creates Excel file

### Adding New Stock
1. Verify symbol via `kite_search_instruments()`
2. Check fundamentals on screener.in
3. Calculate intrinsic value (Graham Number / DCF)
4. Verify MoS > 25% before adding

### Creating New Agent
1. Add prompt to `prompts/*.md`
2. Reference in `opencode.json` agents section
3. Test with sample data
