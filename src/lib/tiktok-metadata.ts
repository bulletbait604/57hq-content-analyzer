// TikTok Metadata Extraction Service
// Multiple methods for getting TikTok metadata

// TikTok metadata interface
export interface TikTokMetadata {
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
            video_ids: [videoId]
          }
        })
      })

      if (!response.ok) {
        console.error('TikTok Official API error:', response.status)
        return null
      }

      const data = await response.json()
      return this.formatMetadata(data)
    } catch (error) {
      console.error('TikTok Official API error:', error)
      return null
    }
  }

  // Method 2: Web Scraping (Fallback)
  async getMetadataScraping(videoUrl: string): Promise<TikTokMetadata | null> {
    try {
      // TikTok scraping with proper headers
      const response = await fetch(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://www.tiktok.com/',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Windows"'
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

  // Method 3: TikWM.com API (Free, No API Key Required, No CORS Issues)
  async getMetadataTikWM(videoUrl: string): Promise<TikTokMetadata | null> {
    try {
      console.log(' Attempting TikWM.com API for:', videoUrl)

      // TikWM.com free API - no API key required, no CORS issues
      const response = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://www.tikwm.com/',
          'Origin': 'https://www.tikwm.com',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Windows"'
        }
      })

      console.log('TikWM.com API response status:', response.status)

      if (!response.ok) {
        console.error('TikWM.com API error:', {
          status: response.status,
          statusText: response.statusText,
          url: videoUrl
        })
        return null
      }

      const data = await response.json()
      console.log('TikWM.com API full response:', {
        success: data?.success,
        msg: data?.msg,
        dataKeys: data?.data ? Object.keys(data.data) : 'no data',
        hasData: !!data?.data,
        fullData: data?.data
      })

      if (!data || !data.data) {
        console.error('TikWM.com API returned invalid data:', data)
        return null
      }

      // TikWM API structure: data contains video info directly, not data.video
      const videoData = data.data
      console.log('TikWM API video data:', {
        title: videoData.title,
        desc: videoData.desc,
        content_desc: videoData.content_desc,
        hashtags: videoData.hashtags,
        text: videoData.text,
        author: videoData.author,
        stats: videoData.stats
      })

      // Handle TikTok description - it can be in content_desc (array) or desc (string)
      let description = ''
      if (Array.isArray(videoData.content_desc)) {
        description = videoData.content_desc.join(' ')
      } else if (typeof videoData.desc === 'string') {
        description = videoData.desc
      } else if (typeof videoData.text === 'string') {
        description = videoData.text
      }

      return {
        id: videoData.id,
        title: videoData.title || videoData.desc || 'Untitled Video',
        description: description,
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
        hashtags: videoData.hashtags?.map((tag: any) => tag.name) || videoData.hashtags_extra || [],
        duration: videoData.duration || 0,
        createTime: videoData.create_time || Date.now(),
        music: videoData.music ? {
          title: videoData.music.title || '',
          author: videoData.music.author || ''
        } : undefined
      }
    } catch (error) {
      console.error('TikWM.com API error:', error)
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

      if (!response.ok) {
        console.error('TikSave API error:', response.status)
        return null
      }

      const data = await response.json()
      return this.formatMetadataTikSave(data)
    } catch (error) {
      console.error('TikSave API error:', error)
      return null
    }
  }

  // Format metadata from TikWM.com API
  private formatMetadataTikWM(data: any): TikTokMetadata {
    return {
      id: data.id,
      title: data.title || data.desc || 'Untitled Video',
      description: Array.isArray(data.content_desc) ? data.content_desc.join(' ') : (data.desc || data.text || ''),
      author: {
        username: data.author?.unique_id || data.author?.name || '',
        displayName: data.author?.nickname || data.author?.name || ''
      },
      stats: {
        views: data.stats?.play_count || 0,
        likes: data.stats?.digg_count || 0,
        comments: data.stats?.comment_count || 0,
        shares: data.stats?.share_count || 0
      },
      hashtags: data.hashtags?.map((tag: any) => tag.name) || data.hashtags_extra || [],
      duration: data.duration || 0,
      createTime: data.create_time || Date.now(),
      music: data.music ? {
        title: data.music.title || '',
        author: data.music.author || ''
      } : undefined
    }
  }

  // Format metadata from TikSave.io API
  private formatMetadataTikSave(data: any): TikTokMetadata {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      author: {
        username: data.author?.unique_id || data.author?.name || '',
        displayName: data.author?.nickname || data.author?.name || ''
      },
      stats: {
        views: data.views || 0,
        likes: data.likes || 0,
        comments: data.comments || 0,
        shares: data.shares || 0
      },
      hashtags: data.hashtags || [],
      duration: data.duration || 0,
      createTime: data.create_time || Date.now(),
      music: data.music ? {
        title: data.music.title || '',
        author: data.music.author || ''
      } : undefined
    }
  }

  // Format metadata from scraping/official API
  private formatMetadata(data: any): TikTokMetadata {
    return {
      id: data.id,
      title: data.title || 'Untitled Video',
      description: data.description || '',
      author: {
        username: data.author?.unique_id || data.author?.name || '',
        displayName: data.author?.nickname || data.author?.name || ''
      },
      stats: {
        views: data.stats?.play_count || 0,
        likes: data.stats?.digg_count || 0,
        comments: data.stats?.comment_count || 0,
        shares: data.stats?.share_count || 0
      },
      hashtags: data.hashtags?.map((tag: any) => tag.name) || [],
      duration: data.duration || 0,
      createTime: data.create_time || Date.now(),
      music: data.music ? {
        title: data.music.title || '',
        author: data.music.author || ''
      } : undefined
    }
  }

  // Try multiple methods in order of preference (TikWM.com First - No CORS Issues)
  async getMetadata(videoUrl: string): Promise<TikTokMetadata | null> {
    const methods = [
      () => this.getMetadataTikWM(videoUrl),        // Method 3: TikWM.com - Free, no API key, no CORS issues (Primary)
      () => this.getMetadataOfficial(videoUrl),      // Method 1: Official API (requires key)
      () => this.getMetadataScraping(videoUrl),      // Fallback: Web scraping
      () => this.getMetadataTikSave(videoUrl)        // Method 2: TikSave.io - Has CORS issues (Last resort)
    ]

    for (const method of methods) {
      try {
        const result = await method()
        if (result) return result
      } catch (error) {
        console.warn('Method failed, trying next:', error)
        continue
      }
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"iOS"'
    }
  })

  console.log('🎵 TikWM.com API response status:', response.status)
  
  if (!response.ok) {
    console.error('🎵 TikWM.com API error:', {
      status: response.status,
      statusText: response.statusText,
      url: videoUrl
    })
    return null
  }

  const data = await response.json()
  console.log('🎵 TikWM.com API full response:', {
    success: data?.success,
    msg: data?.msg,
    dataKeys: data?.data ? Object.keys(data.data) : 'no data',
    hasData: !!data?.data,
    fullData: data?.data
  })
  
  if (!data || !data.data) {
    console.error('🎵 TikWM.com API returned invalid data:', data)
    return null
  }

  // TikWM API structure: data contains video info directly, not data.video
  const videoData = data.data
  console.log('🎵 TikWM API video data:', {
    title: videoData.title,
    desc: videoData.desc,
    content_desc: videoData.content_desc,
    hashtags: videoData.hashtags,
    text: videoData.text,
    author: videoData.author,
    stats: videoData.stats
  })
  
  // Handle TikTok description - it can be in content_desc (array) or desc (string)
  let description = ''
  if (Array.isArray(videoData.content_desc)) {
    description = videoData.content_desc.join(' ')
  } else if (typeof videoData.desc === 'string') {
    description = videoData.desc
  } else if (typeof videoData.text === 'string') {
    description = videoData.text
  }
  
  return {
    id: videoData.id,
    title: videoData.title || videoData.desc || 'Untitled Video',
    description: description,
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
    hashtags: videoData.hashtags?.map((tag: any) => tag.name) || videoData.hashtags_extra || [],
    duration: videoData.duration || 0,
    createTime: videoData.create_time || Date.now(),
    music: videoData.music ? {
      title: videoData.music.title || '',
      author: videoData.music.author || ''
    } : undefined
  }
} catch (error) {
  console.error('🎵 TikWM.com API error:', error)
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

  if (!response.ok) {
    console.error('TikSave API error:', response.status)
    return null
  }

  const data = await response.json()
  return this.formatMetadataTikSave(data)
} catch (error) {
  console.error('TikSave API error:', error)
  return null
}
}

