import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Allow browser usage for client-side API calls
})

export interface AIAnalysis {
  tags: string[]
  title: string
  description: string
  insights: string[]
  algorithmScore: number
  recommendations: string[]
}

export async function analyzeContentWithAI(
  contentType: string,
  platform: string,
  title: string,
  description: string = '',
  additionalContext: string = ''
): Promise<AIAnalysis> {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from AI')
    }

    return JSON.parse(response) as AIAnalysis
  } catch (error) {
    console.error('AI Analysis Error:', error)
    // Fallback response
    return {
      tags: ['content', '2026', 'trending', 'viral', 'fps'],
      title: title,
      description: description || 'Content description',
      insights: ['AI analysis temporarily unavailable'],
      algorithmScore: 50,
      recommendations: ['Try again later for AI-powered insights']
    }
  }
}

export async function generateTagsWithAI(
  title: string,
  platform: string,
  contentType: string = 'gaming'
): Promise<string[]> {
  try {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 300,
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from AI')
    }

    return JSON.parse(response) as string[]
  } catch (error) {
    console.error('AI Tag Generation Error:', error)
    // Fallback tags
    return ['trending', 'viral', '2026', 'content', platform.toLowerCase()]
  }
}
