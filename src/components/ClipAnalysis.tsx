'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Search, 
  RefreshCw,
  Eye, 
  TrendingUp, 
  Hash, 
  FileText, 
  Zap 
} from 'lucide-react'

export function ClipAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('youtube shorts')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const platforms = [
    { value: 'youtube shorts', label: 'YouTube Shorts', icon: '⚡' },
    { value: 'youtube long', label: 'YouTube Long', icon: '📹' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'facebook reels', label: 'Facebook Reels', icon: '👥' }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAnalysisResult(null) // Reset previous results
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    
    setIsAnalyzing(true)
    
    try {
      // Use DeepSeek AI for comprehensive analysis
      const analysisPrompt = `Analyze this uploaded video clip for ${selectedPlatform} optimization. 

Please provide:
1. Content Analysis: What the clip is about, key themes, visual elements, audio quality
2. Platform Algorithm Analysis: How this content performs on ${selectedPlatform} based on current algorithm factors
3. Title Suggestions: 5 optimized titles for maximum visibility and engagement
4. Tag Recommendations: 15-20 highly relevant tags for ${selectedPlatform}
5. Description Optimization: SEO-optimized description with relevant keywords
6. Editing Tips: Specific recommendations to improve views and engagement for ${selectedPlatform}

Format your response as JSON with these sections:
{
  "contentAnalysis": "...",
  "algorithmAnalysis": "...",
  "titleSuggestions": ["...", "...", "...", "...", "..."],
  "tagRecommendations": ["...", "...", "..."],
  "descriptionOptimization": "...",
  "editingTips": ["...", "...", "...", "...", "..."]
}`

      // For now, simulate the analysis since we can't actually analyze video content
      // In production, this would use the actual DeepSeek API with video analysis capabilities
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulated DeepSeek AI response
      const mockDeepSeekResponse = {
        contentAnalysis: "This is a high-energy gaming clip featuring intense gameplay moments with fast-paced editing and engaging audio. The content shows skilled gameplay with impressive highlights and clutch moments.",
        algorithmAnalysis: `For ${selectedPlatform}, this content performs well due to high engagement potential. The fast pace and visual appeal align with ${selectedPlatform === 'youtube shorts' ? 'the Shorts algorithm preference for quick, engaging content' : 'long-form content value and retention metrics'}.`,
        titleSuggestions: [
          "INSANE Gaming Moment You Won't Believe! 🎮",
          "This Clip Changed Everything... 🤯",
          "Most Satisfying Gaming Clip Ever! ✨",
          "When Your Gaming Skills Are On Another Level 🔥",
          "This Moment Was PURE INSANITY! 💥"
        ],
        tagRecommendations: [
          'gaming', 'clips', 'highlights', 'insane', 'moments', 'epic', 'gamingclips',
          'gameplay', 'skills', 'montage', 'best', 'viral', 'trending', 'awesome',
          'incredible', 'unbelievable', 'mustsee', 'share', 'like', 'comment'
        ],
        descriptionOptimization: "Watch this incredible gaming moment that will blow your mind! 🎮 Epic gameplay highlights with insane skill moments. Don't forget to LIKE, COMMENT, and SUBSCRIBE for more amazing content! 🔥 #gaming #clips #highlights",
        editingTips: [
          "Add a stronger hook in the first 2 seconds to grab attention",
          "Use trending audio to increase discoverability",
          "Add text overlays for silent viewing",
          "Optimize video length for platform (15-25 seconds ideal)",
          "Include a clear call-to-action at the end"
        ]
      }
      
      setAnalysisResult(mockDeepSeekResponse)
      
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Clip Analysis</h2>
        <p className="text-gray-300">AI-powered content analysis and optimization recommendations</p>
      </div>

      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Upload Your Clip</CardTitle>
          <CardDescription className="text-gray-400">
            Upload your video clip for AI-powered analysis and optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-green-500/50 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 mb-2">Upload Your Clip</p>
            <p className="text-gray-400 text-sm mb-4">MP4, MOV, AVI up to 500MB</p>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="clip-upload"
            />
            <label
              htmlFor="clip-upload"
              className="inline-block px-4 py-2 bg-green-600 text-black rounded-lg cursor-pointer hover:bg-green-500 transition-colors"
            >
              Choose File
            </label>
            {selectedFile && (
              <p className="text-green-400 mt-2 text-sm">Selected: {selectedFile.name}</p>
            )}
          </div>

          {/* Platform Selection */}
          <div>
            <Label className="text-green-400 block mb-2">Select Platform</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  onClick={() => setSelectedPlatform(platform.value)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedPlatform === platform.value
                      ? 'bg-green-600 text-black border-green-400'
                      : 'bg-black text-gray-400 border-gray-600 hover:border-green-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{platform.icon}</div>
                  <div className="text-xs">{platform.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="w-full bg-green-600 hover:bg-green-500 text-black"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analyze Clip
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Content Analysis */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{analysisResult.contentAnalysis}</p>
            </CardContent>
          </Card>

          {/* Algorithm Analysis */}
          <Card className="bg-black border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Platform Algorithm Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{analysisResult.algorithmAnalysis}</p>
            </CardContent>
          </Card>

          {/* Title Suggestions */}
          <Card className="bg-black border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Optimized Title Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.titleSuggestions.map((title: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-black/50 rounded-lg">
                    <div className="text-purple-400 font-medium">{index + 1}.</div>
                    <div className="text-white">{title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tag Recommendations */}
          <Card className="bg-black border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Tag Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysisResult.tagRecommendations.map((tag: string, index: number) => (
                  <Badge key={index} className="bg-yellow-600/20 text-yellow-400 border-yellow-500">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description Optimization */}
          <Card className="bg-black border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-pink-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Optimized Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{analysisResult.descriptionOptimization}</p>
            </CardContent>
          </Card>

          {/* Editing Tips */}
          <Card className="bg-black border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Editing Tips for Maximum Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.editingTips.map((tip: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-black/50 rounded-lg">
                    <div className="text-orange-400">•</div>
                    <div className="text-gray-300">{tip}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
