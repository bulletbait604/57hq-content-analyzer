// TikTok OAuth Implementation
export interface TikTokUser {
  open_id: string
  union_id: string
  avatar_url: string
  avatar_url_100: string
  display_name: string
  bio_description: string
  profile_deep_link: string
  is_verified: boolean
  follower_count: number
  following_count: number
  likes_count: number
  video_count: number
}

export interface TikTokAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
  refresh_expires_in: number
}

export class TikTokOAuth {
  private clientId: string
  private clientSecret: string
  private redirectUri: string
  private csrfState: string

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUri = redirectUri
    this.csrfState = this.generateCSRFState()
  }

  private generateCSRFState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Generate TikTok OAuth URL
  getAuthURL(): string {
    const scopes = ['user.info.basic', 'user.info.profile', 'user.info.stats']
    const scope = scopes.join(',')
    
    const params = new URLSearchParams({
      client_key: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scope,
      response_type: 'code',
      state: this.csrfState
    })

    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, state: string): Promise<TikTokAuthResponse> {
    // Verify CSRF state
    if (state !== this.csrfState) {
      throw new Error('Invalid CSRF state')
    }

    console.log('🔐 Exchanging code for TikTok access token...')

    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/'
    
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
        body: new URLSearchParams({
          client_key: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('TikTok token error:', errorText)
        throw new Error(`TikTok API error: ${response.status} - ${errorText}`)
      }

      const tokenData = await response.json()
      console.log('✅ TikTok token exchange success!')
      
      return tokenData
    } catch (error) {
      console.error('❌ TikTok token exchange failed:', error)
      throw error
    }
  }

  // Get user information with access token
  async getUserInfo(accessToken: string): Promise<TikTokUser> {
    console.log('🔍 Getting TikTok user info...')
    
    const userInfoUrl = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,avatar_url_100,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count'
    
    try {
      const response = await fetch(userInfoUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('TikTok user info error:', errorText)
        throw new Error(`TikTok API error: ${response.status} - ${errorText}`)
      }

      const userData = await response.json()
      console.log('✅ Got TikTok user info:', userData)
      
      if (userData.error && userData.error.code) {
        throw new Error(`TikTok API error: ${userData.error.message}`)
      }

      return userData.data.user
    } catch (error) {
      console.error('❌ TikTok user info failed:', error)
      throw error
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<TikTokAuthResponse> {
    console.log('🔄 Refreshing TikTok access token...')

    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/'
    
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
        body: new URLSearchParams({
          client_key: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`TikTok refresh error: ${response.status} - ${errorText}`)
      }

      const tokenData = await response.json()
      console.log('✅ TikTok token refresh success!')
      
      return tokenData
    } catch (error) {
      console.error('❌ TikTok token refresh failed:', error)
      throw error
    }
  }

  // Get current CSRF state
  getCSRFState(): string {
    return this.csrfState
  }
}

// Create singleton instance
let tiktokOAuth: TikTokOAuth | null = null

export function getTikTokOAuth(): TikTokOAuth {
  if (!tiktokOAuth) {
    const clientId = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID || ''
    const clientSecret = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_SECRET || ''
    const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI || 'https://sdhq-content-analyzer.vercel.app/auth/tiktok/callback'
    
    tiktokOAuth = new TikTokOAuth(clientId, clientSecret, redirectUri)
  }
  return tiktokOAuth
}
