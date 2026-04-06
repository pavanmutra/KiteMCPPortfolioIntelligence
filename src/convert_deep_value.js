const fs = require('fs');
const path = require('path');

function convertDeepValueMarkdown() {
  const inputFile = path.join(__dirname, '../indian_deep_value_stocks.md');
  const outputFile = path.join(__dirname, '../reports/deep_value_screener.json');

  if (!fs.existsSync(inputFile)) {
    console.error(`[Deep Value Converter] Input file not found: ${inputFile}`);
    return;
  }

  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.split('\n');

  const result = [];
  let currentCategory = null;

  // Helper to parse table rows
  const parseRow = (line) => {
    return line
      .split('|')
      .slice(1, -1) // remove empty first and last elements due to leading/trailing |
      .map((cell) => cell.trim());
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for category headers
    if (line.startsWith('##') && !line.includes('Scoring Legend')) {
      // e.g. ## Banking (14 stocks)
      const match = line.match(/##\s+([^\(]+)/);
      if (match) {
        currentCategory = match[1].trim();
      }
      continue;
    }

    // Check for table rows (skip headers and separators)
    if (currentCategory && line.startsWith('|') && !line.includes('---|')) {
      const cells = parseRow(line);

      // Ensure it's a data row, not the header row
      if (cells.length >= 12 && cells[0] !== 'Company') {
        const [
          company,
          ticker,
          pe,
          pb,
          roe,
          de,
          promo,
          pledge,
          sales5y,
          mcap,
          score,
          risk
        ] = cells;

        result.push({
          category: currentCategory,
          company,
          ticker,
          pe: parseFloat(pe) || 0,
          pb: parseFloat(pb) || 0,
          roe: parseFloat(roe.replace('%', '')) || 0,
          de: parseFloat(de) || 0,
          promo: parseFloat(promo.replace('%', '')) || 0,
          pledge: parseFloat(pledge.replace('%', '')) || 0,
          sales5y: parseFloat(sales5y.replace('%', '')) || 0,
          mcap: parseFloat(mcap.replace(/,/g, '')) || 0,
          score,
          risk
        });
      }
    }
  }

  // Ensure reports directory exists
  const reportsDir = path.dirname(outputFile);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`[Deep Value Converter] Successfully converted to ${outputFile}`);
  console.log(`[Deep Value Converter] Parsed ${result.length} stocks across categories.`);
}

if (require.main === module) {
  convertDeepValueMarkdown();
}

module.exports = convertDeepValueMarkdown;
