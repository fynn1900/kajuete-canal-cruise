'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const MAX_SEATS = 6
const PRICE_ADULT = 19
const PRICE_KID = 5

// Direct browser → Supabase connection, no API route needed for reads
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function getSeasonMin() {
  const today = new Date()
  const seasonStart = new Date(today.getFullYear(), 4, 11)
  return today > seasonStart ? today : seasonStart
}

function getSeasonMax() {
  return new Date(new Date().getFullYear(), 8, 30)
}

function toDateString(d: Date) {
  return d.toISOString().split('T')[0]
}

function formatDateDE(s: string) {
  const [y, m, d] = s.split('-')
  return `${d}.${m}.${y}`
}

type AvState = 'idle' | 'loading' | 'ready' | 'soldout' | 'blocked' | 'error'

export default function BookingSection() {
  const seasonMin = getSeasonMin()
  const seasonMax = getSeasonMax()
  const today = new Date()
  const defaultDate = today >= seasonMin && today <= seasonMax ? toDateString(today) : toDateString(seasonMin)

  const [date, setDate] = useState(defaultDate)
  const [avState, setAvState] = useState<AvState>('idle')
  const [booked, setBooked] = useState(0)
  const [available, setAvailable] = useState(MAX_SEATS)

  const [adults, setAdults] = useState(1)
  const [kids, setKids] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const totalPersons = adults + kids
  const totalPrice = adults * PRICE_ADULT + kids * PRICE_KID

  useEffect(() => {
    if (!date) return
    setAvState('loading')
    setSuccess(false)
    setFormError(null)

    const sb = getSupabase()

    Promise.all([
      sb.from('canal_cruise_bookings').select('group_size').eq('booking_date', date),
      sb.from('blocked_dates').select('id').eq('blocked_date', date).maybeSingle(),
    ]).then(([bookingsRes, blockedRes]) => {
      if (bookingsRes.error) {
        console.error(bookingsRes.error)
        setAvState('error')
        return
      }
      if (blockedRes.data) {
        setBooked(MAX_SEATS)
        setAvailable(0)
        setAvState('blocked')
        return
      }
      const b = (bookingsRes.data || []).reduce((s, r) => s + r.group_size, 0)
      const a = Math.max(0, MAX_SEATS - b)
      setBooked(b)
      setAvailable(a)
      setAvState(a === 0 ? 'soldout' : 'ready')
      setAdults(prev => Math.min(prev, a || 1))
      setKids(prev => Math.min(prev, Math.max(0, a - Math.min(adults, a))))
    }).catch(() => setAvState('error'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  const maxPersons = avState === 'ready' ? available : MAX_SEATS

  function changeAdults(d: number) {
    const next = adults + d
    if (next < 0 || next + kids > maxPersons) return
    setAdults(next)
  }
  function changeKids(d: number) {
    const next = kids + d
    if (next < 0 || adults + next > maxPersons) return
    setKids(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setFormError('Bitte Namen eingeben.'); return }
    if (totalPersons < 1) { setFormError('Bitte mindestens 1 Person wählen.'); return }
    setFormError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_date: date, group_size: totalPersons, contact_name: name, email, adults_count: adults, kids_count: kids }),
      })
      let data: { error?: string; success?: boolean } = {}
      try { data = await res.json() } catch { data = { error: `Fehler ${res.status}` } }
      if (!res.ok) { setFormError(data.error || `Fehler ${res.status}`) }
      else {
        setSuccess(true)
        const newAvail = available - totalPersons
        setBooked(b => b + totalPersons)
        setAvailable(Math.max(0, newAvail))
        if (newAvail <= 0) setAvState('soldout')
        setName(''); setEmail(''); setAdults(1); setKids(0)
      }
    } catch (err) {
      console.error('Booking submit error:', err)
      setFormError('Verbindungsfehler. Bitte Seite neu laden und erneut versuchen.')
    }
    finally { setSubmitting(false) }
  }

  function CounterBtn({ onClick, disabled, label }: { onClick: () => void; disabled: boolean; label: string }) {
    return (
      <button type="button" onClick={onClick} disabled={disabled}
        className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-light select-none flex-shrink-0"
        style={{
          background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(212,168,67,0.12)',
          border: `1.5px solid ${disabled ? 'rgba(255,255,255,0.07)' : 'rgba(212,168,67,0.35)'}`,
          color: disabled ? 'rgba(245,237,216,0.15)' : '#ECC564',
          cursor: disabled ? 'default' : 'pointer',
          transition: 'all 0.15s ease',
          WebkitTapHighlightColor: 'transparent',
        }}>
        {label}
      </button>
    )
  }

  return (
    <section id="buchen" className="relative py-20 px-4">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 600px 400px at 50% 40%, rgba(212,168,67,0.05) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="font-outfit text-xs tracking-[0.22em] uppercase mb-3" style={{ color: 'rgba(212,168,67,0.55)' }}>Reservierung</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream">
            Platz <em className="gold-text not-italic">sichern</em>
          </h2>
          <p className="font-outfit text-sm mt-3" style={{ color: 'rgba(245,237,216,0.4)' }}>
            Täglich 19:00 Uhr · Max. 6 Personen · Kajüten-Gracht
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{
          background: 'rgba(19,34,64,0.75)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(212,168,67,0.15)',
          borderTop: '2px solid rgba(212,168,67,0.35)',
        }}>

          {/* Date */}
          <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <label className="form-label block mb-2">Datum wählen</label>
            <input type="date" value={date}
              min={toDateString(seasonMin)} max={toDateString(seasonMax)}
              onChange={e => setDate(e.target.value)}
              className="form-input w-full rounded-xl px-4 py-3 text-base"
              style={{ fontSize: '16px' }} />
            <p className="font-outfit text-xs mt-1.5" style={{ color: 'rgba(245,237,216,0.25)' }}>Saison: 11. Mai – 30. September</p>
          </div>

          {/* Availability */}
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {avState === 'loading' && (
              <div className="flex items-center gap-3">
                {Array.from({ length: MAX_SEATS }).map((_, i) => (
                  <div key={i} className="seat-dot animate-pulse" style={{ background: 'rgba(212,168,67,0.12)' }} />
                ))}
                <span className="font-outfit text-xs" style={{ color: 'rgba(245,237,216,0.3)' }}>Wird geladen…</span>
              </div>
            )}
            {avState === 'ready' && (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-1.5">
                  {Array.from({ length: MAX_SEATS }).map((_, i) => (
                    <div key={i} className={`seat-dot ${i < booked ? 'taken' : 'available'}`} />
                  ))}
                </div>
                <span className="font-outfit text-sm font-medium" style={{ color: '#4ade80' }}>
                  {available} von {MAX_SEATS} frei
                </span>
              </div>
            )}
            {(avState === 'soldout' || avState === 'blocked') && (
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {Array.from({ length: MAX_SEATS }).map((_, i) => (
                    <div key={i} className="seat-dot taken" />
                  ))}
                </div>
                <span className="font-outfit text-xs tracking-wider uppercase px-3 py-1 rounded-full"
                  style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                  {avState === 'blocked' ? 'Keine Fahrt' : 'Ausgebucht'}
                </span>
              </div>
            )}
            {avState === 'error' && (
              <p className="font-outfit text-sm" style={{ color: '#f87171' }}>
                Konnte nicht geladen werden — bitte Seite neu laden.
              </p>
            )}
          </div>

          {/* Success */}
          {success && (
            <div className="m-6 rounded-xl p-6 text-center success-appear"
              style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.18)' }}>
              <div className="text-3xl mb-3">⚓</div>
              <p className="font-cormorant text-xl font-medium" style={{ color: '#86efac' }}>Reservierung erhalten!</p>
              <p className="font-outfit text-sm mt-1" style={{ color: 'rgba(245,237,216,0.5)' }}>
                Bis zum {formatDateDE(date)} um 19:00 Uhr!
              </p>
              <p className="font-outfit text-xs mt-2" style={{ color: 'rgba(245,237,216,0.3)' }}>
                Barzahlung vor Ort · 19€ p.P. · Kids 2–7 Jahre 5€
              </p>
            </div>
          )}

          {/* Form */}
          {!success && avState !== 'soldout' && avState !== 'blocked' && (
            <form onSubmit={handleSubmit}>

              {/* Person counters */}
              <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <p className="form-label block mb-5">Personen</p>

                <div className="space-y-5">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-outfit text-sm font-medium text-cream">Erwachsene & ab 8 Jahren</p>
                      <p className="font-outfit text-xs mt-0.5" style={{ color: 'rgba(245,237,216,0.3)' }}>{PRICE_ADULT} € pro Person</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <CounterBtn onClick={() => changeAdults(-1)} disabled={adults <= 0} label="−" />
                      <span className="font-outfit text-xl font-semibold text-cream w-5 text-center">{adults}</span>
                      <CounterBtn onClick={() => changeAdults(1)} disabled={totalPersons >= maxPersons} label="+" />
                    </div>
                  </div>

                  {/* Kids */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-outfit text-sm font-medium text-cream">Kleine Kids (2–7 Jahre)</p>
                      <p className="font-outfit text-xs mt-0.5" style={{ color: 'rgba(245,237,216,0.3)' }}>{PRICE_KID} € pro Person</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <CounterBtn onClick={() => changeKids(-1)} disabled={kids <= 0} label="−" />
                      <span className="font-outfit text-xl font-semibold text-cream w-5 text-center">{kids}</span>
                      <CounterBtn onClick={() => changeKids(1)} disabled={totalPersons >= maxPersons} label="+" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Price total */}
              {totalPersons > 0 && (
                <div className="px-6 py-3.5 border-b flex items-center justify-between"
                  style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(212,168,67,0.04)' }}>
                  <span className="font-outfit text-sm" style={{ color: 'rgba(245,237,216,0.45)' }}>
                    {totalPersons} Person{totalPersons !== 1 ? 'en' : ''} · Barzahlung vor Ort
                  </span>
                  <span className="font-cormorant text-2xl font-semibold gold-text">{totalPrice} €</span>
                </div>
              )}

              {/* Contact */}
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="form-label block mb-2">Name *</label>
                  <input type="text" placeholder="Dein Name" value={name}
                    onChange={e => setName(e.target.value)} required
                    className="form-input w-full rounded-xl px-4 py-3"
                    style={{ fontSize: '16px' }} />
                </div>
                <div>
                  <label className="form-label block mb-2">E-Mail <span style={{ color: 'rgba(245,237,216,0.3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(für Bestätigungsmail)</span></label>
                  <input type="email" placeholder="deine@mail.de" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input w-full rounded-xl px-4 py-3"
                    style={{ fontSize: '16px' }} />
                </div>

                {formError && (
                  <p className="font-outfit text-sm rounded-lg px-4 py-2"
                    style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                    {formError}
                  </p>
                )}

                <button type="submit" disabled={submitting || (avState !== 'ready' && avState !== 'idle')}
                  className="btn-primary w-full rounded-xl py-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  <span>{submitting ? 'Wird gesendet…' : 'Jetzt reservieren'}</span>
                </button>
              </div>
            </form>
          )}

          {!success && (avState === 'soldout' || avState === 'blocked') && (
            <div className="p-8 text-center">
              <p className="font-cormorant text-2xl italic" style={{ color: 'rgba(245,237,216,0.5)' }}>
                {avState === 'blocked' ? 'Keine Fahrt an diesem Tag.' : 'Alle Plätze vergeben.'}
              </p>
              <p className="font-outfit text-sm mt-2" style={{ color: 'rgba(245,237,216,0.3)' }}>Bitte anderes Datum wählen.</p>
            </div>
          )}
        </div>

        <p className="font-outfit text-xs text-center mt-5 leading-relaxed" style={{ color: 'rgba(245,237,216,0.2)' }}>
          Offenes Boot · Nur bei gutem Wetter (mind. 14°C) · Min. 2 Personen für Abfahrt
        </p>
      </div>
    </section>
  )
}
