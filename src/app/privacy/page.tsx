import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-8">Privacy Policy</h1>
        
        <div className="space-y-8">
          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">Last Updated: March 23, 2024</CardTitle>
              <CardDescription className="text-gray-400">
                This Privacy Policy is compliant with TikTok API requirements and accessible at: 
                <a href="https://sdhq-content-analyzer.vercel.app/privacy" className="text-green-400 hover:underline ml-2">
                  https://sdhq-content-analyzer.vercel.app/privacy
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                SDHQ Content Analyzer ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information when 
                you use our content analysis platform.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-2">Account Information</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Username and display names from connected social media platforms</li>
                  <li>Profile information (bio, profile picture, follower count)</li>
                  <li>Authentication tokens for API access</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-2">Content Data</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Public video/post metadata (title, description, upload time)</li>
                  <li>Engagement metrics (views, likes, comments, shares)</li>
                  <li>Content thumbnails and media URLs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-2">Usage Data</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Platform interaction patterns</li>
                  <li>Analysis requests and results</li>
                  <li>Feature usage statistics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide content analysis and optimization services</li>
                <li>Generate personalized recommendations</li>
                <li>Maintain and improve our platform functionality</li>
                <li>Communicate with you about service updates</li>
                <li>Ensure compliance with platform terms of service</li>
                <li>Aggregate anonymous data for research and improvement</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">3. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>We may share aggregated, anonymous data for research purposes</li>
                <li>We may disclose information if required by law or legal process</li>
                <li>We may share information with trusted service providers who assist in operating our platform</li>
                <li>We may share information to protect our rights, property, or safety</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Secure authentication and access controls</li>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Secure storage of authentication tokens and credentials</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">5. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We retain your personal information for as long as necessary to provide the services and fulfill the purposes outlined in this Privacy Policy:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Account information: Retained until account deletion</li>
                <li>Content data: Cached for up to 30 days for analysis purposes</li>
                <li>Usage data: Retained for 12 months for service improvement</li>
                <li>Authentication tokens: Refreshed according to platform requirements</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">6. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Access your personal information</li>
                <li>Update or correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Object to processing of your information</li>
                <li>Request data portability</li>
                <li>Opt out of certain communications</li>
                <li>Revoke authorization for connected platforms</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">7. Third-Party Platform Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                When you connect social media platforms:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>TikTok: We access public profile information and video data per TikTok API terms</li>
                <li>Instagram: We access public posts and basic profile information with your permission</li>
                <li>YouTube: We access public video data and channel information through YouTube API</li>
                <li>Twitter: We access public tweets and profile information through Twitter API</li>
                <li>Facebook: We access public posts and page information through Facebook Graph API</li>
                <li>KICK: We access public streaming data and user information through KICK API</li>
              </ul>
              <p className="text-gray-300 mt-2">
                Each platform's data usage is governed by their respective terms of service and privacy policies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">8. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last Updated" date at the top</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying in-app notifications for active users</li>
              </ul>
              <p className="text-gray-300 mt-2">
                The updated policy will be available at: 
                <a href="https://sdhq-content-analyzer.vercel.app/privacy" className="text-green-400 hover:underline ml-2">
                  https://sdhq-content-analyzer.vercel.app/privacy
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">9. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
              </p>
              <div className="text-green-400">
                <p>Email: privacy@sdhq.com</p>
                <p>Website: <a href="https://sdhq-content-analyzer.vercel.app" className="hover:underline">https://sdhq-content-analyzer.vercel.app</a></p>
                <p>Privacy Contact: <a href="https://sdhq-content-analyzer.vercel.app/privacy-contact" className="hover:underline">https://sdhq-content-analyzer.vercel.app/privacy-contact</a></p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-900/20 border border-green-500/50">
            <CardHeader>
              <CardTitle className="text-green-400">TikTok API Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                This Privacy Policy is designed to comply with TikTok's API requirements:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Permanent URL: https://sdhq-content-analyzer.vercel.app/privacy</li>
                <li>Clear description of TikTok data collection and usage</li>
                <li>Transparent data retention and sharing practices</li>
                <li>User rights and control over TikTok data</li>
                <li>Compliance with TikTok's data protection standards</li>
                <li>Regular updates to maintain API compliance</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
