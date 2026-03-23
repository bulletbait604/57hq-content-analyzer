#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const authDir = path.join(__dirname, '../src/app/auth');
const platforms = ['kick', 'youtube']; // Removed Instagram and TikTok

console.log('🔍 Checking OAuth structure for conflicts...\n');

let hasConflicts = false;

platforms.forEach(platform => {
  const callbackDir = path.join(authDir, platform, 'callback');
  
  if (fs.existsSync(callbackDir)) {
    const files = fs.readdirSync(callbackDir);
    const hasRoute = files.includes('route.ts');
    const hasPage = files.includes('page.tsx');
    
    console.log(`📁 ${platform.toUpperCase()}:`);
    console.log(`   route.ts: ${hasRoute ? '✅' : '❌'}`);
    console.log(`   page.tsx: ${hasPage ? '✅' : '❌'}`);
    
    if (hasRoute && hasPage) {
      console.log(`   ⚠️  CONFLICT: Both route.ts and page.tsx found!`);
      hasConflicts = true;
    } else {
      console.log(`   ✅ No conflicts`);
    }
    console.log('');
  } else {
    console.log(`📁 ${platform.toUpperCase()}: ❌ Directory not found`);
    console.log('');
  }
});

if (hasConflicts) {
  console.log('❌ OAuth structure has conflicts. Please fix before deploying.');
  process.exit(1);
} else {
  console.log('✅ OAuth structure is clean. Ready for deployment!');
}
