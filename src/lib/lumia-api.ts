// Lumia API for checking subscriber status
export interface LumiaUser {
  id: string
  username: string
  display_name: string
  profile_image_url: string
  is_subscriber: boolean
  subscription_tier?: string
  subscription_expires?: string
}

export interface LumiaResponse {
  success: boolean
  data?: LumiaUser
  error?: string
}

export class LumiaAPI {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.lumia.com/v1' // Replace with actual Lumia API URL
  }

  // Check if user is a subscriber
  async checkSubscriberStatus(username: string): Promise<LumiaResponse> {
    try {
      console.log(`🔍 Checking subscriber status for ${username} via Lumia API`)
      
      const response = await fetch(`${this.baseUrl}/users/${username}/subscription`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Lumia API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      console.log('✅ Lumia API response:', data)
      
      return {
        success: true,
        data: {
          id: data.id,
          username: data.username,
          display_name: data.display_name,
          profile_image_url: data.profile_image_url,
          is_subscriber: data.is_subscriber || false,
          subscription_tier: data.subscription_tier,
          subscription_expires: data.subscription_expires
        }
      }
    } catch (error) {
      console.error('❌ Lumia API error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Alternative: Check subscriber status via RapidAPI if Lumia is not available
  async checkSubscriberStatusRapidAPI(username: string): Promise<LumiaResponse> {
    try {
      console.log(`🔍 Checking subscriber status for ${username} via RapidAPI`)
      
      const url = 'https://kick-api2.p.rapidapi.com/user/subscriptions'
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'kick-api2.p.rapidapi.com'
        }
      }

      const response = await fetch(`${url}?username=${username}`, options)
      
      if (!response.ok) {
        throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      console.log('✅ RapidAPI response:', data)
      
      // Check if user has any active subscriptions
      const isSubscribed = data.data && data.data.length > 0 && 
        data.data.some((sub: any) => sub.status === 'active' || sub.type === 'subscriber')
      
      return {
        success: true,
        data: {
          id: data.data?.[0]?.user_id || '',
          username: username,
          display_name: username,
          profile_image_url: '',
          is_subscriber: isSubscribed,
          subscription_tier: data.data?.[0]?.tier || 'basic'
        }
      }
    } catch (error) {
      console.error('❌ RapidAPI error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Create a singleton instance
let lumiaAPI: LumiaAPI | null = null

export function getLumiaAPI(): LumiaAPI {
  if (!lumiaAPI) {
    // You'll need to set your Lumia API key here
    const apiKey = process.env.NEXT_PUBLIC_LUMIA_API_KEY || 'your-lumia-api-key'
    lumiaAPI = new LumiaAPI(apiKey)
  }
  return lumiaAPI
}
