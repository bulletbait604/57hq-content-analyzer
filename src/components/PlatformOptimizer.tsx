'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Zap, Target, Users } from 'lucide-react'

interface PlatformConfig {
  platform: string
  algorithm: string[]
  bestPractices: string[]
  technicalSpecs: string[]
}

export function PlatformOptimizer() {
  const [selectedPlatform, setSelectedPlatform] = useState('youtube')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')

  const platformConfigs: Record<string, PlatformConfig> = {
    youtube: {
      platform: 'YouTube Shorts',
      algorithm: [
        'Session Contribution',
        'Completion Rate',
        'Seamless loops',
        'Interactive elements (polls)'
      ],
      bestPractices: [
        'Start mid-action (no dead air)',
        'Use dynamic text overlays',
        'Link to long-form content',
        'Optimize for search intent'
      ],
      technicalSpecs: [
        'High-bitrate 1080p export',
        'No external watermarks',
        'Audio ducking (-15% game vol)',
        'Vertical 9:16 format'
      ]
    },
    tiktok: {
      platform: 'TikTok',
      algorithm: [
        'Search Engine behavior',
        'Pattern Interrupts (every 3 seconds)',
        'High-contrast keyword text',
        'First caption line for SEO'
      ],
      bestPractices: [
        'Changes every 3 seconds',
        'High-contrast text overlays',
        'First line matches search intent',
        'No watermarks'
      ],
      technicalSpecs: [
        'Vertical 9:16 format',
        'High-quality audio',
        'Fast cuts and transitions',
        'Trending sounds/music'
      ]
    },
    instagram: {
      platform: 'Instagram Reels',
      algorithm: [
        'Sends Per Reach (DMs)',
        'Share-to-DM metric',
        'Original content priority',
        'Engagement rate'
      ],
      bestPractices: [
        'Tag friends for engagement',
        'No watermarks',
        'Highest quality upload',
        'ALT text for SEO'
      ],
      technicalSpecs: [
        '"Upload at Highest Quality" ON',
        'ALT text enabled',
        'No external watermarks',
        'Optimized for sharing'
      ]
    }
  }

  const getOptimizationTips = () => {
    const config = platformConfigs[selectedPlatform]
    const tips = []

    if (title.length < 10) {
      tips.push('Title should be more descriptive for better SEO')
    }
    if (tags.split(',').length < 3) {
      tips.push('Add more relevant tags for better discoverability')
    }
    if (description.length < 50) {
      tips.push('Description should be more detailed to provide context')
    }
    if (selectedPlatform === 'youtube' && !title.includes('2026')) {
      tips.push('Add current year to title for timely relevance')
    }
    if (selectedPlatform === 'tiktok' && !title.includes('?') && !title.includes('How to')) {
      tips.push('Consider using question format or "How to" for better search')
    }
    if (selectedPlatform === 'instagram' && !title.toLowerCase().includes('tag')) {
      tips.push('Consider adding engagement prompts like "Tag a friend"')
    }

    return tips
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="h-5 w-5 text-cyan-400" />
            57 HQ Platform-Specific Optimization
          </CardTitle>
          <CardDescription className="text-cyan-300">
            Optimize your content based on 2026 algorithm parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.keys(platformConfigs).map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedPlatform === platform
                    ? 'border-cyan-500 bg-cyan-900'
                    : 'border-cyan-600 bg-black hover:border-cyan-500'
                }`}
              >
                <div className="font-semibold capitalize text-white">
                  {platform}
                </div>
                <div className="text-xs text-cyan-300">
                  {platformConfigs[platform].platform}
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your content title..."
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas..."
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your content description..."
                rows={3}
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-black border border-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-cyan-400" />
              Algorithm Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {platformConfigs[selectedPlatform].algorithm.map((param, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm text-cyan-300">{param}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border border-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-cyan-400" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {platformConfigs[selectedPlatform].bestPractices.map((practice, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                  <span className="text-sm text-cyan-300">{practice}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border border-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-cyan-400" />
              Technical Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {platformConfigs[selectedPlatform].technicalSpecs.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm text-cyan-300">{spec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border border-cyan-500">
          <CardHeader>
            <CardTitle className="text-white">57 HQ Optimization Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getOptimizationTips().length > 0 ? (
                getOptimizationTips().map((tip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                    <span className="text-sm text-cyan-300">{tip}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-cyan-300">Add content to see optimization tips</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
