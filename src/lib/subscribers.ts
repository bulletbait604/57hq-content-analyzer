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
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.subscribers))
    }
  }

  isAdmin(username: string): boolean {
    return this.ADMIN_USERS.includes(username.toLowerCase())
  }

  isSubscriber(username: string): boolean {
    const result = this.subscribers.some(
      sub => sub.username.toLowerCase() === username.toLowerCase() && sub.status === 'active'
    )
    
    console.log('🔍 Subscription Check:', {
      checkingUsername: username,
      allSubscribers: this.subscribers,
      isSubscriber: result
    })
    
    return result
  }

  addSubscriber(username: string, addedBy: string): boolean {
    const existingIndex = this.subscribers.findIndex(
      sub => sub.username.toLowerCase() === username.toLowerCase()
    )

    if (existingIndex >= 0) {
      // Reactivate existing subscriber
      this.subscribers[existingIndex].status = 'active'
      this.subscribers[existingIndex].addedBy = addedBy
      this.subscribers[existingIndex].addedAt = new Date()
    } else {
      // Add new subscriber
      this.subscribers.push({
        username: username.toLowerCase(),
        addedAt: new Date(),
        addedBy: addedBy.toLowerCase(),
        status: 'active'
      })
    }

    this.saveSubscribers()
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
    const index = this.subscribers.findIndex(
      sub => sub.username.toLowerCase() === username.toLowerCase()
    )

    if (index >= 0) {
      this.subscribers[index].status = 'inactive'
      this.saveSubscribers()
      return true
    }

    return false
  }

  getSubscribers(): Subscriber[] {
    return this.subscribers
  }

  getAllSubscribers(): Subscriber[] {
    return this.subscribers
  }

  canAccessClipAnalysis(username: string): boolean {
    return this.isSubscriber(username) || this.isAdmin(username)
  }
}

export default SubscribersManager
export type { Subscriber }
