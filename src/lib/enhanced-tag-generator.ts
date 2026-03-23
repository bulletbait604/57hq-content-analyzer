// Enhanced Free Tag Generator - Advanced algorithm with comprehensive tag database
// Research-based tag generation for content creators

export interface TagCategory {
  name: string
  tags: string[]
  weight: number
}

export interface EnhancedTagResult {
  tags: string[]
  categories: string[]
  confidence: number
  suggestions: string[]
}

export class EnhancedTagGenerator {
  private static instance: EnhancedTagGenerator
  
  // Comprehensive tag database with categories
  private tagDatabase: TagCategory[] = [
    // Gaming tags
    {
      name: 'gaming',
      tags: [
        'gaming', 'gamer', 'gameplay', 'esports', 'gamingcommunity', 'videogames', 'pcgaming', 'consolegaming',
        'mobilegaming', 'indiegame', 'gaminglife', 'gamergirl', 'streamer', 'twitchstreamer',
        'gamingclips', 'gamingmoments', 'gamingsetup', 'gamingchair', 'gamingdesk', 'rgbgaming',
        'fortnite', 'valorant', 'apexlegends', 'callofduty', 'minecraft', 'gta5', 'leagueoflegends',
        'overwatch', 'csgo', 'dota2', 'fifa', 'nba2k', 'madden', 'nhl', 'mlbtheshow',
        'gamingnews', 'gamingreviews', 'gamingtips', 'gamingguides', 'gamingdeals', 'gaminggear'
      ],
      weight: 10
    },
    
    // Social media platform tags
    {
      name: 'social',
      tags: [
        'socialmedia', 'instagram', 'tiktok', 'twitter', 'facebook', 'linkedin', 'snapchat', 'pinterest',
        'youtube', 'reels', 'shorts', 'stories', 'posts', 'contentcreator', 'influencer',
        'digitalmarketing', 'socialmediamarketing', 'contentcreation', 'creator', 'influencermarketing',
        'socialmediatips', 'viral', 'trending', 'fyp', 'foryou', 'explorepage', 'viralvideo',
        'socialmediagrowth', 'followers', 'likes', 'shares', 'comments', 'engagement'
      ],
      weight: 9
    },
    
    // Technology tags
    {
      name: 'technology',
      tags: [
        'tech', 'technology', 'software', 'programming', 'coding', 'webdevelopment', 'appdevelopment',
        'artificialintelligence', 'machinelearning', 'blockchain', 'cryptocurrency', 'cybersecurity',
        'gadgets', 'smartphones', 'laptops', 'computers', 'gamingtech', 'futurism',
        'innovation', 'startup', 'techreview', 'howto', 'tutorial', 'technews', 'digital'
      ],
      weight: 8
    },
    
    // Entertainment tags
    {
      name: 'entertainment',
      tags: [
        'entertainment', 'movies', 'music', 'celebrity', 'hollywood', 'netflix', 'streaming',
        'tvshows', 'series', 'bollywood', 'animation', 'comedy', 'drama', 'thriller',
        'concert', 'livemusic', 'musicvideo', 'album', 'song', 'dance', 'entertainmentnews',
        'popculture', 'celebritygossip', 'moviereview', 'tvshow', 'webseries', 'podcast'
      ],
      weight: 7
    },
    
    // Lifestyle tags
    {
      name: 'lifestyle',
      tags: [
        'lifestyle', 'fitness', 'health', 'wellness', 'nutrition', 'workout', 'gym', 'exercise',
        'fashion', 'style', 'beauty', 'skincare', 'makeup', 'hairstyle', 'ootd',
        'travel', 'wanderlust', 'vacation', 'adventure', 'food', 'recipe', 'cooking',
        'homedecor', 'diy', 'lifetips', 'selfcare', 'motivation', 'inspiration', 'lifestyleblogger'
      ],
      weight: 6
    },
    
    // Business tags
    {
      name: 'business',
      tags: [
        'business', 'entrepreneur', 'startup', 'marketing', 'sales', 'finance', 'investment',
        'cryptocurrency', 'trading', 'realestate', 'businesscoach', 'motivationalspeaker',
        'leadership', 'productivity', 'timemanagement', 'success', 'businessgrowth', 'networking',
        'personalbrand', 'personaldevelopment', 'career', 'jobsearch', 'resume', 'interview'
      ],
      weight: 5
    },
    
    // Education tags
    {
      name: 'education',
      tags: [
        'education', 'learning', 'study', 'tutorial', 'howto', 'tips', 'tricks', 'lifehacks',
        'onlinelearning', 'courses', 'skills', 'development', 'training', 'certification',
        'student', 'college', 'university', 'research', 'academic', 'scholarship', 'edtech',
        'teaching', 'homeschool', 'learningplatform', 'educationtechnology', 'knowledge', 'wisdom'
      ],
      weight: 4
    }
  ]

