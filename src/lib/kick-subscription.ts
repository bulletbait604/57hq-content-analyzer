// Uses RapidAPI endpoints to check subscription status
export interface SubscriptionResponse {
  isSubscribed: boolean
  method: string
  data?: any
  error?: string
}

export class KickSubscriptionChecker {
  private apiKey: string
  private baseURL: string = 'https://kick-com-api.p.rapidapi.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async checkSubscription(username: string, channelName: string = 'bulletbait604'): Promise<SubscriptionResponse> {
    try {
      console.log(`🔍 Checking subscription via RapidAPI for ${username} to ${channelName}`)
      
      // Method 1: Try RapidAPI for subscriber list (primary method)
      try {
        console.log(`🚀 Trying RapidAPI for subscriber list: https://kick-com-api.p.rapidapi.com/channel/${channelName}/subscribers`)
        const rapidApiResponse = await fetch(`https://kick-com-api.p.rapidapi.com/channel/${channelName}/subscribers`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'kick-com-api.p.rapidapi.com'
          }
        })

        console.log(`RapidAPI subscribers response: ${rapidApiResponse.status}`)
        
        if (rapidApiResponse.ok) {
          const rapidApiData = await rapidApiResponse.json()
          console.log('📋 Got subscriber list from RapidAPI:', rapidApiData)
          
          if (rapidApiData.data && Array.isArray(rapidApiData.data)) {
            console.log(`📋 Found ${rapidApiData.data.length} subscribers via RapidAPI`)
            
            const isSubscribed = rapidApiData.data.some((subscriber: any) => {
              const subscriberUsername = subscriber.username?.toLowerCase() || subscriber.name?.toLowerCase() || subscriber.user?.username?.toLowerCase()
              const loggedInUsername = username.toLowerCase()
              console.log(`🔍 Checking if subscriber "${subscriberUsername}" matches logged-in user "${loggedInUsername}"`)
              return subscriberUsername === loggedInUsername
            })
            
            console.log(`✅ RapidAPI cross-reference check result: ${isSubscribed}`)
            
            if (isSubscribed) {
              console.log(`🎉 FOUND "${username.toLowerCase()}" in ${channelName}'s RapidAPI subscriber list!`)
              return { 
                isSubscribed: true, 
                method: 'rapidapi_subscriber_list',
                data: {
                  rapidApiData: rapidApiData.data,
                  subscriberFound: rapidApiData.data.find((sub: any) => 
                    sub.username?.toLowerCase() === username.toLowerCase() || 
                    sub.name?.toLowerCase() === username.toLowerCase()
                  ),
                  totalSubscribers: rapidApiData.data.length
                }
              }
            } else {
              console.log(`❌ "${username.toLowerCase()}" NOT found in ${channelName}'s RapidAPI subscriber list`)
            }
          } else {
            console.log('❌ No subscriber data found in RapidAPI response')
          }
        } else {
          const rapidApiError = await rapidApiResponse.text()
          console.log(`❌ RapidAPI subscribers failed (${rapidApiResponse.status}):`, rapidApiError)
          
          if (rapidApiResponse.status === 403) {
            return { 
              isSubscribed: false, 
              method: 'rapidapi',
              error: 'API subscription required: Subscribe to Kick API on RapidAPI'
            }
          }
          
          if (rapidApiResponse.status === 429) {
            return { 
              isSubscribed: false, 
              method: 'rapidapi',
              error: 'Rate limit exceeded: Too many requests to RapidAPI'
            }
          }
        }
      } catch (rapidApiError) {
        console.log('❌ RapidAPI subscriber list request failed:', rapidApiError)
      }

      // Method 2: Fallback to follow status check
      try {
        console.log(`🔄 Checking if ${username} follows ${channelName} as fallback`)
        const followResponse = await fetch(`${this.baseURL}/public/v1/channels/${channelName}/followers`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
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
        method: 'rapidapi',
        error: 'All methods failed - user may not be subscribed'
      }
    } catch (error) {
      console.error('RapidAPI subscription check failed:', error)
      return { 
        isSubscribed: false, 
        method: 'rapidapi',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const kickSubscriptionChecker = new KickSubscriptionChecker(
  process.env.NEXT_PUBLIC_RAPIDAPI_KICK_API_KEY || ''
)
