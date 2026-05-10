'use client'

import { useState, useEffect } from 'react'

type BlockedDate = { id: string; blocked_date: string; reason: string | null; created_at: string }

function toDE(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}.${m}.${y}`
}

export default function AdminPage() {
  const [dates, setDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/blocked-dates')
    const data = await res.json()
    setDates(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function block() {
    if (!newDate) return
    setSaving(true)
    setError(null)
    const res = await fetch('/api/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: newDate, reason: newReason }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setNewDate(''); setNewReason('')
    await load()
    setSaving(false)
  }

  async function unblock(id: string) {
    await fetch('/api/blocked-dates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await load()
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A1628', color: '#F5EDD8', padding: '2rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(212,168,67,0.5)', marginBottom: '0.5rem' }}>
          Admin · Nur für Skipper Fynn
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', fontWeight: 300, marginBottom: '2rem' }}>
          Tage blocken
        </h1>

        {/* Add form */}
        <div style={{ background: 'rgba(19,34,64,0.8)', border: '1px solid rgba(212,168,67,0.2)', borderTop: '2px solid rgba(212,168,67,0.4)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,237,216,0.4)', marginBottom: '1rem' }}>
            Neuen Tag blocken
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#F5EDD8', fontSize: '0.9rem', outline: 'none' }}
            />
            <input
              type="text"
              placeholder="Grund (optional) – z.B. Sturm, Urlaub…"
              value={newReason}
              onChange={e => setNewReason(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#F5EDD8', fontSize: '0.9rem', outline: 'none' }}
            />
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>}
            <button
              onClick={block}
              disabled={!newDate || saving}
              style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96E)', color: '#0A1628', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: newDate ? 'pointer' : 'not-allowed', opacity: newDate ? 1 : 0.5 }}
            >
              {saving ? 'Wird gespeichert…' : '🚫 Tag blocken'}
            </button>
          </div>
        </div>

        {/* Blocked dates list */}
        <div>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,237,216,0.4)', marginBottom: '1rem' }}>
            Geblockte Tage ({dates.length})
          </p>
          {loading && <p style={{ color: 'rgba(245,237,216,0.4)' }}>Laden…</p>}
          {!loading && dates.length === 0 && (
            <p style={{ color: 'rgba(245,237,216,0.35)', fontStyle: 'italic' }}>Keine geblockten Tage.</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {dates.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#fca5a5' }}>{toDE(d.blocked_date)}</span>
                  {d.reason && <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'rgba(245,237,216,0.4)' }}>{d.reason}</span>}
                </div>
                <button
                  onClick={() => unblock(d.id)}
                  style={{ background: 'none', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '0.5rem', padding: '0.3rem 0.7rem', color: '#fca5a5', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Freigeben
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
