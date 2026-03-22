// Official Kick Developer API Implementation
// This handles OAuth authentication and user profile data from api.kick.com
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

export class KickDeveloperAPI {
  private clientId: string
  private clientSecret: string
  private oauthServerURL: string
  private apiBaseURL: string

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.oauthServerURL = 'https://id.kick.com'
    this.apiBaseURL = 'https://api.kick.com'
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
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

  private async generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    const codeVerifier = this.generateRandomString(128)
    const hashBuffer = await this.sha256(codeVerifier)
    const codeChallenge = this.base64UrlEncode(hashBuffer)
    return { codeVerifier, codeChallenge }
  }

  async getAuthURL(redirectURI: string): Promise<string> {
    const { codeVerifier, codeChallenge } = await this.generatePKCE()
    
    sessionStorage.setItem('kick_code_verifier', codeVerifier)
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectURI,
      response_type: 'code',
      scope: 'user:read',
      state: Math.random().toString(36).substring(7),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    })

    return `${this.oauthServerURL}/oauth/authorize?${params.toString()}`
  }

  async exchangeCodeForToken(code: string, redirectURI: string): Promise<KickAuthResponse> {
    const codeVerifier = sessionStorage.getItem('kick_code_verifier')
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found')
    }

    console.log('🔐 Exchanging code for token with official Kick API...')
    
    const tokenEndpoint = `${this.oauthServerURL}/oauth/token`
    
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'User-Agent': 'SDHQ-Content-Analyzer/1.0'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: redirectURI,
          code_verifier: codeVerifier
        })
      })

      console.log('Token response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log('Token error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const tokenData = await response.json()
      console.log('✅ Token exchange success!')
      console.log('Token response:', tokenData)
      
      sessionStorage.removeItem('kick_code_verifier')
      return tokenData
    } catch (error) {
      console.error('❌ Token exchange failed:', error)
      sessionStorage.removeItem('kick_code_verifier')
      throw error
    }
  }

  async getCurrentUser(accessToken: string): Promise<KickUser> {
    console.log('🔍 Getting current user from Kick Developer API (api.kick.com)...')
    
    const userEndpoint = `${this.apiBaseURL}/public/v1/users`
    
    try {
      console.log(`Trying Kick Developer API endpoint: ${userEndpoint}`)
      
      const response = await fetch(userEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'SDHQ-Content-Analyzer/1.0'
        }
      })

      console.log(`Kick Developer API response status: ${response.status}`)
      console.log(`Kick Developer API response headers:`, Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log(`Kick Developer API error (${response.status}):`, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('✅ Got user data from Kick Developer API:', responseData)
      
      // Extract user data from the response
      if (responseData.data && responseData.data.length > 0) {
        const userData = responseData.data[0]
        console.log('Kick Developer API user data extracted:', userData)
        
        return {
          id: userData.user_id?.toString() || 'unknown',
          username: userData.email?.split('@')[0] || userData.name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
          display_name: userData.name || 'Unknown User',
          profile_image_url: userData.profile_picture || ''
        }
      } else {
        throw new Error('No user data found in Kick Developer API response')
      }
    } catch (error) {
      console.error('❌ Kick Developer API failed:', error)
      throw error
    }
  }
}
