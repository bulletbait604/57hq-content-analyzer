'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Clock, 
  Eye, 
  Heart, 
  TrendingUp,
  Video,
  Share2,
  MessageSquare,
  BarChart3,
  Zap,
  Target,
  Users,
  DollarSign,
  Crown
} from 'lucide-react'

interface YouTubeInfo {
  type: 'shorts' | 'long'
}

export function YouTubeInfo({ type }: YouTubeInfo) {
  const [lastUpdate, setLastUpdate] = useState('2024-03-23 10:00:00')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLastUpdate(new Date().toLocaleString())
    setIsRefreshing(false)
  }

  // YouTube Shorts-specific algorithm factors
  const shortsFactors = [
    'First 3 seconds critical for retention',
    'Hook in first 1 second with strong visual',
    'Trending audio usage drives discovery',
    'Fast-paced editing increases completion rate',
    'Vertical format optimized for mobile',
    'Loop potential encourages re-watches',
    'Text overlays for silent viewing',
    'Consistent posting (3-5 Shorts daily)',
    'Quick engagement in first hour drives algorithm',
    'Short-form watch session contribution',
    'Sound synchronization accuracy'
  ]

  const shortsTips = [
    'Use trending sounds from YouTube library',
    'Keep Shorts under 30 seconds (15-25 ideal)',
    'Add captions for accessibility',
    'Post during peak hours (6-9 PM)',
    'Use hashtags #shorts #viral #trending',
    'Create series to encourage follows',
    'Engage with comments in first hour',
    'Optimize for mobile viewing experience',
    'Test different aspect ratios (9:16 vs 16:9)',
    'Use jump cuts and quick transitions'
  ]

  // YouTube Long-form specific algorithm factors
  const longFormFactors = [
    'Watch time retention (first 30 seconds critical)',
    'Session watch time contribution',
    'Click-through rate from thumbnails',
    'Video completion rate (70%+ ideal)',
    'Audience retention curves',
    'Keyword optimization in titles/descriptions',
    'Video upload consistency and timing',
    'Engagement velocity (first 24 hours)',
    'Deep content value and expertise',
    'Long-form subscriber growth impact',
    'Algorithm preference for 8+ minute content',
    'End screen engagement optimization'
  ]

  const longFormTips = [
    'Create compelling thumbnails with high contrast',
    'Hook viewers in first 15 seconds',
    'Use end screens to promote other content',
    'Post during peak audience hours',
    'Include relevant keywords in first 2 lines',
    'Aim for 8+ minute videos for monetization',
    'Build series for subscriber retention',
    'Use timestamps for navigation',
    'Create multiple content pillars',
    'Focus on evergreen topics for long-term growth',
    'Optimize for search vs suggested content'
  ]

  const factors = type === 'shorts' ? shortsFactors : longFormFactors
  const tips = type === 'shorts' ? shortsTips : longFormTips
  const title = type === 'shorts' ? 'YouTube Shorts Algorithm' : 'YouTube Long-Form Algorithm'
  const icon = type === 'shorts' ? '⚡' : '📹'
  const color = type === 'shorts' ? 'border-orange-500' : 'border-red-500'
  const bgColor = type === 'shorts' ? 'bg-orange-500/10' : 'bg-red-500/10'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-2 flex items-center gap-2">
            <span>{icon}</span>
            {title}
          </h2>
          <p className="text-gray-300">
            Latest algorithm insights and optimization strategies for {type === 'shorts' ? 'short-form content' : 'long-form videos'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdate}
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-green-600 hover:bg-green-500 text-white"
          >
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent border-r-transparent animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Refresh Data
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Algorithm Factors */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Key Algorithm Factors
          </CardTitle>
          <CardDescription className="text-gray-400">
            Critical ranking factors that {type === 'shorts' ? 'Shorts' : 'long-form'} algorithm prioritizes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {factors.map((factor, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-black/50 rounded-lg">
                <Target className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium text-sm">{factor}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Tips */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Optimization Strategies
          </CardTitle>
          <CardDescription className="text-gray-400">
            Proven strategies to maximize {type === 'shorts' ? 'Shorts' : 'long-form'} performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-black/50 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium text-sm">{tip}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {type === 'shorts' ? 'Discovery Rate' : 'Watch Time'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {type === 'shorts' ? '67%' : '4:32'}
            </div>
            <div className="text-sm text-gray-400">
              {type === 'shorts' ? 'above average' : '12 min avg'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {type === 'shorts' ? '8.2%' : '5.1%'}
            </div>
            <div className="text-sm text-gray-400">
              {type === 'shorts' ? 'excellent' : 'good'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {type === 'shorts' ? 'Follower Growth' : 'Subscriber Growth'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {type === 'shorts' ? '+2.4K' : '+847'}
            </div>
            <div className="text-sm text-gray-400">
              {type === 'shorts' ? 'this week' : 'this month'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Strategy */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Video className="w-5 h-5" />
            Recommended Content Strategy
          </CardTitle>
          <CardDescription className="text-gray-400">
            Optimal content mix for {type === 'shorts' ? 'Shorts growth' : 'long-form authority'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
              <div>
                <div className="text-white font-medium">{type === 'shorts' ? 'Daily Shorts' : 'Weekly Long-Form'}</div>
                <div className="text-sm text-gray-400">
                  {type === 'shorts' ? '3-5 Shorts per day' : '1-2 long videos per week'}
                </div>
              </div>
              <Badge className="bg-green-600/20 text-green-400 border-green-500">
                {type === 'shorts' ? 'High Volume' : 'Quality Focus'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
              <div>
                <div className="text-white font-medium">{type === 'shorts' ? 'Trending Audio' : 'Evergreen Topics'}</div>
                <div className="text-sm text-gray-400">
                  {type === 'shorts' ? 'Use trending sounds weekly' : 'Focus on pillar content'}
                </div>
              </div>
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500">
                {type === 'shorts' ? 'Discovery Boost' : 'Authority Building'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
              <div>
                <div className="text-white font-medium">{type === 'shorts' ? 'Quick Engagement' : 'Deep Value'}</div>
                <div className="text-sm text-gray-400">
                  {type === 'shorts' ? 'Reply in first hour' : '10+ minute videos'}
                </div>
              </div>
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500">
                {type === 'shorts' ? 'Viral Potential' : 'Expert Positioning'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
