// Google Gemini AI Service for Algorithm Research and Content Analysis
// Using official Google Gemini API for enhanced content analysis

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
  titleSuggestions?: string[]  // Optional for YouTube content
  descriptionSuggestions: string[]
  tagSuggestions: string[]
  algorithmInsights: string[]
  algorithmResearch: string
  trendingOpportunities: string
  engagementTriggers: string[]
  performancePrediction: string
  editRecommendations: string[]  // Added for detailed edit recommendations
  algorithmInformation: string  // Added for detailed algorithm information
}

export class GeminiService {
  private static instance: GeminiService
  private apiKey: string

  private constructor() {
    // Use Google API key for Gemini (they're the same service)
    // Priority order: NEXT_PUBLIC_GEMINI_API_KEY (Gemini 3.1), then fallback to Google API keys
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
                 process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY || ''
    
    // Log which API key is being used for debugging
    if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.log('🔑 Using Gemini 3.1 API Key (NEXT_PUBLIC_GEMINI_API_KEY)')
    } else if (process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      console.log('🔑 Using Google API Key (NEXT_PUBLIC_GOOGLE_API_KEY)')
    } else {
      console.warn('⚠️ No Gemini API key found, using fallback analysis')
    }
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
  "recommendations": ["rec1", "rec2", ...]
}`

      const userPrompt = `Content Type: ${contentType}
Platform: ${platform}
Current Title: ${title}
Current Description: ${description}
Additional Context: ${additionalContext}

Please analyze this content and provide optimization recommendations.`

      // Use official Google Gemini API with latest model
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
            maxOutputTokens: 2048
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

      return JSON.parse(jsonMatch[0]) as GeminiAnalysis
    } catch (error) {
      console.error('Gemini Analysis Error:', error)
      return this.getFallbackAnalysis(title, description)
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
      const systemPrompt = `You are an expert content optimization specialist specializing in 2026 social media algorithm analysis using Google's Gemini AI.

CRITICAL INSTRUCTIONS:
1. DO NOT copy the original description - create entirely new, optimized suggestions
2. Take your time to provide IN-DEPTH, ANALYTICAL responses
3. Research the target platform's algorithm specified by the user in detail
4. Cross-reference the provided TikTok content with the target platform algorithm
5. Provide detailed, comprehensive analysis and recommendations

FIRST, ANALYZE THE CONTENT:
- Content Type: TikTok video from URL
- Current Title: "${title}"
- Current Description: "${description}"
- Current Tags: ${tags.join(', ')}

THEN, RESEARCH THE TARGET PLATFORM ALGORITHM:
- Target Platform: ${targetPlatform}
- Conduct in-depth research on ${targetPlatform}'s 2026 algorithm
- Analyze ranking factors, engagement patterns, and optimization strategies
- Study current trends and algorithm updates

FINALLY, CROSS-REFERENCE AND OPTIMIZE:
- Compare TikTok content characteristics with ${targetPlatform} algorithm requirements
- Identify optimization opportunities and potential challenges
- Create platform-specific recommendations

YOUR TASK - TIKTOK CONTENT CROSS-PLATFORM OPTIMIZATION:

1. TIKTOK CONTENT ANALYSIS:
   - Analyze the TikTok content structure and themes
   - Identify key elements, hooks, and engagement factors
   - Evaluate current performance indicators

2. TARGET PLATFORM ALGORITHM RESEARCH:
   - Provide in-depth analysis of ${targetPlatform}'s current algorithm
   - Explain ranking factors and success metrics
   - Detail trending content types and optimization strategies

3. CROSS-REFERENCE ANALYSIS:
   - Compare TikTok content with ${targetPlatform} requirements
   - Identify strengths, weaknesses, and optimization opportunities
   - Provide specific adaptation strategies

4. OPTIMIZATION RECOMMENDATIONS:
   - Generate 3 COMPLETELY NEW and DIFFERENT optimized description suggestions
   - Generate up to 10 relevant hashtags for the target platform
   - Provide detailed algorithm-specific insights and engagement triggers
   - Create in-depth research analysis

