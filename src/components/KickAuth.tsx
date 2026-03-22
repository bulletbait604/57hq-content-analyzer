'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, LogIn, LogOut, CheckCircle, XCircle, Crown } from 'lucide-react'

interface KickAuthProps {
  onSubscriptionChange?: (subscribed: boolean) => void
  onUserChange?: (user: any) => void
}

export function KickAuth({ onSubscriptionChange, onUserChange }: KickAuthProps) {
  const [user, setUser] = useState<any>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock login for testing
  const handleMockLogin = () => {
    setIsLoading(true)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: '12345',
        username: 'testuser',
        display_name: 'Test User',
        profile_image_url: ''
      }

      // Simulate subscription check (you can change this to true for testing)
      const mockSubscribed = false // Change to true to test premium features

      setUser(mockUser)
      setIsSubscribed(mockSubscribed)
      onUserChange?.(mockUser)
      onSubscriptionChange?.(mockSubscribed)
      setIsLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    setUser(null)
    setIsSubscribed(false)
    onUserChange?.(null)
    onSubscriptionChange?.(false)
    setError(null)
  }

  if (user) {
    return (
      <Card className="bg-black border border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-cyan-400" />
            Kick Account Connected (Mock)
          </CardTitle>
          <CardDescription className="text-cyan-300">
            {isSubscribed ? 'Premium features unlocked!' : 'Basic access - Upgrade for AI features'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-900 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="font-medium text-white">{user.display_name || user.username}</p>
                <p className="text-sm text-cyan-300 flex items-center gap-1">
                  {isSubscribed ? (
                    <>
                      <Crown className="h-3 w-3 text-lime-400" />
                      <span className="text-lime-400">Verified Subscriber</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-cyan-400" />
                      <span>Not Subscribed to bulletbait604</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-cyan-500 text-cyan-500 hover:bg-cyan-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {!isSubscribed && (
            <div className="mt-4 p-3 bg-cyan-900 border border-cyan-600 rounded-lg">
              <p className="text-sm text-cyan-300">
                <strong>Unlock Premium Features:</strong> Subscribe to{' '}
                <a href="https://kick.com/bulletbait604" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">
                  bulletbait604
                </a>{' '}
                on Kick to access DeepSeek AI-powered content optimization.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black border border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <LogIn className="h-5 w-5 text-cyan-400" />
          Connect Your Kick Account (Mock for Testing)
        </CardTitle>
        <CardDescription className="text-cyan-300">
          Login with Kick to unlock premium AI features for subscribers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-cyan-300 mb-4">
              Subscribe to <strong>bulletbait604</strong> on Kick to unlock:
            </p>
            <div className="grid grid-cols-1 gap-2 text-sm text-cyan-400">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-4 w-4 text-lime-400" />
                <span>DeepSeek AI Content Analysis</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-4 w-4 text-lime-400" />
                <span>AI-Powered Tag Generation</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-4 w-4 text-lime-400" />
                <span>Algorithm Scoring & Insights</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-900 border border-red-500 rounded-lg">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button
              onClick={handleMockLogin}
              disabled={isLoading}
              className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Mock Login (Test Premium Features)
                </>
              )}
            </Button>
            
            <p className="text-xs text-cyan-400 text-center">
              Note: This is a mock login for testing. Set up Kick developer app for real OAuth.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
