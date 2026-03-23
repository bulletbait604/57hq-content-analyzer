// Premium Access System - Manages premium user access and feature unlocking

export interface PremiumUser {
  username: string
  hasPremium: boolean
  grantedAt: string
  features: string[]
}

export class PremiumAccess {
  private static instance: PremiumAccess
  private premiumUsers: Set<string> = new Set(['Bulletbait604']) // Pre-granted premium users

  private constructor() {}

  static getInstance(): PremiumAccess {
    if (!PremiumAccess.instance) {
      PremiumAccess.instance = new PremiumAccess()
    }
    return PremiumAccess.instance
  }

  // Check if user has premium access based on KICK API username
  hasPremiumAccess(username: string): boolean {
    // Normalize username (case insensitive, trim whitespace)
    const normalizedUsername = username?.toLowerCase().trim() || ''
    return this.premiumUsers.has(normalizedUsername)
  }

  // Grant premium access to a user
  grantPremiumAccess(username: string): void {
    const normalizedUsername = username.toLowerCase().trim()
    this.premiumUsers.add(normalizedUsername)
    this.savePremiumUsers()
  }

  // Revoke premium access from a user
  revokePremiumAccess(username: string): void {
    const normalizedUsername = username.toLowerCase().trim()
    this.premiumUsers.delete(normalizedUsername)
    this.savePremiumUsers()
  }

  // Get list of premium users
  getPremiumUsers(): string[] {
    return Array.from(this.premiumUsers)
  }

  // Check if user can access specific premium feature
  canAccessFeature(username: string, feature: string): boolean {
    if (!this.hasPremiumAccess(username)) {
      return false
    }

    // All premium users get access to all features
    const premiumFeatures = [
      'ai-tag-generator',
      'clip-analysis', 
      'advanced-algorithm-insights',
      'priority-support',
      'unlimited-generations'
    ]

    return premiumFeatures.includes(feature)
  }

  // Save premium users to localStorage
  private savePremiumUsers(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('premiumUsers', JSON.stringify(Array.from(this.premiumUsers)))
    }
  }

  // Load premium users from localStorage
  private loadPremiumUsers(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('premiumUsers')
      if (stored) {
        try {
          const users = JSON.parse(stored)
          this.premiumUsers = new Set(users.map((user: string) => user.toLowerCase().trim()))
        } catch (error) {
          console.error('Error loading premium users:', error)
          this.premiumUsers = new Set(['bulletbait604'])
        }
      }
    }
  }

  // Initialize premium access system
  initialize(): void {
    this.loadPremiumUsers()
    // Always ensure Bulletbait604 has premium access (normalized to lowercase)
    this.premiumUsers.add('bulletbait604')
    this.savePremiumUsers()
  }

  // Get premium user info
  getPremiumUserInfo(username: string): PremiumUser | null {
    if (!this.hasPremiumAccess(username)) {
      return null
    }

    return {
      username,
      hasPremium: true,
      grantedAt: new Date().toISOString(),
      features: [
        'ai-tag-generator',
        'clip-analysis',
        'advanced-algorithm-insights', 
        'priority-support',
        'unlimited-generations'
      ]
    }
  }

  // Check if user is the special premium user
  isSpecialPremiumUser(username: string): boolean {
    const normalizedUsername = username?.toLowerCase().trim() || ''
    return normalizedUsername === 'bulletbait604'
  }

  // Add premium user (for admin use)
  addPremiumUser(username: string): void {
    const normalizedUsername = username.toLowerCase().trim()
    this.premiumUsers.add(normalizedUsername)
    this.savePremiumUsers()
  }

  // Remove premium user (for admin use)
  removePremiumUser(username: string): void {
    const normalizedUsername = username.toLowerCase().trim()
    this.premiumUsers.delete(normalizedUsername)
    this.savePremiumUsers()
  }
}
