'use client'

import { useState, useEffect, useRef } from 'react'

const MAX_SEATS = 6

function getSeasonMin() {
  const today = new Date()
  const year = today.getFullYear()
  const seasonStart = new Date(year, 4, 11) // May 11
  return today > seasonStart ? today : seasonStart
}

function getSeasonMax() {
  const year = new Date().getFullYear()
  return new Date(year, 8, 30) // Sep 30
}

function toDateString(d: Date) {
  return d.toISOString().split('T')[0]
}

function formatDateDE(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}.${m}.${y}`
}

type AvailabilityState = 'idle' | 'loading' | 'ready' | 'soldout' | 'blocked' | 'error'

export default function BookingSection() {
  const today = new Date()
  const seasonMin = getSeasonMin()
  const seasonMax = getSeasonMax()

  const defaultDate =
    today >= seasonMin && today <= seasonMax
      ? toDateString(today)
      : toDateString(seasonMin)

  const [date, setDate] = useState(defaultDate)
  const [availability, setAvailability] = useState<{ booked: number; available: number } | null>(null)
  const [avState, setAvState] = useState<AvailabilityState>('idle')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [groupSize, setGroupSize] = useState(1)

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!date) return
    setAvState('loading')
    setAvailability(null)
    const ctrl = new AbortController()
    fetch(`/api/availability?date=${date}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        setAvailability(d)
        if (d.blocked) setAvState('blocked')
        else if (d.available === 0) setAvState('soldout')
        else setAvState('ready')
        setGroupSize(Math.min(groupSize, d.available || 1))
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setAvState('error')
      })
    return () => ctrl.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Bitte Namen eingeben.'); return }
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_date: date, group_size: groupSize, contact_name: name, email, phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Fehler bei der Buchung.')
      } else {
        setSuccess(true)
        setName(''); setEmail(''); setPhone(''); setGroupSize(1)
        setAvailability(prev => prev ? { booked: prev.booked + groupSize, available: prev.available - groupSize } : null)
        if ((availability?.available ?? 0) - groupSize <= 0) setAvState('soldout')
      }
    } catch {
      setError('Netzwerkfehler. Bitte erneut versuchen.')
    } finally {
      setSubmitting(false)
    }
  }

  const available = availability?.available ?? 0
  const booked = availability?.booked ?? 0

  return (
    <section id="buchen" ref={sectionRef} className="relative py-20 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D4A843 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-outfit text-xs tracking-[0.2em] uppercase text-amber-light/60 mb-3">
            Reservierung
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream">
            Platz{' '}
            <em className="gold-text not-italic">sichern</em>
          </h2>
          <p className="font-outfit text-sm text-cream/50 mt-3">
            Täglich 19:00 Uhr · Direkt an der Hütten-Gracht · Max. 6 Personen
          </p>
        </div>

        <div className="nautical-border rounded-2xl p-8" style={{ background: 'rgba(19,34,64,0.7)', backdropFilter: 'blur(12px)' }}>

          {/* ── Date Picker ── */}
          <div className="mb-8">
            <label className="form-label block mb-2">Datum wählen</label>
            <input
              type="date"
              value={date}
              min={toDateString(seasonMin)}
              max={toDateString(seasonMax)}
              onChange={e => { setDate(e.target.value); setSuccess(false); setError(null) }}
              className="form-input w-full rounded-xl px-4 py-3 text-base"
            />
            <p className="font-outfit text-xs text-cream/35 mt-2">
              Saison: 11. Mai – 30. September
            </p>
          </div>

          {/* ── Availability ── */}
          <div className="mb-8">
            <p className="form-label block mb-3">Verfügbarkeit</p>
            {avState === 'loading' && (
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {Array.from({ length: MAX_SEATS }).map((_, i) => (
                    <div key={i} className="seat-dot animate-pulse" style={{ background: 'rgba(212,168,67,0.2)' }} />
                  ))}
                </div>
                <span className="font-outfit text-sm text-cream/40">Wird geprüft …</span>
              </div>
            )}
            {avState === 'ready' && availability && (
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex gap-2">
                  {Array.from({ length: MAX_SEATS }).map((_, i) => (
                    <div
                      key={i}
                      className={`seat-dot ${i < booked ? 'taken' : 'available'}`}
                      title={i < booked ? 'Belegt' : 'Frei'}
                    />
                  ))}
                </div>
                <span className="font-outfit text-sm font-medium" style={{ color: available > 0 ? '#4ade80' : '#f87171' }}>
                  {available} von {MAX_SEATS} Plätzen frei
                </span>
              </div>
            )}
            {avState === 'soldout' && (
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {Array.from({ length: MAX_SEATS }).map((_, i) => (
                    <div key={i} className="seat-dot taken" />
                  ))}
                </div>
                <span className="inline-block font-outfit text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                  Ausgebucht
                </span>
              </div>
            )}
            {avState === 'blocked' && (
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {Array.from({ length: MAX_SEATS }).map((_, i) => (
                    <div key={i} className="seat-dot taken" />
                  ))}
                </div>
                <span className="inline-block font-outfit text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                  Keine Fahrt an diesem Tag
                </span>
              </div>
            )}
            {avState === 'error' && (
              <p className="font-outfit text-sm text-red-400">Fehler beim Laden der Verfügbarkeit.</p>
            )}
          </div>

          {/* ── Success Message ── */}
          {success && (
            <div className="success-appear mb-8 rounded-xl p-5 text-center"
              style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)' }}>
              <div className="text-3xl mb-2">⚓</div>
              <p className="font-cormorant text-xl text-green-300 font-medium">Reservierung erhalten!</p>
              <p className="font-outfit text-sm text-cream/60 mt-1">
                Wir freuen uns auf euch am {formatDateDE(date)} um 19:00 Uhr.
              </p>
              <p className="font-outfit text-xs text-cream/40 mt-2">
                Barzahlung vor Ort · 19 € p.P. · Kids 2–7 Jahre 5 €
              </p>
            </div>
          )}

          {/* ── Form ── */}
          {avState !== 'soldout' && avState !== 'blocked' && !success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label block mb-2">Name / Vorname *</label>
                  <input
                    type="text"
                    placeholder="Familie Müller"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="form-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="form-label block mb-2">Gruppengröße *</label>
                  <select
                    value={groupSize}
                    onChange={e => setGroupSize(Number(e.target.value))}
                    className="form-input w-full rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer"
                    disabled={avState !== 'ready'}
                  >
                    {Array.from({ length: Math.max(1, available) }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} Person{n > 1 ? 'en' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label block mb-2">E-Mail</label>
                  <input
                    type="email"
                    placeholder="name@beispiel.de"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="form-label block mb-2">Telefon</label>
                  <input
                    type="tel"
                    placeholder="+49 …"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="form-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              {error && (
                <p className="font-outfit text-sm text-red-400 bg-red-950/30 rounded-lg px-4 py-2 border border-red-900/40">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || avState !== 'ready'}
                  className="btn-primary w-full rounded-xl py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{submitting ? 'Wird gesendet …' : 'Jetzt unverbindlich reservieren'}</span>
                </button>
                <p className="font-outfit text-xs text-center text-cream/35 mt-3">
                  Barzahlung vor Ort · 19 € p.P. · Kids 2–7 Jahre 5 €
                </p>
              </div>
            </form>
          )}

          {(avState === 'soldout' || avState === 'blocked') && !success && (
            <div className="text-center py-6">
              <p className="font-cormorant text-2xl text-cream/60 italic">
                {avState === 'blocked'
                  ? 'An diesem Tag findet keine Fahrt statt.'
                  : 'Alle Plätze für diesen Tag sind vergeben.'}
              </p>
              <p className="font-outfit text-sm text-cream/40 mt-2">
                Bitte wähle ein anderes Datum.
              </p>
            </div>
          )}
        </div>

        {/* Note */}
        <p className="font-outfit text-xs text-center text-cream/30 mt-6 leading-relaxed">
          Offenes Boot · Fahrt nur bei gutem & trockenem Wetter (mind. 14 °C) ·
          Mindestens 2 Personen für Abfahrt nötig · Keine Online-Zahlung erforderlich
        </p>
      </div>
    </section>
  )
}
