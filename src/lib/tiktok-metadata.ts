// TikTok Metadata Extraction Service
// Multiple methods for getting TikTok video metadata

interface TikTokMetadata {
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
    shares: number
  }
  hashtags: string[]
  duration: number
  createTime: number
  music?: {
    title: string
    author: string
  }
}

class TikTokMetadataService {
  private static instance: TikTokMetadataService
  private rapidApiKey: string

  private constructor() {
    this.rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || ''
  }

  static getInstance(): TikTokMetadataService {
    if (!TikTokMetadataService.instance) {
      TikTokMetadataService.instance = new TikTokMetadataService()
    }
    return TikTokMetadataService.instance
  }

  // Extract TikTok video ID from URL
  extractVideoId(url: string): string | null {
    const patterns = [
      /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
      /tiktok\.com\/v\/(\d+)/,
      /tiktok\.com\/t\/(\d+)/,
      /vm\.tiktok\.com\/(\d+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    return null
  }

  // Method 1: Official TikTok API (requires developer account)
  async getMetadataOfficial(videoUrl: string): Promise<TikTokMetadata | null> {
    try {
      const videoId = this.extractVideoId(videoUrl)
      if (!videoId) return null

      // This requires TikTok Developer API access
      const response = await fetch(`https://open.tiktokapis.com/v2/video/query/?fields=id,title,description,hashtags,duration,author,stats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TIKTOK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filters: {
            video_id: videoId
          }
        })
      })

      if (!response.ok) return null

      const data = await response.json()
      return this.formatMetadata(data.data)
    } catch (error) {
      console.error('TikTok official API error:', error)
      return null
    }
  }

  // Method 2: Web scraping with proper headers
  async getMetadataScraping(videoUrl: string): Promise<TikTokMetadata | null> {
    try {
      const videoId = this.extractVideoId(videoUrl)
      if (!videoId) return null

      // TikTok's internal API endpoint
      const apiUrl = `https://www.tiktok.com/api/video/detail/${videoId}`

      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
          'Referer': 'https://www.tiktok.com/',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"iOS"'
        }
      })

      if (!response.ok) return null

      const data = await response.json()
      return this.formatMetadata(data)
    } catch (error) {
      console.error('TikTok scraping error:', error)
      return null
    }
  }

  // Method 3: TikWM.com API (Free, No API Key Required)
  async getMetadataTikWM(videoUrl: string): Promise<TikTokMetadata | null> {
    try {
      // TikWM.com free API - no API key required
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://www.tikwm.com/',
          'Origin': 'https://www.tikwm.com'
        }
      })

      if (!response.ok) return null

      const data = await response.json()
      
      // TikWM returns different structure, format it
      if (data.code === 0 && data.data) {
        const videoData = data.data
        return {
          id: videoData.id,
          title: videoData.title || videoData.desc,
          description: videoData.desc || '',
          author: {
            username: videoData.author?.unique_id || videoData.author?.name || '',
            displayName: videoData.author?.nickname || videoData.author?.name || ''
          },
          stats: {
            views: videoData.stats?.play_count || 0,
            likes: videoData.stats?.digg_count || 0,
            comments: videoData.stats?.comment_count || 0,
            shares: videoData.stats?.share_count || 0
          },
          hashtags: videoData.hashtags?.map((tag: any) => tag.name) || [],
          duration: videoData.duration || 0,
          createTime: videoData.create_time || Date.now(),
          music: videoData.music ? {
            title: videoData.music.title || '',
            author: videoData.music.author || ''
          } : undefined
        }
      }

      return null
    } catch (error) {
      console.error('TikWM API error:', error)
      return null
    }
  }

  // Method 4: TikSave.io API (Alternative Free Option)
  async getMetadataTikSave(videoUrl: string): Promise<TikTokMetadata | null> {
    try {
      const response = await fetch(`https://tiksave.io/api/download?url=${encodeURIComponent(videoUrl)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://tiksave.io/'
        }
      })

      if (!response.ok) return null

      const data = await response.json()
      
      // Format TikSave.io response
      if (data.success && data.data) {
        const videoData = data.data
        return {
          id: videoData.id || this.extractVideoId(videoUrl) || '',
          title: videoData.title || videoData.caption || '',
          description: videoData.caption || videoData.description || '',
          author: {
            username: videoData.author?.unique_id || videoData.author?.username || '',
            displayName: videoData.author?.nickname || videoData.author?.display_name || ''
          },
          stats: {
            views: videoData.stats?.play_count || videoData.play_count || 0,
            likes: videoData.stats?.digg_count || videoData.likes || 0,
            comments: videoData.stats?.comment_count || videoData.comment_count || 0,
            shares: videoData.stats?.share_count || videoData.share_count || 0
          },
          hashtags: videoData.hashtags || videoData.tags || [],
          duration: videoData.duration || 0,
          createTime: videoData.create_time || Date.now(),
          music: videoData.music ? {
            title: videoData.music.title || '',
            author: videoData.music.author || ''
          } : undefined
        }
      }

      return null
    } catch (error) {
      console.error('TikSave API error:', error)
      return null
    }
  }

  // Try multiple methods in order of preference (TikSave.io First)
  async getMetadata(videoUrl: string): Promise<TikTokMetadata | null> {
    const methods = [
      () => this.getMetadataTikSave(videoUrl),      // Method 2: TikSave.io - Free, no API key (Primary)
      () => this.getMetadataTikWM(videoUrl),        // Method 3: TikWM.com - Free, no API key (Backup)
      () => this.getMetadataOfficial(videoUrl),      // Method 1: Official API (requires key)
      () => this.getMetadataScraping(videoUrl)       // Fallback: Web scraping
    ]

    for (const method of methods) {
      try {
        const result = await method()
        if (result) return result
      } catch (error) {
        console.warn('Method failed, trying next:', error)
        continue
      }
    }

    return null
  }

  // Format metadata from official API
  private formatMetadata(data: any): TikTokMetadata {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      author: {
        username: data.author.unique_id,
        displayName: data.author.nickname
      },
      stats: {
        views: data.stats.play_count,
        likes: data.stats.digg_count,
        comments: data.stats.comment_count,
        shares: data.stats.share_count
      },
      hashtags: data.hashtags?.map((tag: any) => tag.name) || [],
      duration: data.duration,
      createTime: data.create_time,
      music: data.music ? {
        title: data.music.title,
        author: data.music.author
      } : undefined
    }
  }
}

export default TikTokMetadataService
