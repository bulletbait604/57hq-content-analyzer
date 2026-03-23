// Multi-Platform Social Media Verification System
export interface SocialStatus {
  platform: string
  isFollowing: boolean
  isSubscribed: boolean
  username: string
  verifiedAt: Date
  error?: string
}

export interface VerificationResult {
  totalPlatforms: number
  verifiedPlatforms: number
  aiCreditsPerDay: number
  socialStatus: SocialStatus[]
  isVerified: boolean
  lastChecked: Date
}

export class SocialVerificationService {
  private kickAccessToken: string = ''
  private tiktokApiKey: string = ''
  private youtubeApiKey: string = ''
  private twitterApiKey: string = ''

  constructor() {
    // Initialize API keys from environment
    this.tiktokApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_TIKTOK_API_KEY || ''
    this.youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || ''
    this.twitterApiKey = process.env.NEXT_PUBLIC_TWITTER_API_KEY || ''
  }

  setKickAccessToken(token: string) {
    this.kickAccessToken = token
  }

  // Check if user follows on Kick
  async checkKickFollow(username: string, channelToFollow: string = 'bulletbait604'): Promise<SocialStatus> {
    try {
      console.log(`🔍 Checking if ${username} follows ${channelToFollow} on Kick`)
      
      const response = await fetch(`https://api.kick.com/v1/users/${username}/follows`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.kickAccessToken}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const follows = Array.isArray(data) ? data : (data.data || data.follows || [])
        const isFollowing = follows.some((follow: any) => 
          follow.username?.toLowerCase() === channelToFollow.toLowerCase() ||
          follow.channel_name?.toLowerCase() === channelToFollow.toLowerCase()
        )
        
        return {
          platform: 'Kick',
          isFollowing,
          isSubscribed: false,
          username,
          verifiedAt: new Date()
        }
      } else {
        throw new Error(`Kick API error: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Kick follow check failed:', error)
      return {
        platform: 'Kick',
        isFollowing: false,
        isSubscribed: false,
        username,
        verifiedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Check if user follows on TikTok
  async checkTikTokFollow(username: string, accountToFollow: string = 'thebulletbait'): Promise<SocialStatus> {
    try {
      console.log(`🔍 Checking if ${username} follows ${accountToFollow} on TikTok`)
      
      if (!this.tiktokApiKey) {
        throw new Error('TikTok API key not configured')
      }

      const response = await fetch(`https://tiktok-api2.p.rapidapi.com/user/following/${username}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.tiktokApiKey,
          'X-RapidAPI-Host': 'tiktok-api2.p.rapidapi.com'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const following = Array.isArray(data) ? data : (data.data || data.following || [])
        const isFollowing = following.some((follow: any) => 
          follow.username?.toLowerCase() === accountToFollow.toLowerCase() ||
          follow.uniqueId?.toLowerCase() === accountToFollow.toLowerCase()
        )
        
        return {
          platform: 'TikTok',
          isFollowing,
          isSubscribed: false,
          username,
          verifiedAt: new Date()
        }
      } else {
        throw new Error(`TikTok API error: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ TikTok follow check failed:', error)
      return {
        platform: 'TikTok',
        isFollowing: false,
        isSubscribed: false,
        username,
        verifiedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Check if user follows on Instagram
  async checkInstagramFollow(username: string, accountToFollow: string = 'bulletbait604'): Promise<SocialStatus> {
    try {
      console.log(`🔍 Checking if ${username} follows ${accountToFollow} on Instagram`)
      
      // Note: Instagram API requires OAuth and app approval
      // For now, we'll return a placeholder that would need proper Instagram API integration
      const response = await fetch(`https://graph.instagram.com/${username}/following`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || ''}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const following = Array.isArray(data) ? data : (data.data || [])
        const isFollowing = following.some((follow: any) => 
          follow.username?.toLowerCase() === accountToFollow.toLowerCase()
        )
        
        return {
          platform: 'Instagram',
          isFollowing,
          isSubscribed: false,
          username,
          verifiedAt: new Date()
        }
      } else {
        throw new Error(`Instagram API error: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Instagram follow check failed:', error)
      return {
        platform: 'Instagram',
        isFollowing: false,
        isSubscribed: false,
        username,
        verifiedAt: new Date(),
        error: error instanceof Error ? error.message : 'Instagram API not configured'
      }
    }
  }

  // Check if user is subscribed on YouTube
  async checkYouTubeSubscribe(username: string, channelToSubscribe: string = 'bulletbait604'): Promise<SocialStatus> {
    try {
      console.log(`🔍 Checking if ${username} is subscribed to ${channelToSubscribe} on YouTube`)
      
      if (!this.youtubeApiKey) {
        throw new Error('YouTube API key not configured')
      }

      // First get channel ID from username
      const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${channelToSubscribe}&key=${this.youtubeApiKey}`)
      
      if (!channelResponse.ok) {
        throw new Error(`YouTube channel lookup error: ${channelResponse.status}`)
      }
      
      const channelData = await channelResponse.json()
      const channelId = channelData.items?.[0]?.id
      
      if (!channelId) {
        throw new Error(`YouTube channel ${channelToSubscribe} not found`)
      }

      // Check if user is subscribed to this channel
      const response = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&forChannelId=${channelId}&key=${this.youtubeApiKey}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.youtubeApiKey}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const subscriptions = Array.isArray(data.items) ? data.items : []
        const isSubscribed = subscriptions.length > 0
        
        return {
          platform: 'YouTube',
          isFollowing: false,
          isSubscribed,
          username,
          verifiedAt: new Date()
        }
      } else {
        throw new Error(`YouTube API error: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ YouTube subscription check failed:', error)
      return {
        platform: 'YouTube',
        isFollowing: false,
        isSubscribed: false,
        username,
        verifiedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Calculate AI credits based on verified platforms
  calculateAICredits(socialStatus: SocialStatus[]): number {
    let credits = 0
    
    socialStatus.forEach(status => {
      if (status.isFollowing || status.isSubscribed) {
        credits += 5 // 5 credits per verified platform
      }
    })
    
    return Math.min(credits, 25) // Max 25 credits per day
  }

  // Complete verification for all platforms
  async verifyAllPlatforms(username: string): Promise<VerificationResult> {
    console.log(`🚀 Starting complete social verification for ${username}`)
    
    const platforms = [
      () => this.checkKickFollow(username),
      () => this.checkTikTokFollow(username),
      () => this.checkInstagramFollow(username),
      () => this.checkYouTubeSubscribe(username)
    ]
    
    const results: SocialStatus[] = []
    
    // Check all platforms in parallel
    const promises = platforms.map(check => check())
    const resolvedResults = await Promise.allSettled(promises)
    
    resolvedResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        const platformNames = ['Kick', 'TikTok', 'Instagram', 'YouTube']
        results.push({
          platform: platformNames[index],
          isFollowing: false,
          isSubscribed: false,
          username,
          verifiedAt: new Date(),
          error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
        })
      }
    })
    
    const verifiedPlatforms = results.filter(r => r.isFollowing || r.isSubscribed).length
    const aiCredits = this.calculateAICredits(results)
    
    const verificationResult: VerificationResult = {
      totalPlatforms: platforms.length,
      verifiedPlatforms,
      aiCreditsPerDay: aiCredits,
      socialStatus: results,
      isVerified: verifiedPlatforms >= 2, // Require at least 2 platforms
      lastChecked: new Date()
    }
    
    console.log(`✅ Verification complete: ${verifiedPlatforms}/${platforms.length} platforms verified, ${aiCredits} AI credits`)
    
    return verificationResult
  }
}

// Singleton instance
let socialVerificationService: SocialVerificationService | null = null

export function getSocialVerificationService(): SocialVerificationService {
  if (!socialVerificationService) {
    socialVerificationService = new SocialVerificationService()
  }
  return socialVerificationService
}
