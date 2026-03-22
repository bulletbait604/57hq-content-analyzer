// Kick.com API integration via RapidAPI for subscription verification

export interface KickChannelData {
  id: string
  name: string
  display_name: string
  followers: number
  following: number
  subscriber_count?: number
  subscription_tier?: string
  is_subscribed?: boolean
  subscribers?: any[]  // Add subscribers array
  [key: string]: any    // Allow additional properties
}

export class KickRapidAPI {
  private apiKey: string
  private baseURL: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseURL = 'https://kick-com-api.p.rapidapi.com'
  }

  async getChannelInfo(channelName: string): Promise<KickChannelData> {
    try {
      const response = await fetch(`${this.baseURL}/channel/${channelName}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Extract subscription info if available
      return {
        id: data.id || data.channel?.id || '',
        name: data.name || data.channel?.name || channelName,
        display_name: data.display_name || data.channel?.display_name || channelName,
        followers: data.followers || data.channel?.followers || 0,
        following: data.following || data.channel?.following || 0,
        subscriber_count: data.subscriber_count || data.channel?.subscriber_count,
        subscription_tier: data.subscription_tier || data.channel?.subscription_tier,
        is_subscribed: data.is_subscribed || data.channel?.is_subscribed
      }
    } catch (error) {
      console.error('Failed to get channel info:', error)
      throw error
    }
  }

  async checkUserSubscription(username: string, channelName: string): Promise<boolean> {
    try {
      console.log(`🔍 Checking if ${username} is subscribed to ${channelName} via RapidAPI`)
      
      // Method 1: Try direct subscription endpoint
      try {
        const response = await fetch(`${this.baseURL}/user/${username}/subscriptions`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
          }
        })

        if (response.ok) {
          const subscriptions = await response.json()
          console.log('📋 Got user subscriptions:', subscriptions)
          
          // Check if user is subscribed to the specific channel
          const isSubscribed = subscriptions.some((sub: any) => 
            sub.channel_name === channelName || 
            sub.channel_slug === channelName ||
            sub.channel_id === channelName ||
            sub.name === channelName
          )
          
          console.log(`✅ Direct subscription check result: ${isSubscribed}`)
          return isSubscribed
        } else {
          console.log(`❌ Subscription endpoint failed: ${response.status}`)
        }
      } catch (error) {
        console.log('❌ Direct subscription check failed:', error)
      }

      // Method 2: Get user info and check subscription status
      try {
        const userInfo = await this.getUserInfo(username)
        console.log('👤 Got user info:', userInfo)
        
        // Check if user info contains subscription data
        if (userInfo.subscriptions) {
          const isSubscribed = userInfo.subscriptions.some((sub: any) => 
            sub.channel_name === channelName || 
            sub.channel_slug === channelName ||
            sub.channel_id === channelName
          )
          
          console.log(`✅ User info subscription check result: ${isSubscribed}`)
          return isSubscribed
        }
      } catch (error) {
        console.log('❌ User info check failed:', error)
      }

      // Method 3: Get channel info and check subscriber list
      try {
        const channelInfo = await this.getChannelInfo(channelName)
        console.log('📺 Got channel info:', channelInfo)
        
        // Check if channel info contains subscriber data
        if (channelInfo.subscribers && Array.isArray(channelInfo.subscribers)) {
          const isSubscribed = channelInfo.subscribers.some((sub: any) => 
            sub.username === username ||
            sub.name === username ||
            sub.id === username
          )
          
          console.log(`✅ Channel subscriber check result: ${isSubscribed}`)
          return isSubscribed
        }
        
        // Check subscriber count (if available)
        if (channelInfo.subscriber_count !== undefined) {
          console.log(`📊 Channel has ${channelInfo.subscriber_count} subscribers (but no list available)`)
        }
      } catch (error) {
        console.log('❌ Channel info check failed:', error)
      }

      console.log(`❌ Could not verify subscription for ${username} to ${channelName}`)
      return false
    } catch (error) {
      console.error('Failed to check subscription:', error)
      return false
    }
  }

  private async checkSubscriptionViaChannel(username: string, channelName: string): Promise<boolean> {
    try {
      // Alternative method: Get channel info and check if user is in subscribers
      const channelData = await this.getChannelInfo(channelName)
      
      // If we can't get direct subscription info, we'll need to use a different approach
      // For now, return false and let the calling code handle it
      return false
    } catch (error) {
      console.error('Alternative subscription check failed:', error)
      return false
    }
  }

  async getUserInfo(username: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/user/${username}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get user info:', error)
      throw error
    }
  }
}
