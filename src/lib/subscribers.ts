// Hidden Subscribers Management System

interface Subscriber {
  username: string
  addedAt: Date
  addedBy: string
  status: 'active' | 'inactive'
}

class SubscribersManager {
  private static instance: SubscribersManager
  private subscribers: Subscriber[] = []
  private readonly STORAGE_KEY = '57hq_subscribers_list'
  private readonly ADMIN_USERS = ['bulletbait604'] // Add more admins here if needed

  private constructor() {
    this.loadSubscribers()
    // Initialize with Bulletbait604 if list is empty
    if (this.subscribers.length === 0) {
      this.addSubscriber('bulletbait604', 'system')
    }
  }

  static getInstance(): SubscribersManager {
    if (!SubscribersManager.instance) {
      SubscribersManager.instance = new SubscribersManager()
    }
    return SubscribersManager.instance
  }

  private loadSubscribers(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        try {
          this.subscribers = JSON.parse(stored).map((sub: any) => ({
            ...sub,
            addedAt: new Date(sub.addedAt)
          }))
        } catch (error) {
          console.error('Error loading subscribers:', error)
          this.subscribers = []
        }
      }
    }
  }

  private saveSubscribers(): void {
    if (typeof window !== 'undefined') {
      const dataToSave = JSON.stringify(this.subscribers)
      console.log('💾 saveSubscribers called:', {
        subscribers: this.subscribers,
        dataToSave: dataToSave,
        storageKey: this.STORAGE_KEY
      })
      localStorage.setItem(this.STORAGE_KEY, dataToSave)
      
      // Verify it was saved
      const savedData = localStorage.getItem(this.STORAGE_KEY)
      console.log('✅ localStorage verification:', {
        savedData: savedData,
        matches: savedData === dataToSave
      })
    }
  }

  isAdmin(username: string): boolean {
    return this.ADMIN_USERS.includes(username.toLowerCase())
  }

  isSubscriber(username: string): boolean {
    console.log('🔍 isSubscriber called for:', username)
    console.log('🔍 Current subscriber list:', this.subscribers)
    
    const result = this.subscribers.some(
      sub => sub.username.toLowerCase() === username.toLowerCase() && sub.status === 'active'
    )
    
    console.log('🔍 Subscription Check:', {
      checkingUsername: username,
      checkingUsernameLower: username.toLowerCase(),
      allSubscribers: this.subscribers,
      subscriberMatches: this.subscribers.map(sub => ({
        username: sub.username,
        usernameLower: sub.username.toLowerCase(),
        status: sub.status,
        matches: sub.username.toLowerCase() === username.toLowerCase() && sub.status === 'active'
      })),
      isSubscriber: result
    })
    
    return result
  }

  addSubscriber(username: string, addedBy: string): boolean {
    console.log('➕ SubscribersManager.addSubscriber called:', {
      username,
      addedBy,
      currentSubscribers: this.subscribers
    })
    
    const existingIndex = this.subscribers.findIndex(
      sub => sub.username.toLowerCase() === username.toLowerCase()
    )

    if (existingIndex >= 0) {
      // Reactivate existing subscriber
      console.log('🔄 Reactivating existing subscriber:', this.subscribers[existingIndex])
      this.subscribers[existingIndex].status = 'active'
      this.subscribers[existingIndex].addedBy = addedBy
      this.subscribers[existingIndex].addedAt = new Date()
    } else {
      // Add new subscriber
      const newSubscriber = {
        username: username.toLowerCase(),
        addedAt: new Date(),
        addedBy: addedBy.toLowerCase(),
        status: 'active' as const
      }
      console.log('🆕 Adding new subscriber:', newSubscriber)
      this.subscribers.push(newSubscriber)
    }

    console.log('💾 Saving subscribers to localStorage:', this.subscribers)
    this.saveSubscribers()
    console.log('✅ Subscriber added successfully')
    return true
  }

  // Add a method to manually check localStorage contents
  debugStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      console.log('📦 Subscribers Storage Debug:', {
        storageKey: this.STORAGE_KEY,
        rawData: stored,
        parsedData: stored ? JSON.parse(stored) : null,
        currentSubscribers: this.subscribers
      })
    }
  }

  removeSubscriber(username: string, removedBy: string): boolean {
    console.log('🗑️ SubscribersManager.removeSubscriber called:', {
      username,
      removedBy,
      currentSubscribers: this.subscribers
    })
    
    const index = this.subscribers.findIndex(
      sub => sub.username.toLowerCase() === username.toLowerCase()
    )

    if (index >= 0) {
      console.log('🗑️ Removing subscriber:', this.subscribers[index])
      // Actually remove from array instead of just setting inactive
      this.subscribers.splice(index, 1)
      console.log('💾 Saving updated subscribers list:', this.subscribers)
      this.saveSubscribers()
      console.log('✅ Subscriber removed successfully')
      return true
    } else {
      console.log('❌ Subscriber not found for removal:', username)
    }

    return false
  }

  getSubscribers(): Subscriber[] {
    // Return only active subscribers
    const activeSubscribers = this.subscribers.filter(sub => sub.status === 'active')
    console.log('📋 getSubscribers called:', {
      totalSubscribers: this.subscribers.length,
      activeSubscribers: activeSubscribers.length,
      activeList: activeSubscribers
    })
    return activeSubscribers
  }

  getAllSubscribers(): Subscriber[] {
    return this.subscribers
  }

  canAccessClipAnalysis(username: string): boolean {
    return this.isSubscriber(username) || this.isAdmin(username)
  }

  // Manual test function for debugging
  testRemoval(username: string): void {
    console.log('🧪 Testing removal process:', {
      username,
      beforeRemoval: this.subscribers,
      subscriberCount: this.subscribers.length
    })
    
    const index = this.subscribers.findIndex(
      sub => sub.username.toLowerCase() === username.toLowerCase()
    )
    
    console.log('🧪 Found subscriber at index:', index)
    if (index >= 0) {
      console.log('🧪 Subscriber to remove:', this.subscribers[index])
    }
    
    // Test the removal
    const result = this.removeSubscriber(username, 'test')
    console.log('🧪 Removal result:', result)
    console.log('🧪 After removal:', this.subscribers)
    console.log('🧪 Final count:', this.subscribers.length)
  }
}

export default SubscribersManager
export type { Subscriber }
