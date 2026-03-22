// Simplified Kick OAuth implementation
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

export class KickOAuth {
  private clientId: string
  private clientSecret: string
  private oauthServerURL: string

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.oauthServerURL = 'https://id.kick.com'
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
      scope: 'user:read profile:read',
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

    const tokenEndpoint = `${this.oauthServerURL}/oauth/token`
    
    try {
      const response = await fetch(tokenEndpoint, {
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
          redirect_uri: redirectURI,
          code_verifier: codeVerifier
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const tokenData = await response.json()
      sessionStorage.removeItem('kick_code_verifier')
      return tokenData
    } catch (error) {
      sessionStorage.removeItem('kick_code_verifier')
      throw error
    }
  }

  async getUserInfo(accessToken: string): Promise<KickUser> {
    // Try to decode JWT token first
    try {
      const tokenParts = accessToken.split('.')
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))
        
        if (payload.username && payload.username !== 'unknown') {
          return {
            id: payload.sub || payload.id || 'unknown',
            username: payload.username,
            display_name: payload.display_name || payload.name || payload.username,
            profile_image_url: payload.picture || payload.profile_image_url || ''
          }
        }
      }
    } catch (jwtError) {
      console.log('Could not decode JWT token:', jwtError)
    }

    // If JWT doesn't work, try API endpoints
    const endpoints = [
      'https://kick.com/api/v2/user',
      'https://kick.com/api/v1/user',
      'https://kick.com/user'
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          return {
            id: data.id?.toString() || 'unknown',
            username: data.username || data.name || 'unknown',
            display_name: data.display_name || data.name || data.username || 'Unknown User',
            profile_image_url: data.profile_image_url || data.avatar_url || ''
          }
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error)
        continue
      }
    }

    throw new Error('Could not get user information')
  }
}
