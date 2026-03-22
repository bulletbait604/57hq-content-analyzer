// Uses RapidAPI endpoints to check subscription status
export interface SubscriptionResponse {
  isSubscribed: boolean
  method: string
  data?: any
  error?: string
}

export class KickSubscriptionChecker {
  private apiKey: string
  private authToken: string = ''

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Set the auth token after successful OAuth
  setAuthToken(token: string) {
    this.authToken = token
    console.log('🔐 Auth token set for Kick API requests')
  }

  // Generate a random verification code
  generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Send a verification message to chat
  async sendVerificationMessage(username: string, verificationCode: string, channelName: string = 'bulletbait604'): Promise<boolean> {
    try {
      console.log(`📤 Sending verification message from ${username} to ${channelName} chat`)
      console.log(`🔢 Verification code: ${verificationCode}`)
      
      // Get channel info first to get chatroom ID
      const channelResponse = await fetch(`https://kick.com/api/v1/channels/${channelName}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
          'Origin': 'https://kick.com',
          'Referer': 'https://kick.com'
        }
      })

      if (channelResponse.ok) {
        const channelData = await channelResponse.json()
        console.log('📺 Got channel info:', channelData)
        
        if (channelData.data && channelData.data.chatroom) {
          const chatroomId = channelData.data.chatroom.id
          console.log(`💬 Found chatroom ID: ${chatroomId}`)
          
          // Send verification message with the code
          const verificationMessage = `🔐 SUB VERIFICATION: ${verificationCode}`
          console.log(`📤 Sending verification message: ${verificationMessage}`)
          
          const messageResponse = await fetch(`https://kick.com/api/v1/chatrooms/${chatroomId}/messages`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.authToken}`,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
              'Origin': 'https://kick.com',
              'Referer': 'https://kick.com'
            },
            body: JSON.stringify({
              content: verificationMessage,
              type: 'message'
            })
          })

          if (messageResponse.ok) {
            console.log('✅ Verification message sent successfully!')
            return true
          } else {
            const errorText = await messageResponse.text()
            console.log(`❌ Failed to send message (${messageResponse.status}):`, errorText)
            return false
          }
        }
      }
    } catch (error) {
      console.error('❌ Error sending verification message:', error)
      return false
    }
    
    return false
  }

  // Check recent chat messages for user's verification message and badges
  async checkVerificationMessage(username: string, verificationCode: string, channelName: string = 'bulletbait604'): Promise<SubscriptionResponse> {
    try {
      console.log(`🔍 Checking verification message for ${username} in ${channelName}`)
      console.log(`🔢 Looking for code: ${verificationCode}`)
      
      // Get channel info first to get chatroom ID
      const channelResponse = await fetch(`https://kick.com/api/v1/channels/${channelName}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
          'Origin': 'https://kick.com',
          'Referer': 'https://kick.com'
        }
      })

      if (channelResponse.ok) {
        const channelData = await channelResponse.json()
        
        if (channelData.data && channelData.data.chatroom) {
          const chatroomId = channelData.data.chatroom.id
          console.log(`💬 Checking messages in chatroom: ${chatroomId}`)
          
          // Get recent chat messages
          const messagesResponse = await fetch(`https://kick.com/api/v1/chatrooms/${chatroomId}/messages`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.authToken}`,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
              'Origin': 'https://kick.com',
              'Referer': 'https://kick.com'
            }
          })

          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json()
            console.log('📋 Got chat messages:', messagesData)
            console.log('📋 RAW Response:', JSON.stringify(messagesData, null, 2))
            
            if (messagesData.data && messagesData.data.messages) {
              console.log(`📋 Found ${messagesData.data.messages.length} recent messages`)
              
              // Look for user's verification message with the correct code
              const userMessages = messagesData.data.messages.filter((message: any) => 
                message.sender && 
                message.sender.username && 
                message.sender.username.toLowerCase() === username.toLowerCase() &&
                message.content && 
                message.content.includes(verificationCode) &&
                message.content.includes('🔐 SUB VERIFICATION:')
              )
              
              console.log(`📋 Found ${userMessages.length} verification messages from ${username}`)
              
              if (userMessages.length > 0) {
                // Get the most recent verification message
                const latestMessage = userMessages[0]
                console.log('📋 Latest verification message:', latestMessage)
                
                // Check for subscriber badge
                const badges = latestMessage.sender.badges || []
                console.log(`🏅 User badges:`, badges)
                
                const hasSubscriberBadge = badges.some((badge: any) => 
                  badge.type === 'subscriber' || 
                  badge.type === 'subscription' ||
                  badge.badge === 'subscriber' ||
                  badge.badge === 'subscription' ||
                  badge.name?.toLowerCase().includes('sub')
                )
                
                console.log(`🏅 Has subscriber badge: ${hasSubscriberBadge}`)
                
                return { 
                  isSubscribed: hasSubscriberBadge,
                  method: 'chat_badge_verification',
                  data: {
                    verificationMessage: latestMessage,
                    userBadges: badges,
                    hasSubscriberBadge: hasSubscriberBadge,
                    verificationCode: verificationCode,
                    messageContent: latestMessage.content
                  }
                }
              } else {
                console.log(`❌ No verification messages found from ${username}`)
              }
            }
          } else {
            const errorText = await messagesResponse.text()
            console.log(`❌ Failed to get messages (${messagesResponse.status}):`, errorText)
          }
        }
      }
    } catch (error) {
      console.error('❌ Error checking verification message:', error)
    }
    
    return { 
      isSubscribed: false, 
      method: 'chat_badge_verification',
      error: 'Could not verify subscription via chat badge'
    }
  }

  async checkSubscription(username: string, channelName: string = 'bulletbait604'): Promise<SubscriptionResponse> {
    // This method is now used for the verification process
    // The actual verification is handled by verifySubscriptionWithCode method
    return { 
      isSubscribed: false, 
      method: 'chat_badge_verification',
      error: 'Use verifySubscriptionWithCode method instead'
    }
  }

  // New method for the complete verification process
  async verifySubscriptionWithCode(username: string, verificationCode: string, channelName: string = 'bulletbait604'): Promise<SubscriptionResponse> {
    try {
      console.log(`🔍 Starting subscription verification for ${username} to ${channelName}`)
      console.log(`🔢 Verification code: ${verificationCode}`)
      
      // Step 1: Send verification message
      const messageSent = await this.sendVerificationMessage(username, verificationCode, channelName)
      
      if (!messageSent) {
        console.log('❌ Failed to send verification message')
        return { 
          isSubscribed: false, 
          method: 'chat_badge_verification',
          error: 'Failed to send verification message'
        }
      }
      
      // Step 2: Wait a moment for message to appear
      console.log('⏳ Waiting for message to appear in chat...')
      await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 3 seconds
      
      // Step 3: Check chat messages for verification and badges
      return await this.checkVerificationMessage(username, verificationCode, channelName)
      
    } catch (error) {
      console.error('Chat badge verification failed:', error)
      return { 
        isSubscribed: false, 
        method: 'chat_badge_verification',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const kickSubscriptionChecker = new KickSubscriptionChecker(
  process.env.NEXT_PUBLIC_RAPIDAPI_KICK_API_KEY || ''
)
