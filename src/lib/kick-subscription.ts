// Uses RapidAPI endpoints to check subscription status
export interface SubscriptionResponse {
  isSubscribed: boolean
  method: string
  data?: any
  error?: string
}

export class KickSubscriptionChecker {
  private apiKey: string
  private baseURL: string = 'https://kick.com/api/v1'
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
      console.log(`🔍 Checking subscription via Unofficial Kick API for ${username} to ${channelName}`)
      
      // Method 1: Try to get user's own subscriptions using unofficial API
      try {
        console.log(`🚀 Trying Unofficial Kick API: https://kick.com/api/v1/user/subscriptions`)
        
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
        
        const userSubsResponse = await fetch(`https://kick.com/api/v1/user/subscriptions`, {
          method: 'GET',
          headers
        })

        console.log(`User subscriptions response: ${userSubsResponse.status}`)
        
        if (userSubsResponse.ok) {
          const userSubsData = await userSubsResponse.json()
          console.log('📺 Got user subscriptions from Unofficial Kick API:', userSubsData)
          console.log('📋 RAW Response:', JSON.stringify(userSubsData, null, 2))
          console.log('📋 Response structure:', Object.keys(userSubsData))
          
          // Check if user has subscription to target channel
          if (userSubsData.data && Array.isArray(userSubsData.data)) {
            console.log(`📋 Found ${userSubsData.data.length} subscriptions for user`)
            
            const isSubscribed = userSubsData.data.some((subscription: any) => {
              const subscribedChannel = subscription.channel?.name?.toLowerCase() || 
                                     subscription.broadcaster?.name?.toLowerCase() ||
                                     subscription.username?.toLowerCase()
              const targetChannel = channelName.toLowerCase()
              console.log(`🔍 Checking if user is subscribed to "${subscribedChannel}" vs target "${targetChannel}"`)
              return subscribedChannel === targetChannel
            })
            
            console.log(`✅ User subscriptions check result: ${isSubscribed}`)
            
            if (isSubscribed) {
              console.log(`🎉 FOUND subscription from ${username} to ${channelName}!`)
              return { 
                isSubscribed: true, 
                method: 'unofficial_user_subscriptions',
                data: {
                  userSubscriptions: userSubsData.data,
                  subscriptionFound: userSubsData.data.find((sub: any) => 
                    (sub.channel?.name?.toLowerCase() === channelName.toLowerCase()) ||
                     (sub.broadcaster?.name?.toLowerCase() === channelName.toLowerCase()) ||
                     (sub.username?.toLowerCase() === channelName.toLowerCase())
                  ),
                  totalSubscriptions: userSubsData.data.length
                }
              }
            } else {
              console.log(`❌ "${username}" has no subscription to ${channelName}`)
            }
          } else {
            console.log('❌ No subscription array found in user subscriptions API response')
            console.log('❌ Available keys:', Object.keys(userSubsData))
            console.log('❌ Data content:', userSubsData)
          }
        } else {
          const errorText = await userSubsResponse.text()
          console.log(`❌ User subscriptions API failed (${userSubsResponse.status}):`, errorText)
        }
      } catch (userSubsError) {
        console.log('❌ User subscriptions request failed:', userSubsError)
      }

      // Method 2: Try to get channel subscribers using unofficial API
      try {
        console.log(`🔄 Trying channel subscribers endpoint: https://kick.com/api/v1/channels/${channelName}/subscribers`)
        
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
          console.log('📺 Got channel subscribers from Unofficial Kick API:', channelSubsData)
          
          if (channelSubsData.data && Array.isArray(channelSubsData.data)) {
            const isSubscribed = channelSubsData.data.some((subscriber: any) => 
              subscriber.username?.toLowerCase() === username.toLowerCase()
            )
            
            console.log(`✅ Channel subscribers check result: ${isSubscribed}`)
            
            return { 
              isSubscribed: isSubscribed, 
              method: 'unofficial_channel_subscribers',
              data: channelSubsData.data
            }
          }
        }
      } catch (channelError) {
        console.log('❌ Channel subscribers check failed:', channelError)
      }

      // Method 3: Fallback to check if user follows channel
      try {
        console.log(`🔄 Trying fallback: check if ${username} follows ${channelName}`)
        
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        
        // Add auth token if available
        if (this.authToken) {
          headers['Authorization'] = `Bearer ${this.authToken}`
        }
        
        const followResponse = await fetch(`https://kick.com/api/v1/channels/${channelName}/followers`, {
          method: 'GET',
          headers
        })

        console.log(`Followers response: ${followResponse.status}`)
        
        if (followResponse.ok) {
          const followData = await followResponse.json()
          console.log('👥 Got followers data:', followData)
          
          if (followData.data && followData.data.followers) {
            const isFollowing = followData.data.followers.some((follower: any) => 
              follower.username?.toLowerCase() === username.toLowerCase()
            )
            
            console.log(`✅ Follow check result: ${isFollowing}`)
            
            return { 
              isSubscribed: isFollowing, 
              method: 'follow_check_fallback',
              data: followData.data
            }
          }
        }
      } catch (followError) {
        console.log('❌ Follow check failed:', followError)
      }

      console.log(`❌ Could not verify subscription for ${username} - all methods failed`)
      return { 
        isSubscribed: false, 
        method: 'unofficial_kick_api',
        error: 'All methods failed - user may not be subscribed'
      }
    } catch (error) {
      console.error('Unofficial Kick API subscription check failed:', error)
      return { 
        isSubscribed: false, 
        method: 'unofficial_kick_api',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const kickSubscriptionChecker = new KickSubscriptionChecker(
  process.env.NEXT_PUBLIC_RAPIDAPI_KICK_API_KEY || ''
)
