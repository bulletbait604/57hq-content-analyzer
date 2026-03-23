'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, Lock, Database } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: March 23, 2026</p>
        </div>

        <div className="space-y-6">
          {/* Information We Collect */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Account Information</h3>
                <p className="text-gray-300">
                  When you sign in with your Kick account, we collect your username, profile information, 
                  and authentication tokens to provide access to premium features.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Content Analysis Data</h3>
                <p className="text-gray-300">
                  Video files and URLs you submit for analysis are temporarily processed by our AI partners 
                  (DeepSeek and Google AI). We do not store your video content permanently.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Usage Data</h3>
                <p className="text-gray-300">
                  We collect anonymous usage statistics to improve our services, including feature usage patterns 
                  and performance metrics.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Service Provision</h3>
                <p className="text-gray-300">
                  Your information is used to provide AI-powered content analysis, generate optimization suggestions,
                  and deliver personalized recommendations for your content.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Service Improvement</h3>
                <p className="text-gray-300">
                  We analyze usage patterns and feedback to improve our algorithms and user experience.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Communication</h3>
                <p className="text-gray-300">
                  We may contact you regarding service updates, security notifications, or support responses.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Security Measures</h3>
                <p className="text-gray-300">
                  We implement industry-standard security measures including encryption, secure authentication,
                  and regular security audits to protect your information.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Data Retention</h3>
                <p className="text-gray-300">
                  Video analysis data is temporarily processed and deleted within 24 hours. 
                  Account information is retained until you delete your account.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Third-Party Services</h3>
                <p className="text-gray-300">
                  We use DeepSeek AI and Google AI for content analysis. These services have their own 
                  privacy policies and data handling practices.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Access and Control</h3>
                <p className="text-gray-300">
                  You have the right to access, update, or delete your account information at any time 
                  through your account settings.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Data Portability</h3>
                <p className="text-gray-300">
                  You can request a copy of your personal data in a machine-readable format.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Opt-Out</h3>
                <p className="text-gray-300">
                  You can opt out of data collection by deleting your account. Premium features will 
                  no longer be available after account deletion.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-300">
                <p>For privacy-related questions or concerns, contact us at:</p>
                <p><strong>Email:</strong> privacy@57hq.com</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
