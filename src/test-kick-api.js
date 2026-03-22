// Test script to see what Kick API actually returns
const testKickAPI = async () => {
  console.log('🔍 Testing Kick API endpoints...')
  
  // Test 1: Get channel info
  try {
    console.log('📺 Testing: GET https://api.kick.com/public/v1/channels/bulletbait604')
    const response = await fetch('https://api.kick.com/public/v1/channels/bulletbait604')
    console.log('Status:', response.status)
    console.log('Headers:', response.headers)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Channel data:', JSON.stringify(data, null, 2))
    } else {
      const errorText = await response.text()
      console.log('❌ Error:', errorText)
    }
  } catch (error) {
    console.log('❌ Request failed:', error)
  }
  
  // Test 2: Try subscribers endpoint
  try {
    console.log('📋 Testing: GET https://api.kick.com/public/v1/channels/bulletbait604/subscribers')
    const subResponse = await fetch('https://api.kick.com/public/v1/channels/bulletbait604/subscribers')
    console.log('Subscribers Status:', subResponse.status)
    
    if (subResponse.ok) {
      const subData = await subResponse.json()
      console.log('✅ Subscribers data:', JSON.stringify(subData, null, 2))
    } else {
      const subError = await subResponse.text()
      console.log('❌ Subscribers Error:', subError)
    }
  } catch (error) {
    console.log('❌ Subscribers request failed:', error)
  }
}

// Run the test
testKickAPI()
