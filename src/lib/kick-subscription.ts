// Official Kick API Subscription Checker
// Uses official Kick API endpoints to check subscription status

export interface SubscriptionResponse {
  isSubscribed: boolean
  method: string
  data?: any
  error?: string
}

export class KickSubscriptionChecker {
  private baseURL: string = 'https://api.kick.com'

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

      // Method 1: Get channel information including subscriber count
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
          console.log('📺 Got channel info from official Kick API:', channelData)
          
          // Method 1A: Check if channel has subscriber data
          if (channelData.data && channelData.data.subscription_count !== undefined) {
            console.log(`📊 Channel has ${channelData.data.subscription_count} subscribers`)
            
            // If subscription count > 0, we can try to get subscriber list
            if (channelData.data.subscription_count > 0) {
              return await this.checkSubscriberList(username, channelName)
            } else {
              console.log(`❌ Channel has 0 subscribers`)
              return { 
                isSubscribed: false, 
                method: 'official_api',
                error: 'Channel has no subscribers'
              }
            }
          }
        } else {
          const errorText = await channelResponse.text()
          console.log(`❌ Official Kick API channel failed (${channelResponse.status}):`, errorText)
        }
      } catch (error) {
        console.log('❌ Official Kick API channel request failed:', error)
      }

      // Method 2: Try to get user's subscription status directly
      try {
        console.log(`🚀 Trying to get user subscription status for ${username}`)
        const userSubResponse = await fetch(`${this.baseURL}/public/v1/users/${username}/subscriptions`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        console.log(`Official Kick API user subscriptions response: ${userSubResponse.status}`)
        
        if (userSubResponse.ok) {
          const subData = await userSubResponse.json()
          console.log('📋 Got user subscriptions from official Kick API:', subData)
          
          // Check if user is subscribed to the target channel
          if (subData.data && subData.data.subscriptions) {
            const isSubscribed = subData.data.subscriptions.some((sub: any) => 
              sub.channel_name?.toLowerCase() === channelName.toLowerCase() ||
              sub.channel_slug?.toLowerCase() === channelName.toLowerCase()
            )
            
            console.log(`✅ Official Kick API subscription check result: ${isSubscribed}`)
            return { isSubscribed, method: 'official_api', data: subData }
          }
        } else {
          const errorText = await userSubResponse.text()
          console.log(`❌ Official Kick API user subscriptions failed (${userSubResponse.status}):`, errorText)
        }
      } catch (error) {
        console.log('❌ Official Kick API user subscriptions request failed:', error)
      }

      // Method 3: Use a more direct approach - check if user follows the channel
      try {
        console.log(`🚀 Trying to check if ${username} follows ${channelName}`)
        const followResponse = await fetch(`${this.baseURL}/public/v1/channels/${channelName}/followers`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        console.log(`Official Kick API followers response: ${followResponse.status}`)
        
        if (followResponse.ok) {
          const followData = await followResponse.json()
          console.log('👥 Got channel followers from official Kick API:', followData)
          
          // Check if user is in the followers list
          if (followData.data && followData.data.followers) {
            const isFollowing = followData.data.followers.some((follower: any) => 
              follower.username?.toLowerCase() === username.toLowerCase()
            )
            
            // On Kick, following is equivalent to subscribing for free channels
            // For paid subscriptions, we'd need additional logic
            console.log(`✅ User is following: ${isFollowing}`)
            return { 
              isSubscribed: isFollowing, 
              method: 'follow_check',
              data: followData 
            }
          }
        } else {
          const errorText = await followResponse.text()
          console.log(`❌ Official Kick API followers failed (${followResponse.status}):`, errorText)
        }
      } catch (error) {
        console.log('❌ Official Kick API followers request failed:', error)
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
