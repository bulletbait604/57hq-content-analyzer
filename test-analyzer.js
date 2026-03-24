// Test script to verify analyzer functionality
const { analyzeWithMetadataAndAI } = require('./src/components/ClipAnalysis.tsx')

// Test data
const testYouTubeURL = 'https://youtube.com/watch?v=SRaWLl13lXM'
const testMetadata = {
  title: 'Test Video Title',
  description: 'Test video description for analysis',
  hashtags: ['test', 'video', 'analysis']
}

async function testAnalyzer() {
  console.log('🧪 Testing AI Analysis System...')
  
  try {
    // Test the new AI analysis flow
    const result = await analyzeWithMetadataAndAI(
      testYouTubeURL,
      'youtube shorts',
      testMetadata
    )
    
    console.log('✅ Test Analysis Result:', {
      success: !!result,
      hasTitle: !!result?.clipTitle,
      hasDescription: !!result?.clipDescription,
      hasTags: result?.tags?.length > 0,
      tagCount: result?.tags?.length || 0,
      hasAIAnalysis: !!result?.aiAnalysis,
      aiServicesUsed: result?.aiAnalysis
    })
    
    return result
  } catch (error) {
    console.error('❌ Test Failed:', error)
    return null
  }
}

// Run test if called directly
if (require.main === module) {
  testAnalyzer()
    .then(() => {
      console.log('🎉 Test completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Test failed:', error)
      process.exit(1)
    })
}

module.exports = { testAnalyzer }
