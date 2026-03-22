'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/simple-badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Clock, 
  Eye, 
  Users, 
  Heart, 
  MessageCircle,
  Share2,
  Zap,
  Target,
  Brain,
  Rocket,
  Star,
  Video,
  Music,
  Camera
} from 'lucide-react'

export function AlgorithmInfo() {
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  const platforms = [
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: Music,
      color: 'bg-black',
      accent: 'text-pink-400',
      borderColor: 'border-pink-500'
    },
    { 
      id: 'instagram', 
      name: 'Instagram Reels', 
      icon: Camera,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      accent: 'text-purple-400',
      borderColor: 'border-purple-500'
    },
    { 
      id: 'youtube', 
      name: 'YouTube Shorts', 
      icon: Video,
      color: 'bg-red-500',
      accent: 'text-red-400',
      borderColor: 'border-red-500'
    }
  ]

  const algorithmData = {
    tiktok: {
      title: 'TikTok Algorithm 2026',
      description: 'TikTok operates as a search engine and prioritizes content that keeps users watching',
      keyFactors: [
        { factor: 'Pattern Interrupts', weight: '30%', description: 'Changes every 3 seconds to maintain attention' },
        { factor: 'Search Intent', weight: '25%', description: 'First caption line must match search terms' },
        { factor: 'Completion Rate', weight: '20%', description: 'Users watching the entire video' },
        { factor: 'Engagement Velocity', weight: '15%', description: 'Quick likes, comments, shares' },
        { factor: 'Audio Trends', weight: '10%', description: 'Using trending sounds and music' }
      ],
      tips: [
        'Change camera angles, text, or scenes every 3 seconds',
        'Put your main keywords in the first line of your caption',
        'Use high-contrast text that\'s easy to read',
        'Start with a strong hook in the first 2 seconds',
        'Use trending audio but add your unique spin'
      ],
      updates: [
        'New emphasis on "searchable content" - think like SEO',
        'Better performance for educational/informative content',
        'Increased weight on original audio and voiceovers',
        'Algorithm favors content that answers specific questions'
      ]
    },
    instagram: {
      title: 'Instagram Reels Algorithm 2026',
      description: 'Instagram prioritizes content that drives DMs and shares, with emphasis on original content',
      keyFactors: [
        { factor: 'Sends Per Reach', weight: '35%', description: 'How many people share via DM' },
        { factor: 'Watch Time', weight: '25%', description: 'Total viewing time and re-watches' },
        { factor: 'Engagement Rate', weight: '20%', description: 'Likes, comments, shares ratio' },
        { factor: 'Originality Score', weight: '15%', description: 'No watermarks, unique content' },
        { factor: 'Upload Quality', weight: '5%', description: 'High resolution, no compression' }
      ],
      tips: [
        'Include a clear call-to-action to "share this with a friend"',
        'Create content that sparks conversation and questions',
        'Use high-quality video without watermarks',
        'Post at peak times when your audience is active',
        'Use relevant hashtags but focus more on engaging content'
      ],
      updates: [
        'Heavy penalty for watermarked content from other platforms',
        'Increased reach for content that generates DM conversations',
        'Better performance for longer-form Reels (15-30 seconds)',
        'Algorithm favors content that keeps users on platform'
      ]
    },
    youtube: {
      title: 'YouTube Shorts Algorithm 2026',
      description: 'YouTube focuses on session contribution and watch time, rewarding content that keeps users on platform',
      keyFactors: [
        { factor: 'Session Contribution', weight: '30%', description: 'How your video contributes to overall watch time' },
        { factor: 'Completion Rate', weight: '25%', description: 'Percentage of video watched' },
        { factor: 'Click-Through Rate', weight: '20%', description: 'How often your thumbnail gets clicked' },
        { factor: 'SEO Optimization', weight: '15%', description: 'Keywords in title, description, tags' },
        { factor: 'Loopability', weight: '10%', description: 'How well your video loops' }
      ],
      tips: [
        'Create seamless loops that encourage re-watching',
        'Use 2026 and current year in titles/descriptions for SEO',
        'Include searchable terms in your content',
        'Make the first 3 seconds compelling for retention',
        'Use interactive elements like polls when available'
      ],
      updates: [
        'Stronger emphasis on "session watch time" contribution',
        'Better performance for content that links to longer videos',
        'Increased importance of SEO and searchable content',
        'Algorithm favors content that creates "viewer sessions"'
      ]
    }
  }

  const getPlatformData = (platformId: string) => {
    return algorithmData[platformId as keyof typeof algorithmData]
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Algorithm Information</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Understand how each platform algorithm works and get platform-specific optimization strategies
        </p>
      </div>

      <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black border border-cyan-500">
          <TabsTrigger value="all" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">
            All Platforms
          </TabsTrigger>
          {platforms.map((platform) => (
            <TabsTrigger 
              key={platform.id} 
              value={platform.id} 
              className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300"
            >
              <platform.icon className="w-4 h-4 mr-2" />
              {platform.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const data = getPlatformData(platform.id)
              return (
                <Card key={platform.id} className="bg-black border border-cyan-500/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platform.color} bg-opacity-20`}>
                        <platform.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`${platform.accent}`}>{data.title}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {data.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-cyan-300 font-medium mb-2">Key Factors</h4>
                        <div className="space-y-2">
                          {data.keyFactors.slice(0, 3).map((factor, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">{factor.factor}</span>
                              <Badge variant="outline" className="text-cyan-400 border-cyan-400 text-xs">
                                {factor.weight}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-cyan-300 font-medium mb-2">Top Tips</h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                          {data.tips.slice(0, 3).map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black"
                        onClick={() => setSelectedPlatform(platform.id)}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {platforms.map((platform) => {
          const data = getPlatformData(platform.id)
          return (
            <TabsContent key={platform.id} value={platform.id} className="mt-6">
              <div className="space-y-6">
                {/* Header */}
                <Card className="bg-black border border-cyan-500">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${platform.color} bg-opacity-20`}>
                        <platform.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className={`${platform.accent} text-2xl`}>{data.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {data.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Algorithm Factors */}
                <Card className="bg-black border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Algorithm Factors & Weights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.keyFactors.map((factor, index) => (
                        <div key={index} className="border-l-4 border-cyan-500 pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-cyan-300 font-medium">{factor.factor}</h4>
                            <Badge className="bg-cyan-500 text-black">
                              {factor.weight}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Optimization Tips */}
                <Card className="bg-black border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      Optimization Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                          <Target className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300 text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 2026 Updates */}
                <Card className="bg-black border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      2026 Algorithm Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.updates.map((update, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-300">{update}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
