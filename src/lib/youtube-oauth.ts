// YouTube OAuth 2.0 Implementation
// Uses Google OAuth 2.0 for YouTube Data API access

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  url: string
  publishedAt: string
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
  channel: {
    id: string
    title: string
    thumbnail: string
  }
}

export interface YouTubeChannel {
  id: string
  title: string
  description: string
  thumbnail: string
  subscriberCount: string
  videoCount: string
}

export class YouTubeOAuth {
  private clientId: string
  private clientSecret: string
  private redirectUri: string
  private scopes: string[]

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUri = redirectUri
    this.scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ]
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  async exchangeCodeForTokens(code: string): Promise<{
    access_token: string
    refresh_token?: string
    expires_in: number
  }> {
    console.log('🔴 Exchanging YouTube OAuth code for tokens...')

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ YouTube token exchange error (${response.status}):`, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ YouTube OAuth token exchange success!')
    return data
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string
    expires_in: number
  }> {
    console.log('🔄 Refreshing YouTube access token...')

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ YouTube token refresh error (${response.status}):`, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ YouTube token refresh success!')
    return data
  }

  async getUserChannel(accessToken: string): Promise<YouTubeChannel | null> {
    console.log('🔴 Getting YouTube user channel...')

    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ YouTube channel error (${response.status}):`, errorText)
      return null
    }

    const data = await response.json()
    console.log('✅ Got YouTube channel data:', data)

    if (!data.items || data.items.length === 0) {
      return null
    }

    const channel = data.items[0]
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.default.url,
      subscriberCount: channel.statistics.subscriberCount,
      videoCount: channel.statistics.videoCount
    }
  }

  async getRecentVideos(accessToken: string, maxResults: number = 20): Promise<YouTubeVideo[]> {
    console.log('🔴 Getting recent YouTube videos...')

    // First get the channel ID
    const channelResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!channelResponse.ok) {
      throw new Error('Failed to get channel info')
    }

    const channelData = await channelResponse.json()
    if (!channelData.items || channelData.items.length === 0) {
      return []
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads

    // Get recent videos from uploads playlist
    const playlistResponse = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${uploadsPlaylistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!playlistResponse.ok) {
      throw new Error('Failed to get playlist items')
    }

    const playlistData = await playlistResponse.json()
    if (!playlistData.items) {
      return []
    }

    // Get video details for each video
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .filter((id: string) => id) // Filter out null/undefined

    if (videoIds.length === 0) {
      return []
    }

    const videosResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!videosResponse.ok) {
      throw new Error('Failed to get video details')
    }

    const videosData = await videosResponse.json()
    console.log('✅ Got YouTube videos data:', videosData)

    if (!videosData.items) {
      return []
    }

    return videosData.items.map((video: any) => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      publishedAt: video.snippet.publishedAt,
      statistics: {
        viewCount: video.statistics.viewCount || '0',
        likeCount: video.statistics.likeCount || '0',
        commentCount: video.statistics.commentCount || '0'
      },
      channel: {
        id: video.snippet.channelId,
        title: video.snippet.channelTitle,
        thumbnail: '' // Channel thumbnail would need separate API call
      }
    }))
  }

  async getVideoDetails(accessToken: string, videoId: string): Promise<YouTubeVideo | null> {
    console.log(`🔴 Getting YouTube video details for ${videoId}...`)

    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ YouTube video details error (${response.status}):`, errorText)
      return null
    }

    const data = await response.json()
    console.log('✅ Got YouTube video details:', data)

    if (!data.items || data.items.length === 0) {
      return null
    }

    const video = data.items[0]
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      publishedAt: video.snippet.publishedAt,
      statistics: {
        viewCount: video.statistics.viewCount || '0',
        likeCount: video.statistics.likeCount || '0',
        commentCount: video.statistics.commentCount || '0'
      },
      channel: {
        id: video.snippet.channelId,
        title: video.snippet.channelTitle,
        thumbnail: ''
      }
    }
  }
}
