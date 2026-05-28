'use client'

import { useLanguage } from '@/contexts/LanguageContext'

const FLAGS = [
  { lang: 'de' as const, emoji: '🇩🇪', label: 'Deutsch' },
  { lang: 'en' as const, emoji: '🇬🇧', label: 'English' },
  { lang: 'da' as const, emoji: '🇩🇰', label: 'Dansk' },
]

export default function LangToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        background: 'rgba(10,22,40,0.55)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(212,168,67,0.25)',
        borderRadius: '999px',
        padding: '4px 6px',
      }}
    >
      {FLAGS.map(({ lang: l, emoji, label }) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-label={label}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '3px 5px',
            borderRadius: '999px',
            fontSize: '1.15rem',
            lineHeight: 1,
            opacity: lang === l ? 1 : 0.3,
            transition: 'opacity 0.2s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
