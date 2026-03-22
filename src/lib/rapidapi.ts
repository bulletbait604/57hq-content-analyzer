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

      // Method 1: Try channel subscribers endpoint (most reliable)
      try {
        console.log(`🚀 Trying RapidAPI Kick API channel subscribers endpoint: ${this.baseURL}/channel/${channelName}/subscribers`)
        const response = await fetch(`${this.baseURL}/channel/${channelName}/subscribers`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
          }
        })

        console.log(`RapidAPI Kick API channel subscribers response: ${response.status}`)
        
        if (response.ok) {
          const subscribers = await response.json()
          console.log('📋 Got channel subscribers from RapidAPI Kick API:', subscribers)
          
          // Check different possible response structures
          let subscriberList = []
          if (Array.isArray(subscribers)) {
            subscriberList = subscribers
          } else if (subscribers.data && Array.isArray(subscribers.data)) {
            subscriberList = subscribers.data
          } else if (subscribers.subscribers && Array.isArray(subscribers.subscribers)) {
            subscriberList = subscribers.subscribers
          }
          
          console.log(`🔍 Checking ${subscriberList.length} subscribers for username: ${username}`)
          
          const isSubscribed = subscriberList.some((sub: any) => {
            const subUsername = sub.username?.toLowerCase() || sub.name?.toLowerCase() || sub.user?.username?.toLowerCase()
            const targetUsername = username.toLowerCase()
            return subUsername === targetUsername
          })
          
          console.log(`✅ RapidAPI Kick API subscription check result: ${isSubscribed}`)
          return { isSubscribed, method: 'rapidapi', data: subscribers }
        } else {
          const errorText = await response.text()
          console.log(`❌ RapidAPI Kick API channel subscribers failed (${response.status}):`, errorText.substring(0, 100))
        }
      } catch (error) {
        console.log('❌ RapidAPI Kick API channel subscribers request failed:', error)
      }

      // Method 2: Try user subscriptions endpoint
      try {
        console.log(`🚀 Trying RapidAPI Kick API user subscriptions endpoint: ${this.baseURL}/user/${username}/subscriptions`)
        const response = await fetch(`${this.baseURL}/user/${username}/subscriptions`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
          }
        })

        console.log(`RapidAPI Kick API user subscriptions response: ${response.status}`)
        
        if (response.ok) {
          const subscriptions = await response.json()
          console.log('📋 Got user subscriptions from RapidAPI Kick API:', subscriptions)
          
          // Check different possible response structures
          let subscriptionList = []
          if (Array.isArray(subscriptions)) {
            subscriptionList = subscriptions
          } else if (subscriptions.data && Array.isArray(subscriptions.data)) {
            subscriptionList = subscriptions.data
          } else if (subscriptions.subscriptions && Array.isArray(subscriptions.subscriptions)) {
            subscriptionList = subscriptions.subscriptions
          }
          
          const isSubscribed = subscriptionList.some((sub: any) => {
            const channelNameMatch = sub.channel_name?.toLowerCase() === channelName.toLowerCase() ||
                                   sub.channel_slug?.toLowerCase() === channelName.toLowerCase() ||
                                   sub.name?.toLowerCase() === channelName.toLowerCase() ||
                                   sub.channel?.name?.toLowerCase() === channelName.toLowerCase()
            return channelNameMatch
          })
          
          console.log(`✅ RapidAPI Kick API user subscriptions check result: ${isSubscribed}`)
          return { isSubscribed, method: 'rapidapi', data: subscriptions }
        } else {
          const errorText = await response.text()
          console.log(`❌ RapidAPI Kick API user subscriptions failed (${response.status}):`, errorText.substring(0, 100))
        }
      } catch (error) {
        console.log('❌ RapidAPI Kick API user subscriptions request failed:', error)
      }

      // Method 3: Try channel info and check if user is in subscriber list
      try {
        console.log(`🚀 Trying RapidAPI Kick API channel info endpoint: ${this.baseURL}/channel/${channelName}`)
        const channelResponse = await fetch(`${this.baseURL}/channel/${channelName}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
          }
        })

        console.log(`RapidAPI Kick API channel info response: ${channelResponse.status}`)
        
        if (channelResponse.ok) {
          const channelData = await channelResponse.json()
          console.log('📺 Got channel info from RapidAPI Kick API:', channelData)
          
          // Check if channel has subscriber data in different formats
          let subscriberList = []
          if (channelData.subscribers && Array.isArray(channelData.subscribers)) {
            subscriberList = channelData.subscribers
          } else if (channelData.data && channelData.data.subscribers && Array.isArray(channelData.data.subscribers)) {
            subscriberList = channelData.data.subscribers
          }
          
          if (subscriberList.length > 0) {
            console.log(`🔍 Checking ${subscriberList.length} channel subscribers for username: ${username}`)
            
            const isSubscribed = subscriberList.some((sub: any) => {
              const subUsername = sub.username?.toLowerCase() || sub.name?.toLowerCase() || sub.user?.username?.toLowerCase()
              const targetUsername = username.toLowerCase()
              return subUsername === targetUsername
            })
            
            console.log(`✅ RapidAPI Kick API channel info subscriber check result: ${isSubscribed}`)
            return { isSubscribed, method: 'rapidapi', data: channelData }
          } else {
            console.log('❌ No subscriber data found in RapidAPI Kick API channel info')
          }
        } else {
          const errorText = await channelResponse.text()
          console.log(`❌ RapidAPI Kick API channel info failed (${channelResponse.status}):`, errorText.substring(0, 100))
        }
      } catch (error) {
        console.log('❌ RapidAPI Kick API channel info request failed:', error)
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
