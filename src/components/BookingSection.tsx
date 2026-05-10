'use client'

import { useState, useEffect, useRef } from 'react'

const MAX_SEATS = 6
const PRICE_ADULT = 19
const PRICE_KID = 5

function getSeasonMin() {
  const today = new Date()
  const year = today.getFullYear()
  const seasonStart = new Date(year, 4, 11)
  return today > seasonStart ? today : seasonStart
}

function getSeasonMax() {
  return new Date(new Date().getFullYear(), 8, 30)
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
  const seasonMin = getSeasonMin()
  const seasonMax = getSeasonMax()
  const today = new Date()

  const defaultDate =
    today >= seasonMin && today <= seasonMax
      ? toDateString(today)
      : toDateString(seasonMin)

  const [date, setDate] = useState(defaultDate)
  const [availability, setAvailability] = useState<{ booked: number; available: number } | null>(null)
  const [avState, setAvState] = useState<AvailabilityState>('idle')

  const [adults, setAdults] = useState(1)
  const [kids, setKids] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sectionRef = useRef<HTMLDivElement>(null)

  const totalPersons = adults + kids
  const totalPrice = adults * PRICE_ADULT + kids * PRICE_KID
  const available = availability?.available ?? 0

  useEffect(() => {
    if (!date) return
    setAvState('loading')
    setAvailability(null)
    const ctrl = new AbortController()
    fetch(`/api/availability?date=${date}`, { signal: ctrl.signal })
      .then(r => {
        if (!r.ok) throw new Error('fetch failed')
        return r.json()
      })
      .then(d => {
        setAvailability(d)
        if (d.blocked) setAvState('blocked')
        else if (d.available === 0) setAvState('soldout')
        else setAvState('ready')
        // clamp persons to available
        const avail = d.available || 0
        if (adults + kids > avail) {
          const newAdults = Math.min(adults, avail)
          const newKids = Math.min(kids, Math.max(0, avail - newAdults))
          setAdults(newAdults)
          setKids(newKids)
        }
      })
      .catch(() => { if (!ctrl.signal.aborted) setAvState('error') })
    return () => ctrl.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  const maxPersons = avState === 'ready' ? available : MAX_SEATS

  function changeAdults(delta: number) {
    const next = adults + delta
    if (next < 0) return
    if (next + kids > maxPersons) return
    setAdults(next)
  }

  function changeKids(delta: number) {
    const next = kids + delta
    if (next < 0) return
    if (adults + next > maxPersons) return
    setKids(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Bitte Namen eingeben.'); return }
    if (totalPersons < 1) { setError('Bitte mindestens 1 Person wählen.'); return }
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_date: date,
          group_size: totalPersons,
          contact_name: name,
          email,
          adults_count: adults,
          kids_count: kids,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Fehler bei der Buchung.') }
      else {
        setSuccess(true)
        setName(''); setEmail(''); setAdults(1); setKids(0)
        if (availability) {
          const newAvail = availability.available - totalPersons
          setAvailability({ booked: availability.booked + totalPersons, available: Math.max(0, newAvail) })
          if (newAvail <= 0) setAvState('soldout')
        }
      }
    } catch {
      setError('Netzwerkfehler. Bitte erneut versuchen.')
    } finally {
      setSubmitting(false)
    }
  }

  const booked = availability?.booked ?? 0
  const canSubmit = avState === 'ready' && totalPersons >= 1

  return (
    <section id="buchen" ref={sectionRef} className="relative py-20 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D4A843 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-outfit text-xs tracking-[0.2em] uppercase text-amber-light/60 mb-3">Reservierung</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream">
            Platz <em className="gold-text not-italic">sichern</em>
          </h2>
          <p className="font-outfit text-sm text-cream/50 mt-3">
            Täglich 19:00 Uhr · Direkt an der Kajüten-Gracht · Max. 6 Personen
          </p>
        </div>

        <div className="nautical-border rounded-2xl overflow-hidden" style={{ background: 'rgba(19,34,64,0.7)', backdropFilter: 'blur(12px)' }}>

          {/* ── Date ── */}
          <div className="p-6 border-b border-cream/5">
            <label className="form-label block mb-2">Datum</label>
            <input
              type="date"
              value={date}
              min={toDateString(seasonMin)}
              max={toDateString(seasonMax)}
              onChange={e => { setDate(e.target.value); setSuccess(false); setError(null) }}
              className="form-input w-full rounded-xl px-4 py-3 text-base"
            />
            <p className="font-outfit text-xs text-cream/30 mt-2">Saison: 11. Mai – 30. September</p>
          </div>

          {/* ── Availability ── */}
          <div className="px-6 py-4 border-b border-cream/5">
            {avState === 'loading' && (
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {Array.from({ length: MAX_SEATS }).map((_, i) => (
                    <div key={i} className="seat-dot animate-pulse" style={{ background: 'rgba(212,168,67,0.15)' }} />
                  ))}
                </div>
                <span className="font-outfit text-sm text-cream/35">Wird geprüft…</span>
              </div>
            )}
            {avState === 'ready' && availability && (
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  {Array.from({ length: MAX_SEATS }).map((_, i) => (
                    <div key={i} className={`seat-dot ${i < booked ? 'taken' : 'available'}`} />
                  ))}
                </div>
                <span className="font-outfit text-sm font-medium" style={{ color: '#4ade80' }}>
                  {available} von {MAX_SEATS} Plätzen frei
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
                <span className="font-outfit text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                  {avState === 'blocked' ? 'Keine Fahrt' : 'Ausgebucht'}
                </span>
              </div>
            )}
            {avState === 'error' && (
              <p className="font-outfit text-sm text-red-400">
                Verfügbarkeit konnte nicht geladen werden — bitte Seite neu laden.
              </p>
            )}
          </div>

          {/* ── Success ── */}
          {success && (
            <div className="m-6 success-appear rounded-xl p-6 text-center"
              style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <div className="text-3xl mb-2">⚓</div>
              <p className="font-cormorant text-xl text-green-300 font-medium">Reservierung erhalten!</p>
              <p className="font-outfit text-sm text-cream/55 mt-1">
                Bis zum {formatDateDE(date)} um 19:00 Uhr an der Kajüten-Gracht.
              </p>
              <p className="font-outfit text-xs text-cream/35 mt-2">
                Barzahlung vor Ort · 19€ p.P. · Kids 2–7 Jahre 5€
              </p>
            </div>
          )}

          {/* ── Person picker + form ── */}
          {!success && avState !== 'soldout' && avState !== 'blocked' && (
            <form onSubmit={handleSubmit}>

              {/* Person counters */}
              <div className="px-6 py-5 border-b border-cream/5">
                <p className="form-label block mb-4">Personen</p>

                {/* Adults */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-outfit text-sm text-cream/80 font-medium">Erwachsene & ab 8 Jahren</p>
                    <p className="font-outfit text-xs text-cream/35 mt-0.5">{PRICE_ADULT} € pro Person</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => changeAdults(-1)} disabled={adults <= 0}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-light transition-all"
                      style={{
                        background: adults > 0 ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${adults > 0 ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: adults > 0 ? '#ECC564' : 'rgba(245,237,216,0.2)',
                        cursor: adults > 0 ? 'pointer' : 'default',
                      }}>−</button>
                    <span className="font-outfit text-xl font-medium text-cream w-6 text-center">{adults}</span>
                    <button type="button" onClick={() => changeAdults(1)} disabled={totalPersons >= maxPersons}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-light transition-all"
                      style={{
                        background: totalPersons < available ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${totalPersons < available ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: totalPersons < available ? '#ECC564' : 'rgba(245,237,216,0.2)',
                        cursor: totalPersons < available ? 'pointer' : 'default',
                      }}>+</button>
                  </div>
                </div>

                {/* Kids */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-outfit text-sm text-cream/80 font-medium">Kleine Kids (2–7 Jahre)</p>
                    <p className="font-outfit text-xs text-cream/35 mt-0.5">{PRICE_KID} € pro Person</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => changeKids(-1)} disabled={kids <= 0}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-light transition-all"
                      style={{
                        background: kids > 0 ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${kids > 0 ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: kids > 0 ? '#ECC564' : 'rgba(245,237,216,0.2)',
                        cursor: kids > 0 ? 'pointer' : 'default',
                      }}>−</button>
                    <span className="font-outfit text-xl font-medium text-cream w-6 text-center">{kids}</span>
                    <button type="button" onClick={() => changeKids(1)} disabled={totalPersons >= maxPersons}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-light transition-all"
                      style={{
                        background: totalPersons < available ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${totalPersons < available ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: totalPersons < available ? '#ECC564' : 'rgba(245,237,216,0.2)',
                        cursor: totalPersons < available ? 'pointer' : 'default',
                      }}>+</button>
                  </div>
                </div>
              </div>

              {/* Price summary */}
              {totalPersons > 0 && (
                <div className="px-6 py-4 border-b border-cream/5 flex items-center justify-between"
                  style={{ background: 'rgba(212,168,67,0.05)' }}>
                  <div>
                    <span className="font-outfit text-sm text-cream/50">{totalPersons} Person{totalPersons !== 1 ? 'en' : ''}</span>
                    <span className="font-outfit text-xs text-cream/30 ml-3">Barzahlung vor Ort</span>
                  </div>
                  <span className="font-cormorant text-2xl font-medium gold-text">{totalPrice} €</span>
                </div>
              )}

              {/* Contact fields */}
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="form-label block mb-2">Name *</label>
                  <input type="text" placeholder="Dein Name" value={name}
                    onChange={e => setName(e.target.value)} required
                    className="form-input w-full rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="form-label block mb-2">E-Mail</label>
                  <input type="email" placeholder="deine@mail.de" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input w-full rounded-xl px-4 py-3 text-sm" />
                </div>

                {error && (
                  <p className="font-outfit text-sm text-red-400 bg-red-950/30 rounded-lg px-4 py-2 border border-red-900/40">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={!canSubmit || submitting}
                  className="btn-primary w-full rounded-xl py-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  <span>{submitting ? 'Wird gesendet…' : 'Jetzt reservieren'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Blocked / soldout message */}
          {!success && (avState === 'soldout' || avState === 'blocked') && (
            <div className="p-8 text-center">
              <p className="font-cormorant text-2xl text-cream/55 italic">
                {avState === 'blocked' ? 'An diesem Tag findet keine Fahrt statt.' : 'Alle Plätze für diesen Tag sind vergeben.'}
              </p>
              <p className="font-outfit text-sm text-cream/35 mt-2">Bitte ein anderes Datum wählen.</p>
            </div>
          )}
        </div>

        <p className="font-outfit text-xs text-center text-cream/25 mt-5 leading-relaxed">
          Offenes Boot · Fahrt nur bei gutem & trockenem Wetter (mind. 14 °C) · Mind. 2 Personen für Abfahrt nötig
        </p>
      </div>
    </section>
  )
}
