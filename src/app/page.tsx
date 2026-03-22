'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentAnalyzerEnhanced } from '@/components/ContentAnalyzerEnhanced'
import { PlatformOptimizer } from '@/components/PlatformOptimizer'
import { ClipAnalyzerEnhanced } from '@/components/ClipAnalyzerEnhanced'
import { Connections } from '@/components/Connections'
import { AlgorithmInfoEnhanced } from '@/components/AlgorithmInfoEnhanced'
import { TagGenerator } from '@/components/TagGenerator'
import { AIContentOptimizer } from '@/components/AIContentOptimizer'
import { KickAuth } from '@/components/KickAuth'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } catch (error) {
          console.error('Failed to parse stored user data:', error)
          localStorage.removeItem('kickUser')
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 10px #00ffff' }}>
            SDHQ Content Analyzer
          </h1>
          <p className="text-lg text-cyan-300 max-w-2xl mx-auto">
            AI-powered multi-platform content optimization based on 2026 algorithm parameters
          </p>
        </div>

        {/* Kick Authentication Section - Only show if not logged in */}
        {!user && (
          <div className="mb-8">
            <KickAuth 
              onUserChange={(userData: any) => setUser(userData)}
            />
          </div>
        )}

        {/* User Profile Status */}
        {user && (
          <div className="mb-6">
            <div className="bg-black border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.profile_image_url || 'https://via.placeholder.com/40'} 
                    alt={user.display_name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="text-cyan-300 font-medium">Logged in as</div>
                    <div className="text-white font-semibold">{user.display_name}</div>
                    <div className="text-gray-400 text-sm">@{user.username}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('kickUser')
                      localStorage.removeItem('kickAccessToken')
                    }
                    setUser(null)
                  }}
                  className="text-xs text-gray-400 hover:text-cyan-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="algorithm-info" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-black border border-cyan-500">
            <TabsTrigger value="algorithm-info" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Algorithm Info</TabsTrigger>
            <TabsTrigger value="content-analysis" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Content Analysis</TabsTrigger>
            <TabsTrigger value="clip-analysis" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Clip Analysis</TabsTrigger>
            <TabsTrigger value="optimizer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Platform Optimizer</TabsTrigger>
            <TabsTrigger value="connections" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Connections</TabsTrigger>
            <TabsTrigger value="tag-generator" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Tag Generator</TabsTrigger>
            <TabsTrigger value="ai-optimizer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">AI Optimizer</TabsTrigger>
          </TabsList>

          <TabsContent value="algorithm-info" className="mt-6">
            <AlgorithmInfoEnhanced />
          </TabsContent>

          <TabsContent value="content-analysis" className="mt-6">
            <ContentAnalyzerEnhanced />
          </TabsContent>

          <TabsContent value="clip-analysis" className="mt-6">
            <ClipAnalyzerEnhanced />
          </TabsContent>

          <TabsContent value="optimizer" className="mt-6">
            <PlatformOptimizer />
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <Connections />
          </TabsContent>

          <TabsContent value="tag-generator" className="mt-6">
            <TagGenerator />
          </TabsContent>

          <TabsContent value="ai-optimizer" className="mt-6">
            <AIContentOptimizer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
