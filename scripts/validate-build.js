#!/usr/bin/env node

// Simple pre-build validation - focuses only on critical syntax errors
const fs = require('fs');
const path = require('path');

console.log('🔍 Quick Build Validation...\n');

const srcDir = path.join(__dirname, '../src');
const criticalFiles = [
  'lib/youtube-oauth.ts'
];

let hasErrors = false;

// Check for the specific error we had before
function checkForOrphanedCode(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const nextLine = lines[i + 1]?.trim() || '';
      
      // Look for the specific pattern that caused our error
      if (line === '}' && (nextLine.startsWith('const ') || nextLine.startsWith('let ') || nextLine.startsWith('var '))) {
        console.error(`❌ ORPHANED CODE DETECTED in ${filePath}:${i + 1}`);
        console.error(`   Line ${i + 1}: ${line}`);
        console.error(`   Line ${i + 2}: ${nextLine}`);
        console.error(`   This is the exact error that caused the build to fail!`);
        hasErrors = true;
      }
    }
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    hasErrors = true;
  }
}

// Check for basic syntax issues
function checkBasicSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for incomplete declarations
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Only flag actual incomplete declarations, not normal commas
      if (line.endsWith('const ') || line.endsWith('let ') || line.endsWith('var ')) {
        console.error(`❌ INCOMPLETE DECLARATION in ${filePath}:${i + 1}`);
        console.error(`   ${line}`);
        hasErrors = true;
      }
    }
  } catch (error) {
    console.error(`❌ Error checking syntax in ${filePath}:`, error.message);
    hasErrors = true;
  }
}

// Run checks
console.log('🔍 Checking critical files...\n');

criticalFiles.forEach(file => {
  const fullPath = path.join(srcDir, file);
  
  if (fs.existsSync(fullPath)) {
    console.log(`📁 Checking ${file}...`);
    checkForOrphanedCode(fullPath);
    checkBasicSyntax(fullPath);
  } else {
    console.error(`❌ File not found: ${file}`);
    hasErrors = true;
  }
});

console.log('\n🔍 Checking OAuth structure...');
try {
  const { execSync } = require('child_process');
  const output = execSync('node scripts/check-oauth-structure.js', { encoding: 'utf8' });
  console.log(output);
  
  // Check if there are actual conflicts in the output
  if (output.includes('CONFLICT') || output.includes('❌ Directory not found')) {
    console.error('❌ OAuth structure has conflicts!');
    hasErrors = true;
  } else {
    console.log('✅ OAuth structure check passed');
  }
} catch (error) {
  console.error('❌ OAuth structure check failed:', error.message);
  hasErrors = true;
}

console.log('\n📊 Validation Results:');
if (hasErrors) {
  console.error('❌ VALIDATION FAILED - Fix errors before deployment!');
  process.exit(1);
} else {
  console.log('✅ All validations passed - Ready for build!');
  process.exit(0);
}
