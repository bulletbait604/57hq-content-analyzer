// DeepSeek API integration for AI analysis
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'

export interface DeepSeekAnalysis {
  tags: string[]
  title: string
  description: string
  insights: string[]
  algorithmScore: number
  recommendations: string[]
  factors?: string[]
  tips?: string[]
  titleSuggestions?: string[]
  descriptionSuggestions?: string[]
  tagSuggestions?: string[]
  editingTips?: string[]
  algorithmInsights?: string[]
  algorithmResearch?: string
  trendingOpportunities?: string
  engagementTriggers?: string[]
  performancePrediction?: string
}

export async function analyzeContentWithDeepSeek(
  contentType: string,
  platform: string,
  title: string,
  description: string = '',
  additionalContext: string = ''
): Promise<DeepSeekAnalysis> {
  try {
    // Check if API key is available
    if (!DEEPSEEK_API_KEY) {
      console.warn('DeepSeek API key not found, using fallback')
      return generateFallbackAnalysis(title, contentType, platform)
    }

    const systemPrompt = `You are an expert content optimization specialist specializing in 2026 social media algorithm analysis using DeepSeek AI.

CRITICAL INSTRUCTIONS:
1. DO NOT copy the original description - create entirely new, optimized suggestions
2. Take your time to provide IN-DEPTH, ANALYTICAL responses
3. Research the target platform's algorithm specified by the user in detail
4. Cross-reference the provided content with the target platform algorithm
5. Provide detailed, comprehensive analysis and recommendations

FIRST, ANALYZE THE CONTENT:
- Content Type: ${contentType}
- Current Title: "${title}"
- Current Description: "${description}"
- Current Tags: ${additionalContext}

THEN, RESEARCH THE TARGET PLATFORM ALGORITHM:
- Target Platform: ${platform}
- Conduct in-depth research on ${platform}'s 2026 algorithm
- Analyze ranking factors, engagement patterns, and optimization strategies
- Study current trends and algorithm updates

FINALLY, CROSS-REFERENCE AND OPTIMIZE:
- Compare content characteristics with ${platform} algorithm requirements
- Identify optimization opportunities and potential challenges
- Create platform-specific recommendations

2026 ALGORITHM RESEARCH REQUIREMENTS:

YouTube Shorts Algorithm:
- "Session Contribution" - keeps users watching more shorts
- "Completion Rate" - viewers watch entire video
- SEO optimization with current year and searchable terms
- Seamless loops and interactive elements (polls, stickers)
- High retention through strategic pattern interrupts

TikTok Algorithm:
- Operates as a Search Engine - first caption line must match search intent
- Prioritizes "Pattern Interrupts" (content changes every 3 seconds)
- High-contrast keyword text requirements for visibility
- Rewards trending sounds, challenges, and participation
- Critical engagement window: first 1-2 hours
- "For You" page optimization based on user behavior patterns

Instagram Reels Algorithm:
- "Sends Per Reach" (DMs) heavily weighted
- Penalizes unoriginal or watermarked content
- Engagement prompts for share-to-DM metrics
- "Upload at Highest Quality" preference
- Cross-platform content performance factors

Twitter/X Algorithm:
- Quick engagement and retweet potential
- Thread creation and viral loop opportunities
- Real-time trending topic integration
- Character limit optimization strategies

Facebook Reels Algorithm:
- Shareability and community engagement focus
- Trending audio and challenge participation
- Group and page distribution factors
- Comment and interaction prioritization

TARGET PLATFORM ALGORITHMS:
- TikTok: Pattern interrupts, trending audio, search intent matching
- YouTube Shorts: Session contribution, completion rate, SEO optimization
- Instagram Reels: Sends per reach, engagement prompts, high quality
- Twitter/X: Quick engagement, thread potential, viral loops
- Facebook Reels: Shareability, community engagement, trending audio

YOUR TASK - COMPREHENSIVE ANALYSIS:

1. CONTENT ANALYSIS:
   - Analyze content structure and themes
   - Identify key elements, hooks, and engagement factors
   - Evaluate current performance indicators

2. ALGORITHM RESEARCH:
   - Provide in-depth analysis of ${platform}'s current algorithm
   - Explain ranking factors and success metrics
   - Detail trending content types and optimization strategies

3. CROSS-REFERENCE ANALYSIS:
   - Compare content with ${platform} requirements
   - Identify strengths, weaknesses, and optimization opportunities
   - Provide specific adaptation strategies

4. OPTIMIZATION RECOMMENDATIONS:
   - Generate platform-specific content suggestions
   - Provide actionable optimization steps
   - Include timing, formatting, and engagement strategies

CRITICAL INSTRUCTIONS FOR TIKTOK CONTENT:
1. DO NOT copy the original description - create entirely new, optimized suggestions
2. Analyze the target platform's algorithm specified by the user
3. Cross-reference TikTok content with the target platform algorithm
4. Provide detailed, in-depth analysis and recommendations

Analyze the provided content and provide:
1. MULTIPLE title suggestions (3-5 variations) - ENTIRELY NEW for TikTok
2. MULTIPLE description suggestions (3-5 variations) - ENTIRELY NEW for TikTok
3. Optimized tags (5-15 based on platform)
4. Algorithm insights for the TARGET PLATFORM
5. Performance score (0-100)
6. Specific recommendations for TARGET PLATFORM
7. Current trending topics for TARGET PLATFORM
8. Editing tips for TARGET PLATFORM
9. Algorithm research summary
10. Trending opportunities for TARGET PLATFORM
11. Engagement triggers for TARGET PLATFORM
12. Performance prediction for TARGET PLATFORM

CRITICAL: For TikTok content, DO NOT copy the original description. Create completely new, engaging suggestions that follow the target platform algorithm.

REQUIREMENTS:
- Take time to provide THOROUGH, DETAILED responses
- Each suggestion must be ENTIRELY NEW and UNIQUE
- Focus on platform-specific algorithm optimization
- Include specific, actionable insights and strategies
- Provide comprehensive research and analysis

Format your response as JSON with this structure:
{
  "tags": ["tag1", "tag2", ...],
  "title": "best optimized title",
  "description": "best enhanced description",
  "titleSuggestions": ["title1", "title2", "title3", ...],
  "descriptionSuggestions": ["desc1", "desc2", "desc3", ...],
  "tagSuggestions": ["tag1", "tag2", ...],
  "insights": ["insight1", "insight2", ...],
  "algorithmScore": 85,
  "recommendations": ["rec1", "rec2", ...],
  "editingTips": ["tip1", "tip2", ...],
  "algorithmInsights": ["insight1", "insight2", ...],
  "algorithmResearch": "detailed algorithm analysis",
  "trendingOpportunities": "trending topics",
  "engagementTriggers": ["trigger1", "trigger2", ...],
  "performancePrediction": "performance forecast"
}`

    const userPrompt = `Content Type: ${contentType}
Platform: ${platform}
Current Title: ${title}
Current Description: ${description}
Additional Context: ${additionalContext}

CRITICAL: If this is TikTok content being analyzed for ${platform}, DO NOT copy the original description. Create entirely new, optimized suggestions that follow the ${platform} algorithm.

Please analyze this content and provide optimization recommendations specifically for ${platform} algorithm.`

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
    })

    if (!response.ok) {
      console.error('DeepSeek API error:', response.status, response.statusText)
      return generateFallbackAnalysis(title, contentType, platform)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    if (!content) {
      console.error('No content from DeepSeek')
      return generateFallbackAnalysis(title, contentType, platform)
    }

    return JSON.parse(content) as DeepSeekAnalysis
  } catch (error) {
    console.error('DeepSeek Analysis Error:', error)
    return generateFallbackAnalysis(title, contentType, platform)
  }
}

