'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, Settings } from 'lucide-react'
import { KickSubscriptionChecker } from '@/lib/kick-subscription-checker'

interface AdminPanelProps {
  onSubscriptionChange?: (username: string, isSubscribed: boolean) => void
}

export function AdminPanel({ onSubscriptionChange }: AdminPanelProps) {
  const [username, setUsername] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const subscriptionChecker = new KickSubscriptionChecker(
    process.env.NEXT_PUBLIC_RAPIDAPI_KICK_API_KEY || '',
    'bulletbait604'
  )

  const handleSetSubscription = async () => {
    if (!username.trim()) {
      setMessage('Please enter a username')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const success = await subscriptionChecker.adminSetSubscription(username.trim(), isSubscribed)
      
      if (success) {
        setMessage(`✅ Successfully set ${username} as ${isSubscribed ? 'SUBSCRIBED' : 'NOT SUBSCRIBED'}`)
        onSubscriptionChange?.(username.trim(), isSubscribed)
        
        // Clear form after 2 seconds
        setTimeout(() => {
          setUsername('')
          setMessage('')
        }, 2000)
      } else {
        setMessage('❌ Failed to set subscription status')
      }
    } catch (error) {
      setMessage('❌ Error setting subscription status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckCurrent = () => {
    if (!username.trim()) {
      setMessage('Please enter a username')
      return
    }

    const currentStatus = subscriptionChecker.checkAdminOverride(username.trim())
    if (currentStatus !== null) {
      setMessage(`📋 ${username} is currently ${currentStatus ? 'SUBSCRIBED' : 'NOT SUBSCRIBED'}`)
    } else {
      setMessage(`📋 ${username} has no admin override set`)
    }
  }

  return (
    <Card className="bg-black border-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Admin Panel (Testing)
        </CardTitle>
        <CardDescription className="text-gray-400">
          Set subscription status for testing premium features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-cyan-300 text-sm">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="Enter Kick username"
            className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 text-cyan-300 placeholder-gray-500 rounded focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="subscribed"
            checked={isSubscribed}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsSubscribed(e.target.checked)}
            className="w-4 h-4 text-cyan-400 bg-black border-cyan-500/30 rounded focus:ring-cyan-400"
          />
          <label htmlFor="subscribed" className="text-cyan-300 text-sm">
            Subscribed to bulletbait604
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSetSubscription}
            disabled={isLoading || !username.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 text-black"
          >
            <Crown className="w-4 h-4 mr-2" />
            {isLoading ? 'Setting...' : 'Set Status'}
          </Button>
          
          <Button
            onClick={handleCheckCurrent}
            disabled={!username.trim()}
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            Check Current
          </Button>
        </div>

        {message && (
          <div className="text-sm p-2 bg-black/50 border border-cyan-500/20 rounded text-cyan-300">
            {message}
          </div>
        )}

        <div className="text-xs text-gray-500">
          💡 This is for testing only. Set users as subscribed to test premium features.
        </div>
      </CardContent>
    </Card>
  )
}
