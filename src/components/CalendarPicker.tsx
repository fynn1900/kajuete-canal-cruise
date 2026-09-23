'use client'
import { useState } from 'react'

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

          // Opacity layers: past = 0.15, off-season = 0.3, blocked = 0.45
          let opacity = 1
          if (isPast) opacity = 0.15
          else if (isBlocked) opacity = 0.45
          else if (!inSeason) opacity = 0.28

          const bg = isSelected ? gold : isBlocked && !isPast ? 'rgba(248,113,113,0.08)' : 'transparent'
          const color = isSelected ? '#07111f' : isBlocked && !isPast ? '#fca5a5' : cream
          const cursor = isPast ? 'default' : 'pointer'
          const outline = isToday && !isSelected ? `1.5px solid rgba(212,168,67,0.55)` : 'none'

          return (
            <div key={day} onClick={() => handleDay(day)}
              style={{
                textAlign: 'center', borderRadius: '7px',
                fontSize: '0.8rem', fontFamily: 'var(--font-outfit)',
                background: bg, color, opacity, cursor,
                outline, outlineOffset: '-1.5px',
                transition: 'background 0.12s',
                height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent',
                fontWeight: isToday ? 700 : 400,
              }}>
              {day}
            </div>
          )
        })}
      </div>

      {/* Message */}
      {msg && (
        <div
          style={msg.type === 'blocked'
            ? { marginTop: '0.85rem', padding: '0.65rem 0.9rem', borderRadius: '10px', fontFamily: 'var(--font-outfit)', fontSize: '0.77rem', textAlign: 'center' as const, lineHeight: 1.55, background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(252,165,165,0.85)' }
            : { marginTop: '0.85rem', padding: '0.65rem 0.9rem', borderRadius: '10px', fontFamily: 'var(--font-outfit)', fontSize: '0.77rem', textAlign: 'center' as const, lineHeight: 1.55, background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.18)', color: 'rgba(245,237,216,0.6)' }
          }>
          {msg.type === 'blocked'
            ? <>🚫 {blockedTitle}{msg.reason ? ` — ${msg.reason}` : ''}</>
            : <>⚓ {offSeasonMsg}</>
          }
        </div>
      )}
    </div>
  )
}
