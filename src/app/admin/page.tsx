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
}

type BlockedDate = {
  id: string
  blocked_date: string
  reason: string | null
}

const MAX = 6

function toDE(s: string) {
  const [y, m, d] = s.split('-')
  return `${d}.${m}.${y}`
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function timeStr(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

export default function AdminPage() {
  const [tab, setTab] = useState<'bookings' | 'blocked'>('bookings')

  // ── Bookings
  const [bookDate, setBookDate] = useState(today())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookLoading, setBookLoading] = useState(false)

  async function loadBookings(date: string) {
    setBookLoading(true)
    const res = await fetch(`/api/admin/bookings?date=${date}`)
    const data = await res.json()
    setBookings(Array.isArray(data) ? data : [])
    setBookLoading(false)
  }

  useEffect(() => { loadBookings(bookDate) }, [bookDate])

  async function deleteBooking(id: string) {
    if (!confirm('Buchung wirklich löschen?')) return
    await fetch('/api/admin/bookings', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadBookings(bookDate)
  }

  const totalBooked = bookings.reduce((s, b) => s + b.group_size, 0)

  // ── Blocked dates
  const [blocked, setBlocked] = useState<BlockedDate[]>([])
  const [blockLoading, setBlockLoading] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadBlocked() {
    setBlockLoading(true)
    const res = await fetch('/api/blocked-dates')
    const data = await res.json()
    setBlocked(Array.isArray(data) ? data : [])
    setBlockLoading(false)
  }

  useEffect(() => { loadBlocked() }, [])

  async function blockDate() {
    if (!newDate) return
    setSaving(true)
    await fetch('/api/blocked-dates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: newDate, reason: newReason }) })
    setNewDate(''); setNewReason('')
    await loadBlocked()
    setSaving(false)
  }

  async function unblockDate(id: string) {
    await fetch('/api/blocked-dates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadBlocked()
  }

  const c = {
    bg: '#0A1628',
    card: 'rgba(19,34,64,0.9)',
    border: 'rgba(212,168,67,0.18)',
    borderTop: 'rgba(212,168,67,0.45)',
    gold: '#D4A843',
    goldLight: '#ECC564',
    cream: '#F5EDD8',
    dim: 'rgba(245,237,216,0.4)',
    faint: 'rgba(245,237,216,0.18)',
  }

  const tabStyle = (active: boolean) => ({
    padding: '0.6rem 1.4rem',
    borderRadius: '99px',
    fontFamily: 'var(--font-outfit)',
    fontSize: '0.8rem',
    fontWeight: 500,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    border: 'none',
    background: active ? c.gold : 'transparent',
    color: active ? c.bg : c.dim,
    transition: 'all 0.2s',
  } as React.CSSProperties)

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${c.border}`,
    borderRadius: '10px',
    padding: '0.65rem 1rem',
    color: c.cream,
    fontFamily: 'var(--font-outfit)',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
  }

  return (
    <main style={{ minHeight: '100vh', background: c.bg, padding: '2rem 1rem', fontFamily: 'var(--font-outfit)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: c.gold, opacity: 0.6, marginBottom: '0.3rem' }}>
            Kajüte Daily Canal Cruise
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: 300, color: c.cream, margin: 0 }}>
            Admin
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', padding: '4px', marginBottom: '1.5rem', width: 'fit-content' }}>
          <button style={tabStyle(tab === 'bookings')} onClick={() => setTab('bookings')}>Buchungen</button>
          <button style={tabStyle(tab === 'blocked')} onClick={() => setTab('blocked')}>Tage sperren</button>
        </div>

        {/* ── BUCHUNGEN ── */}
        {tab === 'bookings' && (
          <div>
            {/* Date picker */}
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderTop: `2px solid ${c.borderTop}`, borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: c.dim, display: 'block', marginBottom: '0.5rem' }}>
                Datum
              </label>
              <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} style={inputStyle} />
            </div>

            {/* Summary bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: c.dim }}>
                {toDE(bookDate)} · 19:00 Uhr
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: totalBooked >= MAX ? '#f87171' : totalBooked > 0 ? '#4ade80' : c.faint }}>
                {totalBooked} / {MAX} Plätze belegt
              </span>
            </div>

            {/* Seats visual */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
              {Array.from({ length: MAX }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: '6px', borderRadius: '3px',
                  background: i < totalBooked ? c.gold : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            {/* Bookings list */}
            {bookLoading && <p style={{ color: c.faint, fontSize: '0.85rem' }}>Lädt…</p>}

            {!bookLoading && bookings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: c.faint, fontSize: '0.85rem', fontStyle: 'italic' }}>
                Keine Buchungen für diesen Tag.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {bookings.map(b => (
                <div key={b.id} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: c.cream, fontSize: '0.9rem' }}>{b.contact_name}</span>
                      <span style={{ fontSize: '0.75rem', color: c.gold, background: 'rgba(212,168,67,0.1)', border: `1px solid rgba(212,168,67,0.2)`, borderRadius: '99px', padding: '1px 8px' }}>
                        {b.group_size} {b.group_size === 1 ? 'Person' : 'Personen'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: c.dim, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {b.adults_count != null && <span>{b.adults_count} Erw.</span>}
                      {b.kids_count != null && b.kids_count > 0 && <span>{b.kids_count} Kids</span>}
                      {b.email && <span>{b.email}</span>}
                      <span style={{ color: c.faint }}>{timeStr(b.created_at)} Uhr</span>
                    </div>
                  </div>
                  <button onClick={() => deleteBooking(b.id)}
                    style={{ background: 'none', border: `1px solid rgba(248,113,113,0.25)`, borderRadius: '8px', padding: '0.35rem 0.7rem', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 }}>
                    Löschen
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAGE SPERREN ── */}
        {tab === 'blocked' && (
          <div>
            {/* Add form */}
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderTop: `2px solid ${c.borderTop}`, borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: c.dim, marginBottom: '0.75rem' }}>
                Tag sperren
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Grund (optional) — z.B. Schlechtes Wetter, Urlaub…"
                  value={newReason} onChange={e => setNewReason(e.target.value)} style={inputStyle} />
                <button onClick={blockDate} disabled={!newDate || saving}
                  style={{ background: newDate ? `linear-gradient(135deg, ${c.gold}, #F0C96E)` : 'rgba(255,255,255,0.06)', color: newDate ? c.bg : c.faint, border: 'none', borderRadius: '10px', padding: '0.75rem', fontWeight: 600, fontSize: '0.85rem', cursor: newDate ? 'pointer' : 'default', transition: 'all 0.2s', fontFamily: 'var(--font-outfit)' }}>
                  {saving ? 'Wird gespeichert…' : '🚫 Tag sperren'}
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ padding: '0 0.25rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: c.faint }}>{blocked.length} gesperrte Tage</span>
            </div>

            {blockLoading && <p style={{ color: c.faint, fontSize: '0.85rem' }}>Lädt…</p>}

            {!blockLoading && blocked.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: c.faint, fontSize: '0.85rem', fontStyle: 'italic' }}>
                Keine gesperrten Tage.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {blocked.map(d => (
                <div key={d.id} style={{ background: c.card, border: '1px solid rgba(248,113,113,0.18)', borderRadius: '12px', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#fca5a5', fontSize: '0.9rem' }}>{toDE(d.blocked_date)}</span>
                    {d.reason && <span style={{ marginLeft: '0.75rem', fontSize: '0.78rem', color: c.dim }}>{d.reason}</span>}
                  </div>
                  <button onClick={() => unblockDate(d.id)}
                    style={{ background: 'none', border: `1px solid rgba(74,222,128,0.25)`, borderRadius: '8px', padding: '0.35rem 0.7rem', color: '#4ade80', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 }}>
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
