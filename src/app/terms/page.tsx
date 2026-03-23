'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Terms of Service</h1>
          <p className="text-gray-300">Last updated: March 23, 2026</p>
        </div>

        <div className="space-y-6">
          {/* Acceptance of Terms */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                By accessing and using 57HQ Content Analyzer, you accept and agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
              <p className="text-gray-300">
                We may update these terms periodically. Continued use of service constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">57HQ Content Analyzer</h3>
                <p className="text-gray-300">
                  Our service provides AI-powered content analysis and optimization recommendations for social media 
                  creators across multiple platforms including YouTube, TikTok, Instagram, Twitter, and Facebook.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Features</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>• AI-powered content analysis using DeepSeek and Google AI</li>
                  <li>• Platform-specific optimization recommendations</li>
                  <li>• Title and description suggestions</li>
                  <li>• Tag generation and optimization</li>
                  <li>• Editing recommendations for algorithm success</li>
                  <li>• Premium features for subscribed users</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Account Security</h3>
                <p className="text-gray-300">
                  You are responsible for maintaining the confidentiality of your account credentials and for all 
                  activities that occur under your account.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Content Ownership</h3>
                <p className="text-gray-300">
                  You retain ownership of all content you submit for analysis. We do not claim ownership 
                  of your videos, titles, descriptions, or other creative works.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Prohibited Uses</h3>
                <p className="text-gray-300">
                  You may not use our service for illegal activities, harassment, spam, or to analyze 
                  content that violates platform terms of service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription and Payment */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Premium Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Premium Features</h3>
                <p className="text-gray-300">
                  Premium subscription provides access to advanced AI analysis, unlimited content processing, 
                  and priority support. Premium features are clearly marked in the interface.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Payment Terms</h3>
                <p className="text-gray-300">
                  Premium subscriptions are billed monthly or annually. You can cancel your subscription 
                  at any time through your account settings.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Refund Policy</h3>
                <p className="text-gray-300">
                  We offer a 7-day money-back guarantee for new premium subscriptions. 
                  Contact support for refund requests.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Service Ownership</h3>
                <p className="text-gray-300">
                  The 57HQ Content Analyzer service, including its algorithms, interfaces, and methodology, 
                  is owned by 57HQ and protected by intellectual property laws.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">User Content</h3>
                <p className="text-gray-300">
                  Analysis results and recommendations generated by our service are provided for your use. 
                  You retain full rights to your original content and any modified versions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Service Availability</h3>
                <p className="text-gray-300">
                  We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                  The service may be temporarily unavailable for maintenance or technical issues.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Accuracy of Analysis</h3>
                <p className="text-gray-300">
                  AI-generated recommendations are provided as guidance. Results may vary based on 
                  platform algorithm changes and content factors. Success is not guaranteed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Termination */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">User Termination</h3>
                <p className="text-gray-300">
                  You may terminate your account at any time. Upon termination, your data will be 
                  deleted in accordance with our privacy policy.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Service Termination</h3>
                <p className="text-gray-300">
                  We reserve the right to suspend or terminate accounts for violation of these terms or 
                  illegal activities. We will provide notice when possible.
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
                <p>For questions about these Terms of Service, contact us at:</p>
                <p><strong>Email:</strong> legal@57hq.com</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                By creating an account, connecting social media platforms, or using our 
                analysis services, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms and our Privacy Policy available at 
                <a href="https://sdhq-content-analyzer.vercel.app/privacy" className="text-green-400 hover:underline ml-2">
                  https://sdhq-content-analyzer.vercel.app/privacy
                </a>.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">2. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                SDHQ Content Analyzer provides:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Social media content analysis and optimization suggestions</li>
                <li>Integration with TikTok, Instagram, YouTube, Twitter, Facebook, and KICK platforms</li>
                <li>Algorithm insights and performance metrics</li>
                <li>Content optimization recommendations</li>
                <li>Premium features for subscribed users</li>
                <li>AI-powered tag generation and clip analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">3. User Responsibilities</CardTitle>
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
                <li>Ensure you have rights to analyze any connected content</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">4. Social Media Platform Integration</CardTitle>
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
                <li>TikTok integration follows TikTok's API terms and data usage policies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">5. Subscription and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Premium features require subscription:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Subscriptions are managed through our premium platform</li>
                <li>Subscription fees are $9.99/month and are non-refundable except as required by law</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
                <li>Subscription grants access to premium features during active period</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-2">Our Content</h3>
                <p className="text-gray-300">
                  All content, features, and functionality of our service are owned by 
                  SDHQ Content Analyzer and protected by copyright, trademark, and other 
                  intellectual property laws.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-2">Your Content</h3>
                <p className="text-gray-300">
                  You retain ownership of your content. By using our service, you grant us 
                  a limited license to access, analyze, and process your content solely to 
                  provide our services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">7. Service Availability</CardTitle>
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

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">8. Limitation of Liability</CardTitle>
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

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">9. Termination</CardTitle>
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

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We reserve the right to modify these Terms at any time. Changes will be 
                effective immediately upon posting. Your continued use of the service 
                constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                If you have questions about these Terms, please contact us at:
              </p>
              <div className="text-green-400">
                <p>Email: support@sdhq.com</p>
                <p>Website: <a href="https://sdhq-content-analyzer.vercel.app" className="hover:underline">https://sdhq-content-analyzer.vercel.app</a></p>
                <p>Contact Form: <a href="https://sdhq-content-analyzer.vercel.app/contact" className="hover:underline">https://sdhq-content-analyzer.vercel.app/contact</a></p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-900/20 border border-green-500/50">
            <CardHeader>
              <CardTitle className="text-green-400">TikTok API Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                This Terms of Service is designed to comply with TikTok's API requirements:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Permanent URL: https://sdhq-content-analyzer.vercel.app/terms</li>
                <li>Clear terms regarding data usage and user responsibilities</li>
                <li>Specific section on social media platform integration</li>
                <li>Transparent contact information and support channels</li>
                <li>Regular updates to maintain compliance with API requirements</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
