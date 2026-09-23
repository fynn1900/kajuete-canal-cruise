'use client'
import { useState, useEffect } from 'react'

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const MONTH_FULL: Record<string, string[]> = {
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  da: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
}

export type BlockedDate = { date: string; reason: string | null }

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// Season: June 1 – Sept 30
function isInSeason(month: number): boolean {
  return month >= 6 && month <= 9
}

type MsgState = { type: 'offseason' } | { type: 'blocked'; reason: string | null } | null

type Props = {
  value: string
  onChange: (iso: string) => void
  lang: 'de' | 'en' | 'da'
  offSeasonMsg: string
  blockedTitle: string
  blockedDates: BlockedDate[]
}

export default function CalendarPicker({ value, onChange, lang, offSeasonMsg, blockedTitle, blockedDates }: Props) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const todayISO = toISO(currentYear, now.getMonth() + 1, now.getDate())

  const initYear = value ? parseInt(value.split('-')[0]) : currentYear
  const initMonth = value ? parseInt(value.split('-')[1]) : now.getMonth() + 1

  const [calYear, setCalYear] = useState(initYear)
  const [calMonth, setCalMonth] = useState(initMonth)
  const [msg, setMsg] = useState<MsgState>(null)
  const [toastVisible, setToastVisible] = useState(false)

  // Auto-dismiss toast after 3.5 s
  useEffect(() => {
    if (!msg) { setToastVisible(false); return }
    setToastVisible(true)
    const timer = setTimeout(() => {
      setToastVisible(false)
      setTimeout(() => setMsg(null), 300) // wait for fade-out
    }, 3500)
    return () => clearTimeout(timer)
  }, [msg])

  const monthNames = MONTH_FULL[lang] ?? MONTH_FULL.de

  const atMax = calYear >= currentYear + 1 && calMonth >= 9
  const atMin = calYear <= currentYear && calMonth <= now.getMonth() + 1

  const firstDay = new Date(calYear, calMonth - 1, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(calYear, calMonth, 0).getDate()

  const blockedSet = new Map(blockedDates.map(b => [b.date, b.reason]))

  function prevMonth() {
    if (atMin) return
    setMsg(null)
    if (calMonth === 1) { setCalYear(y => y - 1); setCalMonth(12) }
    else setCalMonth(m => m - 1)
  }

  function nextMonth() {
    if (atMax) return
    setMsg(null)
    if (calMonth === 12) { setCalYear(y => y + 1); setCalMonth(1) }
    else setCalMonth(m => m + 1)
  }

  function handleDay(day: number) {
    const iso = toISO(calYear, calMonth, day)
    if (iso < todayISO) return

    if (blockedSet.has(iso)) {
      setMsg({ type: 'blocked', reason: blockedSet.get(iso) ?? null })
      return
    }
    if (!isInSeason(calMonth)) {
      setMsg({ type: 'offseason' })
      return
    }
    setMsg(null)
    onChange(iso)
  }

  const gold = '#D4A843'
  const cream = '#F5EDD8'
  const dim = 'rgba(245,237,216,0.28)'
  const faint = 'rgba(245,237,216,0.08)'

  return (
    <div style={{ userSelect: 'none' }}>
      {/* Toast — floats above popup, auto-dismisses */}
      {msg && (
        <div
          style={{
            position: 'fixed',
            top: '8vh',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 300,
            padding: '0.9rem 1.4rem',
            borderRadius: '16px',
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.875rem',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: 'calc(100vw - 2.5rem)',
            width: 'max-content',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: toastVisible ? 1 : 0,
            ...(msg.type === 'blocked'
              ? { background: 'rgba(18,6,6,0.97)', border: '1.5px solid rgba(248,113,113,0.5)', color: 'rgba(252,165,165,0.95)' }
              : { background: 'rgba(7,14,28,0.97)', border: '1.5px solid rgba(212,168,67,0.5)', color: 'rgba(245,237,216,0.9)' }
            ),
          }}
        >
          {msg.type === 'blocked'
            ? <>🚫 {blockedTitle}{msg.reason ? ` — ${msg.reason}` : ''}</>
            : <>⚓ {offSeasonMsg}</>
          }
        </div>
      )}

      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <button onClick={prevMonth} disabled={atMin}
          style={{ background: 'none', border: `1px solid ${atMin ? 'rgba(255,255,255,0.06)' : 'rgba(212,168,67,0.2)'}`, borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: atMin ? faint : dim, cursor: atMin ? 'default' : 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>
          ‹
        </button>
        <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.15rem', fontWeight: 300, color: cream, letterSpacing: '0.02em' }}>
          {monthNames[calMonth - 1]} {calYear}
        </span>
        <button onClick={nextMonth} disabled={atMax}
          style={{ background: 'none', border: `1px solid ${atMax ? 'rgba(255,255,255,0.06)' : 'rgba(212,168,67,0.2)'}`, borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: atMax ? faint : dim, cursor: atMax ? 'default' : 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.62rem', color: dim, fontFamily: 'var(--font-outfit)', letterSpacing: '0.06em', padding: '0.15rem 0', fontWeight: 500 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const iso = toISO(calYear, calMonth, day)
          const isPast = iso < todayISO
          const isBlocked = blockedSet.has(iso)
          const inSeason = isInSeason(calMonth)
          const isSelected = iso === value
          const isToday = iso === todayISO

          let opacity = 1
          if (isPast) opacity = 0.15
          else if (isBlocked) opacity = 0.45
          else if (!inSeason) opacity = 0.28

          const bg = isSelected ? gold : isBlocked && !isPast ? 'rgba(248,113,113,0.08)' : 'transparent'
          const color = isSelected ? '#07111f' : isBlocked && !isPast ? '#fca5a5' : cream
          const outline = isToday && !isSelected ? `1.5px solid rgba(212,168,67,0.55)` : 'none'

          return (
            <button key={day} type="button" onClick={() => handleDay(day)}
              style={{
                textAlign: 'center', borderRadius: '7px',
                fontSize: '0.8rem', fontFamily: 'var(--font-outfit)',
                background: bg, color, opacity,
                outline, outlineOffset: '-1.5px',
                border: 'none', transition: 'background 0.12s',
                height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', cursor: isPast ? 'default' : 'pointer',
                WebkitTapHighlightColor: 'transparent',
                fontWeight: isToday ? 700 : 400,
              }}>
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