5. DETAILED EDIT RECOMMENDATIONS:
   - Specific changes needed for better results on ${targetPlatform}
   - Content adaptation strategies from TikTok to ${targetPlatform}
   - Timing, formatting, and engagement optimization
   - Platform-specific feature recommendations

6. ALGORITHM INFORMATION:
   - Detailed description of ${targetPlatform}'s algorithm
   - Best practices for ${targetPlatform} optimization
   - Current trends and algorithm updates for ${targetPlatform}

REQUIREMENTS:
- Take time to provide THOROUGH, DETAILED responses
- Each suggestion must be ENTIRELY NEW and UNIQUE
- Focus on platform-specific algorithm optimization
- Include specific, actionable insights and strategies
- Provide comprehensive research and analysis

FORMAT YOUR RESPONSE AS JSON:
{
  "descriptionSuggestions": [
    "ENTIRELY NEW engaging description 1 with hooks and platform optimization",
    "COMPLETELY DIFFERENT engaging description 2 with call-to-action and algorithm factors", 
    "UNIQUE engaging description 3 with trending elements and engagement triggers"
  ],
  "tagSuggestions": ["platform_specific_hashtag1", "platform_specific_hashtag2", "algorithm_hashtag3", "trending_hashtag4", "niche_hashtag5", "engagement_hashtag6", "viral_hashtag7", "community_hashtag8", "seasonal_hashtag9", "strategy_hashtag10"],
  "algorithmInsights": [
    "Detailed ${targetPlatform} algorithm insight 1 with specific ranking factors",
    "Specific ${targetPlatform} algorithm insight 2 with engagement patterns",
    "Actionable ${targetPlatform} algorithm insight 3 with optimization strategies",
    "Advanced ${targetPlatform} algorithm insight 4 with trending analysis",
    "Strategic ${targetPlatform} algorithm insight 5 with performance metrics"
  ],
  "algorithmResearch": "Comprehensive in-depth analysis of how ${targetPlatform} algorithm applies to this TikTok content, including detailed ranking factors, current trends, optimization strategies, and specific recommendations for maximizing performance and engagement",
  "trendingOpportunities": "Detailed analysis of current ${targetPlatform} trends and how to leverage this TikTok content for maximum reach, including specific trending topics, formats, and engagement strategies",
  "engagementTriggers": [
    "${targetPlatform}-specific engagement trigger 1 with psychological factors",
    "${targetPlatform}-specific engagement trigger 2 with timing strategies", 
    "${targetPlatform}-specific engagement trigger 3 with content optimization"
  ],
  "performancePrediction": "Predicted performance on ${targetPlatform} based on comprehensive algorithm analysis, content optimization, current trends, and specific engagement strategies with detailed reasoning and confidence factors",
  "editRecommendations": [
    "Specific edit recommendation 1 for better ${targetPlatform} results",
    "Content adaptation strategy 2 from TikTok to ${targetPlatform}",
    "Timing and formatting optimization 3 for ${targetPlatform}",
    "Platform-specific feature recommendation 4 for ${targetPlatform}"
  ],
  "algorithmInformation": "Detailed description of ${targetPlatform}'s algorithm including ranking factors, best practices, current trends, and optimization strategies for maximum content performance and discoverability"
}`

      const userPrompt = `Analyze this TikTok content for cross-platform optimization:

Current Title: ${title}
Current Description: ${description}
Current Tags: ${tags.join(', ')}
Target Platform: ${targetPlatform}

Please provide comprehensive TikTok-to-${targetPlatform} optimization suggestions with detailed algorithm research and edit recommendations.`

      // Use official Google Gemini API with latest model
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
            maxOutputTokens: 2048
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

  // Analyze YouTube content for cross-platform optimization
  async analyzeYouTubeContent(
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
      const systemPrompt = `You are an expert content optimization specialist specializing in 2026 social media algorithm analysis using Google's Gemini AI.

