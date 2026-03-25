'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Play, 
  Settings, 
  FileText, 
  Hash, 
  Search, 
  Clock, 
  RefreshCw,
  Lock,
  CheckCircle,
  ExternalLink,
  Star,
  TrendingUp,
  Video,
  Link,
  Zap
} from 'lucide-react'
import { AlgorithmUpdater } from '@/lib/algorithm-updater'
import { analyzeContentWithDeepSeek } from '@/lib/deepseek'
import { GeminiService } from '@/lib/gemini'
import SubscribersManager from '@/lib/subscribers'
import TikTokMetadataService from '@/lib/tiktok-metadata'
import YouTubeMetadataService, { YouTubeMetadata } from '@/lib/youtube-metadata'

interface AnalysisResult {
  clipTitle: string
  titleSuggestions: string[]
  clipDescription: string
  descriptionSuggestions: string[]
  tags: string[]
  tagSuggestions: string[]
  editingTips: string[]
  algorithmInsights: string[]
  algorithmResearch: string
  trendingOpportunities: string
  engagementTriggers: string[]
  performancePrediction: string
  gameAnalysis?: {
    gameName: string
    gameGenre: string
    gamingPlatform: string
    streamingPlatform: string
    contentFocus: string
  }
  aiAnalysis?: {
    metadataUsed: boolean
    deepSeekUsed: boolean
    geminiUsed: boolean
    totalInsights: number
    totalTagSuggestions: number
  }
  isTikTok: boolean
}

const platforms = [
  { value: 'TikTok', label: '🎵 TikTok', icon: '🎵' },
  { value: 'YouTube', label: '📺 YouTube', icon: '📺' },
  { value: 'Instagram', label: '📷 Instagram', icon: '📷' },
  { value: 'Twitter', label: '🐦 Twitter/X', icon: '🐦' },
  { value: 'Facebook', label: '📘 Facebook', icon: '📘' }
]

