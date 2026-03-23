// Algorithm Update System - Researches and updates platform algorithm information using DeepSeek AI
// This system uses AI research to update algorithm data weekly on Sundays

import { analyzeContentWithDeepSeek, DeepSeekAnalysis } from './deepseek'

export interface AlgorithmChange {
  date: string
  platform: string
  changes: string[]
  impact: 'high' | 'medium' | 'low'
  source: string
  url?: string
}

export interface PlatformAlgorithm {
  name: string
  platform: string
  icon: string
  color: string
  bgColor: string
  lastUpdate: string
  factors: string[]
  tips: string[]
}

export class AlgorithmUpdater {
  private static instance: AlgorithmUpdater
  private lastUpdate: string

  private constructor() {
    this.lastUpdate = this.getLastUpdateFromStorage()
  }

  static getInstance(): AlgorithmUpdater {
    if (!AlgorithmUpdater.instance) {
      AlgorithmUpdater.instance = new AlgorithmUpdater()
    }
    return AlgorithmUpdater.instance
  }

  private getLastUpdateFromStorage(): string {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('algorithmLastUpdate')
      return stored || new Date().toISOString()
    }
    return new Date().toISOString()
  }

  private saveLastUpdateToStorage(date: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('algorithmLastUpdate', date)
    }
    this.lastUpdate = date
  }

  getLastUpdate(): string {
    return this.lastUpdate
  }

  shouldAutoUpdate(): boolean {
    const now = new Date()
    const lastUpdate = new Date(this.lastUpdate)
    const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
    
    // Check if it's Sunday and at least 7 days have passed
    const isSunday = now.getDay() === 0 // 0 = Sunday
    const isPastMidnight = now.getHours() >= 0 // After midnight
    
    return isSunday && isPastMidnight && daysSinceUpdate >= 7
  }

  async updateAlgorithmWithAI(platform: string): Promise<PlatformAlgorithm> {
    try {
      console.log(`🤖 Using DeepSeek AI to research ${platform} algorithm...`)
      
      const systemPrompt = `You are an expert social media algorithm researcher specializing in 2026 platform updates. 
      
Research the latest algorithm changes and factors for ${platform} as of March 2024. Focus on:
1. Current ranking factors and their importance
2. Recent algorithm updates and changes
3. Best practices for content creators
4. Engagement metrics that matter most
5. Content optimization strategies

Provide specific, actionable insights that content creators can use immediately.

Format your response as JSON with this structure:
{
  "factors": ["factor1", "factor2", "factor3", ...],
  "tips": ["tip1", "tip2", "tip3", ...]
}

Be thorough and provide 6-8 factors and 5-7 tips for each platform.`

      const userPrompt = `Research and analyze the current ${platform} algorithm for 2024. 
      Focus on the latest trends, ranking factors, and optimization strategies that content creators need to know.`

      // Use DeepSeek API for research
      const analysis = await analyzeContentWithDeepSeek(
        'algorithm_research',
        platform,
        `${platform} Algorithm Analysis 2024`,
        userPrompt,
        systemPrompt
      )

      // Create platform algorithm object
      const platformConfig = this.getPlatformConfig(platform)
      
      return {
        name: platform,
        platform,
        icon: platformConfig.icon,
        color: platformConfig.color,
        bgColor: platformConfig.bgColor,
        lastUpdate: new Date().toISOString(),
        factors: analysis.factors && analysis.factors.length > 0 ? analysis.factors : platformConfig.defaultFactors,
        tips: analysis.tips && analysis.tips.length > 0 ? analysis.tips : platformConfig.defaultTips
      }
    } catch (error) {
      console.error(`Error updating ${platform} algorithm with AI:`, error)
      // Return fallback data
      return this.getFallbackAlgorithm(platform)
    }
  }

  async updateAllAlgorithms(): Promise<PlatformAlgorithm[]> {
    console.log('🔄 Starting weekly algorithm update with DeepSeek AI...')
    
    const platforms = ['YouTube', 'TikTok', 'Instagram', 'Twitter', 'Facebook Reels']
    const updatedAlgorithms: PlatformAlgorithm[] = []
    
    for (const platform of platforms) {
      try {
        const algorithm = await this.updateAlgorithmWithAI(platform)
        updatedAlgorithms.push(algorithm)
        console.log(`✅ Updated ${platform} algorithm with AI research`)
      } catch (error) {
        console.error(`❌ Failed to update ${platform}:`, error)
        // Add fallback algorithm
        updatedAlgorithms.push(this.getFallbackAlgorithm(platform))
      }
    }
    
    // Save update timestamp
    this.saveLastUpdateToStorage(new Date().toISOString())
    
    console.log('✅ Algorithm update complete!')
    return updatedAlgorithms
  }

  private getPlatformConfig(platform: string) {
    const configs = {
      'YouTube': {
        icon: '🎥',
        color: 'border-red-500',
        bgColor: 'bg-red-500/10',
        defaultFactors: [
          'Watch time retention (first 30 seconds critical)',
          'Click-through rate from thumbnails',
          'Session watch time contribution',
          'User engagement (likes, comments, shares)',
          'Video upload consistency and timing',
          'Keyword optimization in titles and descriptions'
        ],
        defaultTips: [
          'Create compelling thumbnails with high contrast',
          'Hook viewers in first 15 seconds',
          'Use end screens to promote other content',
          'Post during peak audience hours (6-9 PM local time)',
          'Include relevant keywords in first 2 lines of description'
        ]
      },
      'TikTok': {
        icon: '🎵',
        color: 'border-black',
        bgColor: 'bg-black/20',
        defaultFactors: [
          'Video completion rate (critical for virality)',
          'Re-watch value and loop potential',
          'User engagement velocity (first hour)',
          'Trending sound usage',
          'Video resolution and quality',
          'Posting frequency and consistency'
        ],
        defaultTips: [
          'Use trending sounds but add unique twist',
          'Keep videos under 30 seconds for max reach',
          'Text overlays should be readable without sound',
          'Post 3-5 times daily during peak hours',
          'Engage with comments within first hour'
        ]
      },
      'Instagram': {
        icon: '📷',
        color: 'border-pink-500',
        bgColor: 'bg-pink-500/10',
        defaultFactors: [
          'Engagement rate (likes + comments ÷ followers)',
          'Story completion rate',
          'Reels share velocity',
          'Hashtag relevance and mix',
          'Posting consistency',
          'User interaction speed'
        ],
        defaultTips: [
          'Mix popular and niche hashtags (10-15 total)',
          'Post Reels with trending audio',
          'Use Instagram Stories for behind-the-scenes',
          'Engage with comments within 30 minutes',
          'Post during 7-9 PM for maximum reach'
        ]
      },
      'Twitter': {
        icon: '🐦',
        color: 'border-blue-500',
        bgColor: 'bg-blue-500/10',
        defaultFactors: [
          'Tweet engagement rate',
          'Retweet velocity',
          'Reply thread engagement',
          'Hashtag performance',
          'Posting timing',
          'Media attachment performance'
        ],
        defaultTips: [
          'Post threads for increased engagement',
          'Use 2-3 relevant hashtags maximum',
          'Include high-quality images or videos',
          'Post during 8-10 AM and 2-4 PM',
          'Engage with replies quickly'
        ]
      },
      'Facebook Reels': {
        icon: '👥',
        color: 'border-blue-600',
        bgColor: 'bg-blue-600/10',
        defaultFactors: [
          'Video completion rate',
          'Share velocity',
          'Comment engagement',
          'Original content vs reposts',
          'Audio usage trends',
          'Cross-platform performance'
        ],
        defaultTips: [
          'Keep Reels under 30 seconds',
          'Use trending audio from Facebook library',
          'Add captions for silent viewing',
          'Post 1-2 Reels daily',
          'Share to Facebook Groups for extra reach'
        ]
      }
    }
    
    return configs[platform as keyof typeof configs] || configs['YouTube']
  }

  private getFallbackAlgorithm(platform: string): PlatformAlgorithm {
    const config = this.getPlatformConfig(platform)
    return {
      name: platform,
      platform,
      icon: config.icon,
      color: config.color,
      bgColor: config.bgColor,
      lastUpdate: new Date().toISOString(),
      factors: config.defaultFactors,
      tips: config.defaultTips
    }
  }

  async performAutoUpdateIfNeeded(): Promise<PlatformAlgorithm[] | null> {
    if (this.shouldAutoUpdate()) {
      console.log('🤖 Triggering automatic Sunday algorithm update with DeepSeek AI...')
      return await this.updateAllAlgorithms()
    }
    return null
  }
}
