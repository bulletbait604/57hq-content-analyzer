'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { KickAuth } from '@/components/KickAuth'
import { ClipAnalysis } from '@/components/ClipAnalysis'
import { Settings as SettingsComponent } from '@/components/Settings'
import { Footer } from '@/components/Footer'
import { AlgorithmUpdater } from '@/lib/algorithm-updater'
import { PremiumAccess } from '@/lib/premium-access'
import SubscribersManager from '@/lib/subscribers'

// Get instance using the static method
const algorithmUpdater = AlgorithmUpdater.getInstance()
import { 
  Upload, 
  Play, 
  Settings, 
  FileText, 
  Hash, 
  Search, 
  Clock, 
  RefreshCw,
  Lock,
  CheckCircle,
  ExternalLink,
  Star,
  TrendingUp,
  Video,
  Link,
  Zap
} from 'lucide-react'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [hasPremium, setHasPremium] = useState(false)
  const [language, setLanguage] = useState<'en' | 'es' | 'fr' | 'de' | 'ja'>('en')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Apply theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      } else {
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
      }
    }

    // Check for existing session
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
      const storedLanguage = localStorage.getItem('language') as 'en' | 'es' | 'fr' | 'de' | 'ja' | null | undefined
      
      if (storedTheme) {
        setTheme(storedTheme)
      }
      
      if (storedLanguage) {
        setLanguage(storedLanguage as 'en' | 'es' | 'fr' | 'de' | 'ja')
      }
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          console.log('🔄 Loading stored user:', parsedUser)
          setUser(parsedUser)
          
          // Use SubscribersManager instead of PremiumAccess
          const subscribersManager = SubscribersManager.getInstance()
          const isSub = subscribersManager.isSubscriber(parsedUser.username)
          console.log('🔍 Initial premium status:', {
            username: parsedUser.username,
            isSubscriber: isSub
          })
          setHasPremium(isSub)
        } catch (error) {
          console.error('❌ Error loading stored user:', error)
        }
      }
    }
  }, [])

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
    
    // Apply theme immediately
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage)
    }
  }

  const applyTheme = (theme: 'dark' | 'light') => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            57HQ Content Analyzer
          </h1>
          <p className="text-center text-gray-400 mb-8">
            AI-powered content optimization with algorithm research
          </p>
        </div>

        <Tabs defaultValue="clip-analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="clip-analysis" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Clip Analysis
            </TabsTrigger>
            <TabsTrigger value="tag-generator" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Tag Generator
            </TabsTrigger>
            <TabsTrigger value="content-analysis" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content Analysis
            </TabsTrigger>
            <TabsTrigger value="algorithm-info" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Algorithm Info
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clip-analysis" className="mt-6">
            <ClipAnalysis />
          </TabsContent>

          <TabsContent value="tag-generator" className="mt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-400 mb-2">Tag Generator</h2>
              <p className="text-gray-300">Generate optimized tags for your content</p>
            </div>
          </TabsContent>

          <TabsContent value="content-analysis" className="mt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-400 mb-2">Content Analysis</h2>
              <p className="text-gray-300">Analyze your content performance across platforms</p>
            </div>
          </TabsContent>

          <TabsContent value="algorithm-info" className="mt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-400 mb-2">Algorithm Info</h2>
              <p className="text-gray-300">Platform algorithm information and updates</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            {user ? (
              <SettingsComponent user={user} language={language} onLanguageChange={handleLanguageChange} />
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-400 mb-2">Settings</h2>
                <p className="text-gray-300">Please log in to access settings</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Footer />
      </div>
    </div>
  )
}
