'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LangToggle() {
  const { lang, toggle } = useLanguage()

  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
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
        padding: '5px 12px',
        cursor: 'pointer',
        fontFamily: 'var(--font-outfit), sans-serif',
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <span style={{ color: lang === 'de' ? '#ECC564' : 'rgba(245,237,216,0.35)', transition: 'color 0.2s' }}>DE</span>
      <span style={{ color: 'rgba(245,237,216,0.2)', margin: '0 3px' }}>|</span>
      <span style={{ color: lang === 'en' ? '#ECC564' : 'rgba(245,237,216,0.35)', transition: 'color 0.2s' }}>EN</span>
    </button>
  )
}
