// Test different OAuth URL formats for Kick

export function testKickOAuthURLs(clientId: string, redirectUri: string) {
  const state = Math.random().toString(36).substring(7)
  
  const urls = [
    // Standard OAuth 2.0
    `https://kick.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user channel&state=${state}`,
    
    // OAuth 2.0 with different scope format
    `https://kick.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user:read channel:read&state=${state}`,
    
    // OAuth 2.0 without scope
    `https://kick.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`,
    
    // OAuth 2.0 with prompt
    `https://kick.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user channel&state=${state}&prompt=consent`,
    
    // OAuth 2.0 with approval_prompt
    `https://kick.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user channel&state=${state}&approval_prompt=force`,
    
    // Different endpoints
    `https://kick.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user channel&state=${state}`,
    
    `https://kick.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user channel&state=${state}`,
    
    `https://kick.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user channel&state=${state}`,
    
    // Kick-specific format (if they have custom OAuth)
    `https://kick.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&permissions=user channel&state=${state}`,
    
    // Maybe they use different parameter names
    `https://kick.com/oauth/authorize?client_id=${clientId}&callback_url=${encodeURIComponent(redirectUri)}&response_type=code&scope=user channel&state=${state}`,
  ]
  
  return urls
}

// Test function to try each URL
export function createTestURLs(clientId: string, redirectUri: string) {
  const urls = testKickOAuthURLs(clientId, redirectUri)
  
  console.log('=== Kick OAuth Test URLs ===')
  console.log('Client ID:', clientId)
  console.log('Redirect URI:', redirectUri)
  console.log('')
  
  urls.forEach((url, index) => {
    console.log(`Test ${index + 1}: ${url}`)
  })
  
  return urls
}
