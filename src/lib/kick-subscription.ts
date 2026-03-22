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

      // Method 1: Get channel information including subscriber list
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
          if (channelData.data && channelData.data.subscribers && Array.isArray(channelData.data.subscribers)) {
            console.log(`� Found ${channelData.data.subscribers.length} subscribers in channel data`)
            
            const isSubscribed = channelData.data.subscribers.some((subscriber: any) => {
              const subUsername = subscriber.username?.toLowerCase() || subscriber.name?.toLowerCase() || subscriber.user?.username?.toLowerCase()
              const targetUsername = username.toLowerCase()
              console.log(`🔍 Checking subscriber: ${subUsername} vs target: ${targetUsername}`)
              return subUsername === targetUsername
            })
            
            console.log(`✅ Cross-reference check result: ${isSubscribed}`)
            console.log(`🔍 Looking for username "${username.toLowerCase()}" in subscriber list`)
            
            if (isSubscribed) {
              console.log(`🎉 FOUND "${username.toLowerCase()}" in ${channelName}'s subscriber list!`)
              return { 
                isSubscribed: true, 
                method: 'subscriber_list_cross_reference',
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
              
              // Method 2: Try user subscriptions endpoint
              try {
                console.log(`🚀 Trying official Kick API user subscriptions endpoint: ${this.baseURL}/public/v1/users/${username}/subscriptions`)
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
                  
                  if (subData.data && subData.data.subscriptions) {
                    const isSubscribedToChannel = subData.data.subscriptions.some((sub: any) => 
                      sub.channel_name?.toLowerCase() === channelName.toLowerCase() ||
                      sub.channel_slug?.toLowerCase() === channelName.toLowerCase() ||
                      sub.name?.toLowerCase() === channelName.toLowerCase()
                    )
                    
                    console.log(`✅ User subscription check result: ${isSubscribedToChannel}`)
                    
                    if (isSubscribedToChannel) {
                      console.log(`🎉 FOUND ${channelName} in ${username}'s subscriptions!`)
                      return { 
                        isSubscribed: true, 
                        method: 'user_subscriptions_cross_reference',
                        data: {
                          userData: subData.data,
                          subscriptionFound: subData.data.subscriptions.find((sub: any) => 
                            sub.channel_name?.toLowerCase() === channelName.toLowerCase() ||
                            sub.channel_slug?.toLowerCase() === channelName.toLowerCase() ||
                            sub.name?.toLowerCase() === channelName.toLowerCase()
                          )
                        }
                      }
                    }
                  }
                }
                
                if (!isSubscribedToChannel) {
                  console.log(`❌ ${channelName} NOT found in ${username}'s subscriptions`)
                }
              } catch (subError) {
                console.log('❌ Official Kick API user subscriptions request failed:', subError)
              }
            }
          } else {
            console.log('❌ No subscriber data found in channel info')
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
