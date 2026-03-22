// Official Kick API Subscription Checker
// Uses official Kick API endpoints to check subscription status

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
      console.log(`🔍 Checking subscription via official Kick API for ${username} to ${channelName}`)
      
      // Check if user is checking their own subscription
      const isCheckingOwnSubscription = username.toLowerCase() === channelName.toLowerCase()
      
      if (isCheckingOwnSubscription) {
        console.log(`✅ User ${username} is checking their own subscription to ${channelName}`)
        console.log(`🎯 Since this is the channel owner, they are automatically considered subscribed`)
        return { 
          isSubscribed: true, 
          method: 'owner_check',
          data: { 
            isOwner: true, 
            username: username, 
            channel: channelName,
            message: 'Channel owner is automatically subscribed'
          }
        }
      }

      // Method 1: Try RapidAPI for subscriber list (more likely to work)
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
          console.log('� Got subscriber list from RapidAPI:', rapidApiData)
          
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

      // Method 2: Fallback to official Kick API channel info
      try {
        console.log(`🚀 Trying official Kick API channel endpoint: ${this.baseURL}/public/v1/channels/${channelName}`)
        const channelResponse = await fetch(`${this.baseURL}/public/v1/channels/${channelName}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        console.log(`Official Kick API channel response: ${channelResponse.status}`)
        
        if (channelResponse.ok) {
          const channelData = await channelResponse.json()
          console.log('� Got channel info from official Kick API:', channelData)
          
          // Check if channel has subscriber data
          if (channelData.data && channelData.data.subscribers && Array.isArray(channelData.data.subscribers)) {
            console.log(`📋 Found ${channelData.data.subscribers.length} subscribers in channel data`)
            
            const isSubscribed = channelData.data.subscribers.some((subscriber: any) => {
              const subUsername = subscriber.username?.toLowerCase() || subscriber.name?.toLowerCase() || subscriber.user?.username?.toLowerCase()
              const targetUsername = username.toLowerCase()
              return subUsername === targetUsername
            })
            
            console.log(`✅ Official API cross-reference check result: ${isSubscribed}`)
            
            if (isSubscribed) {
              console.log(`🎉 FOUND "${username.toLowerCase()}" in ${channelName}'s subscriber list!`)
              return { 
                isSubscribed: true, 
                method: 'official_api_subscriber_list',
                data: {
                  channelData: channelData.data,
                  subscriberFound: channelData.data.subscribers.find((sub: any) => 
                    sub.username?.toLowerCase() === username.toLowerCase() || 
                    sub.name?.toLowerCase() === username.toLowerCase()
                  ),
                  totalSubscribers: channelData.data.subscribers.length
                }
              }
            } else {
              console.log(`❌ "${username.toLowerCase()}" NOT found in ${channelName}'s subscriber list`)
            }
          } else {
            console.log('❌ No subscriber data found in official API channel info')
          }
        } else {
          const errorText = await channelResponse.text()
          console.log(`❌ Official Kick API channel failed (${channelResponse.status}):`, errorText)
        }
      } catch (error) {
        console.log('❌ Official Kick API channel request failed:', error)
      }

      // Method 3: Fallback to follow status check
      try {
        console.log(`� Checking if ${username} follows ${channelName} as fallback`)
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

      console.log(`❌ Could not verify subscription for ${username} - all official Kick API methods failed`)
      return { 
        isSubscribed: false, 
        method: 'official_api',
        error: 'All official Kick API methods failed - user may not be subscribed'
      }
    } catch (error) {
      console.error('Official Kick API check failed:', error)
      return { 
        isSubscribed: false, 
        method: 'official_api',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async checkSubscriberList(username: string, channelName: string): Promise<SubscriptionResponse> {
    try {
      console.log(`🔍 Checking subscriber list for ${channelName} to find ${username}`)
      
      // Try to get subscribers (this endpoint might not be publicly available)
      const subscribersResponse = await fetch(`${this.baseURL}/public/v1/channels/${channelName}/subscribers`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      console.log(`Subscribers endpoint response: ${subscribersResponse.status}`)
      
      if (subscribersResponse.ok) {
        const subscribersData = await subscribersResponse.json()
        console.log('📋 Got subscribers list:', subscribersData)
        
        if (subscribersData.data && subscribersData.data.subscribers) {
          const isSubscribed = subscribersData.data.subscribers.some((sub: any) => 
            sub.username?.toLowerCase() === username.toLowerCase()
          )
          
          console.log(`✅ Found user in subscriber list: ${isSubscribed}`)
          return { 
            isSubscribed, 
            method: 'subscriber_list',
            data: subscribersData 
          }
        }
      } else {
        const errorText = await subscribersResponse.text()
        console.log(`❌ Subscribers endpoint failed (${subscribersResponse.status}):`, errorText)
        
        // If subscribers endpoint is not available, fall back to follow check
        if (subscribersResponse.status === 404 || subscribersResponse.status === 403) {
          console.log(`🔄 Subscribers endpoint not available, falling back to follow check`)
          return await this.checkFollowStatus(username, channelName)
        }
      }
    } catch (error) {
      console.log('❌ Subscriber list check failed:', error)
    }

    return { 
      isSubscribed: false, 
      method: 'subscriber_list',
      error: 'Could not access subscriber list'
    }
  }

  private async checkFollowStatus(username: string, channelName: string): Promise<SubscriptionResponse> {
    try {
      console.log(`🔄 Checking if ${username} follows ${channelName}`)
      
      const followResponse = await fetch(`${this.baseURL}/public/v1/channels/${channelName}/followers`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (followResponse.ok) {
        const followData = await followResponse.json()
        console.log('👥 Got followers list:', followData)
        
        if (followData.data && followData.data.followers) {
          const isFollowing = followData.data.followers.some((follower: any) => 
            follower.username?.toLowerCase() === username.toLowerCase()
          )
          
          console.log(`✅ User following status: ${isFollowing}`)
          return { 
            isSubscribed: isFollowing, 
            method: 'follow_check',
            data: followData 
          }
        }
      }
    } catch (error) {
      console.log('❌ Follow status check failed:', error)
    }

    return { 
      isSubscribed: false, 
      method: 'follow_check',
      error: 'Could not check follow status'
    }
  }
}

// Export singleton instance
export const kickSubscriptionChecker = new KickSubscriptionChecker()
