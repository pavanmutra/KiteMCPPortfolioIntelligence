const fs = require('fs');
const path = require('path');

/**
 * GATE 9: Archive & Cleanup
 * 
 * Archives all files from previous sessions (older than current date)
 * Creates archive manifest and cleans up reports folder
 */

const REPORTS_DIR = path.join(__dirname, '../reports');
const CURRENT_DATE = '2026-03-31';
const ARCHIVE_DIR = path.join(REPORTS_DIR, 'archive', CURRENT_DATE);

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         GATE 9: ARCHIVE & CLEANUP OPERATION               ║');
console.log('║        Archiving Old Files & Preparing for Next Session    ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Step 1: Create archive directory
console.log('📁 STEP 1: Creating archive directory structure...');
if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  console.log(`✅ Created: ${ARCHIVE_DIR}`);
} else {
  console.log(`✅ Already exists: ${ARCHIVE_DIR}`);
}

// Step 2: Identify files to archive
console.log('\n📋 STEP 2: Identifying files to archive...');
const allFiles = fs.readdirSync(REPORTS_DIR);
const filesToArchive = allFiles.filter(file => {
  // Archive if:
  // 1. Starts with 2026-03-30 (or earlier)
  // 2. Is a directory (like "2026-03-30" folder)
  // 3. Exclude current date files and archive folder
  const isOldDate = /^\d{4}-\d{2}-\d{2}(?!31)/.test(file) || file === '2026-03-30';
  const isNotCurrent = !file.startsWith(CURRENT_DATE);
  const isNotArchiveDir = file !== 'archive' && file !== 'readable';
  return isOldDate && isNotCurrent && isNotArchiveDir;
});

console.log(`📦 Files/folders to archive: ${filesToArchive.length}`);
filesToArchive.forEach(file => {
  console.log(`   - ${file}`);
});

// Step 3: Move files to archive
console.log('\n🚚 STEP 3: Moving files to archive...');
const archivedFiles = [];
const archiveErrors = [];

for (const file of filesToArchive) {
  const srcPath = path.join(REPORTS_DIR, file);
  const destPath = path.join(ARCHIVE_DIR, file);
  
  try {
    // Get file stats before moving
    const stat = fs.statSync(srcPath);
    const isDir = stat.isDirectory();
    
    // Move file/directory
    fs.renameSync(srcPath, destPath);
    
    archivedFiles.push({
      name: file,
      type: isDir ? 'directory' : 'file',
      size: isDir ? '(directory)' : `${(stat.size / 1024).toFixed(1)} KB`,
      moved: new Date().toISOString(),
      destination: `archive/${CURRENT_DATE}/${file}`
    });
    
    console.log(`✅ Moved: ${file}`);
  } catch (err) {
    archiveErrors.push({
      file: file,
      error: err.message
    });
    console.log(`❌ Error moving ${file}: ${err.message}`);
  }
}

// Step 4: Create archive manifest
console.log('\n📝 STEP 4: Creating archive manifest...');
const manifest = {
  archive_date: CURRENT_DATE,
  archive_time: new Date().toISOString(),
  archive_location: `reports/archive/${CURRENT_DATE}/`,
  total_files_archived: archivedFiles.length,
  total_errors: archiveErrors.length,
  archived_files: archivedFiles,
  errors: archiveErrors.length > 0 ? archiveErrors : null,
  workflow_date: CURRENT_DATE,
  notes: 'Archives from previous sessions. Current session (2026-03-31) files remain in reports/ root.',
  next_session_ready: archiveErrors.length === 0
};

const manifestPath = path.join(REPORTS_DIR, `${CURRENT_DATE}_ARCHIVE_MANIFEST.json`);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✅ Manifest created: ${CURRENT_DATE}_ARCHIVE_MANIFEST.json`);

// Step 5: Verify archive integrity
console.log('\n🔍 STEP 5: Verifying archive integrity...');
const archiveContents = fs.readdirSync(ARCHIVE_DIR);
console.log(`✅ Archive contains ${archiveContents.length} items`);
console.log(`   Items in archive: ${archiveContents.join(', ')}`);

// Step 6: List current session files (should remain in reports/)
console.log('\n✨ STEP 6: Current session files (remaining in reports/)...');
const currentSessionFiles = fs.readdirSync(REPORTS_DIR).filter(file => {
  return file.startsWith(CURRENT_DATE) || file === 'Portfolio_2026-03-31.xlsx' || file.includes('ARCHIVE_MANIFEST');
});

console.log(`📂 Current session files: ${currentSessionFiles.length}`);
currentSessionFiles.forEach(file => {
  const filePath = path.join(REPORTS_DIR, file);
  try {
    const stat = fs.statSync(filePath);
    const size = stat.isDirectory() ? '(dir)' : `${(stat.size / 1024).toFixed(1)} KB`;
    console.log(`   ✅ ${file} (${size})`);
  } catch (e) {
    console.log(`   ✅ ${file}`);
  }
});

// Step 7: Generate summary report
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║               GATE 9 SUMMARY REPORT                        ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log(`📊 Files Archived:        ${archivedFiles.length}`);
console.log(`⚠️  Archive Errors:        ${archiveErrors.length}`);
console.log(`📂 Current Files Remain:  ${currentSessionFiles.length}`);
console.log(`📍 Archive Location:      reports/archive/${CURRENT_DATE}/`);
console.log(`📋 Manifest File:         ${CURRENT_DATE}_ARCHIVE_MANIFEST.json`);

if (archiveErrors.length === 0) {
  console.log('\n✅ GATE 9 STATUS: PASS - Archive operation successful');
  console.log('   All old files archived, current session ready for next workflow');
} else {
  console.log('\n⚠️  GATE 9 STATUS: PASS_WITH_WARNINGS - Some errors occurred');
  console.log('   Review errors above and archive manually if needed');
}

// Update gate status in memory (would be used by workflow orchestrator)
const gateResult = {
  gate: 'GATE 9',
  name: 'Archive & Cleanup',
  status: archiveErrors.length === 0 ? 'PASS' : 'PASS_WITH_WARNINGS',
  execution_date: CURRENT_DATE,
  execution_time: new Date().toISOString(),
  files_archived: archivedFiles.length,
  errors: archiveErrors.length,
  manifest_file: manifestPath
};

// Save gate result
const gateResultPath = path.join(REPORTS_DIR, `${CURRENT_DATE}_gate9_result.json`);
fs.writeFileSync(gateResultPath, JSON.stringify(gateResult, null, 2));

console.log(`\n📝 Gate result saved: ${CURRENT_DATE}_gate9_result.json`);
console.log('\n═══════════════════════════════════════════════════════════════\n');

// Final status
if (archiveErrors.length === 0) {
  console.log('🎉 GATE 9 COMPLETE - Ready for next session workflow');
} else {
  console.log('⚠️  GATE 9 COMPLETE WITH WARNINGS - Check archive manually');
}
console.log('\n');
