'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { PremiumAccess } from '@/lib/premium-access'
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

  // Check premium access
  const isPremiumUser = hasPremium || PremiumAccess.getInstance().hasPremiumAccess(user?.username)

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
    const googlePrompt = `As a social media algorithm expert, analyze this content for ${platform} optimization:

CONTENT: ${content}

Focus on:
1. Title optimization for ${platform} algorithm
2. Description optimization for maximum engagement
3. Tag strategies based on current trends
4. Editing recommendations for algorithm success

Provide specific, actionable recommendations in JSON format:
{
  "titleOptimization": "Specific title advice",
  "descriptionOptimization": "Description strategy",
  "tagStrategy": "Tag recommendations",
  "editingRecommendations": ["Edit tip 1", "Edit tip 2"]
}`

    // Check if Google API key is available
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    if (!apiKey || apiKey === 'your_google_api_key_here') {
      console.warn('Google AI API key not configured, skipping Gemini analysis')
      return null
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
    
    if (!isPremiumUser) {
      alert('This feature requires a premium subscription. Please upgrade to access Clip Analysis.')
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
      
      // Combine results from both AIs
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
          ...(googleData?.titleOptimization ? [`Gemini: ${googleData.titleOptimization}`] : []),
          ...(googleData?.descriptionOptimization ? [`Gemini: ${googleData.descriptionOptimization}`] : []),
          ...(googleData?.tagStrategy ? [`Gemini: ${googleData.tagStrategy}`] : [])
        ].filter(Boolean),
        researchTimestamp: new Date()
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
  if (!isPremiumUser) {
    return (
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Clip Analysis - Premium Feature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-gray-400">
              <p className="text-lg mb-2">🔒 Premium Feature</p>
              <p>Clip Analysis with AI-powered optimization is available to premium users only.</p>
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
              <p>Upgrade to premium to unlock this feature and boost your content performance!</p>
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
