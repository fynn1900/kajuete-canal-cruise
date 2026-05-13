'use client'

import { useState, useEffect } from 'react'

type Booking = {
  id: string
  booking_date: string
  group_size: number
  adults_count: number | null
  kids_count: number | null
  contact_name: string
  email: string | null
  created_at: string
  is_exclusive: boolean | null
}

type BlockedDate = { id: string; blocked_date: string; reason: string | null }
type DaySummary = { booked: number; isExclusive: boolean }

const MAX = 6
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
function toDE(s: string) {
  const [y, m, d] = s.split('-')
  return `${d}.${m}.${y}`
}
function timeStr(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

const c = {
  bg: '#07111f',
  surface: '#0f1f35',
  card: 'rgba(19,34,64,0.95)',
  border: 'rgba(212,168,67,0.15)',
  borderTop: 'rgba(212,168,67,0.5)',
  gold: '#D4A843',
  goldLight: '#ECC564',
  cream: '#F5EDD8',
  dim: 'rgba(245,237,216,0.38)',
  faint: 'rgba(245,237,216,0.14)',
  green: '#4ade80',
  red: '#f87171',
}

export default function AdminPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1) // 1-based
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Month data
  const [daySummaries, setDaySummaries] = useState<Record<string, DaySummary>>({})
  const [blocked, setBlocked] = useState<BlockedDate[]>([])
  const [monthLoading, setMonthLoading] = useState(false)

  // Day bookings
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [dayLoading, setDayLoading] = useState(false)

  // Block form
  const [tab, setTab] = useState<'cal' | 'block'>('cal')
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [saving, setSaving] = useState(false)

  const monthKey = `${year}-${String(month).padStart(2, '0')}`

  // Load month bookings + blocked
  useEffect(() => {
    setMonthLoading(true)
    setSelectedDate(null)
    setDayBookings([])
    Promise.all([
      fetch(`/api/admin/bookings?month=${monthKey}`).then(r => r.json()),
      fetch('/api/blocked-dates').then(r => r.json()),
    ]).then(([bookingsRaw, blockedRaw]) => {
      const summaries: Record<string, DaySummary> = {}
      if (Array.isArray(bookingsRaw)) {
        for (const b of bookingsRaw) {
          if (!summaries[b.booking_date]) summaries[b.booking_date] = { booked: 0, isExclusive: false }
          summaries[b.booking_date].booked += b.group_size
          if (b.is_exclusive) summaries[b.booking_date].isExclusive = true
        }
      }
      setDaySummaries(summaries)
      setBlocked(Array.isArray(blockedRaw) ? blockedRaw : [])
      setMonthLoading(false)
    }).catch(() => setMonthLoading(false))
  }, [monthKey])

  // Load day bookings on date select
  useEffect(() => {
    if (!selectedDate) return
    setDayLoading(true)
    fetch(`/api/admin/bookings?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => { setDayBookings(Array.isArray(data) ? data : []); setDayLoading(false) })
      .catch(() => setDayLoading(false))
  }, [selectedDate])

  async function deleteBooking(id: string) {
    if (!confirm('Buchung löschen?')) return
    await fetch('/api/admin/bookings', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (selectedDate) {
      fetch(`/api/admin/bookings?date=${selectedDate}`).then(r => r.json()).then(d => setDayBookings(Array.isArray(d) ? d : []))
    }
    // Refresh month summary
    fetch(`/api/admin/bookings?month=${monthKey}`).then(r => r.json()).then(bookingsRaw => {
      const summaries: Record<string, DaySummary> = {}
      if (Array.isArray(bookingsRaw)) {
        for (const b of bookingsRaw) {
          if (!summaries[b.booking_date]) summaries[b.booking_date] = { booked: 0, isExclusive: false }
          summaries[b.booking_date].booked += b.group_size
          if (b.is_exclusive) summaries[b.booking_date].isExclusive = true
        }
      }
      setDaySummaries(summaries)
    })
  }

  async function blockDate() {
    if (!newDate) return
    setSaving(true)
    try {
      await fetch('/api/blocked-dates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: newDate, reason: newReason }) })
      setNewDate(''); setNewReason('')
      const res = await fetch('/api/blocked-dates')
      const data = await res.json()
      setBlocked(Array.isArray(data) ? data : [])
    } catch (e) { console.error('blockDate error', e) }
    setSaving(false)
  }

  async function unblockDate(id: string) {
    try {
      await fetch('/api/blocked-dates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      const res = await fetch('/api/blocked-dates')
      const data = await res.json()
      setBlocked(Array.isArray(data) ? data : [])
    } catch (e) { console.error('unblockDate error', e) }
  }

  // Calendar grid
  const blockedSet = new Set(blocked.map(b => b.blocked_date))
  const firstDay = new Date(year, month - 1, 1).getDay() // 0=Sun
  const startOffset = firstDay === 0 ? 6 : firstDay - 1 // Monday-first
  const daysInMonth = new Date(year, month, 0).getDate()
  const todayISO = toISO(now.getFullYear(), now.getMonth() + 1, now.getDate())

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.border}`,
    borderRadius: '10px', padding: '0.65rem 1rem', color: c.cream,
    fontFamily: 'var(--font-outfit)', fontSize: '0.875rem', outline: 'none', width: '100%',
  }

  const isExclusiveDay = dayBookings.some(b => b.is_exclusive)
  const actualPersons = dayBookings.reduce((s, b) => s + (b.adults_count ?? 0) + (b.kids_count ?? 0), 0)
  const totalBooked = dayBookings.reduce((s, b) => s + b.group_size, 0)

  return (
    <main style={{ minHeight: '100vh', background: c.bg, padding: '1.5rem 1rem', fontFamily: 'var(--font-outfit)', color: c.cream }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: c.gold, opacity: 0.6, margin: '0 0 4px' }}>Kajüte Canal Cruise</p>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 300, color: c.cream, margin: 0 }}>Admin</h1>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', padding: '3px' }}>
            {(['cal', 'block'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '0.45rem 1.1rem', borderRadius: '99px', border: 'none', cursor: 'pointer',
                background: tab === t ? c.gold : 'transparent',
                color: tab === t ? c.bg : c.dim,
                fontFamily: 'var(--font-outfit)', fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s',
              }}>
                {t === 'cal' ? 'Kalender' : 'Sperren'}
              </button>
            ))}
          </div>
        </div>

        {/* ── KALENDER TAB ── */}
        {tab === 'cal' && (
          <div>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: `1px solid ${c.border}`, borderRadius: '8px', padding: '0.4rem 0.8rem', color: c.dim, cursor: 'pointer', fontSize: '1rem' }}>‹</button>
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: 400, color: c.cream }}>
                {MONTHS[month - 1]} {year}
              </span>
              <button onClick={nextMonth} style={{ background: 'none', border: `1px solid ${c.border}`, borderRadius: '8px', padding: '0.4rem 0.8rem', color: c.dim, cursor: 'pointer', fontSize: '1rem' }}>›</button>
            </div>

            {/* Calendar grid */}
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderTop: `2px solid ${c.borderTop}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              {/* Weekday headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${c.border}` }}>
                {WEEKDAYS.map(d => (
                  <div key={d} style={{ textAlign: 'center', padding: '0.6rem 0', fontSize: '0.7rem', letterSpacing: '0.08em', color: c.dim, fontWeight: 500 }}>{d}</div>
                ))}
              </div>

              {/* Day cells */}
              {monthLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: c.faint, fontSize: '0.85rem' }}>Lädt…</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {/* Empty cells */}
                  {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`e${i}`} style={{ padding: '0.5rem', minHeight: '56px', borderRight: `1px solid rgba(255,255,255,0.03)`, borderBottom: `1px solid rgba(255,255,255,0.03)` }} />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const iso = toISO(year, month, day)
                    const summary = daySummaries[iso]
                    const isBlocked = blockedSet.has(iso)
                    const isSelected = selectedDate === iso
                    const isToday = iso === todayISO
                    const booked = summary?.booked ?? 0
                    const isFull = booked >= MAX
                    const hasBookings = booked > 0
                    const isExclusive = summary?.isExclusive ?? false
                    const col = (i + startOffset) % 7

                    let bg = 'transparent'
                    if (isSelected) bg = 'rgba(212,168,67,0.18)'
                    else if (isBlocked) bg = 'rgba(248,113,113,0.07)'
                    else if (isExclusive) bg = 'rgba(212,168,67,0.08)'
                    else if (hasBookings) bg = 'rgba(74,222,128,0.05)'

                    return (
                      <div key={iso} onClick={() => setSelectedDate(iso === selectedDate ? null : iso)}
                        style={{
                          padding: '0.4rem 0.5rem', minHeight: '56px', cursor: 'pointer',
                          background: bg,
                          borderRight: col < 6 ? `1px solid rgba(255,255,255,0.03)` : 'none',
                          borderBottom: `1px solid rgba(255,255,255,0.03)`,
                          borderLeft: isSelected ? `2px solid ${c.gold}` : 'none',
                          transition: 'background 0.15s',
                          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px',
                          position: 'relative',
                        }}>
                        {/* Day number */}
                        <span style={{
                          fontSize: '0.8rem', fontWeight: isToday ? 700 : 400,
                          color: isBlocked ? '#f87171' : isToday ? c.gold : isSelected ? c.goldLight : c.cream,
                          lineHeight: 1,
                        }}>{day}</span>

                        {/* Booking indicator */}
                        {!isBlocked && hasBookings && (
                          <div style={{ width: '100%' }}>
                            {isExclusive ? (
                              <span style={{ fontSize: '0.65rem', color: c.gold, display: 'block', marginTop: '2px' }}>⭐ exkl.</span>
                            ) : (
                              <>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  {Array.from({ length: MAX }).map((_, s) => (
                                    <div key={s} style={{
                                      flex: 1, height: '3px', borderRadius: '2px',
                                      background: s < booked ? (isFull ? '#f87171' : c.gold) : 'rgba(255,255,255,0.08)',
                                    }} />
                                  ))}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: isFull ? '#f87171' : c.gold, marginTop: '2px', display: 'block' }}>
                                  {booked}/{MAX}
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Blocked indicator */}
                        {isBlocked && (
                          <span style={{ fontSize: '0.65rem', color: '#f87171' }}>gesperrt</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.72rem', color: c.dim, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(74,222,128,0.2)', display: 'inline-block' }} /> Buchungen</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(212,168,67,0.15)', border: `1px solid rgba(212,168,67,0.3)`, display: 'inline-block' }} /> ⭐ Exklusiv</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(248,113,113,0.2)', display: 'inline-block' }} /> Gesperrt</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(212,168,67,0.2)', border: `1px solid ${c.gold}`, display: 'inline-block' }} /> Ausgewählt</span>
            </div>

            {/* Selected day detail */}
            {selectedDate && (
              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderTop: `2px solid ${c.borderTop}`, borderRadius: '16px', overflow: 'hidden' }}>
                {/* Day header */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', color: c.cream }}>{toDE(selectedDate)}</span>
                    <span style={{ fontSize: '0.78rem', color: c.dim, marginLeft: '0.75rem' }}>19 Uhr</span>
                  </div>
                  {isExclusiveDay ? (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: c.gold, background: 'rgba(212,168,67,0.12)', border: `1px solid rgba(212,168,67,0.35)`, borderRadius: '99px', padding: '3px 10px' }}>
                      ⭐ EXKLUSIV · {actualPersons} {actualPersons === 1 ? 'Person' : 'Personen'}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: totalBooked >= MAX ? '#f87171' : totalBooked > 0 ? c.green : c.faint }}>
                      {totalBooked} / {MAX} Plätze
                    </span>
                  )}
                </div>

                {/* Seat bar */}
                {isExclusiveDay ? (
                  <div style={{ padding: '0.75rem 1.25rem', borderBottom: `1px solid ${c.border}`, fontSize: '0.75rem', color: c.gold }}>
                    ⭐ Exklusive Fahrt — Boot vollständig für diese Gruppe reserviert. Kein weiterer Zustieg.
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px', padding: '0.75rem 1.25rem', borderBottom: `1px solid ${c.border}` }}>
                    {Array.from({ length: MAX }).map((_, i) => (
                      <div key={i} style={{ flex: 1, height: '5px', borderRadius: '3px', background: i < totalBooked ? c.gold : 'rgba(255,255,255,0.07)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                )}

                {/* Bookings */}
                {dayLoading && <div style={{ padding: '1.5rem', textAlign: 'center', color: c.faint, fontSize: '0.85rem' }}>Lädt…</div>}

                {!dayLoading && dayBookings.length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: c.faint, fontSize: '0.85rem', fontStyle: 'italic' }}>
                    {blockedSet.has(selectedDate) ? 'Dieser Tag ist gesperrt.' : 'Keine Buchungen.'}
                  </div>
                )}

                {!dayLoading && dayBookings.map((b, idx) => {
                  const personCount = (b.adults_count ?? 0) + (b.kids_count ?? 0)
                  return (
                    <div key={b.id} style={{ padding: '0.85rem 1.25rem', borderBottom: idx < dayBookings.length - 1 ? `1px solid ${c.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 600, color: c.cream, fontSize: '0.88rem' }}>{b.contact_name}</span>
                          {b.is_exclusive ? (
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c.gold, background: 'rgba(212,168,67,0.12)', border: `1px solid rgba(212,168,67,0.35)`, borderRadius: '99px', padding: '1px 8px' }}>
                              ⭐ EXKLUSIV · {personCount} {personCount === 1 ? 'Person' : 'Pers.'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: c.gold, background: 'rgba(212,168,67,0.1)', border: `1px solid rgba(212,168,67,0.2)`, borderRadius: '99px', padding: '1px 7px' }}>
                              {personCount} {personCount === 1 ? 'Person' : 'Pers.'}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.73rem', color: c.dim, display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                          {b.adults_count != null && <span>{b.adults_count} Erw.</span>}
                          {b.kids_count != null && b.kids_count > 0 && <span>{b.kids_count} Kids</span>}
                          {b.email && <span>{b.email}</span>}
                          <span style={{ color: c.faint }}>{timeStr(b.created_at)}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteBooking(b.id)} style={{ background: 'none', border: `1px solid rgba(248,113,113,0.22)`, borderRadius: '8px', padding: '0.3rem 0.65rem', color: '#f87171', cursor: 'pointer', fontSize: '0.73rem', flexShrink: 0 }}>
                        Löschen
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SPERREN TAB ── */}
        {tab === 'block' && (
          <div>
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderTop: `2px solid ${c.borderTop}`, borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: c.dim, marginBottom: '0.75rem' }}>Tag sperren</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Grund (optional) — Schlechtes Wetter, Urlaub…" value={newReason} onChange={e => setNewReason(e.target.value)} style={inputStyle} />
                <button onClick={blockDate} disabled={!newDate || saving} style={{ background: newDate ? `linear-gradient(135deg,${c.gold},#F0C96E)` : 'rgba(255,255,255,0.05)', color: newDate ? c.bg : c.faint, border: 'none', borderRadius: '10px', padding: '0.75rem', fontWeight: 600, fontSize: '0.85rem', cursor: newDate ? 'pointer' : 'default', fontFamily: 'var(--font-outfit)', transition: 'all 0.2s' }}>
                  {saving ? 'Wird gespeichert…' : '🚫  Tag sperren'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {blocked.length === 0 && <p style={{ textAlign: 'center', color: c.faint, fontSize: '0.85rem', fontStyle: 'italic', padding: '1.5rem 0' }}>Keine gesperrten Tage.</p>}
              {blocked.map(d => (
                <div key={d.id} style={{ background: c.card, border: '1px solid rgba(248,113,113,0.18)', borderRadius: '12px', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#fca5a5', fontSize: '0.9rem' }}>{toDE(d.blocked_date)}</span>
                    {d.reason && <span style={{ marginLeft: '0.75rem', fontSize: '0.78rem', color: c.dim }}>{d.reason}</span>}
                  </div>
                  <button onClick={() => unblockDate(d.id)} style={{ background: 'none', border: `1px solid rgba(74,222,128,0.25)`, borderRadius: '8px', padding: '0.3rem 0.65rem', color: c.green, cursor: 'pointer', fontSize: '0.73rem', flexShrink: 0 }}>
                    Freigeben
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
