import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const mainAppUrl = 'https://sdhq-content-analyzer.vercel.app'

  if (code) {
    // Redirect to main app with success
    return NextResponse.redirect(`${mainAppUrl}?auth=success&code=${code}`)
  } else if (error) {
    // Redirect to main app with error
    return NextResponse.redirect(`${mainAppUrl}?auth=error&message=${encodeURIComponent(error)}`)
  } else {
    // Redirect to main app with no code error
    return NextResponse.redirect(`${mainAppUrl}?auth=error&message=no_code`)
  }
}
