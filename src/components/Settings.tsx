'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { 
  Settings as SettingsIcon, 
  Globe,
  Shield,
  FileText,
  Mail
} from 'lucide-react'

interface SettingsProps {
  user: any
}

const translations = {
  en: {
    title: 'Settings',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    language: 'Language',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    account: 'Account Settings',
    username: 'Username',
    premium: 'Premium Status',
    active: 'Active',
    inactive: 'Inactive',
    save: 'Save Settings',
    saved: 'Settings saved successfully!',
    error: 'Error saving settings',
    selectLanguage: 'Select Language',
    selectTheme: 'Select Theme'
  },
  es: {
    title: 'Configuración',
    theme: 'Tema',
    dark: 'Oscuro',
    light: 'Claro',
    language: 'Idioma',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
    account: 'Configuración de Cuenta',
    username: 'Nombre de Usuario',
    email: 'Correo Electrónico',
    joined: 'Se unió',
    premium: 'Estado Premium',
    active: 'Activo',
    inactive: 'Inactivo',
    save: 'Guardar Configuración',
    saved: '¡Configuración guardada con éxito!',
    error: 'Error al guardar la configuración',
    selectLanguage: 'Seleccionar Idioma',
    selectTheme: 'Seleccionar Tema'
  },
  fr: {
    title: 'Paramètres',
    theme: 'Thème',
    dark: 'Sombre',
    light: 'Clair',
    language: 'Langue',
    privacy: 'Politique de Confidentialité',
    terms: 'Conditions d\'Utilisation',
    account: 'Paramètres du Compte',
    username: 'Nom d\'Utilisateur',
    premium: 'Statut Premium',
    active: 'Actif',
    inactive: 'Inactif',
    save: 'Sauvegarder les Paramètres',
    saved: 'Paramètres sauvegardés avec succès!',
    error: 'Erreur lors de la sauvegarde des paramètres',
    selectLanguage: 'Sélectionner la Langue',
    selectTheme: 'Sélectionner le Thème'
  },
  de: {
    title: 'Einstellungen',
    theme: 'Thema',
    dark: 'Dunkel',
    light: 'Hell',
    language: 'Sprache',
    privacy: 'Datenschutzerklärung',
    terms: 'Nutzungsbedingungen',
    account: 'Kontoeinstellungen',
    username: 'Benutzername',
    premium: 'Premium-Status',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    save: 'Einstellungen Speichern',
    saved: 'Einstellungen erfolgreich gespeichert!',
    error: 'Fehler beim Speichern der Einstellungen',
    selectLanguage: 'Sprache Auswählen',
    selectTheme: 'Thema Auswählen'
  },
  ja: {
    title: '設定',
    theme: 'テーマ',
    dark: 'ダーク',
    light: 'ライト',
    language: '言語',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    account: 'アカウント設定',
    username: 'ユーザー名',
    premium: 'プレミアムステータス',
    active: 'アクティブ',
    inactive: '非アクティブ',
    save: '設定を保存',
    saved: '設定が正常に保存されました！',
    error: '設定の保存中にエラーが発生しました',
    selectLanguage: '言語を選択',
    selectTheme: 'テーマを選択'
  }
}

interface SettingsProps {
  user: any
  language: 'en' | 'es' | 'fr' | 'de' | 'ja'
  onLanguageChange: (newLanguage: 'en' | 'es' | 'fr' | 'de' | 'ja') => void
}

type Language = keyof typeof translations

interface SettingsProps {
  user: any
  language: 'en' | 'es' | 'fr' | 'de' | 'ja'
  onLanguageChange: (newLanguage: 'en' | 'es' | 'fr' | 'de' | 'ja') => void
}

export function Settings({ user, language, onLanguageChange }: SettingsProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(language)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const t = (key: keyof typeof translations.en) => translations[currentLanguage][key] || translations.en[key]

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) setCurrentLanguage(savedLanguage)
  }, [])

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    onLanguageChange(newLanguage)
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      // Simulate saving to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveMessage(t('saved'))
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage(t('error'))
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-gray-400">
              <SettingsIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">{t('title')}</p>
              <p>Please sign in with your Kick account to access settings.</p>
            </div>
            <div className="text-yellow-400 text-sm">
              <p>Sign in to customize your experience:</p>
              <ul className="mt-2 space-y-1">
                <li>• Theme preferences</li>
                <li>• Language selection</li>
                <li>• Account management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">{t('title')}</h2>
        <p className="text-gray-300">Customize your experience and preferences</p>
      </div>
      
      {/* Language Settings */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('language')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-green-400">{t('selectLanguage')}</Label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="w-full bg-black border border-green-500/50 rounded p-2 text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t('account')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-green-400">{t('username')}</Label>
              <p className="text-white p-2 bg-black/50 rounded">{user.username}</p>
            </div>
            <div>
              <Label className="text-green-400">{t('premium')}</Label>
              <div className="mt-2">
                <Badge className={user.is_premium ? "bg-green-600/20 text-green-400 border-green-500" : "bg-gray-600/20 text-gray-400 border-gray-500"}>
                  {user.is_premium ? t('active') : t('inactive')}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-500 text-black px-8"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-green-600 border-t-transparent animate-spin" />
              Saving...
            </>
          ) : (
            t('save')
          )}
        </Button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="text-center">
          <p className={`text-sm ${saveMessage === t('saved') ? 'text-green-400' : 'text-red-400'}`}>
            {saveMessage}
          </p>
        </div>
      )}
    </div>
  )
}
