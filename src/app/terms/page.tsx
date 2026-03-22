import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">Terms of Service</h1>
        
        <div className="space-y-8">
          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Last Updated: March 22, 2026</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Welcome to SDHQ Content Analyzer. These Terms of Service ("Terms") govern your 
                use of our content analysis platform and services. By accessing or using our 
                service, you agree to be bound by these Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                By creating an account, connecting social media platforms, or using our 
                analysis services, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms and our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">2. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                SDHQ Content Analyzer provides:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Social media content analysis and optimization suggestions</li>
                <li>Integration with TikTok, Instagram, and YouTube platforms</li>
                <li>Algorithm insights and performance metrics</li>
                <li>Content optimization recommendations</li>
                <li>Premium features for subscribed users</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                As a user, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide accurate information when creating accounts</li>
                <li>Maintain the security of your login credentials</li>
                <li>Use the service for lawful purposes only</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Not attempt to reverse engineer or exploit our systems</li>
                <li>Comply with all applicable laws and platform terms</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">4. Social Media Platform Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                When you connect social media accounts:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>You authorize us to access your public content and basic profile information</li>
                <li>You must have the right to share and analyze the connected content</li>
                <li>You remain responsible for compliance with each platform's terms of service</li>
                <li>We only access data necessary to provide our analysis services</li>
                <li>You can revoke access at any time through your account settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">5. Subscription and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Premium features require subscription:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Subscriptions are managed through Kick platform integration</li>
                <li>Subscription fees are non-refundable except as required by law</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
                <li>Subscription grants access to premium features during active period</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">Our Content</h3>
                <p className="text-gray-300">
                  All content, features, and functionality of our service are owned by 
                  SDHQ Content Analyzer and protected by copyright, trademark, and other 
                  intellectual property laws.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">Your Content</h3>
                <p className="text-gray-300">
                  You retain ownership of your content. By using our service, you grant us 
                  a limited license to access, analyze, and process your content solely to 
                  provide our services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">7. Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We strive to provide reliable service but:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Service availability is not guaranteed 100% of the time</li>
                <li>We may perform maintenance that temporarily affects service</li>
                <li>Third-party API availability affects our service functionality</li>
                <li>We are not responsible for platform-specific outages</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Our service is provided "as is" without warranties</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our liability is limited to the amount paid for subscription (if any)</li>
                <li>We are not responsible for content accuracy or platform algorithm changes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">9. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We may terminate or suspend your account if:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>You violate these Terms of Service</li>
                <li>You engage in fraudulent or illegal activities</li>
                <li>You misuse or exploit our systems</li>
                <li>You violate platform terms of connected services</li>
              </ul>
              <p className="text-gray-300">
                You may terminate your account at any time through your account settings.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We reserve the right to modify these Terms at any time. Changes will be 
                effective immediately upon posting. Your continued use of the service 
                constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                If you have questions about these Terms, please contact us at:
              </p>
              <div className="text-cyan-300">
                <p>Email: support@sdhqcreatorcorner.com</p>
                <p>Discord: SDHQ Creator Corner Community</p>
                <p>Kick: @bulletbait604</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
