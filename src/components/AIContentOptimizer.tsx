'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Loader2, Copy, CheckCircle, TrendingUp, Target, Zap } from 'lucide-react'
import { analyzeContentWithDeepSeek } from '@/lib/deepseek'

export function AIContentOptimizer() {
  const [contentType, setContentType] = useState('title')
  const [platform, setPlatform] = useState('youtube')
  const [inputTitle, setInputTitle] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [useAI, setUseAI] = useState(true)

  const analyzeContent = async () => {
    if (!inputTitle.trim()) return

    setIsLoading(true)
    try {
      const result = await analyzeContentWithDeepSeek(
        contentType,
        platform,
        inputTitle,
        inputDescription,
        additionalContext
      )
      setAnalysis(result)
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysis(generateBasicOptimization())
    } finally {
      setIsLoading(false)
    }
  }

  const generateBasicOptimization = () => {
    const basicTags = ['gaming', '2026', 'trending', 'viral', 'fps']
    const optimizedTitle = inputTitle.includes('2026') ? inputTitle : `${inputTitle} (2026)`
    
    return {
      tags: basicTags,
      title: optimizedTitle,
      description: inputDescription || `Amazing ${contentType} content optimized for ${platform}`,
      insights: ['Basic optimization applied'],
      algorithmScore: 65,
      recommendations: ['Enable AI for advanced analysis']
    }
  }

  const analyzeContentWithAI = async (
    contentType: string,
    platform: string,
    title: string,
    description: string,
    additionalContext: string
  ) => {
    // Mock AI function - replace with actual OpenAI integration
    const aiTags = [
      `${platform.toLowerCase()}`,
      'gaming',
      '2026',
      'trending',
      'viral',
      'fps',
      'gameplay',
      'tips',
      'tutorial',
      'shorts',
      'content',
      'creator',
      'highlights'
    ].filter(tag => 
      title.toLowerCase().includes(tag.toLowerCase()) || 
      contentType.toLowerCase().includes('gaming')
    )

    const score = Math.min(95, 65 + Math.floor(Math.random() * 30))

    return {
      tags: aiTags.slice(0, platform === 'tiktok' ? 5 : platform === 'youtube' ? 10 : 15),
      title: title.includes('2026') ? title : `${title} (2026)`,
      description: description || `AI-optimized ${contentType} content for ${platform} with enhanced SEO and engagement strategies`,
      insights: [
        `Content optimized for ${platform} algorithm`,
        'Strong keyword integration detected',
        'Engagement hooks identified',
        'SEO score: Excellent'
      ],
      algorithmScore: score,
      recommendations: [
        'Add trending hashtags',
        'Include call-to-action',
        'Optimize posting time',
        'Use platform-specific features'
      ]
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-lime-400'
    if (score >= 60) return 'text-cyan-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5 text-cyan-400" />
            57 HQ AI Content Optimizer
          </CardTitle>
          <CardDescription className="text-cyan-300">
            Advanced AI-powered content analysis and optimization based on 2026 algorithms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-black border border-cyan-600 rounded-lg">
            <Brain className="h-5 w-5 text-cyan-400" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="w-4 h-4 text-cyan-600 bg-black border border-cyan-500 rounded focus:ring-cyan-400"
              />
              <span className="text-white font-medium">Enable DeepSeek Analysis</span>
            </label>
            <span className="text-xs text-cyan-300">
              {useAI ? 'DeepSeek AI-powered analysis' : 'Basic optimization'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="title">Title Optimization</option>
                <option value="description">Description Enhancement</option>
                <option value="tags">Tag Strategy</option>
                <option value="full">Full Content Analysis</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="youtube">YouTube Shorts</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram Reels</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Current Title</label>
              <input
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="Enter your current title..."
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Current Description</label>
              <textarea
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
                placeholder="Enter your current description..."
                rows={3}
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Additional Context (Optional)</label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Target audience, content goals, specific features..."
                rows={2}
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-700"
              />
            </div>

            <button
              onClick={analyzeContent}
              disabled={isLoading || !inputTitle.trim()}
              className="w-full px-4 py-2 bg-cyan-500 text-black rounded-md hover:bg-cyan-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
            >
              {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {useAI ? 'DeepSeek Analyzing...' : 'Optimizing...'}
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    {useAI ? 'DeepSeek Analysis' : 'Basic Optimization'}
                  </>
                )}
            </button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-4">
          <Card className="bg-black border border-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Algorithm Score
                  {useAI && (
                    <span className="px-2 py-1 bg-lime-500 text-black text-xs rounded-full">DeepSeek-Powered</span>
                  )}
                </span>
                <span className={`text-2xl font-bold ${getScoreColor(analysis.algorithmScore)}`}>
                  {analysis.algorithmScore}/100
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-lime-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.algorithmScore}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-black border border-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5 text-cyan-400" />
                  Optimized Title
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-white p-3 bg-black border border-cyan-600 rounded-lg">
                    {analysis.title}
                  </p>
                  <button
                    onClick={() => copyToClipboard(analysis.title)}
                    className="flex items-center gap-2 px-3 py-1 bg-cyan-500 text-black text-sm rounded hover:bg-cyan-400 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Title
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border border-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-cyan-400" />
                  Optimized Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {analysis.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-cyan-900 text-cyan-300 border border-cyan-600 text-xs rounded-full font-mono"
                        style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => copyToClipboard(analysis.tags.join(', '))}
                    className="flex items-center gap-2 px-3 py-1 bg-cyan-500 text-black text-sm rounded hover:bg-cyan-400 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Tags
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border border-cyan-500">
              <CardHeader>
                <CardTitle className="text-white">Enhanced Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-cyan-300 p-3 bg-black border border-cyan-600 rounded-lg">
                    {analysis.description}
                  </p>
                  <button
                    onClick={() => copyToClipboard(analysis.description)}
                    className="flex items-center gap-2 px-3 py-1 bg-cyan-500 text-black text-sm rounded hover:bg-cyan-400 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Description
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black border border-cyan-500">
            <CardHeader>
              <CardTitle className="text-white">AI Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-3">Algorithm Insights</h4>
                  <ul className="space-y-2 text-sm text-cyan-300">
                    {analysis.insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-cyan-500 mt-1">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-3">Recommendations</h4>
                  <ul className="space-y-2 text-sm text-cyan-300">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-lime-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
