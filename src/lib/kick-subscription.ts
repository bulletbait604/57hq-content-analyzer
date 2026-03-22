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
        console.log(`🚀 Trying Official Kick API: https://api.kick.com/public/v1/channels/${channelName}`)
        
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
        
        const channelResponse = await fetch(`https://api.kick.com/public/v1/channels/${channelName}`, {
          method: 'GET',
          headers
        })

        console.log(`Official Kick API response: ${channelResponse.status}`)
        
        if (channelResponse.ok) {
          const channelData = await channelResponse.json()
          console.log('📺 Got channel info from Official Kick API:', channelData)
          console.log('📋 RAW Response:', JSON.stringify(channelData, null, 2))
          console.log('📋 Response structure:', Object.keys(channelData))
          
          // Check if channel has subscriber data in any format
          if (channelData.data) {
            console.log('📋 Available data keys:', Object.keys(channelData.data))
            
            // Try different possible subscriber data locations
            const subscriberData = channelData.data.subscribers || 
                               channelData.data.subscription_data ||
                               channelData.data.subscriptions ||
                               channelData.data.paid_subscribers ||
                               channelData.data.subscriber_list ||
                               channelData.data.members ||
                               channelData.data.followers
                               
            console.log('📋 Subscriber data found:', subscriberData ? JSON.stringify(subscriberData, null, 2) : 'None')
            
            if (subscriberData && Array.isArray(subscriberData)) {
              console.log(`📋 Found ${subscriberData.length} subscribers via Official Kick API`)
              
              const isSubscribed = subscriberData.some((subscriber: any) => {
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
                console.log(`🎉 FOUND "${username.toLowerCase()}" in ${channelName}'s subscriber list!`)
                return { 
                  isSubscribed: true, 
                  method: 'official_kick_api_subscriber_list',
                  data: {
                    channelData: channelData.data,
                    subscriberFound: subscriberData.find((sub: any) => 
                      sub.username?.toLowerCase() === username.toLowerCase() || 
                      sub.name?.toLowerCase() === username.toLowerCase() ||
                      sub.user?.username?.toLowerCase() === username.toLowerCase()
                    ),
                    totalSubscribers: subscriberData.length
                  }
                }
              } else {
                console.log(`❌ "${username.toLowerCase()}" NOT found in ${channelName}'s subscriber list`)
              }
            } else {
              console.log('❌ No subscriber array found in official API response')
            }
          } else {
            console.log('❌ No data object found in official API response')
          }
        } else {
          const errorText = await channelResponse.text()
          console.log(`❌ Official Kick API failed (${channelResponse.status}):`, errorText)
        }
      } catch (officialApiError) {
        console.log('❌ Official Kick API request failed:', officialApiError)
      }

      // Method 2: Fallback to follow status check
      try {
        console.log(`🔄 Checking if ${username} follows ${channelName} as fallback`)
        
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        
        // Add auth token if available
        if (this.authToken) {
          headers['Authorization'] = `Bearer ${this.authToken}`
        }
        
        const followResponse = await fetch(`${this.baseURL}/public/v1/channels/${channelName}/followers`, {
          method: 'GET',
          headers
        })

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
