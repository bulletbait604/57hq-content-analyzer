'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentAnalyzer } from '@/components/ContentAnalyzer'
import { PlatformOptimizer } from '@/components/PlatformOptimizer'
import { ClipAnalyzer } from '@/components/ClipAnalyzer'
import { ImprovementTips } from '@/components/ImprovementTips'
import { TagGenerator } from '@/components/TagGenerator'
import { AIContentOptimizer } from '@/components/AIContentOptimizer'
import { KickAuth } from '@/components/KickAuth'

export default function Home() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [user, setUser] = useState<any>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 10px #00ffff' }}>
            57 HQ Content Analyzer
          </h1>
          <p className="text-lg text-cyan-300 max-w-2xl mx-auto">
            AI-powered multi-platform content optimization based on 2026 algorithm parameters
          </p>
        </div>

        {/* Kick Authentication Section */}
        <div className="mb-8">
          <KickAuth 
            onSubscriptionChange={(subscribed) => setIsSubscribed(subscribed)}
            onUserChange={(userData) => setUser(userData)}
          />
        </div>

        {/* Subscription Status Banner */}
        {user && (
          <div className={`mb-6 p-4 rounded-lg border ${
            isSubscribed 
              ? 'bg-lime-900 border-lime-500 text-lime-300' 
              : 'bg-cyan-900 border-cyan-500 text-cyan-300'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {isSubscribed ? '🎉 Premium Access Unlocked!' : '🔒 Basic Access'}
                </h3>
                <p className="text-sm mt-1">
                  {isSubscribed 
                    ? 'You have full access to DeepSeek AI-powered features!' 
                    : 'Subscribe to bulletbait604 on Kick to unlock AI features'
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {user.display_name || user.username}
                </p>
                <p className="text-xs opacity-75">
                  {isSubscribed ? 'Verified Subscriber' : 'Not Subscribed'}
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="analyzer" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black border border-cyan-500">
            <TabsTrigger value="analyzer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Content Analysis</TabsTrigger>
            <TabsTrigger value="ai-optimizer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">
              AI Optimizer
              {!isSubscribed && <span className="ml-1 text-xs">🔒</span>}
            </TabsTrigger>
            <TabsTrigger value="tags" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">
              Tag Generator
              {!isSubscribed && <span className="ml-1 text-xs">🔒</span>}
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Platform Optimizer</TabsTrigger>
            <TabsTrigger value="clip" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Clip Analysis</TabsTrigger>
            <TabsTrigger value="tips" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Improvement Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer" className="mt-6">
            <ContentAnalyzer />
          </TabsContent>

          <TabsContent value="ai-optimizer" className="mt-6">
            {isSubscribed ? (
              <AIContentOptimizer />
            ) : (
              <Card className="bg-black border border-cyan-500">
                <CardContent className="text-center py-12">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">🔒 Premium Feature</h3>
                  <p className="text-cyan-300 mb-6">
                    Subscribe to <strong>bulletbait604</strong> on Kick to unlock DeepSeek AI-powered content optimization.
                  </p>
                  <div className="text-sm text-cyan-400">
                    <p>✨ Advanced AI analysis</p>
                    <p>✨ Algorithm scoring</p>
                    <p>✨ Content optimization</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tags" className="mt-6">
            {isSubscribed ? (
              <TagGenerator />
            ) : (
              <Card className="bg-black border border-cyan-500">
                <CardContent className="text-center py-12">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">🔒 Premium Feature</h3>
                  <p className="text-cyan-300 mb-6">
                    Subscribe to <strong>bulletbait604</strong> on Kick to unlock DeepSeek AI-powered tag generation.
                  </p>
                  <div className="text-sm text-cyan-400">
                    <p>✨ AI-generated tags</p>
                    <p>✨ Platform optimization</p>
                    <p>✨ Trend analysis</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="optimizer" className="mt-6">
            <PlatformOptimizer />
          </TabsContent>

          <TabsContent value="clip" className="mt-6">
            <ClipAnalyzer />
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <ImprovementTips />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