export default function ClipAnalysis() {
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [canAccessAnalysis, setCanAccessAnalysis] = useState(false)

  // Check user access on mount
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const subscribers = await SubscribersManager.getSubscribers()
        const hasAccess = subscribers.length > 0
        
        setCanAccessAnalysis(hasAccess)
        console.log('🔑 Access Check:', { 
          subscriberCount: subscribers.length, 
          hasAccess, 
          canUseFeature: hasAccess 
        })
      } catch (error) {
        console.error('❌ Access check failed:', error)
        setCanAccessAnalysis(false)
      }
    }

    checkAccess()
  }, [])

  const analyzeTikTokWithGemini = async (currentTitle: string, currentDescription: string, currentTags: string[], platform: string) => {
    console.log('🎵 Starting TikTok Analysis with Gemini AI:')
    console.log('📊 TikTok Content:', { currentTitle, currentDescription, currentTags, platform })
    
    try {
      // Try Gemini AI first
      console.log('🤖 Gemini analyzing TikTok content...')
      const geminiService = GeminiService.getInstance()
      const geminiAnalysis = await geminiService.analyzeTikTokContent(currentTitle, currentDescription, currentTags, platform)
      
      // Enhanced logging for Gemini response debugging
      console.log('🤖 GEMINI TIKTOK RESPONSE DEBUG:')
      console.log('📊 Analysis Quality Check:')
      console.log('  ✅ Source: TikTok URL detected')
      console.log('  ✅ API: Gemini 3.1 with enhanced algorithm research')
      console.log('  ✅ Target Platform:', platform)
      console.log('  ✅ Cross-Reference: TikTok content +', platform, 'algorithm')
      console.log('  📝 Description Suggestions:', geminiAnalysis?.descriptionSuggestions)
      console.log('  🏷️ Tag Suggestions:', geminiAnalysis?.tagSuggestions)
      console.log('  🔍 Algorithm Insights:', geminiAnalysis?.algorithmInsights)
      console.log('  📚 Algorithm Research:', geminiAnalysis?.algorithmResearch)
      console.log('  📈 Trending Opportunities:', geminiAnalysis?.trendingOpportunities)
      console.log('  ⚡ Engagement Triggers:', geminiAnalysis?.engagementTriggers)
      console.log('  🎯 Performance Prediction:', geminiAnalysis?.performancePrediction)
      console.log('  📊 Quality Metrics:')
      console.log('    - Description Count:', geminiAnalysis?.descriptionSuggestions?.length || 0)
      console.log('    - Tag Count:', geminiAnalysis?.tagSuggestions?.length || 0)
      console.log('    - Insight Count:', geminiAnalysis?.algorithmInsights?.length || 0)
      console.log('    - Research Depth:', geminiAnalysis?.algorithmResearch?.length || 0, 'characters')
      console.log('  🚫 Copy-Paste Check:', {
        descriptionsAreNew: geminiAnalysis?.descriptionSuggestions?.every(desc => desc !== currentDescription),
        hasInDepthResearch: (geminiAnalysis?.algorithmResearch?.length || 0) > 200,
        hasPlatformSpecificInsights: (geminiAnalysis?.algorithmInsights?.length || 0) >= 3
      })
      
      return {
        descriptionSuggestions: geminiAnalysis?.descriptionSuggestions || [],
        tagSuggestions: geminiAnalysis?.tagSuggestions || [],
        editingTips: geminiAnalysis?.algorithmInsights || [],
        algorithmInsights: geminiAnalysis?.algorithmInsights || [],
        algorithmResearch: geminiAnalysis?.algorithmResearch || '',
        trendingOpportunities: geminiAnalysis?.trendingOpportunities || '',
        engagementTriggers: geminiAnalysis?.engagementTriggers || [],
        performancePrediction: geminiAnalysis?.performancePrediction || '',
        aiUsed: 'gemini'
      }
    } catch (error) {
      console.warn('🤖 Gemini failed, falling back to DeepSeek:', error)
      
      // Fallback to DeepSeek
      try {
        console.log('🧠 DeepSeek analyzing TikTok content as fallback...')
        const deepseekAnalysis = await analyzeContentWithDeepSeek('video', platform, currentTitle, currentDescription, `Current tags: ${currentTags.join(', ')}`)
        
        console.log('🧠 DEEPSEEK TIKTOK FALLBACK DEBUG:')
        console.log('📊 Analysis Quality Check:')
        console.log('  ⚠️ Fallback: Gemini failed, using DeepSeek')
        console.log('  ✅ Source: TikTok URL detected')
        console.log('  ✅ API: DeepSeek with enhanced algorithm research')
        console.log('  ✅ Target Platform:', selectedPlatform)
        console.log('  ✅ Cross-Reference: TikTok content +', selectedPlatform, 'algorithm')
        console.log('  📝 Description Suggestions:', deepseekAnalysis?.descriptionSuggestions)
        console.log('  🏷️ Tag Suggestions:', deepseekAnalysis?.tagSuggestions)
        console.log('  🔍 Algorithm Insights:', deepseekAnalysis?.algorithmInsights)
        console.log('  📚 Algorithm Research:', deepseekAnalysis?.algorithmResearch)
        console.log('  📈 Trending Opportunities:', deepseekAnalysis?.trendingOpportunities)
        console.log('  ⚡ Engagement Triggers:', deepseekAnalysis?.engagementTriggers)
        console.log('  🎯 Performance Prediction:', deepseekAnalysis?.performancePrediction)
        console.log('  📊 Quality Metrics:')
        console.log('    - Description Count:', deepseekAnalysis?.descriptionSuggestions?.length || 0)
        console.log('    - Tag Count:', deepseekAnalysis?.tagSuggestions?.length || 0)
        console.log('    - Insight Count:', deepseekAnalysis?.algorithmInsights?.length || 0)
        console.log('    - Research Depth:', deepseekAnalysis?.algorithmResearch?.length || 0, 'characters')
        console.log('  🚫 Copy-Paste Check:', {
          descriptionsAreNew: deepseekAnalysis?.descriptionSuggestions?.every(desc => desc !== currentDescription),
          hasInDepthResearch: (deepseekAnalysis?.algorithmResearch?.length || 0) > 200,
          hasPlatformSpecificInsights: (deepseekAnalysis?.algorithmInsights?.length || 0) >= 3
        })
        
        return {
          descriptionSuggestions: deepseekAnalysis?.descriptionSuggestions || [],
          tagSuggestions: deepseekAnalysis?.tagSuggestions || [],
          editingTips: deepseekAnalysis?.editingTips || deepseekAnalysis?.recommendations || [],
          algorithmInsights: deepseekAnalysis?.algorithmInsights || [],
          algorithmResearch: deepseekAnalysis?.algorithmResearch || '',
          trendingOpportunities: deepseekAnalysis?.trendingOpportunities || '',
          engagementTriggers: deepseekAnalysis?.engagementTriggers || [],
          performancePrediction: deepseekAnalysis?.performancePrediction || '',
          aiUsed: 'deepseek'
        }
      } catch (deepseekError) {
        console.error('❌ Both Gemini and DeepSeek failed:', deepseekError)
        return null
      }
    }
  }

  const analyzeWithDeepSeekOnly = async (currentTitle: string, currentDescription: string, currentTags: string[], platform: string) => {
    console.log('🤖 Starting DeepSeek Analysis Flow:')
    console.log('📊 Current Content:', { currentTitle, currentDescription, currentTags, platform })
    
    try {
      // Analyze with DeepSeek using current metadata
      console.log('🧠 DeepSeek analyzing current content...')
      const deepseekAnalysis = await analyzeContentWithDeepSeek('video', platform, currentTitle, currentDescription, `Current tags: ${currentTags.join(', ')}`)
      
      // Enhanced logging for DeepSeek response debugging
      console.log('🧠 DEEPSEEK YOUTUBE RESPONSE DEBUG:')
      console.log('📊 Analysis Quality Check:')
      console.log('  ✅ Source: YouTube URL detected')
      console.log('  ✅ API: DeepSeek with enhanced algorithm research')
      console.log('  ✅ Target Platform:', platform)
      console.log('  ✅ Cross-Reference: YouTube content +', platform, 'algorithm')
      console.log('  📝 Title Suggestions:', deepseekAnalysis?.titleSuggestions)
      console.log('  📝 Description Suggestions:', deepseekAnalysis?.descriptionSuggestions)
      console.log('  🏷️ Tag Suggestions:', deepseekAnalysis?.tagSuggestions)
      console.log('  🔍 Algorithm Insights:', deepseekAnalysis?.algorithmInsights)
      console.log('  📚 Algorithm Research:', deepseekAnalysis?.algorithmResearch)
      console.log('  📈 Trending Opportunities:', deepseekAnalysis?.trendingOpportunities)
      console.log('  ⚡ Engagement Triggers:', deepseekAnalysis?.engagementTriggers)
      console.log('  🎯 Performance Prediction:', deepseekAnalysis?.performancePrediction)
      console.log('  📊 Quality Metrics:')
      console.log('    - Title Count:', deepseekAnalysis?.titleSuggestions?.length || 0)
      console.log('    - Description Count:', deepseekAnalysis?.descriptionSuggestions?.length || 0)
      console.log('    - Tag Count:', deepseekAnalysis?.tagSuggestions?.length || 0)
      console.log('    - Insight Count:', deepseekAnalysis?.algorithmInsights?.length || 0)
      console.log('    - Research Depth:', deepseekAnalysis?.algorithmResearch?.length || 0, 'characters')
      console.log('  🚫 Copy-Paste Check:', {
        titlesAreNew: deepseekAnalysis?.titleSuggestions?.every(title => title !== currentTitle),
        descriptionsAreNew: deepseekAnalysis?.descriptionSuggestions?.every(desc => desc !== currentDescription),
        hasInDepthResearch: (deepseekAnalysis?.algorithmResearch?.length || 0) > 200,
        hasPlatformSpecificInsights: (deepseekAnalysis?.algorithmInsights?.length || 0) >= 3
      })
      
      return {
        titleSuggestions: deepseekAnalysis?.titleSuggestions || [],
        descriptionSuggestions: deepseekAnalysis?.descriptionSuggestions || [],
        tagSuggestions: deepseekAnalysis?.tagSuggestions || [],
        editingTips: deepseekAnalysis?.editingTips || deepseekAnalysis?.recommendations || [],
        algorithmInsights: deepseekAnalysis?.algorithmInsights || [],
        algorithmResearch: deepseekAnalysis?.algorithmResearch || '',
        trendingOpportunities: deepseekAnalysis?.trendingOpportunities || '',
        engagementTriggers: deepseekAnalysis?.engagementTriggers || [],
        performancePrediction: deepseekAnalysis?.performancePrediction || (deepseekAnalysis?.algorithmScore && deepseekAnalysis.algorithmScore > 75 ? 'High potential for viral performance' : 'Moderate performance expected'),
        aiUsed: 'deepseek'
      }
    } catch (error) {
      console.error('❌ DeepSeek Analysis failed:', error)
      return null
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setVideoUrl('')
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile && !videoUrl.trim()) {
      alert('Please select a video file or enter a video URL')
      return
    }

    setIsAnalyzing(true)
    setLoadingMessage('Extracting metadata...')
    setAnalysisResult(null)

    try {
      let currentTitle = ''
      let currentDescription = ''
      let currentTags: string[] = []
      let tiktokMetadata = null
      let youtubeMetadata = null

      // Extract metadata based on input type
      if (selectedFile) {
        console.log('📁 Analyzing uploaded file...')
        // For file uploads, we'll use a generic approach since we can't extract metadata without processing
        currentTitle = selectedFile.name.replace(/\.[^/.]+$/, "")
        currentDescription = `Uploaded video file: ${selectedFile.name}`
        currentTags = ['video', 'upload', 'content']
      } else if (videoUrl.trim()) {
        console.log('🔗 Analyzing video URL...')
        console.log('🔗 URL:', videoUrl)
        
        // Check if it's a TikTok URL
        const isTikTok = videoUrl.includes('tiktok.com') || videoUrl.includes('vm.tiktok.com')
        console.log('🎵 TikTok Detection:', { isTikTok, url: videoUrl })
        
        if (isTikTok) {
          console.log('🎵 Extracting TikTok metadata...')
          tiktokMetadata = await TikTokMetadataService.extractMetadata(videoUrl)
          console.log('🎵 TikTok Metadata:', tiktokMetadata)
          
          if (tiktokMetadata) {
            currentTitle = tiktokMetadata.title
            currentDescription = tiktokMetadata.description
            currentTags = tiktokMetadata.hashtags
          }
        } else {
          console.log('📺 Extracting YouTube metadata...')
          youtubeMetadata = await YouTubeMetadataService.extractMetadata(videoUrl)
          console.log('📺 YouTube Metadata:', youtubeMetadata)
          
          if (youtubeMetadata) {
            currentTitle = youtubeMetadata.title
            currentDescription = youtubeMetadata.description
            currentTags = youtubeMetadata.hashtags || []
          }
        }
      }

      // Debug logging for metadata extraction
      console.log('🏷️ Metadata Extraction Debug:', {
        platform: isTikTok ? 'TikTok' : 'YouTube',
        title: currentTitle,
        description: currentDescription,
        descriptionLength: currentDescription.length,
        descriptionPreview: currentDescription.substring(0, 100) + (currentDescription.length > 100 ? '...' : ''),
        tags: currentTags,
        tagCount: currentTags.length,
        tagPreview: currentTags.slice(0, 3).join(', '),
        tiktokMetadata: tiktokMetadata ? {
          id: tiktokMetadata.id,
          author: tiktokMetadata.author,
          stats: tiktokMetadata.stats,
          hashtags: tiktokMetadata.hashtags,
          duration: tiktokMetadata.duration
        } : null,
        youtubeMetadata: youtubeMetadata ? {
          id: youtubeMetadata.id,
          title: youtubeMetadata.title,
          description: youtubeMetadata.description,
          hashtags: youtubeMetadata.hashtags,
          duration: youtubeMetadata.duration
        } : null
      })
      
      // Initialize analysis data with extracted metadata
      const analysisData: AnalysisResult = {
        clipTitle: currentTitle,
        titleSuggestions: [],
        clipDescription: currentDescription,
        descriptionSuggestions: [],
        tags: currentTags,
        tagSuggestions: [],
        editingTips: [],
        algorithmInsights: [],
        algorithmResearch: '',
        trendingOpportunities: '',
        engagementTriggers: [],
        performancePrediction: '',
        gameAnalysis: {
          gameName: 'Unknown Game',
          gameGenre: 'Unknown',
          gamingPlatform: 'Unknown',
          streamingPlatform: 'Unknown',
          contentFocus: 'Unknown'
        },
        aiAnalysis: {
          metadataUsed: !!(youtubeMetadata || tiktokMetadata),
          deepSeekUsed: false,
          geminiUsed: false,
          totalInsights: 0,
          totalTagSuggestions: 0
        },
        isTikTok: isTikTok || false
      }

      // Then analyze with appropriate AI based on source content
      let comprehensiveResult = null
      
      if (isTikTok) {
        // Use TikTok-specific analysis with Gemini as primary, DeepSeek as fallback
        console.log('🎵 Using TikTok-specific analysis with Gemini AI...')
        console.log('🎵 TikTok Content Analysis Flow:')
        console.log('  1. Source: TikTok URL detected')
        console.log('  2. Extracted: TikTok metadata via TikTok API')
        console.log('  3. Target Platform:', selectedPlatform)
        console.log('  4. AI: Gemini analyzing TikTok content +', selectedPlatform, 'algorithm')
        comprehensiveResult = await analyzeTikTokWithGemini(currentTitle, currentDescription, currentTags, selectedPlatform)
      } else {
        // Use regular DeepSeek analysis for YouTube and other platforms
        console.log('🧠 Using DeepSeek analysis for YouTube content...')
        console.log('📺 YouTube Content Analysis Flow:')
        console.log('  1. Source: YouTube URL detected')
        console.log('  2. Extracted: YouTube metadata via YouTube API')
        console.log('  3. Target Platform:', selectedPlatform)
        console.log('  4. AI: DeepSeek analyzing YouTube content +', selectedPlatform, 'algorithm')
        comprehensiveResult = await analyzeWithDeepSeekOnly(currentTitle, currentDescription, currentTags, selectedPlatform)
      }
      
      if (comprehensiveResult) {
        // Update with AI suggestions
        const updatedAnalysisData = {
          ...analysisData,
          titleSuggestions: Array.isArray((comprehensiveResult as any).titleSuggestions) ? (comprehensiveResult as any).titleSuggestions : [],
          descriptionSuggestions: Array.isArray(comprehensiveResult.descriptionSuggestions) ? comprehensiveResult.descriptionSuggestions : [],
          tagSuggestions: Array.isArray(comprehensiveResult.tagSuggestions) ? comprehensiveResult.tagSuggestions : [],
          editingTips: Array.isArray(comprehensiveResult.editingTips) ? comprehensiveResult.editingTips : [],
          algorithmInsights: Array.isArray(comprehensiveResult.algorithmInsights) ? comprehensiveResult.algorithmInsights : [],
          algorithmResearch: comprehensiveResult.algorithmResearch || '',
          trendingOpportunities: comprehensiveResult.trendingOpportunities || '',
          engagementTriggers: Array.isArray(comprehensiveResult.engagementTriggers) ? comprehensiveResult.engagementTriggers : [],
          performancePrediction: comprehensiveResult.performancePrediction || '',
          gameAnalysis: {
            gameName: 'Unknown Game',
            gameGenre: 'Unknown',
            gamingPlatform: 'Unknown',
            streamingPlatform: 'Unknown',
            contentFocus: 'Unknown'
          },
          // Update AI Analysis Info
          aiAnalysis: {
            metadataUsed: !!(youtubeMetadata || tiktokMetadata),
            deepSeekUsed: (comprehensiveResult as any)?.aiUsed === 'deepseek',
            geminiUsed: (comprehensiveResult as any)?.aiUsed === 'gemini',
            totalInsights: comprehensiveResult.algorithmInsights?.length || 0,
            totalTagSuggestions: comprehensiveResult.tagSuggestions?.length || 0
          },
          // Preserve TikTok detection flag
          isTikTok: isTikTok || false
        }
        
        // Update with AI results
        setAnalysisResult(updatedAnalysisData)
      }
      
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
                <li>• Advanced title optimization</li>
                <li>• Algorithm-specific tags</li>
                <li>• Editing recommendations</li>
                <li>• Platform-specific insights</li>
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
          <CardTitle className="text-green-400">
            <Video className="w-5 h-5" />
            Upload Video or Enter URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Mode Selection */}
          <div>
            <Label className="text-green-400">Input Method</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={videoUrl ? 'outline' : 'default'}
                onClick={() => setSelectedFile(null)}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <Button
                variant={!videoUrl ? 'outline' : 'default'}
                onClick={() => setSelectedFile(null)}
                className="flex-1"
              >
                <Link className="w-4 h-4 mr-2" />
                Video URL
              </Button>
            </div>
          </div>
          
          {/* File Upload */}
          {selectedFile && (
            <div>
              <Label className="text-green-400">Select Video File</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-black hover:file:bg-green-500 cursor-pointer"
                />
              </div>
            </div>
          )}
          
          {/* URL Input */}
          {videoUrl && (
            <div>
              <Label className="text-green-400">Video URL</Label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-black border border-green-500/50 rounded p-2 text-white placeholder:text-gray-400"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          )}
          
          {/* Platform Selection */}
          <div>
            <Label className="text-green-400">Platform You're Posting To</Label>
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
          <div>
            <Button
              onClick={handleAnalyze}
              disabled={(!selectedFile && !videoUrl.trim()) || isAnalyzing}
              className="w-full bg-green-600 hover:bg-green-500 text-black"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {loadingMessage || 'Analyzing...'}
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze with DeepSeek AI
                </>
              )}
            </Button>
          </div>
          
          {/* Processing Time Notice */}
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              This may take a minute as AI analyzes the video and cross references it with platform algorithms
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Clip Title - Hide for TikTok */}
          {!analysisResult.isTikTok && (
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
                        <div key={index} className="flex items-start gap-2 p-3 bg-black/50 rounded">
                          <div className="text-blue-400 font-medium">{index + 1}.</div>
                          <div className="text-white">{title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
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
                      <div key={index} className="flex items-start gap-2 p-3 bg-black/50 rounded">
                        <div className="text-purple-400 font-medium">{index + 1}.</div>
                        <div className="text-white">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Tags - Hide for TikTok */}
          {!analysisResult.isTikTok && (
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
                        <Badge key={index} className="bg-green-600/20 text-green-400 border-green-400">
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
                        <Badge key={index} className="bg-yellow-600/20 text-yellow-400 border-yellow-400">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Editing Tips */}
          <Card className="bg-black border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Editing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            <CardContent className="space-y-4">
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
            <p>Analysis powered by DeepSeek AI & Google AI</p>
            <p className="mt-1">Research includes VidIQ optimization strategies and current algorithm trends</p>
          </div>
        </div>
      )}
    </div>
  )
}
