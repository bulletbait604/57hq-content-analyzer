'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Target, Zap, TrendingUp, Award, AlertCircle, CheckCircle } from 'lucide-react'

interface TipCategory {
  title: string
  icon: React.ReactNode
  tips: string[]
  priority: 'high' | 'medium' | 'low'
}

export function ImprovementTips() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [contentType, setContentType] = useState('fps')

  const tipCategories: Record<string, TipCategory[]> = {
    fps: [
      {
        title: 'Retention Optimization',
        icon: <Target className="h-5 w-5 text-cyan-400" />,
        priority: 'high',
        tips: [
          'Add neon progress bars during downtime (armor plating, reloading)',
          'Start clips mid-action - remove all dead air',
          'Use dynamic text overlays instead of static bars',
          'Implement pattern interrupts every 3 seconds for TikTok',
          'Add countdown timers for suspenseful moments'
        ]
      },
      {
        title: 'Visual Enhancement',
        icon: <Zap className="h-5 w-5 text-cyan-400" />,
        priority: 'high',
        tips: [
          'Use 9:16 vertical split (gameplay top/face cam bottom)',
          'Add high-contrast keyword text for searchability',
          'Implement seamless loops for YouTube Shorts',
          'Use neon elements for visual hooks',
          'Add motion blur during sensitive content'
        ]
      },
      {
        title: 'Audio Optimization',
        icon: <TrendingUp className="h-5 w-5 text-cyan-400" />,
        priority: 'medium',
        tips: [
          'Apply audio ducking (-15% game vol during speech)',
          'Ensure clear voice audio for AI caption accuracy',
          'Use trending sounds/music where appropriate',
          'Balance game audio with commentary',
          'Add audio normalization for consistent levels'
        ]
      },
      {
        title: 'Platform-Specific',
        icon: <Award className="h-5 w-5 text-cyan-400" />,
        priority: 'high',
        tips: [
          'YouTube: Add current year to titles for SEO',
          'TikTok: First caption line must match search intent',
          'Instagram: Use engagement prompts like "Tag a friend"',
          'All platforms: No external watermarks',
          'YouTube: Link Shorts to long-form content',
          'TikTok: Use pattern interrupts every 3 seconds',
          'Instagram: Enable "Upload at Highest Quality"'
        ]
      },
      {
        title: 'Technical Specifications',
        icon: <AlertCircle className="h-5 w-5 text-cyan-400" />,
        priority: 'medium',
        tips: [
          'Export at high-bitrate 1080p',
          'Enable "Upload at Highest Quality" on Instagram',
          'Add ALT text for Google indexing',
          'Use vertical 9:16 format consistently',
          'Test on multiple devices before upload',
          'Check compression settings for each platform'
        ]
      },
      {
        title: 'Growth Strategy',
        icon: <Lightbulb className="h-5 w-5 text-cyan-400" />,
        priority: 'low',
        tips: [
          'Post consistently at optimal times',
          'Engage with comments in first hour',
          'Create series for better retention',
          'Collaborate with other creators',
          'Use platform-specific features like polls',
          'Analyze analytics to optimize posting schedule'
        ]
      }
    ]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900'
      case 'medium': return 'text-cyan-400 bg-cyan-900'
      case 'low': return 'text-lime-400 bg-lime-900'
      default: return 'text-cyan-400 bg-cyan-900'
    }
  }

  const filteredCategories = selectedCategory === 'all'
    ? tipCategories[contentType]
    : tipCategories[contentType].filter(cat => cat.title.toLowerCase().includes(selectedCategory.toLowerCase()))

  return (
    <div className="space-y-6">
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
            57 HQ Improvement Tips
          </CardTitle>
          <CardDescription className="text-cyan-300">
            Actionable tips based on 2026 algorithm analysis and best practices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="flex-1 px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="fps">FPS Gaming</option>
              <option value="general">General Content</option>
              <option value="educational">Educational</option>
              <option value="viral">Viral/Trending</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="all">All Categories</option>
              {tipCategories[contentType].map((cat) => (
                <option key={cat.title} value={cat.title}>{cat.title}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredCategories.map((category, index) => (
          <Card key={index} className="bg-black border border-cyan-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black border border-cyan-600 rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{category.title}</CardTitle>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(category.priority)}`}>
                      {category.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {category.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="flex items-start gap-3 p-3 bg-black border border-cyan-600 rounded-lg">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-cyan-300 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Quick Implementation Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-3 text-lime-400">Before Upload</h4>
              <ul className="space-y-2 text-sm text-cyan-300">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-cyan-500" />
                  <span>Remove dead air from start</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-cyan-500" />
                  <span>Add progress bars for downtime</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-cyan-500" />
                  <span>Apply audio ducking</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-cyan-500" />
                  <span>Check for watermarks</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-cyan-400">Platform Optimization</h4>
              <ul className="space-y-2 text-sm text-cyan-300">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-cyan-500" />
                  <span>YouTube: Add year to title</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-cyan-500" />
                  <span>TikTok: Pattern interrupts</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-cyan-500" />
                  <span>Instagram: Tag friends</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-cyan-500" />
                  <span>ALT text for SEO</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
