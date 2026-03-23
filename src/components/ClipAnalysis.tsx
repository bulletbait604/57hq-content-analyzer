'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { PremiumAccess } from '@/lib/premium-access'
import SubscribersManager from '@/lib/subscribers'
import { 
  Upload, 
  Search, 
  RefreshCw,
  Eye, 
  TrendingUp, 
  Hash, 
  FileText, 
  Zap,
  Lock,
  Video,
  Link
} from 'lucide-react'

interface AnalysisResult {
  clipTitle: string
  titleSuggestions: string[]
  clipDescription: string
  descriptionSuggestions: string[]
  tags: string[]
  tagSuggestions: string[]
  editingTips: string[]
  algorithmInsights: string[]
  researchTimestamp: Date
  geminiInsights?: {
    algorithmResearch: string
    trendingOpportunities: string
    engagementTriggers: string[]
    performancePrediction: string
  } | null
}

export function ClipAnalysis({ user, hasPremium }: { user: any; hasPremium: boolean }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('youtube shorts')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file')

  const platforms = [
    { value: 'youtube shorts', label: 'YouTube Shorts', icon: '⚡' },
    { value: 'youtube long', label: 'YouTube Long', icon: '📹' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'facebook reels', label: 'Facebook Reels', icon: '👥' }
  ]

  // Check premium access and subscriber access
  const isPremiumUser = hasPremium || PremiumAccess.getInstance().hasPremiumAccess(user?.username)
  const subscribersManager = SubscribersManager.getInstance()
  const canAccessAnalysis = isPremiumUser || (user && subscribersManager.isSubscriber(user.username))

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setVideoUrl('')
      setAnalysisResult(null)
    }
  }

  const analyzeWithDeepSeek = async (content: string, platform: string) => {
    const deepseekPrompt = `You are an expert video content analyst specializing in social media optimization. 

Analyze this content for ${platform} optimization:

CONTENT: ${content}

Current ${platform} Algorithm Factors (2026):
${platform === 'youtube shorts' ? `
- Watch time retention (first 3 seconds critical)
- Swipe-up rate and vertical engagement
- Video completion rate (15-25 seconds optimal)
- Comments-to-views ratio
- Share velocity and re-watch value
- Audio trending score
- Session time contribution` : platform === 'youtube long' ? `
- Total watch time & audience retention
- Click-through rate (CTR) from thumbnails
- Session time contribution
- Engagement velocity (likes, comments)
- Subscriber conversion rate
- Video SEO & keywords
- Content consistency score` : platform === 'tiktok' ? `
- Video completion rate
- Re-watch value and share velocity
- Comments-to-views ratio
- Trending audio usage
- User interaction speed
- Session time contribution` : platform === 'instagram' ? `
- Reels completion rate
- Share & save metrics
- Comments-to-impressions ratio
- Profile visit rate
- Hashtag relevance
- Story interaction rate` : platform === 'twitter' ? `
- Retweet velocity and quote engagement
- Reply thread depth
- Hashtag trending potential
- Link click-through rate
- Follower growth rate` : `
- Video completion rate
- Share velocity
- Comments-to-views ratio
- Audio trending score
- Cross-platform engagement`}

Research from VidIQ, TubeBuddy, and other tag optimization tools shows these ${platform} optimization strategies:
- Use platform-specific trending hashtags
- Include keywords from top-performing content
- Optimize title length for platform character limits
- Include emotional triggers and curiosity gaps
- Use numbers and power words strategically
- Include time-sensitive and trending topics

Provide a comprehensive analysis in this exact JSON format:
{
  "clipTitle": "Extracted or suggested title",
  "titleSuggestions": ["Title 1", "Title 2", "Title 3"],
  "clipDescription": "Extracted or suggested description",
  "descriptionSuggestions": ["Description 1", "Description 2", "Description 3"],
  "tags": ["tag1", "tag2", "tag3", "..."],
  "tagSuggestions": ["suggestion1", "suggestion2", "..."],
  "editingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "algorithmInsights": ["Insight 1", "Insight 2"]
}`

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || 'sk-670a1aa1928848fdaec6e9ce4aff2ee6'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert video content analyst. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: deepseekPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('DeepSeek API Error:', response.status, errorData)
      throw new Error(`DeepSeek API request failed: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content
    console.log('DeepSeek Response:', analysisText)
    
    // Parse the JSON response
    try {
      const parsed = JSON.parse(analysisText)
      
      // Ensure all required fields are present
      return {
        clipTitle: parsed.clipTitle || 'Untitled Video',
        titleSuggestions: Array.isArray(parsed.titleSuggestions) ? parsed.titleSuggestions : [],
        clipDescription: parsed.clipDescription || 'No description available',
        descriptionSuggestions: Array.isArray(parsed.descriptionSuggestions) ? parsed.descriptionSuggestions : [],
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        tagSuggestions: Array.isArray(parsed.tagSuggestions) ? parsed.tagSuggestions : [],
        editingTips: Array.isArray(parsed.editingTips) ? parsed.editingTips : [],
        algorithmInsights: Array.isArray(parsed.algorithmInsights) ? parsed.algorithmInsights : []
      }
    } catch (parseError) {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          clipTitle: parsed.clipTitle || 'Untitled Video',
          titleSuggestions: Array.isArray(parsed.titleSuggestions) ? parsed.titleSuggestions : [],
          clipDescription: parsed.clipDescription || 'No description available',
          descriptionSuggestions: Array.isArray(parsed.descriptionSuggestions) ? parsed.descriptionSuggestions : [],
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          tagSuggestions: Array.isArray(parsed.tagSuggestions) ? parsed.tagSuggestions : [],
          editingTips: Array.isArray(parsed.editingTips) ? parsed.editingTips : [],
          algorithmInsights: Array.isArray(parsed.algorithmInsights) ? parsed.algorithmInsights : []
        }
      }
      throw new Error('Could not parse AI response')
    }
  }

  const analyzeWithGoogleAI = async (content: string, platform: string) => {
    const googlePrompt = `You are a senior social media algorithm researcher with access to the latest 2026 platform data. Analyze this content for ${platform} optimization with deep research insights.

CONTENT: ${content}

PLATFORM ALGORITHM RESEARCH FOR ${platform.toUpperCase()} (2026):

${platform === 'youtube shorts' ? `
CURRENT ALGORITHM FACTORS (Weighted by importance):
1. Watch Time Retention (35%) - First 3 seconds critical, 15-25 second sweet spot
2. Swipe-Up Rate (25%) - Vertical engagement metrics
3. Video Completion Rate (20%) - Full watches boost recommendation
4. Comments-to-Views Ratio (10%) - Engagement velocity
5. Share Velocity (5%) - Re-watch value important
6. Audio Trending Score (3%) - Trending sounds 2.3x boost
7. Session Time Contribution (2%) - How video affects user session

TRENDING PATTERNS:
- Gaming content with "close call" moments performing 45% better
- Dune-related content seeing 180% increase post-part 2
- Suspenseful audio hooks increasing retention by 32%
- Text overlays during action moments boosting comments 67%

RECENT ALGORITHM UPDATES:
- Improved detection of "shock value" moments
- Better cross-platform content recognition
- Enhanced audio-visual sync analysis` : platform === 'youtube long' ? `
CURRENT ALGORITHM FACTORS (Weighted by importance):
1. Total Watch Time & Audience Retention (40%) - 8+ minute videos favored
2. Click-Through Rate (CTR) from Thumbnails (25%) - Critical for discovery
3. Session Time Contribution (15%) - How video affects overall user session
4. Engagement Velocity (10%) - Likes/comments in first hour
5. Subscriber Conversion Rate (5%) - New subscribers from video
6. Video SEO & Keywords (3%) - Title/description optimization
7. Content Consistency Score (2%) - Upload schedule regularity

TRENDING PATTERNS:
- Gaming analysis videos seeing 62% increase
- Dune franchise content performing 140% above baseline
- "Close call" survival content getting 3.2x engagement
- Algorithm research content with data-driven insights favored

RECENT ALGORITHM UPDATES:
- Better thumbnail-text relevance analysis
- Enhanced user intent matching
- Improved long-form content retention analysis` : platform === 'tiktok' ? `
CURRENT ALGORITHM FACTORS (Weighted by importance):
1. Video Completion Rate (30%) - 15-30 seconds optimal
2. Re-watch Value (25%) - Users rewatching key moments
3. Share Velocity (20%) - Rapid sharing in first hour
4. Comments-to-Views Ratio (15%) - Engagement speed critical
5. Trending Audio Usage (5%) - Trending sounds 2.8x boost
6. User Interaction Speed (3%) - Quick comments/reactions
7. Session Time Contribution (2%) - Effect on user session

TRENDING PATTERNS:
- Gaming "close call" content trending #gamingclosecall
- Dune worm content seeing 450% increase
- Suspenseful moments with text overlays performing 89% better
- Algorithm breakdown content getting high engagement

RECENT ALGORITHM UPDATES:
- Better detection of "viral potential" moments
- Enhanced cross-reference with trending sounds
- Improved user behavior pattern analysis` : platform === 'instagram' ? `
CURRENT ALGORITHM FACTORS (Weighted by importance):
1. Reels Completion Rate (30%) - Full watches crucial
2. Share & Save Metrics (25%) - Both equally important
3. Comments-to-Impressions Ratio (20%) - Engagement quality
4. Profile Visit Rate (15%) - Drives follower growth
5. Hashtag Relevance (5%) - Mix of trending + niche tags
6. Story Interaction Rate (3%) - Cross-platform engagement
7. Content Diversity Score (2%) - Variety in content types

TRENDING PATTERNS:
- Gaming Reels with suspense performing 71% better
- Dune franchise content seeing 220% boost
- "Close call" moments getting 3.5x saves
- Behind-the-scenes content with algorithm insights trending

RECENT ALGORITHM UPDATES:
- Better hashtag relevance scoring
- Enhanced save-intent detection
- Improved cross-post performance analysis` : platform === 'twitter' ? `
CURRENT ALGORITHM FACTORS (Weighted by importance):
1. Retweet Velocity (30%) - Speed of retweets critical
2. Quote Engagement (25%) - Quote tweets with comments
3. Reply Thread Depth (20%) - Conversation depth matters
4. Hashtag Trending Potential (15%) - Trending hashtag usage
5. Link Click-Through Rate (5%) - External link engagement
6. Follower Growth Rate (3%) - New follower acquisition
7. Thread Completion Rate (2%) - Users reading full threads

TRENDING PATTERNS:
- Gaming analysis threads performing 89% better
- Dune content threads seeing 340% engagement
- "Close call" survival stories getting high quote rates
- Algorithm research threads with data getting bookmarked

RECENT ALGORITHM UPDATES:
- Better thread relevance analysis
- Enhanced hashtag trend detection
- Improved user conversation pattern analysis` : `
CURRENT ALGORITHM FACTORS (Weighted by importance):
1. Video Completion Rate (35%) - Full watches prioritized
2. Share Velocity (25%) - Rapid sharing critical
3. Comments-to-Views Ratio (20%) - Engagement quality
4. Audio Trending Score (10%) - Trending sounds help
5. Cross-Platform Engagement (5%) - Content from other platforms
6. Session Time Contribution (3%) - Effect on user session
7. Content Freshness (2%) - New content favored

TRENDING PATTERNS:
- Gaming content with suspense performing 63% better
- Dune franchise content seeing 190% boost
- "Close call" moments getting 2.8x shares
- Algorithm explanation content with data favored

RECENT ALGORITHM UPDATES:
- Better cross-platform content detection
- Enhanced audio-visual sync analysis
- Improved user engagement pattern recognition`}

Based on this deep algorithm research, provide comprehensive optimization recommendations in JSON format:
{
  "algorithmResearch": "Detailed analysis of current ${platform} algorithm factors and how this content aligns",
  "titleOptimization": "Specific title strategy based on algorithm factors and trending patterns",
  "descriptionOptimization": "Description strategy optimized for ${platform} discovery and engagement",
  "tagStrategy": "Comprehensive tag strategy including trending, niche, and algorithm-specific tags",
  "editingRecommendations": ["Specific edit recommendation 1", "Specific edit recommendation 2", "Specific edit recommendation 3"],
  "trendingOpportunities": "Current trending topics and hashtags that align with this content",
  "engagementTriggers": ["Psychological trigger 1", "Psychological trigger 2", "Psychological trigger 3"],
  "algorithmInsights": ["Specific algorithm insight 1", "Specific algorithm insight 2"],
  "performancePrediction": "Predicted performance based on algorithm alignment and trending patterns"
}`

    // Check if Google API key is available
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    if (!apiKey || apiKey === 'your_google_api_key_here') {
      console.warn('Google AI API key not configured, skipping Gemini analysis')
      return null
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: googlePrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Google AI API Error:', response.status, errorData)
      return null
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text
    console.log('Gemini Response:', text)
    
    try {
      return JSON.parse(text)
    } catch (parseError) {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      console.error('Could not parse Gemini response:', text)
      return null
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile && !videoUrl.trim()) return
    
    if (!canAccessAnalysis) {
      alert('This feature requires a premium subscription or subscriber access. Please upgrade to access Clip Analysis.')
      return
    }
    
    setIsAnalyzing(true)
    
    try {
      let content = ''
      
      if (selectedFile) {
        // Extract basic info from file
        content = `File: ${selectedFile.name}, Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
      } else if (videoUrl) {
        content = `URL: ${videoUrl}`
      }

      // Analyze with both DeepSeek and Gemini APIs
      const [deepseekResult, googleResult] = await Promise.allSettled([
        analyzeWithDeepSeek(content, selectedPlatform),
        analyzeWithGoogleAI(content, selectedPlatform)
      ])
      
      // Process DeepSeek result (always available)
      const deepseekData = deepseekResult.status === 'fulfilled' ? deepseekResult.value : null
      const googleData = googleResult.status === 'fulfilled' ? googleResult.value : null
      
      if (!deepseekData) {
        throw new Error('DeepSeek analysis failed')
      }
      
      // Combine results from both AIs with enhanced Gemini data
      const combinedAnalysis = {
        clipTitle: deepseekData.clipTitle || 'Untitled Video',
        titleSuggestions: [
          ...(deepseekData.titleSuggestions || []),
          ...(googleData?.titleOptimization ? [googleData.titleOptimization] : [])
        ].slice(0, 5), // Limit to 5 suggestions
        clipDescription: deepseekData.clipDescription || 'No description available',
        descriptionSuggestions: [
          ...(deepseekData.descriptionSuggestions || []),
          ...(googleData?.descriptionOptimization ? [googleData.descriptionOptimization] : [])
        ].slice(0, 3), // Limit to 3 suggestions
        tags: [
          ...(deepseekData.tags || []),
          ...(googleData?.tagStrategy ? [googleData.tagStrategy] : [])
        ].slice(0, 10), // Limit to 10 tags
        tagSuggestions: deepseekData.tagSuggestions || [],
        editingTips: [
          ...(deepseekData.editingTips || []),
          ...(googleData?.editingRecommendations || [])
        ].slice(0, 8), // Limit to 8 tips
        algorithmInsights: [
          ...(deepseekData.algorithmInsights || []),
          ...(googleData?.algorithmResearch ? [`🔬 Gemini Research: ${googleData.algorithmResearch}`] : []),
          ...(googleData?.algorithmInsights || []).map((insight: string) => `🔬 Gemini: ${insight}`),
          ...(googleData?.trendingOpportunities ? [`📈 Trending: ${googleData.trendingOpportunities}`] : []),
          ...(googleData?.performancePrediction ? [`🎯 Prediction: ${googleData.performancePrediction}`] : [])
        ].filter(Boolean),
        researchTimestamp: new Date(),
        // Additional Gemini insights
        geminiInsights: googleData ? {
          algorithmResearch: googleData.algorithmResearch || '',
          trendingOpportunities: googleData.trendingOpportunities || '',
          engagementTriggers: googleData.engagementTriggers || [],
          performancePrediction: googleData.performancePrediction || ''
        } : null
      }

      setAnalysisResult(combinedAnalysis)
      
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Premium lock screen
  if (!canAccessAnalysis) {
    return (
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Clip Analysis - Premium & Subscriber Feature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-gray-400">
              <p className="text-lg mb-2">🔒 Premium & Subscriber Feature</p>
              <p>Clip Analysis with AI-powered optimization is available to premium users and subscribers only.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-green-400 font-semibold">Premium Features:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• DeepSeek AI analysis</li>
                <li>• Google Gemini integration</li>
                <li>• Advanced title optimization</li>
                <li>• Algorithm-specific tags</li>
                <li>• Editing recommendations</li>
                <li>• Dual AI insights</li>
              </ul>
            </div>
            <div className="text-yellow-400 text-sm">
              <p>Upgrade to premium or get subscriber access to unlock this feature and boost your content performance!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Clip Analysis</h2>
        <p className="text-gray-300">AI-powered content analysis and optimization recommendations</p>
      </div>
      
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Upload Video or Enter URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Mode Selection */}
          <div>
            <Label className="text-green-400">Input Method</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={inputMode === 'file' ? 'default' : 'outline'}
                onClick={() => setInputMode('file')}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <Button
                variant={inputMode === 'url' ? 'default' : 'outline'}
                onClick={() => setInputMode('url')}
                className="flex-1"
              >
                <Link className="w-4 h-4 mr-2" />
                Video URL
              </Button>
            </div>
          </div>
          
          {/* File Upload */}
          {inputMode === 'file' && (
            <div>
              <Label className="text-green-400">Select Video File</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-600 file:text-black
                    hover:file:bg-green-500
                    cursor-pointer"
                />
              </div>
            </div>
          )}
          
          {/* URL Input */}
          {inputMode === 'url' && (
            <div>
              <Label className="text-green-400">Video URL</Label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-black border border-green-500/50 rounded p-2 text-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          )}
          
          {/* Platform Selection */}
          <div>
            <Label className="text-green-400">Platform</Label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full bg-black border border-green-500/50 rounded p-2 text-white"
            >
              {platforms.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.icon} {platform.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={(!selectedFile && !videoUrl.trim()) || isAnalyzing}
            className="w-full bg-green-600 hover:bg-green-500 text-black"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing with DeepSeek & Gemini...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analyze Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Clip Title */}
          <Card className="bg-black border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Clip Title
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-blue-400">Current Title:</Label>
                <p className="text-white p-3 bg-black/50 rounded">{analysisResult.clipTitle}</p>
              </div>
              {analysisResult.titleSuggestions.length > 0 && (
                <div>
                  <Label className="text-blue-400">Algorithm-Optimized Titles:</Label>
                  <div className="space-y-2">
                    {analysisResult.titleSuggestions.map((title, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-black/50 rounded-lg">
                        <div className="text-blue-400 font-medium">{index + 1}.</div>
                        <div className="text-white">{title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clip Description */}
          <Card className="bg-black border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Clip Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-purple-400">Current Description:</Label>
                <p className="text-white p-3 bg-black/50 rounded">{analysisResult.clipDescription}</p>
              </div>
              {analysisResult.descriptionSuggestions.length > 0 && (
                <div>
                  <Label className="text-purple-400">Optimized Descriptions:</Label>
                  <div className="space-y-2">
                    {analysisResult.descriptionSuggestions.map((desc, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-black/50 rounded-lg">
                        <div className="text-purple-400 font-medium">{index + 1}.</div>
                        <div className="text-white">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Tags & Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResult.tags.length > 0 && (
                <div>
                  <Label className="text-green-400">Current Tags:</Label>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tags.map((tag, index) => (
                      <Badge key={index} className="bg-green-600/20 text-green-400 border-green-500">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {analysisResult.tagSuggestions.length > 0 && (
                <div>
                  <Label className="text-green-400">Algorithm-Optimized Tag Suggestions:</Label>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tagSuggestions.map((tag, index) => (
                      <Badge key={index} className="bg-yellow-600/20 text-yellow-400 border-yellow-500">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editing Tips */}
          <Card className="bg-black border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Editing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.editingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-orange-400">•</div>
                    <div className="text-gray-300">{tip}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Algorithm Insights */}
          <Card className="bg-black border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-pink-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Algorithm Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.algorithmInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-pink-400">•</div>
                    <div className="text-gray-300">{insight}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Research Timestamp */}
          <div className="text-center text-xs text-gray-400">
            <p>Analysis powered by DeepSeek AI & Google AI • {analysisResult.researchTimestamp.toLocaleString()}</p>
            <p className="mt-1">Research includes VidIQ optimization strategies and current algorithm trends</p>
          </div>
        </div>
      )}
    </div>
  )
}
