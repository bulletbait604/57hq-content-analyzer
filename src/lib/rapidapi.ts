// RapidAPI Kick API Integration for Subscription Verification
// This handles subscription verification using kick-com-api.p.rapidapi.com
export interface RapidAPIResponse {
  isSubscribed: boolean
  method: string
  data?: any
  error?: string
}

export class RapidAPIKickSubscription {
  private apiKey: string
  private baseURL: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseURL = 'https://kick-com-api.p.rapidapi.com'
  }

  async checkSubscription(username: string, channelName: string = 'bulletbait604'): Promise<RapidAPIResponse> {
    try {
      console.log(`🔍 Checking subscription via RapidAPI Kick API for ${username} to ${channelName}`)
      
      if (!this.apiKey || this.apiKey === 'your-rapidapi-kick-api-key-here') {
        console.log('❌ RapidAPI Kick API key not configured')
        return { isSubscribed: false, method: 'rapidapi', error: 'RapidAPI Kick API key not configured' }
      }

      // Method 1: Try direct subscription endpoint
      try {
        console.log(`🚀 Trying RapidAPI Kick API subscription endpoint: ${this.baseURL}/user/${username}/subscriptions`)
        const response = await fetch(`${this.baseURL}/user/${username}/subscriptions`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
          }
        })

        console.log(`RapidAPI Kick API subscription endpoint response: ${response.status}`)
        
        if (response.ok) {
          const subscriptions = await response.json()
          console.log('📋 Got user subscriptions from RapidAPI Kick API:', subscriptions)
          
          const isSubscribed = subscriptions.some((sub: any) => 
            sub.channel_name === channelName || 
            sub.channel_slug === channelName ||
            sub.name === channelName
          )
          
          console.log(`✅ RapidAPI Kick API subscription check result: ${isSubscribed}`)
          return { isSubscribed, method: 'rapidapi', data: subscriptions }
        } else {
          const errorText = await response.text()
          console.log(`❌ RapidAPI Kick API subscription endpoint failed (${response.status}):`, errorText.substring(0, 100))
        }
      } catch (error) {
        console.log('❌ RapidAPI Kick API subscription endpoint request failed:', error)
      }

      // Method 2: Try channel info (with rate limiting delay)
      try {
        console.log(`🚀 Trying RapidAPI Kick API channel endpoint: ${this.baseURL}/channel/${channelName}`)
        const channelResponse = await fetch(`${this.baseURL}/channel/${channelName}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
          }
        })

        console.log(`RapidAPI Kick API channel endpoint response: ${channelResponse.status}`)
        
        if (channelResponse.ok) {
          const channelData = await channelResponse.json()
          console.log('📺 Got channel info from RapidAPI Kick API:', channelData)
          
          // Check if channel has subscriber data
          if (channelData.subscribers && Array.isArray(channelData.subscribers)) {
            const isSubscribed = channelData.subscribers.some((sub: any) => 
              sub.username === username || sub.name === username
            )
            
            console.log(`✅ RapidAPI Kick API channel subscriber check result: ${isSubscribed}`)
            return { isSubscribed, method: 'rapidapi', data: channelData }
          } else {
            console.log('❌ No subscriber data found in RapidAPI Kick API channel info')
          }
        } else {
          const errorText = await channelResponse.text()
          console.log(`❌ RapidAPI Kick API channel endpoint failed (${channelResponse.status}):`, errorText.substring(0, 100))
        }
      } catch (error) {
        console.log('❌ RapidAPI Kick API channel endpoint request failed:', error)
      }

      console.log(`❌ Could not verify subscription for ${username} - all RapidAPI Kick API methods failed`)
      return { 
        isSubscribed: false, 
        method: 'rapidapi', 
        error: 'All RapidAPI Kick API methods failed - check API key and rate limits' 
      }
    } catch (error) {
      console.error('RapidAPI Kick API check failed:', error)
      return { 
        isSubscribed: false, 
        method: 'rapidapi', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}
