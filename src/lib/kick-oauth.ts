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

    console.log('🔐 Exchanging code for token...')
    console.log('Code:', code.substring(0, 10) + '...')
    console.log('Redirect URI:', redirectURI)
    console.log('Code verifier:', codeVerifier.substring(0, 10) + '...')

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
      console.log('Access token:', tokenData.access_token ? tokenData.access_token.substring(0, 20) + '...' : 'No access token')
      
      // Clean up code verifier
      sessionStorage.removeItem('kick_code_verifier')
      
      return tokenData
    } catch (error) {
      console.error('❌ Token exchange failed:', error)
      sessionStorage.removeItem('kick_code_verifier')
      throw error
    }
  }

  async getUserInfo(accessToken: string): Promise<KickUser> {
    console.log('🔍 Trying to get user info from Kick OAuth token...')
    console.log('Access token type:', typeof accessToken)
    console.log('Access token length:', accessToken.length)
    console.log('Access token preview:', accessToken.substring(0, 50) + '...')
    
    // First, try to decode JWT token to get user data
    try {
      const tokenParts = accessToken.split('.')
      console.log('Token parts count:', tokenParts.length)
      
      if (tokenParts.length === 3) {
        console.log('Token looks like JWT, attempting to decode payload...')
        const payload = JSON.parse(atob(tokenParts[1]))
        console.log('🔍 JWT token payload:', payload)
        
        // Try multiple field names for username
        const username = payload.username || payload.preferred_username || payload.name || payload.login || payload.sub
        const displayName = payload.display_name || payload.name || payload.username || payload.preferred_username || 'Unknown User'
        const userId = payload.sub || payload.id || payload.user_id || 'unknown'
        const profileImage = payload.picture || payload.profile_image_url || payload.avatar_url || payload.image_url || ''
        
        console.log('Extracted fields:', { username, displayName, userId, hasUsername: !!username })
        
        if (username && username !== 'unknown' && username !== 'sub' && typeof username === 'string' && username.length > 2) {
          console.log('✅ Extracted user data from JWT token:', { username, displayName, userId })
          return {
            id: userId,
            username: username,
            display_name: displayName,
            profile_image_url: profileImage
          }
        } else {
          console.log('❌ JWT token does not contain valid username data')
        }
      } else {
        console.log('❌ Token does not appear to be a valid JWT (wrong number of parts)')
      }
    } catch (jwtError) {
      console.log('❌ Could not decode JWT token:', jwtError)
      console.log('JWT error details:', jwtError instanceof Error ? jwtError.message : 'Unknown error')
    }

    // If JWT doesn't work, try API endpoints with better error handling
    console.log('🔄 JWT parsing failed, trying API endpoints...')
    
    // Try different authentication methods and endpoints
    const endpoints = [
      // Try with Bearer token
      { url: 'https://kick.com/api/v2/user', auth: `Bearer ${accessToken}` },
      { url: 'https://kick.com/api/v1/user', auth: `Bearer ${accessToken}` },
      { url: 'https://kick.com/user', auth: `Bearer ${accessToken}` },
      { url: 'https://id.kick.com/api/v1/user', auth: `Bearer ${accessToken}` },
      { url: 'https://id.kick.com/user', auth: `Bearer ${accessToken}` },
      // Try with token as query parameter
      { url: `https://kick.com/api/v1/user?token=${accessToken}`, auth: null },
      { url: `https://kick.com/api/v2/user?token=${accessToken}`, auth: null },
      // Try with OAuth token header
      { url: 'https://kick.com/api/v1/user', auth: `OAuth ${accessToken}` },
      { url: 'https://kick.com/api/v2/user', auth: `OAuth ${accessToken}` },
      // Try with different base URLs
      { url: 'https://api.kick.com/v1/user', auth: `Bearer ${accessToken}` },
      { url: 'https://api.kick.com/v2/user', auth: `Bearer ${accessToken}` }
    ]

    for (const endpoint of endpoints) {
      try {
        const endpointUrl = typeof endpoint === 'string' ? endpoint : endpoint.url
        const authHeader = typeof endpoint === 'string' ? `Bearer ${accessToken}` : endpoint.auth
        
        console.log(`Trying endpoint: ${endpointUrl}`)
        console.log(`Auth method: ${authHeader ? authHeader.substring(0, 20) + '...' : 'None'}`)
        
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'SDHQ-Content-Analyzer/1.0',
          'Origin': typeof window !== 'undefined' ? window.location.origin : 'https://sdhqcreatorcorner.vercel.app',
          'Referer': typeof window !== 'undefined' ? window.location.origin : 'https://sdhqcreatorcorner.vercel.app'
        }
        
        if (authHeader) {
          headers['Authorization'] = authHeader
        }
        
        const response = await fetch(endpointUrl, {
          headers: headers
        })

        console.log(`Response status: ${response.status}`)
        console.log(`Response headers:`, Object.fromEntries(response.headers.entries()))
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Got user data from API:', data)
          console.log('API response keys:', Object.keys(data))
          console.log('API response details:', JSON.stringify(data, null, 2))
          
          return {
            id: data.id?.toString() || data.user_id?.toString() || 'unknown',
            username: data.username || data.name || 'unknown',
            display_name: data.display_name || data.name || data.username || 'Unknown User',
            profile_image_url: data.profile_image_url || data.avatar_url || data.image_url || ''
          }
        } else {
          const errorText = await response.text()
          console.log(`❌ Endpoint ${endpointUrl} failed (${response.status}):`, errorText.substring(0, 100))
          console.log('Error content type:', response.headers.get('content-type'))
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpointUrl} request failed:`, error)
        continue
      }
    }

    // If all methods fail, throw a descriptive error with debugging info
    throw new Error(`Could not get user information. JWT parsing failed and all API endpoints returned HTML errors. Token type: ${typeof accessToken}, Token length: ${accessToken.length}. Please check your Kick OAuth configuration and ensure the token contains user data.`)
  }
}
