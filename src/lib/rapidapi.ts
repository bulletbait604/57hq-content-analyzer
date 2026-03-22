// RapidAPI integration for Kick subscription verification
export interface RapidAPIResponse {
  isSubscribed: boolean
  method: string
  data?: any
  error?: string
}

export class RapidAPI {
  private apiKey: string
  private baseURL: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseURL = 'https://kick-com-api.p.rapidapi.com'
  }

  async checkSubscription(username: string, channelName: string = 'bulletbait604'): Promise<RapidAPIResponse> {
    try {
      console.log(`🔍 Checking subscription for ${username} to ${channelName}`)

      // Method 1: Try direct subscription endpoint
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
        
        const isSubscribed = subscriptions.some((sub: any) => 
          sub.channel_name === channelName || 
          sub.channel_slug === channelName ||
          sub.name === channelName
        )
        
        console.log(`✅ Subscription check result: ${isSubscribed}`)
        return { isSubscribed, method: 'rapidapi', data: subscriptions }
      } else {
        console.log(`❌ Subscription endpoint failed: ${response.status}`)
      }

      // Method 2: Try channel info
      const channelResponse = await fetch(`${this.baseURL}/channel/${channelName}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
        }
      })

      if (channelResponse.ok) {
        const channelData = await channelResponse.json()
        console.log('📺 Got channel info:', channelData)
        
        // Check if channel has subscriber data
        if (channelData.subscribers && Array.isArray(channelData.subscribers)) {
          const isSubscribed = channelData.subscribers.some((sub: any) => 
            sub.username === username || sub.name === username
          )
          
          console.log(`✅ Channel subscriber check result: ${isSubscribed}`)
          return { isSubscribed, method: 'rapidapi', data: channelData }
        }
      }

      console.log(`❌ Could not verify subscription for ${username}`)
      return { isSubscribed: false, method: 'rapidapi', error: 'No subscription data found' }
    } catch (error) {
      console.error('RapidAPI check failed:', error)
      return { isSubscribed: false, method: 'rapidapi', error: 'API request failed' }
    }
  }
}
