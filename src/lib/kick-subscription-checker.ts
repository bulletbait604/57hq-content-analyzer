// Alternative subscription verification methods for Kick

import { KickRapidAPI } from './kick-rapidapi'

export interface SubscriptionResult {
  isSubscribed: boolean
  method: 'oauth' | 'rapidapi' | 'manual' | 'mock'
  data?: any
  error?: string
}

export class KickSubscriptionChecker {
  private rapidAPI: KickRapidAPI | null
  private targetChannel: string

  constructor(rapidAPIKey: string, targetChannel: string = 'bulletbait604') {
    this.targetChannel = targetChannel
    this.rapidAPI = rapidAPIKey ? new KickRapidAPI(rapidAPIKey) : null
  }

  async checkSubscription(username: string, accessToken?: string): Promise<SubscriptionResult> {
    console.log(`🔍 Checking subscription for ${username} to ${this.targetChannel}`)
    
    // Priority 1: Check for admin override (for testing)
    const adminOverride = this.checkAdminOverride(username)
    if (adminOverride !== null) {
      console.log(`👑 Admin override found for ${username}: ${adminOverride}`)
      return { isSubscribed: adminOverride, method: 'mock', data: { admin: true } }
    }

    // Priority 2: Try RapidAPI (primary method for subscription verification)
    if (this.rapidAPI) {
      try {
        console.log('🚀 Trying RapidAPI subscription check...')
        const rapidAPIResult = await this.checkViaRapidAPI(username)
        if (rapidAPIResult.isSubscribed !== undefined) {
          console.log(`✅ RapidAPI check result: ${rapidAPIResult.isSubscribed}`)
          return { isSubscribed: rapidAPIResult.isSubscribed, data: rapidAPIResult.data, method: 'rapidapi' }
        }
      } catch (error) {
        console.log('❌ RapidAPI check failed:', error)
      }
    } else {
      console.log('⚠️ RapidAPI not configured (missing API key)')
    }

    // Priority 3: Try OAuth (if we have a working token)
    if (accessToken) {
      try {
        console.log('🔐 Trying OAuth subscription check...')
        const oauthResult = await this.checkViaOAuth(username, accessToken)
        if (oauthResult.isSubscribed !== undefined) {
          console.log(`✅ OAuth check result: ${oauthResult.isSubscribed}`)
          return { isSubscribed: oauthResult.isSubscribed, data: oauthResult.data, method: 'oauth' }
        }
      } catch (error) {
        console.log('❌ OAuth check failed:', error)
      }
    }

    // Priority 4: Manual verification (fallback)
    try {
      console.log('🔍 Trying manual subscription check...')
      const manualResult = await this.checkViaManual(username)
      console.log(`✅ Manual check result: ${manualResult.isSubscribed || false}`)
      return { isSubscribed: manualResult.isSubscribed || false, data: manualResult.data, method: 'manual' }
    } catch (error) {
      console.log('❌ Manual check failed:', error)
    }

    // Priority 5: Mock (final fallback)
    console.log('🎭 All methods failed, using mock (not subscribed)')
    return { isSubscribed: false, method: 'mock', error: 'All verification methods failed' }
  }

  private async checkViaOAuth(username: string, accessToken: string): Promise<Partial<SubscriptionResult>> {
    try {
      // Try to use Kick's OAuth API to check subscription
      const response = await fetch(`https://api.kick.com/v1/channels/${this.targetChannel}/subscriptions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const subscriptions = await response.json()
        const isSubscribed = subscriptions.some((sub: any) => sub.username === username)
        return { isSubscribed, data: subscriptions }
      }
    } catch (error) {
      console.error('OAuth subscription check failed:', error)
    }
    
    return {}
  }

  private async checkViaRapidAPI(username: string): Promise<Partial<SubscriptionResult>> {
    try {
      if (!this.rapidAPI) {
        console.log('RapidAPI not initialized')
        return {}
      }
      const isSubscribed = await this.rapidAPI.checkUserSubscription(username, this.targetChannel)
      return { isSubscribed }
    } catch (error) {
      console.error('RapidAPI subscription check failed:', error)
    }
    
    return {}
  }

  private async checkViaManual(username: string): Promise<Partial<SubscriptionResult>> {
    try {
      // Get channel info to see if we can determine subscription status
      if (!this.rapidAPI) {
        console.log('RapidAPI not initialized for manual check')
        return {}
      }
      const channelInfo = await this.rapidAPI.getChannelInfo(this.targetChannel)
      
      // For now, we'll implement a simple check based on available data
      // In a real implementation, you might:
      // 1. Check if user appears in channel's subscriber list
      // 2. Check user's profile for subscription badges
      // 3. Use web scraping (not recommended)
      
      return { 
        isSubscribed: false, // Default to false for safety
        data: channelInfo,
        error: 'Manual verification requires additional implementation'
      }
    } catch (error) {
      console.error('Manual subscription check failed:', error)
    }
    
    return {}
  }

  // Admin override function for testing
  async adminSetSubscription(username: string, isSubscribed: boolean): Promise<boolean> {
    try {
      // Store admin override in localStorage for demo purposes
      const overrides = JSON.parse(localStorage.getItem('subscriptionOverrides') || '{}')
      overrides[username] = isSubscribed
      localStorage.setItem('subscriptionOverrides', JSON.stringify(overrides))
      return true
    } catch (error) {
      console.error('Failed to set subscription override:', error)
      return false
    }
  }

  // Check for admin overrides
  checkAdminOverride(username: string): boolean | null {
    try {
      const overrides = JSON.parse(localStorage.getItem('subscriptionOverrides') || '{}')
      return overrides[username] || null
    } catch (error) {
      return null
    }
  }
}
