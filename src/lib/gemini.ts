// Google Gemini AI Service for Algorithm Research and Content Analysis
// Used for backup analysis and trend validation

export interface GeminiAnalysis {
  tags: string[]
  title: string
  description: string
  insights: string[]
  algorithmScore: number
  recommendations: string[]
  trends: string[]
}

export interface TikTokGeminiAnalysis {
  descriptionSuggestions: string[]
  tagSuggestions: string[]
  algorithmInsights: string[]
  algorithmResearch: string
  trendingOpportunities: string
  engagementTriggers: string[]
  performancePrediction: string
}

export class GeminiService {
  private static instance: GeminiService
  private apiKey: string

  private constructor() {
    // Use Google API key for Gemini (they're the same service)
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || 
                 process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY || ''
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService()
    }
    return GeminiService.instance
  }

  async analyzeContent(
    contentType: string,
    platform: string,
    title: string,
    description: string = '',
    additionalContext: string = ''
  ): Promise<GeminiAnalysis> {
    if (!this.apiKey) {
      console.warn('Gemini API key not configured, returning fallback')
      return this.getFallbackAnalysis(title, description)
    }

    try {
      const systemPrompt = `You are an expert social media content analyst specializing in 2026 algorithm optimization for YouTube Shorts, TikTok, and Instagram Reels.

Your analysis must be based on current 2026 algorithm parameters:

YouTube Shorts Algorithm:
- Prioritizes "Session Contribution" and "Completion Rate"
- Rewards seamless loops and interactive elements (polls)
- SEO optimization with current year and searchable terms
- High retention through pattern interrupts

TikTok Algorithm:
- Operates as a Search Engine
- Prioritizes "Pattern Interrupts" (changes every 3 seconds)
- High-contrast keyword text requirements
- First caption line must match search intent
- Trending sounds and challenges

Instagram Reels Algorithm:
- Weighted toward "Sends Per Reach" (DMs)
- Penalizes unoriginal or watermarked content
- Engagement prompts for share-to-DM metrics
- "Upload at Highest Quality" preference

Analyze the provided content and provide:
1. Optimized tags (5-15 based on platform)
2. Improved title suggestions
3. Enhanced descriptions
4. Algorithm insights
5. Performance score (0-100)
6. Specific recommendations
7. Current trending topics

Format your response as JSON with this structure:
{
  "tags": ["tag1", "tag2", ...],
  "title": "optimized title",
  "description": "enhanced description", 
  "insights": ["insight1", "insight2", ...],
  "algorithmScore": 85,
  "recommendations": ["rec1", "rec2", ...],
  "trends": ["trend1", "trend2", ...]
}`

      const userPrompt = `Content Type: ${contentType}
Platform: ${platform}
Current Title: ${title}
Current Description: ${description}
Additional Context: ${additionalContext}

Please analyze this content and provide optimization recommendations.`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\n\n${userPrompt}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!text) {
        throw new Error('No response from Gemini')
      }

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response')
      }

      return JSON.parse(jsonMatch[0]) as GeminiAnalysis
    } catch (error) {
      console.error('Gemini Analysis Error:', error)
      return this.getFallbackAnalysis(title, description)
    }
  }

  async researchAlgorithmTrends(platform: string): Promise<string[]> {
    if (!this.apiKey) {
      console.warn('Gemini API key not configured, returning fallback trends')
      return this.getFallbackTrends(platform)
    }

    try {
      const prompt = `Research the current trending topics and algorithm patterns for ${platform} as of March 2026.

Focus on:
1. Current trending hashtags and challenges
2. Algorithm changes in the last 30 days
3. Content formats performing well
4. Engagement patterns
5. Creator strategies gaining traction

Return only a JSON array of trending topics like:
["trend1", "trend2", "trend3", ...]`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 500,
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!text) {
        throw new Error('No response from Gemini')
      }

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No JSON array found in Gemini response')
      }

      return JSON.parse(jsonMatch[0]) as string[]
    } catch (error) {
      console.error('Gemini Trend Research Error:', error)
      return this.getFallbackTrends(platform)
    }
  }

  async analyzeTikTokContent(
    title: string,
    description: string,
    tags: string[],
    targetPlatform: string
  ): Promise<TikTokGeminiAnalysis> {
    if (!this.apiKey) {
      console.warn('Gemini API key not configured, returning fallback')
      return this.getTikTokFallbackAnalysis(title, description, tags)
    }

    try {
      const systemPrompt = `You are a TikTok content optimization expert specializing in 2026 TikTok algorithm analysis.

CRITICAL INSTRUCTIONS:
1. DO NOT copy the original description - create entirely new, optimized suggestions
2. Analyze the target platform's algorithm specified by the user
3. Cross-reference TikTok content with the target platform algorithm
4. Provide detailed, in-depth analysis and recommendations

TikTok 2026 Algorithm Focus:
- Operates as a Search Engine - first caption line must match search intent
- Prioritizes "Pattern Interrupts" (changes every 3 seconds)
- High-contrast keyword text requirements
- Rewards trending sounds and challenges
- Engagement rate in first 1-2 hours critical
- "For You" page optimization based on user behavior patterns

TARGET PLATFORM ALGORITHMS:
- TikTok: Pattern interrupts, trending audio, search intent matching
- YouTube Shorts: Session contribution, completion rate, SEO optimization
- Instagram Reels: Sends per reach, engagement prompts, high quality
- Twitter/X: Quick engagement, thread potential, viral loops
- Facebook Reels: Shareability, community engagement, trending audio

Your task:
1. Analyze the TikTok content provided
2. Research the TARGET PLATFORM's algorithm (${targetPlatform})
3. Cross-reference TikTok metadata with target platform algorithm insights
4. Generate 3 COMPLETELY NEW and DIFFERENT optimized description suggestions (up to 150 characters each)
5. Generate up to 10 relevant hashtags for the target platform
6. Provide detailed algorithm-specific insights and engagement triggers
7. Create in-depth research analysis

REQUIREMENTS:
- Each description must be ENTIRELY NEW and UNIQUE - no copying original
- Descriptions should be engaging and under 150 characters
- Hashtags should be optimized for the TARGET platform algorithm
- Include specific algorithm optimization tips for the target platform
- Focus on engagement triggers and pattern interrupts
- Provide detailed, actionable insights

Format your response as JSON with this structure:
{
  "descriptionSuggestions": [
    "ENTIRELY NEW engaging description 1 with hooks",
    "COMPLETELY DIFFERENT engaging description 2 with call-to-action", 
    "UNIQUE engaging description 3 with trending elements"
  ],
  "tagSuggestions": ["platform_specific_hashtag1", "platform_specific_hashtag2", ..., "hashtag10"],
  "algorithmInsights": [
    "Detailed ${targetPlatform} algorithm insight 1",
    "Specific ${targetPlatform} algorithm insight 2",
    "Actionable ${targetPlatform} algorithm insight 3"
  ],
  "algorithmResearch": "In-depth analysis of how ${targetPlatform} algorithm applies to this TikTok content and optimization strategies",
  "trendingOpportunities": "Current ${targetPlatform} trends and how to leverage this TikTok content",
  "engagementTriggers": [
    "${targetPlatform}-specific engagement trigger 1",
    "${targetPlatform}-specific engagement trigger 2", 
    "${targetPlatform}-specific engagement trigger 3"
  ],
  "performancePrediction": "Predicted performance on ${targetPlatform} based on algorithm analysis and content optimization"
}`

      const userPrompt = `Analyze this TikTok content for optimization:

Current Title: ${title}
Current Description: ${description}
Current Tags: ${tags.join(', ')}
Target Platform: ${targetPlatform}

Please provide TikTok-specific optimization suggestions based on 2026 algorithm requirements.`

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${userPrompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const text = data.candidates[0]?.content?.parts?.[0]?.text || ''
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response')
      }

      return JSON.parse(jsonMatch[0]) as TikTokGeminiAnalysis
    } catch (error) {
      console.error('Gemini TikTok Analysis Error:', error)
      return this.getTikTokFallbackAnalysis(title, description, tags)
    }
  }

  private getTikTokFallbackAnalysis(title: string, description: string, tags: string[]): TikTokGeminiAnalysis {
    return {
      descriptionSuggestions: [
        `${title} - Watch till the end! 🔥 #TikTok`,
        `You won't believe what happened next! 😱 #Viral`,
        `This is why you should... 🎯 #Trending`
      ],
      tagSuggestions: tags.slice(0, 8).concat(['viral', 'trending', 'fyp', 'tiktok', '2026']),
      algorithmInsights: [
        'First 3 seconds critical for retention',
        'Hook in first line for search optimization',
        'Pattern interrupts every 3 seconds recommended'
      ],
      algorithmResearch: 'TikTok 2026 algorithm prioritizes search intent matching and early engagement metrics',
      trendingOpportunities: 'Current trending sounds and challenges can boost visibility',
      engagementTriggers: [
        'Use trending audio',
        'Add text overlays for engagement',
        'Include call-to-action in first line'
      ],
      performancePrediction: 'Moderate to high potential with proper optimization'
    }
  }

  private getFallbackAnalysis(title: string, description: string): GeminiAnalysis {
    return {
      tags: ['content', '2026', 'trending', 'viral', 'gaming'],
      title: title,
      description: description || 'Content description',
      insights: ['Gemini analysis temporarily unavailable'],
      algorithmScore: 50,
      recommendations: ['Try again later for AI-powered insights'],
      trends: ['gaming', 'content', '2026']
    }
  }

  private getFallbackTrends(platform: string): string[] {
    const fallbackTrends = {
      'YouTube': ['gaming', 'shorts', 'trending', 'algorithm', '2026'],
      'TikTok': ['viral', 'trending', 'challenge', 'dance', '2026'],
      'Instagram': ['reels', 'trending', 'viral', 'content', '2026'],
      'Twitter': ['trending', 'viral', 'threads', '2026', 'content'],
      'Facebook': ['reels', 'viral', 'trending', 'content', '2026']
    }
    
    return fallbackTrends[platform as keyof typeof fallbackTrends] || ['content', '2026', 'trending']
  }
}

export default GeminiService