// Format metadata from TikSave.io API
private formatMetadataTikSave(data: any): TikTokMetadata {
return {
  id: data.id,
  title: data.title,
  description: data.description,
  author: {
    username: data.author?.unique_id || data.author?.name || '',
    displayName: data.author?.nickname || data.author?.name || ''
  },
  stats: {
    views: data.views || 0,
    likes: data.likes || 0,
    comments: data.comments || 0,
    shares: data.shares || 0
  },
  hashtags: data.hashtags || [],
  duration: data.duration || 0,
  createTime: data.create_time || Date.now(),
  music: data.music ? {
    title: data.music.title || '',
    author: data.music.author || ''
  } : undefined
}
}

// Try multiple methods in order of preference (TikWM.com First - No CORS Issues)
async getMetadata(videoUrl: string): Promise<TikTokMetadata | null> {
const methods = [
  () => this.getMetadataTikWM(videoUrl),        // Method 3: TikWM.com - Free, no API key, no CORS issues (Primary)
  () => this.getMetadataOfficial(videoUrl),      // Method 1: Official API (requires key)
  () => this.getMetadataScraping(videoUrl),      // Fallback: Web scraping
  () => this.getMetadataTikSave(videoUrl)        // Method 2: TikSave.io - Has CORS issues (Last resort)
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

export default TikTokMetadataService
