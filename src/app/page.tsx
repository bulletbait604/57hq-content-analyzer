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

export default function Home() {
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

        <Tabs defaultValue="analyzer" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black border border-cyan-500">
            <TabsTrigger value="analyzer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Content Analysis</TabsTrigger>
            <TabsTrigger value="ai-optimizer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">AI Optimizer</TabsTrigger>
            <TabsTrigger value="tags" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Tag Generator</TabsTrigger>
            <TabsTrigger value="optimizer" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Platform Optimizer</TabsTrigger>
            <TabsTrigger value="clip" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Clip Analysis</TabsTrigger>
            <TabsTrigger value="tips" className="text-white hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300">Improvement Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer" className="mt-6">
            <ContentAnalyzer />
          </TabsContent>

          <TabsContent value="ai-optimizer" className="mt-6">
            <AIContentOptimizer />
          </TabsContent>

          <TabsContent value="tags" className="mt-6">
            <TagGenerator />
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
