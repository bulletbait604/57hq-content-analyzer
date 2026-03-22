export interface KickUser {
  id: string
  username: string
  display_name: string
  profile_image_url: string
}

export interface KickAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

export class KickAPI {
  private baseURL: string
  private oauthServerURL: string
  private clientId: string
  private clientSecret: string

  constructor(baseURL: string, clientId: string, clientSecret: string) {
    this.baseURL = baseURL
    this.oauthServerURL = 'https://id.kick.com' // Kick OAuth server is different from API server
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  // Generate PKCE code challenge
  private async generatePKCE() {
    const codeVerifier = this.generateRandomString(128)
    const hashBuffer = await this.sha256(codeVerifier)
    const codeChallenge = this.base64UrlEncode(hashBuffer)
    return { codeVerifier, codeChallenge }
  }

  private generateRandomString(length: number): string {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => String.fromCharCode(byte)).join('')
  }

  private async sha256(message: string): Promise<ArrayBuffer> {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    return hashBuffer
  }

  private base64UrlEncode(arrayBuffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(arrayBuffer)
    let base64 = ''
    for (let i = 0; i < byteArray.length; i++) {
      base64 += String.fromCharCode(byteArray[i])
    }
    return btoa(base64).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  async getAuthURL(redirectURI: string): Promise<string> {
    const { codeVerifier, codeChallenge } = await this.generatePKCE()
    
    // Store code verifier for token exchange
    sessionStorage.setItem('kick_code_verifier', codeVerifier)
    
    // Try different scope formats based on Kick's API documentation
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectURI,
      response_type: 'code',
      scope: 'chat:read user:read', // Try Kick's actual scope format
      state: Math.random().toString(36).substring(7),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    })

    // Use Kick's OAuth server: https://id.kick.com
    const baseUrl = `${this.oauthServerURL}/oauth/authorize`
    return `${baseUrl}?${params.toString()}`
  }

  async exchangeCodeForToken(code: string, redirectURI: string): Promise<KickAuthResponse> {
    const codeVerifier = sessionStorage.getItem('kick_code_verifier')
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found')
    }
    
    console.log('Exchanging code for token...')
    console.log('Code:', code.substring(0, 10) + '...')
    console.log('Redirect URI:', redirectURI)
    console.log('Code verifier:', codeVerifier.substring(0, 10) + '...')
    
    // Try different token endpoints and parameters
    const tokenEndpoints = [
      {
        url: `${this.oauthServerURL}/oauth/token`,
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: redirectURI,
          code_verifier: codeVerifier
        })
      },
      {
        url: `${this.baseURL}/oauth/token`,
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: redirectURI,
          code_verifier: codeVerifier
        })
      },
      {
        url: `${this.baseURL}/api/oauth/token`,
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: redirectURI,
          code_verifier: codeVerifier
        })
      },
      // Try without PKCE
      {
        url: `${this.baseURL}/oauth/token`,
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: redirectURI
        })
      },
      // Try different grant type
      {
        url: `${this.baseURL}/oauth/token`,
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          code: code,
          redirect_uri: redirectURI
        })
      }
    ]
    
    let lastError: Error | null = null
    
    for (const endpoint of tokenEndpoints) {
      try {
        console.log(`Trying token endpoint: ${endpoint.url}`)
        console.log('Body:', endpoint.body.toString())
        
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'SDHQ-Content-Analyzer/1.0'
          },
          body: endpoint.body
        })
        
        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))
        
        if (response.ok) {
          const text = await response.text()
          console.log('Response text:', text)
          
          try {
            const tokenData = JSON.parse(text)
            console.log('Token exchange success!')
            
            // Clean up code verifier
            sessionStorage.removeItem('kick_code_verifier')
            
            return tokenData
          } catch (parseError) {
            console.log('Failed to parse JSON from:', text)
            lastError = new Error(`Invalid JSON response: ${text.substring(0, 200)}`)
            continue
          }
        } else {
          const errorText = await response.text()
          console.log('Error response:', errorText)
          lastError = new Error(`HTTP ${response.status}: ${errorText}`)
          continue
        }
      } catch (error) {
        console.log('Request failed:', error)
        lastError = error as Error
        continue
      }
    }
    
    // Clean up code verifier on failure
    sessionStorage.removeItem('kick_code_verifier')
    throw lastError || new Error('All Kick token endpoints failed - Kick OAuth API may be down')
  }

  async getCurrentUser(accessToken: string): Promise<KickUser> {
    console.log('🔍 Trying to get user data from Kick API...')
    
    // Try different user endpoints
    const userEndpoints = [
      `${this.baseURL}/api/v2/user`,
      `${this.baseURL}/api/v1/user`,
      `${this.baseURL}/user`,
      `${this.oauthServerURL}/api/v1/user`,
      `${this.oauthServerURL}/user`
    ]
    
    for (const endpoint of userEndpoints) {
      try {
        console.log(`Trying user endpoint: ${endpoint}`)
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'SDHQ-Content-Analyzer/1.0'
          }
        })
        
        console.log(`Response status: ${response.status}`)
        
        if (response.ok) {
          const text = await response.text()
          console.log('Response text:', text)
          
          try {
            const data = JSON.parse(text)
            console.log('✅ Successfully got user data:', data)
            
            return {
              id: data.id?.toString() || data.user_id?.toString() || 'unknown',
              username: data.username || data.name || 'unknown',
              display_name: data.display_name || data.name || data.username || 'Unknown User',
              profile_image_url: data.profile_image_url || data.avatar_url || data.image_url || ''
            }
          } catch (parseError) {
            console.log('Failed to parse JSON from user endpoint:', text)
            continue
          }
        } else {
          const errorText = await response.text()
          console.log(`User endpoint error (${response.status}):`, errorText)
          continue
        }
      } catch (error) {
        console.log(`User endpoint request failed:`, error)
        continue
      }
    }
    
    console.log('❌ All user endpoints failed')
    throw new Error('All Kick user endpoints failed - Kick API may be down')
  }

  async checkSubscription(accessToken: string, channelId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/v2/channels/${channelId}/subscriptions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        // If we can't check subscriptions, assume not subscribed
        return false
      }

      const data = await response.json()
      return data.subscriptions && data.subscriptions.length > 0
    } catch (error) {
      console.error('Error checking subscription:', error)
      return false
    }
  }

  async verifyChannelSubscription(accessToken: string, channelUsername: string): Promise<boolean> {
    try {
      // First get channel info
      const channelResponse = await fetch(`${this.baseURL}/api/v2/channels/${channelUsername}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!channelResponse.ok) {
        return false
      }

      const channelData = await channelResponse.json()
      const channelId = channelData.id

      // Then check subscription
      return await this.checkSubscription(accessToken, channelId.toString())
    } catch (error) {
      console.error('Error verifying channel subscription:', error)
      return false
    }
  }
}
