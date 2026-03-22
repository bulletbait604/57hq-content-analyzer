// Uses RapidAPI endpoints to check subscription status
export interface SubscriptionResponse {
  isSubscribed: boolean
  method: string
  data?: any
  error?: string
}

export class KickSubscriptionChecker {
  private apiKey: string
  private baseURL: string = 'https://api.kick.com'
  private authToken: string = ''

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Set the auth token after successful OAuth
  setAuthToken(token: string) {
    this.authToken = token
    console.log('🔐 Auth token set for Kick API requests')
  }

  async checkSubscription(username: string, channelName: string = 'bulletbait604'): Promise<SubscriptionResponse> {
    try {
      console.log(`🔍 Checking subscription via Official Kick API for ${username} to ${channelName}`)
      
      // Method 1: Try Official Kick API for subscriber list
      try {
        console.log(`🚀 Trying Official Kick API: https://kick.com/api/v1/subscriptions/subscribers`)
        
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        
        // Add auth token if available
        if (this.authToken) {
          headers['Authorization'] = `Bearer ${this.authToken}`
          console.log('🔐 Using auth token for API request')
        } else {
          console.log('⚠️ No auth token available - making unauthenticated request')
        }
        
        const subscribersResponse = await fetch(`https://kick.com/api/v1/subscriptions/subscribers`, {
          method: 'GET',
          headers
        })

        console.log(`Official Kick API response: ${subscribersResponse.status}`)
        
        if (subscribersResponse.ok) {
          const subscribersData = await subscribersResponse.json()
          console.log('📺 Got subscribers from Official Kick API:', subscribersData)
          console.log('📋 RAW Response:', JSON.stringify(subscribersData, null, 2))
          console.log('📋 Response structure:', Object.keys(subscribersData))
          
          // Check if we have subscriber data
          if (subscribersData.data && Array.isArray(subscribersData.data)) {
            console.log(`📋 Found ${subscribersData.data.length} subscribers via Official Kick API`)
            console.log('📋 First subscriber:', JSON.stringify(subscribersData.data[0], null, 2))
            
            const isSubscribed = subscribersData.data.some((subscriber: any) => {
              const subscriberUsername = subscriber.username?.toLowerCase() || 
                                              subscriber.name?.toLowerCase() || 
                                              subscriber.user?.username?.toLowerCase() ||
                                              subscriber.display_name?.toLowerCase()
              const loggedInUsername = username.toLowerCase()
              console.log(`🔍 Checking subscriber "${subscriberUsername}" vs logged-in user "${loggedInUsername}"`)
              return subscriberUsername === loggedInUsername
            })
            
            console.log(`✅ Official Kick API check result: ${isSubscribed}`)
            
            if (isSubscribed) {
              console.log(`🎉 FOUND "${username.toLowerCase()}" in Kick's subscriber list!`)
              return { 
                isSubscribed: true, 
                method: 'official_kick_api_subscribers',
                data: {
                  subscribersData: subscribersData.data,
                  subscriberFound: subscribersData.data.find((sub: any) => 
                    sub.username?.toLowerCase() === username.toLowerCase() || 
                    sub.name?.toLowerCase() === username.toLowerCase() ||
                    sub.user?.username?.toLowerCase() === username.toLowerCase()
                  ),
                  totalSubscribers: subscribersData.data.length
                }
              }
            } else {
              console.log(`❌ "${username.toLowerCase()}" NOT found in Kick's subscriber list`)
            }
          } else {
            console.log('❌ No subscriber array found in official API response')
            console.log('❌ Available keys:', Object.keys(subscribersData))
            console.log('❌ Data content:', subscribersData)
          }
        } else {
          const errorText = await subscribersResponse.text()
          console.log(`❌ Official Kick API failed (${subscribersResponse.status}):`, errorText)
        }
      } catch (officialApiError) {
        console.log('❌ Official Kick API request failed:', officialApiError)
      }

      // Method 2: Fallback to channel-specific subscribers
      try {
        console.log(`🔄 Trying channel-specific subscribers endpoint`)
        
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        
        // Add auth token if available
        if (this.authToken) {
          headers['Authorization'] = `Bearer ${this.authToken}`
        }
        
        const channelSubsResponse = await fetch(`https://kick.com/api/v1/channels/${channelName}/subscribers`, {
          method: 'GET',
          headers
        })

        console.log(`Channel subscribers response: ${channelSubsResponse.status}`)
        
        if (channelSubsResponse.ok) {
          const channelSubsData = await channelSubsResponse.json()
          console.log('� Got channel subscribers:', channelSubsData)
          
          if (channelSubsData.data && Array.isArray(channelSubsData.data)) {
            const isSubscribed = channelSubsData.data.some((subscriber: any) => 
              subscriber.username?.toLowerCase() === username.toLowerCase()
            )
            
            console.log(`✅ Channel subscribers check result: ${isSubscribed}`)
            
            return { 
              isSubscribed: isSubscribed, 
              method: 'channel_subscribers_fallback',
              data: channelSubsData.data
            }
          }
        }
      } catch (channelError) {
        console.log('❌ Channel subscribers check failed:', channelError)
      }

      console.log(`❌ Could not verify subscription for ${username} - all methods failed`)
      return { 
        isSubscribed: false, 
        method: 'official_kick_api',
        error: 'All methods failed - user may not be subscribed'
      }
    } catch (error) {
      console.error('Official Kick API subscription check failed:', error)
      return { 
        isSubscribed: false, 
        method: 'official_kick_api',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const kickSubscriptionChecker = new KickSubscriptionChecker(
  process.env.NEXT_PUBLIC_RAPIDAPI_KICK_API_KEY || ''
)
