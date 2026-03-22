// Third-Party TikTok API Integration
// Uses RapidAPI for easy video data access

export interface TikTokVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  url: string
  createTime: number
  stats: {
    playCount: number
    likeCount: number
    commentCount: number
    shareCount: number
  }
  author: {
    username: string
    displayName: string
    avatar: string
  }
}

export interface TikTokUser {
  username: string
  displayName: string
  avatar: string
  followerCount: number
  followingCount: number
  videoCount: number
  verified: boolean
}

export class TikTokAPI {
  private apiKey: string
  private baseURL: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseURL = 'https://tiktok-api23.p.rapidapi.com'
  }

  async getUserRecentVideos(username: string, count: number = 20): Promise<TikTokVideo[]> {
    try {
      console.log(`🎵 Fetching recent videos for @${username} via RapidAPI TikTok API`)
      
      const response = await fetch(`${this.baseURL}/api/user/posts/@${username}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'tiktok-api23.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`❌ TikTok API error (${response.status}):`, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Got TikTok videos data:', data)

      // Transform the data to our format
      const videos: TikTokVideo[] = data.data?.video?.map((video: any) => ({
        id: video.id || video.video_id,
        title: video.desc || video.description || 'No title',
        description: video.desc || video.description || '',
        thumbnail: video.cover || video.thumbnail || video.dynamic_cover,
        url: video.play || video.video_url || `https://www.tiktok.com/@${username}/video/${video.id}`,
        createTime: video.createTime || video.create_time || Date.now(),
        stats: {
          playCount: video.stats?.playCount || video.play_count || 0,
          likeCount: video.stats?.likeCount || video.digg_count || 0,
          commentCount: video.stats?.commentCount || video.comment_count || 0,
          shareCount: video.stats?.shareCount || video.share_count || 0
        },
        author: {
          username: username,
          displayName: video.author?.nickname || username,
          avatar: video.author?.avatarThumb || ''
        }
      })) || []

      console.log(`✅ Processed ${videos.length} TikTok videos`)
      return videos

    } catch (error) {
      console.error('❌ TikTok API failed:', error)
      throw error
    }
  }

  async getUserInfo(username: string): Promise<TikTokUser | null> {
    try {
      console.log(`🎵 Fetching user info for @${username} via RapidAPI TikTok API`)
      
      const response = await fetch(`${this.baseURL}/api/user/info/@${username}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'tiktok-api23.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`❌ TikTok user info error (${response.status}):`, errorText)
        return null
      }

      const data = await response.json()
      console.log('✅ Got TikTok user info:', data)

      const userInfo = data.data?.user
      if (!userInfo) return null

      const user: TikTokUser = {
        username: userInfo.uniqueId || userInfo.unique_id || username,
        displayName: userInfo.nickname || username,
        avatar: userInfo.avatarThumb || userInfo.avatar_thumb || '',
        followerCount: userInfo.stats?.followerCount || userInfo.follower_count || 0,
        followingCount: userInfo.stats?.followingCount || userInfo.following_count || 0,
        videoCount: userInfo.stats?.videoCount || userInfo.video_count || 0,
        verified: userInfo.verified || false
      }

      console.log('✅ Processed TikTok user info:', user)
      return user

    } catch (error) {
      console.error('❌ TikTok user info failed:', error)
      return null
    }
  }

  async getVideoDetails(videoId: string): Promise<TikTokVideo | null> {
    try {
      console.log(`🎵 Fetching video details for ${videoId} via RapidAPI TikTok API`)
      
      const response = await fetch(`${this.baseURL}/api/video/${videoId}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'tiktok-api23.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`❌ TikTok video details error (${response.status}):`, errorText)
        return null
      }

      const data = await response.json()
      console.log('✅ Got TikTok video details:', data)

      const video = data.data?.video
      if (!video) return null

      const videoDetails: TikTokVideo = {
        id: video.id || video.video_id,
        title: video.desc || video.description || 'No title',
        description: video.desc || video.description || '',
        thumbnail: video.cover || video.thumbnail || video.dynamic_cover,
        url: video.play || video.video_url || `https://www.tiktok.com/@${video.author?.uniqueId}/video/${video.id}`,
        createTime: video.createTime || video.create_time || Date.now(),
        stats: {
          playCount: video.stats?.playCount || video.play_count || 0,
          likeCount: video.stats?.likeCount || video.digg_count || 0,
          commentCount: video.stats?.commentCount || video.comment_count || 0,
          shareCount: video.stats?.shareCount || video.share_count || 0
        },
        author: {
          username: video.author?.uniqueId || video.author?.unique_id || 'unknown',
          displayName: video.author?.nickname || 'Unknown',
          avatar: video.author?.avatarThumb || video.author?.avatar_thumb || ''
        }
      }

      console.log('✅ Processed TikTok video details:', videoDetails)
      return videoDetails

    } catch (error) {
      console.error('❌ TikTok video details failed:', error)
      return null
    }
  }

  async searchVideos(query: string, count: number = 20): Promise<TikTokVideo[]> {
    try {
      console.log(`🎵 Searching TikTok videos for "${query}" via RapidAPI TikTok API`)
      
      const response = await fetch(`${this.baseURL}/api/search/video?keywords=${encodeURIComponent(query)}&count=${count}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'tiktok-api23.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`❌ TikTok search error (${response.status}):`, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Got TikTok search results:', data)

      const videos: TikTokVideo[] = data.data?.videos?.map((video: any) => ({
        id: video.id || video.video_id,
        title: video.desc || video.description || 'No title',
        description: video.desc || video.description || '',
        thumbnail: video.cover || video.thumbnail || video.dynamic_cover,
        url: video.play || video.video_url || `https://www.tiktok.com/@${video.author?.uniqueId}/video/${video.id}`,
        createTime: video.createTime || video.create_time || Date.now(),
        stats: {
          playCount: video.stats?.playCount || video.play_count || 0,
          likeCount: video.stats?.likeCount || video.digg_count || 0,
          commentCount: video.stats?.commentCount || video.comment_count || 0,
          shareCount: video.stats?.shareCount || video.share_count || 0
        },
        author: {
          username: video.author?.uniqueId || video.author?.unique_id || 'unknown',
          displayName: video.author?.nickname || 'Unknown',
          avatar: video.author?.avatarThumb || video.author?.avatar_thumb || ''
        }
      })) || []

      console.log(`✅ Processed ${videos.length} TikTok search results`)
      return videos

    } catch (error) {
      console.error('❌ TikTok search failed:', error)
      throw error
    }
  }
}
