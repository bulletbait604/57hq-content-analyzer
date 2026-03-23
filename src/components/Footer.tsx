'use client'

import { useState, useEffect } from 'react'
import { Mail, FileText, Shield } from 'lucide-react'

interface FooterProps {
  language?: string
}

const translations = {
  en: {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    rights: '© 2024 SDHQ Content Analyzer. All rights reserved.',
    powered: 'Powered by AI'
  },
  es: {
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
    rights: '© 2024 SDHQ Content Analyzer. Todos los derechos reservados.',
    powered: 'Impulsado por IA'
  },
  fr: {
    privacy: 'Politique de Confidentialité',
    terms: 'Conditions d\'Utilisation',
    rights: ' 2024 SDHQ Content Analyzer. Tous droits réservés.',
    powered: 'Alimenté par IA'
  },
  de: {
    privacy: 'Datenschutzerklärung',
    terms: 'Nutzungsbedingungen',
    rights: ' 2024 SDHQ Content Analyzer. Alle Rechte vorbehalten.',
    powered: 'Angetrieben von KI'
  },
  ja: {
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    rights: ' 2024 SDHQ Content Analyzer. 全権利留保。',
    powered: 'AI駆動'
  }
}

type Language = keyof typeof translations

export function Footer({ language = 'en' }: FooterProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const t = (key: keyof typeof translations.en) => 
    translations[currentLanguage][key] || translations.en[key]

  return (
    <footer className="bg-black/50 border-t border-green-500/30 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-green-400 font-semibold mb-4">57HQ</h3>
            <p className="text-gray-300 text-sm mb-2">
              {t('powered')}
            </p>
            <p className="text-gray-400 text-xs">
              {t('rights')}
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-green-400 font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <a
                href="/privacy"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors text-sm"
              >
                <Shield className="w-4 h-4" />
                {t('privacy')}
              </a>
              <a
                href="/terms"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                {t('terms')}
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-green-400 font-semibold mb-4">Support</h3>
            <a
              href="mailto:support@57hq.com"
              className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              support@57hq.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-500/30 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-xs">
            {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
