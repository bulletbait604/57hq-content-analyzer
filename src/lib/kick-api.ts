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
  private clientId: string
  private clientSecret: string

  constructor(baseURL: string, clientId: string, clientSecret: string) {
    this.baseURL = baseURL
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  getAuthURL(redirectURI: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectURI,
      response_type: 'code',
      scope: 'user:read channel:read',
      state: Math.random().toString(36).substring(7),
      prompt: 'consent' // Force authorization screen even if logged in
    })

    return `${this.baseURL}/oauth/authorize?${params.toString()}`
  }

  async exchangeCodeForToken(code: string, redirectURI: string): Promise<KickAuthResponse> {
    const response = await fetch(`${this.baseURL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: redirectURI
      })
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for token')
    }

    return response.json()
  }

  async getCurrentUser(accessToken: string): Promise<KickUser> {
    const response = await fetch(`${this.baseURL}/api/v2/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get user info')
    }

    const data = await response.json()
    return {
      id: data.id.toString(),
      username: data.username,
      display_name: data.display_name || data.username,
      profile_image_url: data.profile_image_url || ''
    }
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