  private constructor() {}

  static getInstance(): EnhancedTagGenerator {
    if (!EnhancedTagGenerator.instance) {
      EnhancedTagGenerator.instance = new EnhancedTagGenerator()
    }
    return EnhancedTagGenerator.instance
  }

  // Analyze content and extract keywords
  private analyzeContent(content: string): string[] {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .split(/\s+/)
      .filter(word => word.length > 2) // Filter short words
    
    // Remove duplicates and common stop words
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they']
    
    return [...new Set(words.filter(word => !stopWords.includes(word)))]
  }

  // Calculate relevance score for tags
  private calculateRelevance(content: string, category: TagCategory): number {
    const keywords = this.analyzeContent(content)
    const matches = category.tags.filter(tag => 
      keywords.some(keyword => 
        tag.includes(keyword) || keyword.includes(tag)
      )
    )
    
    const relevanceScore = (matches.length / category.tags.length) * category.weight
    return relevanceScore
  }

  // Generate enhanced tags based on content analysis
  generateEnhancedTags(content: string, platform: string = 'youtube', count: number = 15): EnhancedTagResult {
    const keywords = this.analyzeContent(content)
    const relevantCategories: (TagCategory & { relevanceScore?: number })[] = []
    
    // Calculate relevance for each category
    this.tagDatabase.forEach(category => {
      const relevance = this.calculateRelevance(content, category)
      if (relevance > 0) {
        relevantCategories.push({
          ...category,
          relevanceScore: relevance
        })
      }
    })
    
    // Sort by relevance score
    relevantCategories.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    
    // Generate tags from top categories
    const selectedTags: string[] = []
    const selectedCategories: string[] = []
    
    relevantCategories.slice(0, 4).forEach(category => {
      const categoryTags = category.tags.slice(0, Math.ceil(count / 4))
      selectedTags.push(...categoryTags)
      selectedCategories.push(category.name)
    })
    
    // Add platform-specific tags
    const platformTags = this.getPlatformSpecificTags(platform)
    selectedTags.push(...platformTags.slice(0, Math.floor(count / 5)))
    
    // Add trending/general tags
    const trendingTags = this.getTrendingTags(platform)
    selectedTags.push(...trendingTags.slice(0, Math.floor(count / 5)))
    
    // Remove duplicates and limit to requested count
    const uniqueTags = [...new Set(selectedTags)].slice(0, count)
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(keywords, selectedCategories)
    
    return {
      tags: uniqueTags,
      categories: selectedCategories,
      confidence: Math.min(relevantCategories[0]?.relevanceScore || 0, 100),
      suggestions
    }
  }

