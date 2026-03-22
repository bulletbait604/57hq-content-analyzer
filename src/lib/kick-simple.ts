// Simplified Kick OAuth attempt without PKCE

export class KickSimpleOAuth {
  private clientId: string

  constructor(clientId: string) {
    this.clientId = clientId
  }

  // Try different OAuth URL formats
  getTestURLs(redirectUri: string): string[] {
    const state = Math.random().toString(36).substring(7)
    
    return [
      // Standard OAuth 2.0 with Kick's actual scopes
      `https://id.kick.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=chat:read user:read&state=${state}`,
      
      // Alternative scope format
      `https://id.kick.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user channel&state=${state}`,
      
      // Minimal scope
      `https://id.kick.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user&state=${state}`,
      
      // Try without scope (might default to basic permissions)
      `https://id.kick.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`,
      
      // Try different endpoint
      `https://kick.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=chat:read user:read&state=${state}`,
      
      // Try API endpoint
      `https://kick.com/api/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=chat:read user:read&state=${state}`,
    ]
  }

  // Test function to try each URL
  createTestURLs(clientId: string, redirectUri: string) {
    const oauth = new KickSimpleOAuth(clientId)
    const urls = oauth.getTestURLs(redirectUri)
    
    console.log('=== Kick Simple OAuth Test URLs ===')
    console.log('Client ID:', clientId)
    console.log('Redirect URI:', redirectUri)
    console.log('')
    
    urls.forEach((url, index) => {
      console.log(`Test ${index + 1}: ${url}`)
    })
    
    return urls
  }
}
