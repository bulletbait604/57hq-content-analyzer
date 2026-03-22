'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Video, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  Clock, 
  Zap, 
  Target,
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  Music,
  Camera,
  Edit3,
  Sparkles,
  Rocket,
  Star
} from 'lucide-react'

interface ClipAnalysis {
  id: string
  title: string
  platform: string
  thumbnail: string
  url: string
  duration: number
  views: number
  likes: number
  comments: number
  shares: number
  engagement: number
  retention: number
  score: number
}

export function ClipAnalyzerEnhanced() {
  const [clipUrl, setClipUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ClipAnalysis | null>(null)

  const mockAnalysis: ClipAnalysis = {
    id: '1',
    title: 'Amazing Content Creation Tips! 🚀',
    platform: 'TikTok',
    thumbnail: 'https://via.placeholder.com/400x300/000000/ffffff?text=Video+Thumbnail',
    url: 'https://tiktok.com/@user/video/1',
    duration: 15,
    views: 15420,
    likes: 892,
    comments: 124,
    shares: 67,
    engagement: 6.7,
    retention: 78.5,
    score: 82
  }

  const handleAnalyze = async () => {
    if (!clipUrl.trim()) return
    
    setIsAnalyzing(true)
    
    // Simulate API analysis
    setTimeout(() => {
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  const optimizationSuggestions = [
    {
      category: 'Hook & Opening',
      issues: [
        'First 2 seconds don\'t have a strong hook',
        'Opening text could be more attention-grabbing'
      ],
      suggestions: [
        'Start with a question or bold statement',
        'Use high-contrast text in first 3 seconds',
        'Add a pattern interrupt within 2 seconds'
      ],
      impact: 'High',
      icon: Zap
    },
    {
      category: 'Content Structure',
      issues: [
        'Content could benefit from more pattern interrupts',
        'Visual variety could be improved'
      ],
      suggestions: [
        'Change camera angles every 3-4 seconds',
        'Add text overlays at key moments',
        'Use quick cuts between different scenes'
      ],
      impact: 'Medium',
      icon: Edit3
    },
    {
      category: 'Engagement',
      issues: [
        'Call-to-action could be stronger',
        'Could encourage more comments'
      ],
      suggestions: [
        'Add a specific question in the caption',
        'Include a "share this with a friend" prompt',
        'Use trending audio with your unique spin'
      ],
      impact: 'Medium',
      icon: Users
    },
    {
      category: 'Technical Quality',
      issues: [
        'Audio levels could be balanced better',
        'Lighting could be improved'
      ],
      suggestions: [
        'Normalize audio levels across the video',
        'Use better lighting or color correction',
        'Ensure high-resolution upload'
      ],
      impact: 'Low',
      icon: Camera
    }
  ]

  const algorithmOptimizations = {
    tiktok: [
      'Add pattern interrupt every 3 seconds',
      'Put main keywords in first caption line',
      'Use high-contrast, readable text',
      'Include trending audio with unique twist'
    ],
    instagram: [
      'Create shareable content that sparks DMs',
      'Remove all watermarks from other platforms',
      'Use high-quality video without compression',
      'Add clear call-to-action for sharing'
    ],
    youtube: [
      'Create seamless loops for re-watching',
      'Include 2026 in title for SEO',
      'Add searchable terms in description',
      'Make content that contributes to watch time'
    ]
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Clip Analysis</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Get in-depth analysis and specific optimization suggestions for your content
        </p>
      </div>

      {/* Input Section */}
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="text-cyan-400">Analyze Your Clip</CardTitle>
          <CardDescription className="text-gray-400">
            Enter a video URL to get detailed analysis and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clipUrl" className="text-cyan-300">Video URL</Label>
              <Input
                id="clipUrl"
                placeholder="https://tiktok.com/@user/video/123"
                value={clipUrl}
                onChange={(e) => setClipUrl(e.target.value)}
                className="bg-black border-cyan-500 text-white"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !clipUrl.trim()}
              className="bg-cyan-500 text-black hover:bg-cyan-400"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Clip
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overview */}
          <Card className="bg-black border border-cyan-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-cyan-400">{analysis.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {analysis.platform} • {analysis.duration}s • {analysis.views.toLocaleString()} views
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}/100
                  </div>
                  <div className={`text-sm ${getScoreColor(analysis.score)}`}>
                    {getScoreLabel(analysis.score)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
                    <Eye className="w-4 h-4" />
                    <span className="font-semibold">{analysis.views.toLocaleString()}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Views</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-pink-400 mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="font-semibold">{analysis.likes.toLocaleString()}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Likes</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-semibold">{analysis.comments.toLocaleString()}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Comments</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                    <BarChart3 className="w-4 h-4" />
                    <span className="font-semibold">{analysis.retention}%</span>
                  </div>
                  <div className="text-gray-400 text-sm">Retention</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black border border-cyan-500">
              <TabsTrigger value="suggestions" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">
                <Lightbulb className="w-4 h-4 mr-2" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="algorithm" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">
                <Brain className="w-4 h-4 mr-2" />
                Algorithm Tips
              </TabsTrigger>
              <TabsTrigger value="technical" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">
                <BarChart3 className="w-4 h-4 mr-2" />
                Technical Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="mt-6">
              <div className="space-y-4">
                {optimizationSuggestions.map((category, index) => (
                  <Card key={index} className="bg-black border border-cyan-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-cyan-400 flex items-center gap-2">
                          <category.icon className="w-5 h-5" />
                          {category.category}
                        </CardTitle>
                        <Badge 
                          variant={category.impact === 'High' ? 'default' : 'outline'}
                          className={category.impact === 'High' ? 'bg-red-500 text-white' : 'text-cyan-400 border-cyan-400'}
                        >
                          {category.impact} Impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Issues Found
                          </h4>
                          <ul className="text-gray-400 text-sm space-y-1">
                            {category.issues.map((issue, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Optimization Suggestions
                          </h4>
                          <ul className="text-gray-300 text-sm space-y-2">
                            {category.suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="algorithm" className="mt-6">
              <div className="space-y-6">
                {Object.entries(algorithmOptimizations).map(([platform, tips]) => (
                  <Card key={platform} className="bg-black border border-cyan-500/20">
                    <CardHeader>
                      <CardTitle className="text-cyan-400 capitalize">
                        {platform} Algorithm Optimization
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-gray-300 space-y-3">
                        {tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Rocket className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm">{tip}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="technical" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Engagement Rate</span>
                        <span className="text-cyan-300 font-semibold">{analysis.engagement}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">View Retention</span>
                        <span className="text-cyan-300 font-semibold">{analysis.retention}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Likes per 1k Views</span>
                        <span className="text-cyan-300 font-semibold">
                          {((analysis.likes / analysis.views) * 1000).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Comments per 1k Views</span>
                        <span className="text-cyan-300 font-semibold">
                          {((analysis.comments / analysis.views) * 1000).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Content Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Video Length</span>
                        <span className="text-cyan-300 font-semibold">{analysis.duration}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Optimal Length</span>
                        <span className="text-green-400 font-semibold">7-15s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Best Time to Post</span>
                        <span className="text-cyan-300 font-semibold">7-9 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Content Type</span>
                        <span className="text-cyan-300 font-semibold">Educational</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