  // Platform-specific tag recommendations
  private getPlatformSpecificTags(platform: string): string[] {
    const platformTags = {
      youtube: [
        'youtube', 'youtuber', 'youtubecontent', 'youtubevideo', 'youtubecreators',
        'newvideo', 'subscribe', 'like', 'comment', 'share', 'notification',
        'premiere', 'livestream', 'shorts', 'communitytab', 'studio'
      ],
      tiktok: [
        'tiktok', 'tiktokmademe', 'fyp', 'foryou', 'tiktokdance', 'tiktokchallenge',
        'duet', 'stitch', 'trending', 'viral', 'tiktokcreator', 'tiktoklife',
        'tiktokfamous', 'tiktokvideo', 'tiktoksong', 'tiktoktrend', 'tiktokviral'
      ],
      instagram: [
        'instagram', 'instagood', 'instadaily', 'instamood', 'instapic', 'instastory',
        'reels', 'igtv', 'instagramcreator', 'instafashion', 'instabeauty',
        'instatravel', 'instafood', 'instafitness', 'instagrammodel', 'influencer'
      ],
      twitter: [
        'twitter', 'tweet', 'twitterthread', 'twitterstorm', 'trending', 'viral',
        'retweet', 'liketweet', 'twitterchat', 'twittercommunity', 'twitternews',
        'twitterupdate', 'twitterpoll', 'twitteranalytics', 'tweetdeck', 'hashtags'
      ],
      facebook: [
        'facebook', 'facebooklive', 'facebookwatch', 'facebookgroup', 'facebookpage',
        'facebookpost', 'facebookads', 'facebookmarketing', 'facebookcreator',
        'facebookreels', 'facebookstory', 'facebookshare', 'facebooklike'
      ]
    }
    
    return platformTags[platform as keyof typeof platformTags] || platformTags.youtube
  }

  // Get trending tags for platform
  private getTrendingTags(platform: string): string[] {
    const trendingTags = {
      youtube: [
        'viral', 'trending', 'new', 'latest', '2024', 'mustwatch', 'explore',
        'recommended', 'popular', 'viralvideo', 'trendingnow', 'breaking'
      ],
      tiktok: [
        'viral', 'fyp', 'trending', 'challenge', 'dance', 'comedy', 'memes',
        'trendingaudio', 'tiktokmademe', 'blowthisup', 'foru', 'foryoupage', 'viralpage'
      ],
      instagram: [
        'viral', 'trending', 'explore', 'reelsviral', 'instagood', 'trendingreels',
        'popularpage', 'viralpost', 'instatrending', 'explorepage', 'featured'
      ],
      twitter: [
        'trending', 'viral', 'breaking', 'news', 'viraltweet', 'twittertrending',
        'hashtagviral', 'trendingtopic', 'hot', 'breakingnews', 'viralthread'
      ],
      facebook: [
        'viral', 'trending', 'viralvideo', 'trendingpost', 'viralreels',
        'trendingnow', 'viralcontent', 'trendingtopic', 'hotcontent', 'shareviral'
      ]
    }
    
    return trendingTags[platform as keyof typeof trendingTags] || trendingTags.youtube
  }

  // Generate content suggestions
  private generateSuggestions(keywords: string[], categories: string[]): string[] {
    const suggestions: string[] = []
    
    // Content type suggestions
    if (keywords.some(k => ['tutorial', 'howto', 'guide'].includes(k))) {
      suggestions.push('Consider creating a series for better retention')
    }
    
    if (keywords.some(k => ['review', 'test', 'comparison'].includes(k))) {
      suggestions.push('Add affiliate links for monetization')
    }
    
    if (keywords.some(k => ['gaming', 'gameplay', 'esports'].includes(k))) {
      suggestions.push('Include tournament highlights and clutch moments')
    }
    
    if (categories.includes('gaming')) {
      suggestions.push('Add game title and platform tags')
      suggestions.push('Include gaming setup and gear information')
    }
    
    if (categories.includes('technology')) {
      suggestions.push('Include version numbers and specifications')
      suggestions.push('Add comparison with alternatives')
    }
    
    if (categories.includes('entertainment')) {
      suggestions.push('Include release dates and cast information')
      suggestions.push('Add behind-the-scenes content')
    }
    
    // Platform-specific suggestions
    suggestions.push('Post consistently at optimal times')
    suggestions.push('Engage with comments in first hour')
    suggestions.push('Use high-quality thumbnails')
    
    return suggestions.slice(0, 5)
  }

  // Get all available categories
  getAvailableCategories(): string[] {
    return this.tagDatabase.map(category => category.name)
  }

  // Get category statistics
  getCategoryStats(): { name: string; tagCount: number; weight: number }[] {
    return this.tagDatabase.map(category => ({
      name: category.name,
      tagCount: category.tags.length,
      weight: category.weight
    }))
  }
}
