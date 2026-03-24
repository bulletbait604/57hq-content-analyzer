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
    // Check for API keys on client-side only to avoid hydration issues
    if (typeof window !== 'undefined') {
      // Prioritize the new YouTube API key, fall back to Google API key
      this.apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''
    } else {
      this.apiKey = ''
    }
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
  private extractHashtags(description: string, contentDetailsTags?: string[], snippetTags?: string[]): string[] {
    if (!description) return []
    
    console.log('🔍 Analyzing YouTube description for hashtags:', {
      descriptionLength: description.length,
      descriptionPreview: description.substring(0, 150) + '...'
    })
    
    // Extract hashtags from description text
    const hashtagRegex = /#([a-zA-Z0-9_\u4e00-\u9fff]+)/g
    const descriptionMatches = description.match(hashtagRegex) || []
    const descriptionHashtags = descriptionMatches.map(tag => tag.replace('#', '').trim())
    
    // Extract tags from YouTube API fields (contentDetails.tags and snippet.tags)
    const apiTags = [...(contentDetailsTags || []), ...(snippetTags || [])]
      .filter(tag => tag && typeof tag === 'string')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    // Combine all tags and remove duplicates
    const allTags = [...descriptionHashtags, ...apiTags]
    const uniqueTags = [...new Set(allTags.map(tag => tag.toLowerCase()))]
    
    console.log('🏷️ YouTube hashtag extraction results:', {
      descriptionHashtags: descriptionHashtags,
      apiTags: apiTags,
      combinedTags: allTags,
      uniqueTags: uniqueTags,
      hashtagCount: uniqueTags.length
    })
    
    return uniqueTags
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
        NEXT_PUBLIC_YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ? 'Present' : 'Missing',
        NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? 'Present' : 'Missing'
      })
      return this.getMetadataFromScraping(videoUrl)
    }

    console.log('🔑 Using YouTube API key:', {
      usingKey: this.apiKey === process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ? 'NEXT_PUBLIC_YOUTUBE_API_KEY' : 
               this.apiKey === process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? 'NEXT_PUBLIC_GOOGLE_API_KEY' : 'Unknown',
      keyPresent: !!this.apiKey,
      apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'none',
      envKeys: {
        NEXT_PUBLIC_YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY.substring(0, 10) + '...' : 'Missing',
        NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? process.env.NEXT_PUBLIC_GOOGLE_API_KEY.substring(0, 10) + '...' : 'Missing'
      }
    })
    console.log('🎬 Attempting YouTube Data API v3 for:', videoUrl)
      
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )

    if (!response.ok) {
      console.error('YouTube API error:', {
        status: response.status,
        statusText: response.statusText,
        videoId: videoId
      })
      return null
    }

    const data = await response.json()
    console.log('🎬 YouTube API raw response:', {
      videoId,
      hasItems: !!data.items,
      itemCount: data.items?.length || 0,
      firstItemKeys: data.items?.[0] ? Object.keys(data.items[0]) : []
    })

    if (!data.items || data.items.length === 0) {
      console.error('YouTube API: No video data found for video ID:', videoId)
      return null
    }

    const video = data.items[0]
    const snippet = video.snippet
    const statistics = video.statistics
    const contentDetails = video.contentDetails

    // Get channel details
    let channelUsername = snippet.channelId
    let channelDisplayName = snippet.channelTitle

    try {
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${snippet.channelId}&key=${this.apiKey}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      )

      if (!response.ok) {
        console.error('YouTube API error:', {
          status: response.status,
          statusText: response.statusText,
          videoId: videoId
        })
        return null
      }

      const data = await response.json()
      console.log('🎬 YouTube API raw response:', {
        videoId,
        hasItems: !!data.items,
        itemCount: data.items?.length || 0,
        firstItemKeys: data.items?.[0] ? Object.keys(data.items[0]) : []
      })

      if (!data.items || data.items.length === 0) {
        console.error('YouTube API: No video data found for video ID:', videoId)
        return null
      }

      const video = data.items[0]
      const snippet = video.snippet
      const statistics = video.statistics
      const contentDetails = video.contentDetails

      // Get channel details
      let channelUsername = snippet.channelId
      let channelDisplayName = snippet.channelTitle

      try {
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${snippet.channelId}&key=${this.apiKey}`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }
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
        hashtags: this.extractHashtags(snippet.description, contentDetails.tags, snippet.tags),
        duration: this.parseDuration(contentDetails.duration),
        createTime: snippet.publishedAt,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || ''
      }

      console.log('🎬 YouTube API success:', {
        title: metadata.title,
        descriptionLength: metadata.description.length,
        hashtagsCount: metadata.hashtags.length,
        descriptionPreview: metadata.description.substring(0, 100) + '...',
        extractedHashtags: metadata.hashtags.slice(0, 10),
        fullDescription: metadata.description,
        apiResponse: {
          snippetTitle: snippet.title,
          snippetDescription: snippet.description,
          contentDetailsTags: contentDetails.tags,
          snippetTags: snippet.tags
        }
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
