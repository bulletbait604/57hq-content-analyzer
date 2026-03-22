'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, TrendingUp, Hash, Video, User } from 'lucide-react'

interface PlatformData {
  platform: string
  title: string
  tags: string[]
  description: string
}

export function ContentAnalyzer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [analyzedContent, setAnalyzedContent] = useState<PlatformData[]>([])
  const [username, setUsername] = useState('')

  const mockData: PlatformData[] = [
    {
      platform: 'YouTube',
      title: 'This AK-47 Build is BROKEN in Black Ops Royale 🏆',
      tags: ['Black Ops Royale', 'Avalon Map', 'Best AK47 Build 2026', 'Solo Clutch'],
      description: 'High-quality face cam, clear audio, "Adrenaline" moments with 1v3 solo win'
    },
    {
      platform: 'TikTok',
      title: 'How to win your first Black Ops Royale Solo 🥇',
      tags: ['Black Ops Royale', 'Solo Win', 'Gaming Tips', 'FPS'],
      description: 'Pattern interrupt changes every 3 seconds, high-contrast keyword text'
    },
    {
      platform: 'Instagram',
      title: 'Tag a friend who would\'ve choked this.',
      tags: ['Gaming', 'FPS', 'Black Ops', 'Clutch Moment'],
      description: 'Optimized for Share-to-DM metric, no watermarks, high quality'
    }
  ]

  const handleAnalyze = () => {
    let filtered = mockData

    // Filter by platform if selected
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(item => 
        item.platform.toLowerCase() === selectedPlatform.toLowerCase()
      )
    }

    // Filter by search query if provided
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setAnalyzedContent(filtered)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="h-5 w-5 text-cyan-400" />
            Content Search & Analysis
          </CardTitle>
          <CardDescription className="text-cyan-300">
            Search and analyze your content across all platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Your Username/Channel</label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or channel name..."
                  className="flex-1 px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-700"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, tags, descriptions..."
                className="flex-1 px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-700"
              />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="all">All Platforms</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
              </select>
              <button
                onClick={handleAnalyze}
                className="px-4 py-2 bg-cyan-500 text-black rounded-md hover:bg-cyan-400 transition-colors font-semibold"
                style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
              >
                Analyze
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {analyzedContent.length > 0 && (
        <div className="grid gap-4">
          {analyzedContent.map((content, index) => (
            <Card key={index} className="bg-black border border-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Video className="h-5 w-5 text-cyan-400" />
                  {content.platform}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-cyan-400 mb-1">Title</h4>
                  <p className="text-sm text-white">{content.title}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-cyan-400 mb-1 flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-cyan-900 text-cyan-300 border border-cyan-600 text-xs rounded-full font-mono"
                        style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-cyan-400 mb-1">Description</h4>
                  <p className="text-sm text-cyan-300">{content.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {username && (
        <Card className="bg-black border border-cyan-500">
          <CardContent className="pt-6">
            <div className="text-center text-cyan-400">
              <p className="text-sm">
                Analyzing content for: <span className="font-bold text-white">{username}</span>
              </p>
              <p className="text-xs mt-2 text-cyan-300">
                Tip: Use your actual username to get personalized recommendations
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
