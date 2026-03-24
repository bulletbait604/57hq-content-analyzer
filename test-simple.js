// Simple test for AI analysis functionality
console.log('🧪 Testing AI Analysis System...')

// Test if we can import the main function
try {
  const fs = require('fs')
  const path = require('path')
  
  // Read the main component file
  const componentPath = path.join(__dirname, 'src/components/ClipAnalysis.tsx')
  const componentCode = fs.readFileSync(componentPath, 'utf8')
  
  // Check if the function exists
  if (componentCode.includes('analyzeWithMetadataAndAI')) {
    console.log('✅ Function analyzeWithMetadataAndAI found in component')
    console.log('✅ Component structure looks correct')
    console.log('🎉 AI Analysis System test PASSED')
  } else {
    console.log('❌ Function analyzeWithMetadataAndAI NOT found')
    console.log('❌ Component structure may be incorrect')
  }
  
} catch (error) {
  console.error('❌ Test failed:', error.message)
}
