// Algorithm Data Service
export interface PlatformAlgorithm {
  platform: string
  icon: string
  color: string
  bgColor: string
  lastUpdate: string
  factors: string[]
  tips: string[]
}

export class AlgorithmService {
  private static instance: AlgorithmService
  private algorithms: PlatformAlgorithm[]

  private constructor() {
    this.algorithms = this.getDefaultAlgorithms()
  }

  static getInstance(): AlgorithmService {
    if (!AlgorithmService.instance) {
      AlgorithmService.instance = new AlgorithmService()
    }
    return AlgorithmService.instance
  }

  private getDefaultAlgorithms(): PlatformAlgorithm[] {
    return [
      {
        platform: 'YouTube',
        icon: '🎥',
        color: 'border-red-500',
        bgColor: 'bg-red-500/10',
        lastUpdate: new Date().toISOString(),
        factors: [
          'Watch time retention (first 30 seconds critical)',
          'Click-through rate from thumbnails',
          'Session watch time contribution',
          'User engagement (likes, comments, shares)',
          'Video upload consistency and timing',
          'Keyword optimization in titles and descriptions'
        ],
        tips: [
          'Create compelling thumbnails with high contrast',
          'Hook viewers in first 15 seconds',
          'Use end screens to promote other content',
          'Post during peak audience hours (6-9 PM local time)',
          'Include relevant keywords in first 2 lines of description'
        ]
      },
      {
        platform: 'TikTok',
        icon: '🎵',
        color: 'border-black',
        bgColor: 'bg-black/20',
        lastUpdate: new Date().toISOString(),
        factors: [
          'Video completion rate (critical for virality)',
          'Re-watch value and loop potential',
          'User engagement velocity (first hour)',
          'Trending sound usage',
          'Video resolution and quality',
          'Posting frequency and consistency'
        ],
        tips: [
          'Use trending sounds but add unique twist',
          'Keep videos under 30 seconds for max reach',
          'Text overlays should be readable without sound',
          'Post 3-5 times daily during peak hours',
          'Engage with comments within first hour'
        ]
      },
      {
        platform: 'Instagram',
        icon: '📷',
        color: 'border-pink-500',
        bgColor: 'bg-pink-500/10',
        lastUpdate: new Date().toISOString(),
        factors: [
          'Engagement rate (likes + comments ÷ followers)',
          'Story completion rate',
          'Reels share velocity',
          'Hashtag relevance and mix',
          'Posting consistency',
          'User interaction speed'
        ],
        tips: [
          'Mix popular and niche hashtags (10-15 total)',
          'Post Reels with trending audio',
          'Use Instagram Stories for behind-the-scenes',
          'Engage with comments within 30 minutes',
          'Post during 7-9 PM for maximum reach'
        ]
      },
      {
        platform: 'Twitter',
        icon: '🐦',
        color: 'border-blue-500',
        bgColor: 'bg-blue-500/10',
        lastUpdate: new Date().toISOString(),
        factors: [
          'Tweet engagement rate',
          'Retweet velocity',
          'Reply thread engagement',
          'Hashtag performance',
          'Posting timing',
          'Media attachment performance'
        ],
        tips: [
          'Post threads for increased engagement',
          'Use 2-3 relevant hashtags maximum',
          'Include high-quality images or videos',
          'Post during 8-10 AM and 2-4 PM',
          'Engage with replies quickly'
        ]
      },
      {
        platform: 'Facebook Reels',
        icon: '👥',
        color: 'border-blue-600',
        bgColor: 'bg-blue-600/10',
        lastUpdate: new Date().toISOString(),
        factors: [
          'Video completion rate',
          'Share velocity',
          'Comment engagement',
          'Original content vs reposts',
          'Audio usage trends',
          'Cross-platform performance'
        ],
        tips: [
          'Keep Reels under 30 seconds',
          'Use trending audio from Facebook library',
          'Add captions for silent viewing',
          'Post 1-2 Reels daily',
          'Share to Facebook Groups for extra reach'
        ]
      }
    ]
  }

  getAlgorithms(): PlatformAlgorithm[] {
    return this.algorithms
  }

  getLastRefreshTime(): string {
    return new Date().toLocaleString()
  }

  async refreshAlgorithms(): Promise<void> {
    console.log('🔄 Refreshing algorithm data...')
    
    // Simulate AI research and update
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update timestamps
    this.algorithms = this.algorithms.map(algo => ({
      ...algo,
      lastUpdate: new Date().toISOString()
    }))
    
    console.log('✅ Algorithm data refreshed')
  }

  // Check if it's Sunday and time for auto-refresh
  shouldAutoRefresh(): boolean {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday
    const hour = now.getHours()
    
    return day === 0 && hour === 0 // Sunday at midnight
  }

  async performAutoRefreshIfNeeded(): Promise<void> {
    if (this.shouldAutoRefresh()) {
      await this.refreshAlgorithms()
    }
  }
}
