// Simple token exchange without PKCE for testing

export class KickSimpleToken {
  private clientId: string
  private clientSecret: string
  private baseURL: string

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.baseURL = 'https://kick.com'
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<any> {
    console.log('Simple token exchange (no PKCE)...')
    
    // Try different token endpoint formats
    const endpoints = [
      `${this.baseURL}/oauth/token`,
      `${this.baseURL}/api/oauth/token`,
      `https://id.kick.com/oauth/token`
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying: ${endpoint}`)
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code: code,
            redirect_uri: redirectUri
          })
        })
        
        console.log('Status:', response.status)
        
        if (response.ok) {
          const text = await response.text()
          console.log('Response:', text)
          
          try {
            return JSON.parse(text)
          } catch (e) {
            console.log('Not JSON, returning text:', text)
            return { raw_response: text }
          }
        } else {
          const errorText = await response.text()
          console.log('Error:', errorText)
        }
      } catch (error) {
        console.log('Request failed:', error)
      }
    }
    
    throw new Error('All endpoints failed')
  }
}
