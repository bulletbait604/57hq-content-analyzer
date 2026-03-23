import { NextRequest, NextResponse } from 'next/server'
import { getTikTokOAuth } from '@/lib/tiktok-oauth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔐 TikTok OAuth callback received')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      console.error('❌ TikTok OAuth error:', error, errorDescription)
      return NextResponse.redirect(
        `/?auth=error&platform=tiktok&error=${error}&description=${errorDescription}`
      )
    }

    // Check for authorization code
    if (!code) {
      console.error('❌ No authorization code received')
      return NextResponse.redirect(
        '/?auth=error&platform=tiktok&error=no_code&description=No authorization code received'
      )
    }

    // Exchange code for access token
    const tiktokOAuth = getTikTokOAuth()
    const tokenData = await tiktokOAuth.exchangeCodeForToken(code, state || '')
    
    // Get user information
    const userInfo = await tiktokOAuth.getUserInfo(tokenData.access_token)
    
    console.log('✅ TikTok OAuth success:', userInfo.display_name)

    // Store TikTok user data and tokens
    const tiktokData = {
      user: userInfo,
      tokens: tokenData,
      connectedAt: new Date().toISOString()
    }

    // Redirect back to main app with success
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('auth', 'success')
    redirectUrl.searchParams.set('platform', 'tiktok')
    redirectUrl.searchParams.set('username', userInfo.display_name)
    
    return NextResponse.redirect(redirectUrl.toString())

  } catch (error) {
    console.error('❌ TikTok OAuth callback error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.redirect(
      `/?auth=error&platform=tiktok&error=callback_failed&description=${encodeURIComponent(errorMessage)}`
    )
  }
}