CRITICAL INSTRUCTIONS:
1. DO NOT copy the original title, description, or tags - create entirely new, optimized suggestions
2. Take your time to provide IN-DEPTH, ANALYTICAL responses
3. Research the target platform's algorithm specified by the user in detail
4. Cross-reference the provided YouTube content with the target platform algorithm
5. Provide detailed, comprehensive analysis and recommendations

FIRST, ANALYZE THE CONTENT:
- Content Type: YouTube video from URL
- Current Title: "${title}"
- Current Description: "${description}"
- Current Tags: ${tags.join(', ')}

THEN, RESEARCH THE TARGET PLATFORM ALGORITHM:
- Target Platform: ${targetPlatform}
- Conduct in-depth research on ${targetPlatform}'s 2026 algorithm
- Analyze ranking factors, engagement patterns, and optimization strategies
- Study current trends and algorithm updates

FINALLY, CROSS-REFERENCE AND OPTIMIZE:
- Compare YouTube content characteristics with ${targetPlatform} algorithm requirements
- Identify optimization opportunities and potential challenges
- Create platform-specific recommendations

YOUR TASK - YOUTUBE CONTENT CROSS-PLATFORM OPTIMIZATION:

1. YOUTUBE CONTENT ANALYSIS:
   - Analyze the YouTube content structure and themes
   - Identify key elements, hooks, and engagement factors
   - Evaluate current performance indicators

2. TARGET PLATFORM ALGORITHM RESEARCH:
   - Provide in-depth analysis of ${targetPlatform}'s current algorithm
   - Explain ranking factors and success metrics
   - Detail trending content types and optimization strategies

3. CROSS-REFERENCE ANALYSIS:
   - Compare YouTube content with ${targetPlatform} requirements
   - Identify strengths, weaknesses, and optimization opportunities
   - Provide specific adaptation strategies

4. OPTIMIZATION RECOMMENDATIONS:
   - Generate 3 COMPLETELY NEW and DIFFERENT optimized title suggestions
   - Generate 3 COMPLETELY NEW and DIFFERENT optimized description suggestions
   - Generate up to 10 relevant hashtags for the target platform
   - Provide detailed algorithm-specific insights and engagement triggers
   - Create in-depth research analysis

5. DETAILED EDIT RECOMMENDATIONS:
   - Specific changes needed for better results on ${targetPlatform}
   - Content adaptation strategies from YouTube to ${targetPlatform}
   - Timing, formatting, and engagement optimization
   - Platform-specific feature recommendations

6. ALGORITHM INFORMATION:
   - Detailed description of ${targetPlatform}'s algorithm
   - Best practices for ${targetPlatform} optimization
   - Current trends and algorithm updates for ${targetPlatform}

REQUIREMENTS:
- Take time to provide THOROUGH, DETAILED responses
- Each suggestion must be ENTIRELY NEW and UNIQUE
- Focus on platform-specific algorithm optimization
- Include specific, actionable insights and strategies
- Provide comprehensive research and analysis

