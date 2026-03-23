// AI Credits Management System
export interface UserCredits {
  userId: string
  creditsRemaining: number
  maxCreditsPerDay: number
  lastResetDate: string
  usageHistory: CreditUsage[]
}

export interface CreditUsage {
  timestamp: Date
  feature: string
  creditsUsed: number
  description: string
}

export class AICreditsManager {
  private static readonly STORAGE_KEY = 'ai_credits'
  private static readonly DAILY_RESET_HOUR = 0 // Reset at midnight

  // Get user credits from localStorage
  static getUserCredits(userId: string): UserCredits {
    if (typeof window === 'undefined') {
      return this.getDefaultCredits(userId)
    }

    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) {
      return this.getDefaultCredits(userId)
    }

    try {
      const allCredits = JSON.parse(stored)
      const userCredits = allCredits[userId]
      
      if (!userCredits) {
        return this.getDefaultCredits(userId)
      }

      // Check if we need to reset daily credits
      const lastReset = new Date(userCredits.lastResetDate)
      const now = new Date()
      const shouldReset = now.getDate() !== lastReset.getDate() || 
                         now.getMonth() !== lastReset.getMonth() || 
                         now.getFullYear() !== lastReset.getFullYear()

      if (shouldReset) {
        console.log(`🔄 Resetting daily credits for ${userId}`)
        return this.resetDailyCredits(userCredits)
      }

      return {
        ...userCredits,
        lastResetDate: new Date(userCredits.lastResetDate),
        usageHistory: userCredits.usageHistory.map((usage: any) => ({
          ...usage,
          timestamp: new Date(usage.timestamp)
        }))
      }
    } catch (error) {
      console.error('❌ Error parsing credits data:', error)
      return this.getDefaultCredits(userId)
    }
  }

  // Get default credits for a user
  private static getDefaultCredits(userId: string): UserCredits {
    return {
      userId,
      creditsRemaining: 0,
      maxCreditsPerDay: 0,
      lastResetDate: new Date().toISOString(),
      usageHistory: []
    }
  }

  // Reset daily credits
  private static resetDailyCredits(credits: UserCredits): UserCredits {
    const resetCredits = {
      ...credits,
      creditsRemaining: credits.maxCreditsPerDay,
      lastResetDate: new Date().toISOString(),
      usageHistory: []
    }

    this.saveUserCredits(resetCredits)
    return resetCredits
  }

  // Update user's max credits based on verification
  static updateMaxCredits(userId: string, maxCredits: number): UserCredits {
    const currentCredits = this.getUserCredits(userId)
    
    const updatedCredits = {
      ...currentCredits,
      maxCreditsPerDay: maxCredits,
      creditsRemaining: maxCredits, // Reset to full credits when verification updates
      lastResetDate: new Date().toISOString(),
      usageHistory: []
    }

    this.saveUserCredits(updatedCredits)
    console.log(`✅ Updated max credits for ${userId}: ${maxCredits} per day`)
    
    return updatedCredits
  }

  // Use credits for a feature
  static useCredits(userId: string, feature: string, creditsRequired: number, description: string): boolean {
    const credits = this.getUserCredits(userId)
    
    if (credits.creditsRemaining < creditsRequired) {
      console.log(`❌ Insufficient credits for ${userId}: need ${creditsRequired}, have ${credits.creditsRemaining}`)
      return false
    }

    const usage: CreditUsage = {
      timestamp: new Date(),
      feature,
      creditsUsed: creditsRequired,
      description
    }

    const updatedCredits = {
      ...credits,
      creditsRemaining: credits.creditsRemaining - creditsRequired,
      usageHistory: [usage, ...credits.usageHistory.slice(0, 49)] // Keep last 50 uses
    }

    this.saveUserCredits(updatedCredits)
    console.log(`✅ Used ${creditsRequired} credits for ${feature}. Remaining: ${updatedCredits.creditsRemaining}`)
    
    return true
  }

  // Save user credits to localStorage
  private static saveUserCredits(credits: UserCredits): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      const allCredits = stored ? JSON.parse(stored) : {}
      
      allCredits[credits.userId] = {
        ...credits,
        lastResetDate: typeof credits.lastResetDate === 'string' ? credits.lastResetDate : (credits.lastResetDate as Date).toISOString(),
        usageHistory: credits.usageHistory.map(u => ({
          ...u,
          timestamp: (u.timestamp as Date).toISOString()
        }))
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allCredits))
    } catch (error) {
      console.error('❌ Error saving credits data:', error)
    }
  }

  // Get credits summary for display
  static getCreditsSummary(userId: string): {
    remaining: number
    maxPerDay: number
    usedToday: number
    lastReset: Date
  } {
    const credits = this.getUserCredits(userId)
    const usedToday = credits.maxCreditsPerDay - credits.creditsRemaining
    
    return {
      remaining: credits.creditsRemaining,
      maxPerDay: credits.maxCreditsPerDay,
      usedToday,
      lastReset: typeof credits.lastResetDate === 'string' ? new Date(credits.lastResetDate) : credits.lastResetDate
    }
  }

  // Get today's usage history
  static getTodayUsage(userId: string): CreditUsage[] {
    const credits = this.getUserCredits(userId)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return credits.usageHistory.filter(usage => 
      new Date(usage.timestamp) >= today
    )
  }

  // Check if user has enough credits
  static hasEnoughCredits(userId: string, creditsRequired: number): boolean {
    const credits = this.getUserCredits(userId)
    return credits.creditsRemaining >= creditsRequired
  }

  // Force reset credits (for testing)
  static forceResetCredits(userId: string): UserCredits {
    const credits = this.getUserCredits(userId)
    return this.resetDailyCredits(credits)
  }
}
