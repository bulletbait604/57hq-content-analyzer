import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">Privacy Policy</h1>
        
        <div className="space-y-8">
          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Last Updated: March 22, 2026</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                SDHQ Content Analyzer ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information when 
                you use our content analysis platform.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">Account Information</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Username and display names from connected social media platforms</li>
                  <li>Profile information (bio, profile picture, follower count)</li>
                  <li>Authentication tokens for API access</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">Content Data</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Public video/post metadata (title, description, upload time)</li>
                  <li>Engagement metrics (views, likes, comments, shares)</li>
                  <li>Content thumbnails and media URLs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">Usage Data</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Platform interaction patterns</li>
                  <li>Analysis requests and results</li>
                  <li>Technical usage data (IP address, browser type)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Content Analysis:</strong> To analyze your social media content and provide optimization suggestions</li>
                <li><strong>Platform Integration:</strong> To connect with TikTok, Instagram, and YouTube APIs</li>
                <li><strong>Service Improvement:</strong> To enhance our analysis algorithms and user experience</li>
                <li><strong>Technical Support:</strong> To troubleshoot issues and maintain service quality</li>
                <li><strong>Security:</strong> To protect against unauthorized access and fraud</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Secure HTTPS encryption for all data transmission</li>
                <li>Encrypted storage of sensitive credentials</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to user data on a need-to-know basis</li>
                <li>Compliance with data protection regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We integrate with the following third-party platforms:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>TikTok API:</strong> For accessing public video data and user information</li>
                <li><strong>Instagram Basic Display API:</strong> For retrieving user profile and media data</li>
                <li><strong>YouTube Data API v3:</strong> For accessing public video information and analytics</li>
                <li><strong>Kick API:</strong> For user authentication and subscription verification</li>
              </ul>
              <p className="text-gray-300">
                These services have their own privacy policies and data handling practices. 
                We are not responsible for their data collection methods.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of data collection where legally permitted</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We retain your data for as long as necessary to provide our services:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Account data: Until you delete your account</li>
                <li>Analysis results: 90 days from generation</li>
                <li>API responses: 24 hours for caching purposes</li>
                <li>Authentication tokens: Until revoked or expired</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                If you have questions about this Privacy Policy or want to exercise your rights, 
                please contact us at:
              </p>
              <div className="text-cyan-300">
                <p>Email: privacy@sdhqcreatorcorner.com</p>
                <p>Discord: SDHQ Creator Corner Community</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