FORMAT YOUR RESPONSE AS JSON:
{
  "titleSuggestions": [
    "ENTIRELY NEW engaging title 1 with hooks and platform optimization",
    "COMPLETELY DIFFERENT engaging title 2 with call-to-action and algorithm factors", 
    "UNIQUE engaging title 3 with trending elements and engagement triggers"
  ],
  "descriptionSuggestions": [
    "ENTIRELY NEW engaging description 1 with hooks and platform optimization",
    "COMPLETELY DIFFERENT engaging description 2 with call-to-action and algorithm factors", 
    "UNIQUE engaging description 3 with trending elements and engagement triggers"
  ],
  "tagSuggestions": ["platform_specific_hashtag1", "platform_specific_hashtag2", "algorithm_hashtag3", "trending_hashtag4", "niche_hashtag5", "engagement_hashtag6", "viral_hashtag7", "community_hashtag8", "seasonal_hashtag9", "strategy_hashtag10"],
  "algorithmInsights": [
    "Detailed ${targetPlatform} algorithm insight 1 with specific ranking factors",
    "Specific ${targetPlatform} algorithm insight 2 with engagement patterns",
    "Actionable ${targetPlatform} algorithm insight 3 with optimization strategies",
    "Advanced ${targetPlatform} algorithm insight 4 with trending analysis",
    "Strategic ${targetPlatform} algorithm insight 5 with performance metrics"
  ],
  "algorithmResearch": "Comprehensive in-depth analysis of how ${targetPlatform} algorithm applies to this YouTube content, including detailed ranking factors, current trends, optimization strategies, and specific recommendations for maximizing performance and engagement",
  "trendingOpportunities": "Detailed analysis of current ${targetPlatform} trends and how to leverage this YouTube content for maximum reach, including specific trending topics, formats, and engagement strategies",
  "engagementTriggers": [
    "${targetPlatform}-specific engagement trigger 1 with psychological factors",
    "${targetPlatform}-specific engagement trigger 2 with timing strategies", 
    "${targetPlatform}-specific engagement trigger 3 with content optimization"
  ],
  "performancePrediction": "Predicted performance on ${targetPlatform} based on comprehensive algorithm analysis, content optimization, current trends, and specific engagement strategies with detailed reasoning and confidence factors",
  "editRecommendations": [
    "Specific edit recommendation 1 for better ${targetPlatform} results",
    "Content adaptation strategy 2 from YouTube to ${targetPlatform}",
    "Timing and formatting optimization 3 for ${targetPlatform}",
    "Platform-specific feature recommendation 4 for ${targetPlatform}"
  ],
  "algorithmInformation": "Detailed description of ${targetPlatform}'s algorithm including ranking factors, best practices, current trends, and optimization strategies for maximum content performance and discoverability"
}`

      const userPrompt = `Analyze this YouTube content for cross-platform optimization:

Current Title: ${title}
Current Description: ${description}
Current Tags: ${tags.join(', ')}
Target Platform: ${targetPlatform}

Please provide comprehensive YouTube-to-${targetPlatform} optimization suggestions with detailed algorithm research and edit recommendations.`

      // Use official Google Gemini API with latest model
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
            maxOutputTokens: 2048
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
        throw new Error('No valid JSON found in Gemini response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        titleSuggestions: parsed.titleSuggestions || [],
        descriptionSuggestions: parsed.descriptionSuggestions || [],
        tagSuggestions: parsed.tagSuggestions || [],
        algorithmInsights: parsed.algorithmInsights || [],
        algorithmResearch: parsed.algorithmResearch || '',
        trendingOpportunities: parsed.trendingOpportunities || '',
        engagementTriggers: parsed.engagementTriggers || [],
        performancePrediction: parsed.performancePrediction || '',
        editRecommendations: parsed.editRecommendations || [],
        algorithmInformation: parsed.algorithmInformation || ''
      }
    } catch (error) {
      console.error('Gemini YouTube analysis error:', error)
      return this.getTikTokFallbackAnalysis(title, description, tags)
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

  private getTikTokFallbackAnalysis(title: string, description: string, tags: string[]): TikTokGeminiAnalysis {
    return {
      descriptionSuggestions: [
        `${title} - Watch till end! 🔥 #TikTok`,
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
      performancePrediction: 'Moderate to high potential with proper optimization',
      editRecommendations: [
        'Add pattern interrupts every 3 seconds',
        'Include trending audio or sounds',
        'Optimize first line for search intent',
        'Add high-contrast text overlays'
      ],
      algorithmInformation: 'TikTok operates as a search engine in 2026, prioritizing content that matches user search intent. The algorithm rewards pattern interrupts, trending audio participation, and strong early engagement metrics within the first 1-2 hours of posting.'
    }
  }
}

export default GeminiService
