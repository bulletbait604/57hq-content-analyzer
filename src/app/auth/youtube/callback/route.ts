import { NextRequest, NextResponse } from 'next/server'
import { YouTubeOAuth } from '@/lib/youtube-oauth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔐 YouTube OAuth callback received')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      console.error('❌ YouTube OAuth error:', error, errorDescription)
      return NextResponse.redirect(
        `/?auth=error&platform=youtube&error=${error}&description=${errorDescription}`
      )
    }

    // Check for authorization code
    if (!code) {
      console.error('❌ No authorization code received')
      return NextResponse.redirect(
        '/?auth=error&platform=youtube&error=no_code&description=No authorization code received'
      )
    }

    // Exchange code for access token
    const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || ''
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || ''
    const redirectUri = process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI || 'https://sdhq-content-analyzer.vercel.app/auth/youtube/callback'
    
    const youtubeOAuth = new YouTubeOAuth(clientId, clientSecret, redirectUri)
    const tokenData = await youtubeOAuth.exchangeCodeForToken(code)
    
    // Get user information
    const userInfo = await youtubeOAuth.getUserInfo(tokenData.access_token)
    
    console.log('✅ YouTube OAuth success:', userInfo.channelTitle)

    // Store YouTube user data and tokens
    const youtubeData = {
      user: userInfo,
      tokens: tokenData,
      connectedAt: new Date().toISOString()
    }

    // Store in localStorage via redirect
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('auth', 'success')
    redirectUrl.searchParams.set('platform', 'youtube')
    redirectUrl.searchParams.set('username', userInfo.channelTitle)
    redirectUrl.searchParams.set('channelId', userInfo.channelId)
    
    return NextResponse.redirect(redirectUrl.toString())

  } catch (error) {
    console.error('❌ YouTube OAuth callback error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.redirect(
      `/?auth=error&platform=youtube&error=callback_failed&description=${encodeURIComponent(errorMessage)}`
    )
  }
}
