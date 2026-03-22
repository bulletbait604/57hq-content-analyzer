'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Target, Zap, Award, AlertCircle, BarChart3, Eye, Clock, Copy } from 'lucide-react'

interface ClipData {
  id: string
  title: string
  platform: string
  retentionScore: number
  issues: string[]
  strengths: string[]
  recommendations: string[]
  optimizedTitle: string
  optimizedTags: string[]
  optimizedDescription: string
}

export function ClipAnalyzer() {
  const [selectedClip, setSelectedClip] = useState<string>('')
  const [selectedPlatform, setSelectedPlatform] = useState('youtube')
  const [analysisType, setAnalysisType] = useState('retention')

  const mockClips: ClipData[] = [
    {
      id: '1',
      title: 'Insane 1v3 Clutch - Avalon Map',
      platform: 'YouTube',
      retentionScore: 85,
      issues: [
        'Dead air at start (0-2 seconds)',
        'Audio levels inconsistent',
        'No pattern interrupt at 15 seconds'
      ],
      strengths: [
        'Excellent opening hook',
        'High-quality face cam',
        'Clear callout of strategy',
        'Good pacing'
      ],
      recommendations: [
        'Remove dead air completely',
        'Add audio normalization',
        'Insert pattern interrupt at 15s',
        'Add progress bar during slow moments'
      ],
      optimizedTitle: '🔥 INSANE 1v3 CLUTCH - Avalon Map (2026) 🔥',
      optimizedTags: ['Black Ops Royale', 'Avalon Map', 'Best AK47 Build 2026', 'Solo Clutch', 'Gaming', 'FPS', 'Viral', 'Shorts'],
      optimizedDescription: 'High-quality face cam, clear audio, "Adrenaline" moments with 1v3 solo win. Perfect for Black Ops Royale content!'
    },
    {
      id: '2',
      title: 'Viral Gaming Montage',
      platform: 'TikTok',
      retentionScore: 92,
      issues: [
        'Some clips too long',
        'Missing trending sound',
        'No clear call-to-action'
      ],
      strengths: [
        'Fast pacing',
        'Good use of trends',
        'High energy throughout',
        'Strong visual hooks'
      ],
      recommendations: [
        'Keep clips under 30 seconds',
        'Add trending audio',
        'Include clear CTA in caption',
        'Use more pattern interrupts'
      ],
      optimizedTitle: '⚡ VIRAL Gaming Montage 2026 ⚡',
      optimizedTags: ['viral', 'gaming', 'montage', 'trending', 'fyp', 'fps', 'highlights', 'gamingontiktok', '2026'],
      optimizedDescription: 'Fast-paced gaming montage with trending sounds and high-energy clips. Perfect for TikTok algorithm!'
    },
    {
      id: '3',
      title: 'Epic Fails Compilation',
      platform: 'Instagram',
      retentionScore: 78,
      issues: [
        'Low engagement in middle section',
        'No share prompts',
        'Watermark visible'
      ],
      strengths: [
        'Strong opening',
        'Good variety of clips',
        'Decent editing quality',
        'Consistent branding'
      ],
      recommendations: [
        'Add "Tag a friend who" prompts',
        'Remove watermarks completely',
        'Add engagement bait in middle',
        'Use Instagram-specific hashtags'
      ],
      optimizedTitle: '😂 EPIC Fails Compilation 2026 😂',
      optimizedTags: ['fails', 'gaming', 'funny', 'epic', 'compilation', 'reels', 'viral', 'gaming', '2026'],
      optimizedDescription: 'Hilarious gaming fails compilation with perfect timing and shareable moments. Tag your friends who would choke!'
    }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-lime-400'
    if (score >= 60) return 'text-cyan-400'
    return 'text-red-400'
  }

  const getFilteredClips = () => {
    let filtered = mockClips

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(clip => 
        clip.platform.toLowerCase() === selectedPlatform.toLowerCase()
      )
    }

    return filtered
  }

  const selectedClipData = mockClips.find(clip => clip.id === selectedClip)

  return (
    <div className="space-y-6">
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            57 HQ Clip Analysis
          </CardTitle>
          <CardDescription className="text-cyan-300">
            Analyze your video clips with algorithm insights and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Select Clip</label>
              <select
                value={selectedClip}
                onChange={(e) => setSelectedClip(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Choose a clip...</option>
                {getFilteredClips().map((clip) => (
                  <option key={clip.id} value={clip.id}>
                    {clip.title} ({clip.platform})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="all">All Platforms</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Analysis Type</label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="retention">Retention Analysis</option>
                <option value="engagement">Engagement Metrics</option>
                <option value="technical">Technical Review</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClipData && (
        <div className="grid gap-6">
          <Card className="bg-black border border-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-cyan-400" />
                  {selectedClipData.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-cyan-300">{selectedClipData.platform}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(selectedClipData.retentionScore)}`}>
                    Score: {selectedClipData.retentionScore}/100
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32 bg-gray-800 rounded-lg">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-400 text-black text-xs font-medium text-center py-1"
                      style={{ height: `${selectedClipData.retentionScore}%` }}
                    >
                      {selectedClipData.retentionScore}% Retention
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Issues Found
                    </h4>
                    <ul className="space-y-2 text-sm text-cyan-300">
                      {selectedClipData.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-2 text-sm text-cyan-300">
                      {selectedClipData.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-lime-400 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-cyan-400" />
                57 HQ Optimizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-3">Optimized Title</h4>
                    <p className="text-white p-3 bg-black border border-cyan-600 rounded-lg">
                      {selectedClipData.optimizedTitle}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedClipData.optimizedTitle)}
                      className="flex items-center gap-2 px-3 py-1 bg-cyan-500 text-black text-sm rounded hover:bg-cyan-400 transition-colors"
                    >
                      <span className="h-4 w-4">📋</span>
                      Copy Title
                    </button>
                  </div>

                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-3">Optimized Tags</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedClipData.optimizedTags.map((tag, index) => (
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
                      onClick={() => navigator.clipboard.writeText(selectedClipData.optimizedTags.join(', '))}
                      className="flex items-center gap-2 px-3 py-1 bg-cyan-500 text-black text-sm rounded hover:bg-cyan-400 transition-colors"
                    >
                      <span className="h-4 w-4">📋</span>
                      Copy Tags
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-cyan-400 mb-3">Optimized Description</h4>
                  <p className="text-cyan-300 p-3 bg-black border border-cyan-600 rounded-lg">
                    {selectedClipData.optimizedDescription}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedClipData.optimizedDescription)}
                    className="flex items-center gap-2 px-3 py-1 bg-cyan-500 text-black text-sm rounded hover:bg-cyan-400 transition-colors"
                  >
                    <span className="h-4 w-4">📋</span>
                    Copy Description
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-cyan-400" />
                SDHQ Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-semibold text-cyan-400 mb-3">Platform-Specific Optimizations</h4>
                <div className="space-y-2 text-sm text-cyan-300">
                  {selectedClipData.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-black border border-cyan-600 rounded-lg">
                      <Clock className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-black border border-cyan-600 rounded-lg">
                  <h4 className="font-semibold text-cyan-400 mb-3">Algorithm Insights</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-cyan-300">
                    <div>
                      <h5 className="font-medium text-white mb-2">YouTube Algorithm</h5>
                      <p>Focus on session contribution and completion rate. Add interactive elements like polls to boost engagement.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">TikTok Algorithm</h5>
                      <p>Pattern interrupts every 3 seconds. Use high-contrast text and trending sounds for maximum reach.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">Instagram Algorithm</h5>
                      <p>Optimize for sends per reach (DMs). Use engagement prompts and remove all watermarks.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