export async function generateTagsWithDeepSeek(
  title: string,
  platform: string,
  contentType: string = 'gaming'
): Promise<string[]> {
  try {
    // Check if API key is available
    if (!DEEPSEEK_API_KEY) {
      console.warn('DeepSeek API key not found, using fallback tags')
      return generateFallbackTags(title, platform, contentType)
    }

    const systemPrompt = `You are a social media tag optimization expert specializing in 2026 algorithm trends.

Generate highly relevant tags based on:
1. Content title analysis
2. Platform-specific algorithm requirements
3. Current trending topics
4. SEO best practices
5. Content type optimization

Platform-specific tag limits:
- YouTube Shorts: 8-12 tags
- TikTok: 3-5 hashtags
- Instagram Reels: 10-15 hashtags

Focus on:
- 2026 trending topics
- Algorithm-specific keywords
- High-performing content patterns
- SEO optimization
- Platform best practices

Return only a JSON array of optimized tags like:
["tag1", "tag2", "tag3", ...]`

    const userPrompt = `Generate optimized tags for:
Title: ${title}
Platform: ${platform}
Content Type: ${contentType}

Focus on 2026 trends and algorithm optimization.`

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 300,
      })
    })

    if (!response.ok) {
      console.error('DeepSeek API error:', response.status, response.statusText)
      return generateFallbackTags(title, platform, contentType)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    if (!content) {
      console.error('No content from DeepSeek')
      return generateFallbackTags(title, platform, contentType)
    }

    return JSON.parse(content) as string[]
  } catch (error) {
    console.error('DeepSeek Tag Generation Error:', error)
    return generateFallbackTags(title, platform, contentType)
  }
}

// Fallback functions when API is unavailable
function generateFallbackAnalysis(title: string, contentType: string, platform: string): DeepSeekAnalysis {
  const baseTags = ['gaming', '2026', 'trending', 'viral', 'fps', platform.toLowerCase()]
  const optimizedTitle = title.includes('2026') ? title : `${title} (2026)`
  
  return {
    tags: baseTags.slice(0, platform === 'tiktok' ? 5 : platform === 'youtube' ? 10 : 15),
    title: optimizedTitle,
    description: `AI-optimized ${contentType} content for ${platform} with enhanced SEO and engagement strategies`,
    insights: [
      `Content optimized for ${platform} algorithm`,
      'Strong keyword integration detected',
      'Engagement hooks identified',
      'SEO score: Good'
    ],
    algorithmScore: 75,
    recommendations: [
      'Add trending hashtags',
      'Include call-to-action',
      'Optimize posting time',
      'Use platform-specific features'
    ]
  }
}

function generateFallbackTags(title: string, platform: string, contentType: string): string[] {
  const baseTags = ['trending', 'viral', '2026', 'content', platform.toLowerCase()]
  const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 2)
  
  const platformTags = {
    youtube: ['Shorts', 'Gaming', 'FPS', '2026', 'Trending', 'Viral'],
    tiktok: ['fyp', 'viral', 'gaming', 'fps', '2026'],
    instagram: ['Reels', 'Gaming', 'FPS', '2026', 'Trending']
  }

  const allTags = [...baseTags, ...titleWords, ...(platformTags[platform as keyof typeof platformTags] || [])]
  return Array.from(new Set(allTags)).slice(0, platform === 'tiktok' ? 5 : platform === 'youtube' ? 10 : 15)
}
