// Free Tag Database Service
export class TagDatabase {
  private static instance: TagDatabase
  private tags: string[]
  private lastUpdate: string

  private constructor() {
    this.tags = this.getDefaultTags()
    this.lastUpdate = new Date().toISOString()
  }

  static getInstance(): TagDatabase {
    if (!TagDatabase.instance) {
      TagDatabase.instance = new TagDatabase()
    }
    return TagDatabase.instance
  }

  private getDefaultTags(): string[] {
    return [
      // Viral & Trending
      'viral', 'trending', 'fyp', 'foryou', 'explore', 'contentcreator', 'video', 'new', 'latest', 'popular',
      'amazing', 'incredible', 'awesome', 'best', 'top', 'mustsee', 'share', 'like', 'comment', 'follow',
      
      // Creator & Influencer
      'creator', 'influencer', 'socialmedia', 'digital', 'online', 'viralvideo', 'trendingnow', 'viralpost',
      'entertainment', 'lifestyle', 'fun', 'comedy', 'dance', 'music', 'art', 'design', 'tech', 'gaming',
      
      // Engagement & Growth
      'engagement', 'growth', 'followers', 'likes', 'shares', 'views', 'subscribers', 'community', 'audience',
      'marketing', 'promotion', 'brand', 'business', 'entrepreneur', 'startup', 'success', 'motivation',
      
      // Content Types
      'tutorial', 'review', 'unboxing', 'howto', 'diy', 'tips', 'tricks', 'hacks', 'guide', 'lesson',
      'behindthescenes', 'bts', 'makingof', 'process', 'workflow', 'inspiration', 'creative', 'artistic',
      
      // Platform Specific
      'shorts', 'reels', 'tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'social', 'media',
      'content', 'creatorlife', 'influencermarketing', 'digitalmarketing', 'socialmediamarketing',
      
      // Popular Categories
      'fitness', 'health', 'wellness', 'food', 'cooking', 'travel', 'adventure', 'nature', 'photography',
      'fashion', 'style', 'beauty', 'skincare', 'makeup', 'hairstyle', 'outfit', 'ootd', 'fashionista',
      
      // Tech & Gaming
      'gaming', 'gamer', 'esports', 'tech', 'technology', 'gadgets', 'apps', 'software', 'coding',
      'programming', 'developer', 'design', 'ui', 'ux', 'innovation', 'future', 'digitalart',
      
      // Entertainment
      'movies', 'series', 'tv', 'shows', 'music', 'songs', 'playlist', 'concert', 'live', 'performance',
      'comedy', 'jokes', 'memes', 'funny', 'humor', 'entertainment', 'viralcontent', 'trendingaudio',
      
      // Lifestyle
      'daily', 'routine', 'lifestyle', 'vlog', 'dayinthelife', 'morning', 'night', 'weekend', 'holiday',
      'family', 'friends', 'relationships', 'love', 'happiness', 'positive', 'mindset', 'selfcare',
      
      // Educational
      'learn', 'education', 'study', 'knowledge', 'facts', 'information', 'tipsandtricks', 'lifehacks',
      'skills', 'development', 'personalgrowth', 'selfimprovement', 'productivity', 'success', 'goals',
      
      // Seasonal & Events
      'summer', 'winter', 'spring', 'fall', 'holiday', 'christmas', 'newyear', 'birthday', 'celebration',
      'festival', 'party', 'event', 'special', 'limited', 'exclusive', 'newrelease', 'comingsoon'
    ]
  }

  getTags(): string[] {
    return this.tags
  }

  getLastUpdate(): string {
    return this.lastUpdate
  }

  generateTags(content: string, count: number): string[] {
    if (!content.trim()) return []
    
    const keywords = content.toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .filter(word => !this.isStopWord(word))
    
    // Find relevant tags based on content keywords
    const relevantTags = this.tags.filter(tag => 
      keywords.some(keyword => 
        tag.includes(keyword) || 
        keyword.includes(tag) ||
        tag.toLowerCase().includes(keyword)
      )
    )
    
    // Add random popular tags if needed
    const popularTags = this.tags.filter(tag => 
      ['viral', 'trending', 'popular', 'fyp', 'foryou', 'contentcreator'].includes(tag)
    )
    
    const randomTags = this.tags
      .filter(tag => !relevantTags.includes(tag))
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.max(0, count - relevantTags.length - 2))
    
    const finalTags = [
      ...relevantTags.slice(0, Math.min(relevantTags.length, count - 2)),
      ...popularTags.slice(0, 2),
      ...randomTags
    ].slice(0, count)
    
    return finalTags
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'its', 'may', 'she', 'them', 'use', 'was', 'why', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has']
    return stopWords.includes(word.toLowerCase())
  }

  async monthlyUpdate(): Promise<void> {
    console.log('🔄 Updating monthly tag database...')
    
    // Simulate monthly research and update
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add some new trending tags (in real implementation, this would use AI research)
    const newTrendingTags = [
      'ai', 'artificialintelligence', 'machinelearning', 'automation', 'futuretech',
      'sustainable', 'eco', 'green', 'climate', 'environment',
      'metaverse', 'vr', 'ar', 'virtualreality', 'immersive',
      'crypto', 'blockchain', 'nft', 'web3', 'decentralized'
    ]
    
    this.tags = [...this.tags, ...newTrendingTags]
    this.lastUpdate = new Date().toISOString()
    
    console.log('✅ Tag database updated with new trending tags')
  }

  shouldMonthlyUpdate(): boolean {
    const now = new Date()
    const lastUpdate = new Date(this.lastUpdate)
    const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
    
    return daysSinceUpdate >= 30 // 30 days = 1 month
  }

  async performMonthlyUpdateIfNeeded(): Promise<void> {
    if (this.shouldMonthlyUpdate()) {
      await this.monthlyUpdate()
    }
  }
}
