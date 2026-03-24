// YouTube Metadata Extraction Service
// Uses YouTube Data API v3 for comprehensive video information

export interface YouTubeMetadata {
  id: string
  title: string
  description: string
  author: {
    username: string
    displayName: string
  }
  stats: {
    views: number
    likes: number
    comments: number
  }
  hashtags: string[]
  duration: string // ISO 8601 duration format
  createTime: string
  thumbnail: string
}

class YouTubeMetadataService {
  private static instance: YouTubeMetadataService
  private apiKey: string

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
  }

  static getInstance(): YouTubeMetadataService {
    if (!YouTubeMetadataService.instance) {
      YouTubeMetadataService.instance = new YouTubeMetadataService()
    }
    return YouTubeMetadataService.instance
  }

  // Extract video ID from YouTube URL
  private extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]+)/,
      /youtube\.com\/watch\?.*v=([\w-]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    return null
  }

  // Parse ISO 8601 duration to human-readable format
  private parseDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return '0:00'

    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Extract hashtags from description
  private extractHashtags(description: string): string[] {
    // Extract hashtags with # symbol
    const hashtagRegex = /#\w+/g
    const hashtagMatches = description.match(hashtagRegex) || []
    const hashtags = hashtagMatches.map(tag => tag.substring(1)) // Remove # symbol
    
    // Extract comma-separated tags and space-separated keywords
    const commaTags = description.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && tag.length < 50 && !tag.includes('http'))
      .slice(0, 10) // Limit to first 10 comma-separated tags
    
    const spaceTags = description.split(' ')
      .map(tag => tag.trim().replace(/[^\w\s]/g, ''))
      .filter(tag => tag.length > 2 && tag.length < 30 && !tag.toLowerCase().includes('http'))
      .slice(0, 15) // Limit to first 15 space-separated keywords
    
    // Combine and remove duplicates
    const allTags = [...hashtags, ...commaTags, ...spaceTags]
    const uniqueTags = [...new Set(allTags.map(tag => tag.toLowerCase()))]
    
    // Return top 20 most relevant tags
    return uniqueTags.slice(0, 20)
  }

  // Method 1: YouTube Data API v3 (Primary)
  async getMetadata(videoUrl: string): Promise<YouTubeMetadata | null> {
    const videoId = this.extractVideoId(videoUrl)
    if (!videoId) {
      console.error('Invalid YouTube URL format')
      return null
    }

    if (!this.apiKey) {
      console.warn('YouTube API key not configured, falling back to scraping')
      console.log('Available API keys:', {
        NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? 'Present' : 'Missing',
        NEXT_PUBLIC_YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ? 'Present' : 'Missing'
      })
      return this.getMetadataFromScraping(videoUrl)
    }

    try {
      // Get video details
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`
      )

      if (!videoResponse.ok) {
        console.error('YouTube API error:', videoResponse.status)
        return this.getMetadataFromScraping(videoUrl)
      }

      const videoData = await videoResponse.json()

      if (!videoData.items || videoData.items.length === 0) {
        console.error('Video not found')
        return null
      }

      const video = videoData.items[0]
      const snippet = video.snippet
      const statistics = video.statistics
      const contentDetails = video.contentDetails

      // Get channel details
      let channelUsername = snippet.channelId
      let channelDisplayName = snippet.channelTitle

      try {
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${snippet.channelId}&key=${this.apiKey}`
        )

        if (channelResponse.ok) {
          const channelData = await channelResponse.json()
          if (channelData.items && channelData.items.length > 0) {
            const channel = channelData.items[0]
            channelUsername = channel.snippet.customUrl || channel.snippet.title.toLowerCase().replace(/\s+/g, '')
          }
        }
      } catch (error) {
        console.warn('Failed to fetch channel details:', error)
      }

      const metadata: YouTubeMetadata = {
        id: videoId,
        title: snippet.title,
        description: snippet.description,
        author: {
          username: channelUsername,
          displayName: channelDisplayName
        },
        stats: {
          views: parseInt(statistics.viewCount || '0'),
          likes: parseInt(statistics.likeCount || '0'),
          comments: parseInt(statistics.commentCount || '0')
        },
        hashtags: this.extractHashtags(snippet.description),
        duration: this.parseDuration(contentDetails.duration),
        createTime: snippet.publishedAt,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || ''
      }

      console.log('YouTube API success:', {
        title: metadata.title,
        descriptionLength: metadata.description.length,
        hashtagsCount: metadata.hashtags.length,
        descriptionPreview: metadata.description.substring(0, 100) + '...',
        extractedHashtags: metadata.hashtags.slice(0, 10)
      })
      return metadata

    } catch (error) {
      console.error('YouTube API error:', error)
      return this.getMetadataFromScraping(videoUrl)
    }
  }

  // Method 2: Web Scraping (Fallback)
  async getMetadataFromScraping(videoUrl: string): Promise<YouTubeMetadata | null> {
    try {
      // For YouTube, we'll use oembed API as a fallback
      const videoId = this.extractVideoId(videoUrl)
      if (!videoId) return null

      const oembedResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      )

      if (!oembedResponse.ok) {
        console.error('YouTube oembed error:', oembedResponse.status)
        return null
      }

      const oembedData = await oembedResponse.json()

      // Basic metadata from oembed
      const metadata: YouTubeMetadata = {
        id: videoId,
        title: oembedData.title || 'Untitled Video',
        description: '', // oembed doesn't provide description
        author: {
          username: oembedData.author_name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
          displayName: oembedData.author_name || 'Unknown Channel'
        },
        stats: {
          views: 0,
          likes: 0,
          comments: 0
        },
        hashtags: [],
        duration: '0:00',
        createTime: new Date().toISOString(),
        thumbnail: oembedData.thumbnail_url || ''
      }

      console.log('YouTube scraping success:', metadata.title)
      return metadata

    } catch (error) {
      console.error('YouTube scraping error:', error)
      return null
    }
  }
}

export default YouTubeMetadataService
