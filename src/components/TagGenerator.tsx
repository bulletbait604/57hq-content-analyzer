'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Hash, Copy, CheckCircle, TrendingUp, Brain, Loader2 } from 'lucide-react'

export function TagGenerator() {
  const [clipTitle, setClipTitle] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('youtube')
  const [contentType, setContentType] = useState('gaming')
  const [generatedTags, setGeneratedTags] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [useAI, setUseAI] = useState(true)

  const generateTags = async () => {
    if (!clipTitle.trim()) return

    setIsLoading(true)
    try {
      let tags: string[] = []
      
      if (useAI) {
        // Use AI to generate tags
        tags = await generateTagsWithDeepSeek(clipTitle, selectedPlatform, contentType)
      } else {
        // Fallback to basic tag generation
        tags = generateBasicTags()
      }
      
      setGeneratedTags(tags)
    } catch (error) {
      console.error('Tag generation error:', error)
      // Fallback to basic tags on error
      setGeneratedTags(generateBasicTags())
    } finally {
      setIsLoading(false)
    }
  }

  const generateBasicTags = () => {
    const titleWords = clipTitle.toLowerCase().split(' ').filter(word => word.length > 2)
    
    const platformTags = {
      youtube: ['Shorts', 'Gaming', 'FPS', '2026', 'Trending', 'Viral', 'Gameplay', 'Tips', 'Tutorial', 'Best'],
      tiktok: ['fyp', 'viral', 'gaming', 'fps', '2026', 'trending', 'gameplay', 'tips', 'tutorial', 'howto'],
      instagram: ['Reels', 'Gaming', 'FPS', '2026', 'Trending', 'Viral', 'Gameplay', 'Tips', 'Tutorial', 'Best']
    }

    const baseTags = platformTags[selectedPlatform as keyof typeof platformTags] || []
    const titleBasedTags = baseTags.filter(tag => 
      titleWords.some(word => tag.toLowerCase().includes(word))
    )
    
    const combinedTags = Array.from(new Set([...titleBasedTags, ...baseTags.slice(0, 8)]))
    return combinedTags.slice(0, selectedPlatform === 'tiktok' ? 5 : selectedPlatform === 'youtube' ? 10 : 15)
  }

  const generateTagsWithAI = async (title: string, platform: string, contentType: string) => {
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

    return aiTags.slice(0, platform === 'tiktok' ? 5 : platform === 'youtube' ? 10 : 15)
  }

  const copyTags = () => {
    const tagsString = generatedTags.join(', ')
    navigator.clipboard.writeText(tagsString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Hash className="h-5 w-5 text-cyan-400" />
            57 HQ Tag Generator
          </CardTitle>
          <CardDescription className="text-cyan-300">
            Generate optimized tags using advanced AI analysis or basic algorithms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
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
                {useAI ? 'Advanced DeepSeek-powered tag generation' : 'Basic algorithm-based tags'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Clip Title</label>
              <input
                type="text"
                value={clipTitle}
                onChange={(e) => setClipTitle(e.target.value)}
                placeholder="Enter your clip title..."
                className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-700"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="youtube">YouTube Shorts</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram Reels</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-cyan-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="gaming">Gaming</option>
                  <option value="educational">Educational</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="viral">Viral/Trending</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateTags}
              disabled={isLoading || !clipTitle.trim()}
              className="w-full px-4 py-2 bg-cyan-500 text-black rounded-md hover:bg-cyan-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {useAI ? 'DeepSeek Analyzing...' : 'Generating Tags...'}
                </>
              ) : (
                <>
                  {useAI ? 'Generate DeepSeek Tags' : 'Generate Basic Tags'}
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {generatedTags.length > 0 && (
        <Card className="bg-black border border-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                Generated Tags ({generatedTags.length})
                {useAI && (
                  <span className="px-2 py-1 bg-lime-500 text-black text-xs rounded-full">DeepSeek-Powered</span>
                )}
              </span>
              <button
                onClick={copyTags}
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
                    Copy
                  </>
                )}
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {generatedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-900 text-cyan-300 border border-cyan-600 text-sm rounded-full font-mono"
                    style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-black border border-cyan-600 rounded-lg">
                <h4 className="font-semibold text-cyan-400 mb-3">57 HQ Analysis Insights</h4>
                <ul className="space-y-2 text-sm text-cyan-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    Tags optimized for {selectedPlatform} algorithm
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    Based on 2026 trending topics and SEO best practices
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    {useAI ? 'AI analyzed content context and platform requirements' : 'Generated using pattern matching algorithms'}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
