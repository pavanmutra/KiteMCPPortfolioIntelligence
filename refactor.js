const fs = require('fs');
const path = require('path');

// 1. Create src directory
if (!fs.existsSync('src')) fs.mkdirSync('src');

// 2. Move lib directory
if (fs.existsSync('lib')) {
    fs.renameSync('lib', 'src/lib');
}

// 3. Move all JS files in root to src/
const rootFiles = fs.readdirSync('.');
for (const file of rootFiles) {
    if (file.endsWith('.js') && file !== 'refactor.js') {
        fs.renameSync(file, path.join('src', file));
    }
}

// 4. Update __dirname references in src/*.js
const srcFiles = fs.readdirSync('src').filter(f => f.endsWith('.js'));
for (const file of srcFiles) {
    const filePath = path.join('src', file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace __dirname, 'reports' with __dirname, '../reports'
    content = content.replace(/__dirname,\s*['"]reports['"]/g, "__dirname, '../reports'");
    
    // Some files might use './lib/...' or '../lib/...'
    // Since they moved from root to src/ and lib moved to src/lib/, relative paths like './lib/config' remain the same!
    
    fs.writeFileSync(filePath, content);
}

// 5. Update package.json scripts
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

if (pkg.main && pkg.main === 'run_daily.js') {
    pkg.main = 'src/run_daily.js';
}

for (const [key, value] of Object.entries(pkg.scripts)) {
    // Replace "node script.js" with "node src/script.js"
    let newValue = value.replace(/node ([a-zA-Z0-9_.-]+\.js)/g, "node src/$1");
    // Special case for the clean/help scripts which use node -e
    if (key === 'help' || key === 'clean') {
        newValue = value; // Keep as is
    }
    pkg.scripts[key] = newValue;
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log('Folder restructure completed successfully!');
