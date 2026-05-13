'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useLanguage } from '@/contexts/LanguageContext'

const MAX_SEATS = 6
const PRICE_ADULT = 19
const PRICE_KID = 5
const PRICE_EXCLUSIVE_SURCHARGE = 6

function getSupabase() {
  return createClient(
    'https://vtrpbvjckliwyuccbhvm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cnBidmpja2xpd3l1Y2NiaHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODM3MjUsImV4cCI6MjA4OTI1OTcyNX0.yvyUfF5q2G1yabH6NFG8Tk5DqVH-wCJpct4iTzF90Fg'
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
  const { t, lang } = useLanguage()

  const seasonMin = getSeasonMin()
  const seasonMax = getSeasonMax()
  const today = new Date()
  const defaultDate = today >= seasonMin && today <= seasonMax ? toDateString(today) : toDateString(seasonMin)

  const [date, setDate] = useState(defaultDate)
  const [avState, setAvState] = useState<AvState>('idle')
  const [booked, setBooked] = useState(0)
  const [available, setAvailable] = useState(MAX_SEATS)

  const [adults, setAdults] = useState(2)
  const [kids, setKids] = useState(0)
  const [isExclusive, setIsExclusive] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [liabilityAccepted, setLiabilityAccepted] = useState(false)
  const [liabilityOpen, setLiabilityOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = liabilityOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [liabilityOpen])

  const totalPersons = adults + kids
  const exclusiveSurcharge = isExclusive ? totalPersons * PRICE_EXCLUSIVE_SURCHARGE : 0
  const totalPrice = adults * PRICE_ADULT + kids * PRICE_KID + exclusiveSurcharge

  useEffect(() => {
    if (!date) return
    setAvState('loading')
    setSuccess(false)
    setFormError(null)
    setIsExclusive(false)

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

  const MIN_TOTAL = booked >= 1 ? 1 : 2

  // Exclusive only available when no one else booked yet
  const canGoExclusive = booked === 0 && avState === 'ready'

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
    if (!name.trim()) { setFormError(t.nameError); return }
    if (totalPersons < MIN_TOTAL) { setFormError(t.minError); return }
    if (!liabilityAccepted) { setFormError(t.liabilityRequired); return }
    setFormError(null)
    setSubmitting(true)
    try {
      const groupSizeToSend = isExclusive ? MAX_SEATS : totalPersons
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_date: date,
          group_size: groupSizeToSend,
          contact_name: name,
          email,
          adults_count: adults,
          kids_count: kids,
          liability_accepted: true,
          is_exclusive: isExclusive,
        }),
      })
      let data: { error?: string; success?: boolean } = {}
      try { data = await res.json() } catch { data = { error: `Fehler ${res.status}` } }
      if (!res.ok) { setFormError(data.error || `Fehler ${res.status}`) }
      else {
        setSuccess(true)
        setBooked(b => b + groupSizeToSend)
        setAvailable(0)
        setAvState('soldout')
        setName(''); setEmail(''); setAdults(1); setKids(0); setIsExclusive(false)
      }
    } catch (err) {
      console.error('Booking submit error:', err)
      setFormError(lang === 'de'
        ? 'Verbindungsfehler. Bitte Seite neu laden und erneut versuchen.'
        : 'Connection error. Please reload the page and try again.')
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
    <section id="buchen" className="relative py-14 px-4">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 600px 400px at 50% 40%, rgba(212,168,67,0.05) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="font-outfit text-xs tracking-[0.22em] uppercase mb-3" style={{ color: 'rgba(212,168,67,0.55)' }}>{t.reservation}</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream">
            {t.secureSpot} <em className="gold-text not-italic">{t.secureSpotEm}</em>
          </h2>
          <p className="font-outfit text-sm mt-3" style={{ color: '#F5EDD8' }}>
            {t.bookingSub}
          </p>
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full"
            style={{ background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ECC564' }} />
            <span className="font-outfit text-xs" style={{ color: 'rgba(236,197,100,0.65)' }}>
              {lang === 'de' ? 'Nur 6 Plätze pro Abfahrt – begrenzt' : 'Only 6 spots per trip – limited'}
            </span>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{
          background: 'rgba(19,34,64,0.75)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(212,168,67,0.15)',
          borderTop: '2px solid rgba(212,168,67,0.35)',
        }}>

          {/* Date */}
          <div className="pt-5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <label className="form-label block mb-2 px-5">{t.chooseDate}</label>
            <input type="date" value={date}
              min={toDateString(seasonMin)} max={toDateString(seasonMax)}
              onChange={e => setDate(e.target.value)}
              className="form-input w-full py-3 text-base text-center"
              style={{ fontSize: '16px', display: 'block' }} />
            <p className="font-outfit text-xs mt-1.5 px-5" style={{ color: 'rgba(245,237,216,0.25)' }}>{t.seasonNote}</p>
          </div>

          {/* Availability */}
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {avState === 'loading' && (
              <div className="flex items-center gap-3">
                {Array.from({ length: MAX_SEATS }).map((_, i) => (
                  <div key={i} className="seat-dot animate-pulse" style={{ background: 'rgba(212,168,67,0.12)' }} />
                ))}
                <span className="font-outfit text-xs" style={{ color: 'rgba(245,237,216,0.3)' }}>{t.loading}</span>
              </div>
            )}
            {avState === 'ready' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex gap-1.5">
                    {Array.from({ length: MAX_SEATS }).map((_, i) => (
                      <div key={i} className={`seat-dot ${i < booked ? 'taken' : 'available'}`} />
                    ))}
                  </div>
                  <span className="font-outfit text-sm font-medium" style={{ color: '#4ade80' }}>
                    {available} {t.of} {MAX_SEATS} {t.spotsLeft}
                  </span>
                </div>
                {available > 0 && available <= 3 && (
                  <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full"
                    style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span className="font-outfit text-xs font-medium" style={{ color: '#fca5a5' }}>
                      {lang === 'de'
                        ? `Nur noch ${available} Platz${available !== 1 ? 'e' : ''} – schnell buchen!`
                        : `Only ${available} spot${available !== 1 ? 's' : ''} left – book fast!`}
                    </span>
                  </div>
                )}
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
                  {avState === 'blocked' ? t.noTrip : t.soldOut}
                </span>
              </div>
            )}
            {avState === 'error' && (
              <p className="font-outfit text-sm" style={{ color: '#f87171' }}>
                {t.loadError}
              </p>
            )}
          </div>

          {/* Success */}
          {success && (
            <div className="m-6 rounded-xl p-6 text-center success-appear"
              style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.18)' }}>
              <div className="text-3xl mb-3">⚓</div>
              <p className="font-cormorant text-xl font-medium" style={{ color: '#F5EDD8' }}>{t.successTitle}</p>
              <p className="font-outfit text-sm mt-1" style={{ color: '#F5EDD8' }}>
                {t.successSub} {formatDateDE(date)} {lang === 'de' ? 'um 19 Uhr' : 'at 7 PM'}!
              </p>
              <p className="font-outfit text-xs mt-2" style={{ color: '#F5EDD8' }}>
                {t.successNote}
              </p>
              {email && (
                <p className="font-outfit text-xs mt-3" style={{ color: 'rgba(74,222,128,0.7)' }}>
                  ✉ {lang === 'de' ? `Bestätigung geht an ${email}` : `Confirmation sent to ${email}`}
                </p>
              )}
            </div>
          )}

          {/* Form */}
          {!success && avState !== 'soldout' && avState !== 'blocked' && (
            <form onSubmit={handleSubmit}>

              {/* Person counters */}
              <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <p className="form-label block mb-5">{t.persons}</p>

                <div className="space-y-5">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-outfit text-sm font-medium text-cream">{t.adults}</p>
                      <p className="font-outfit text-xs mt-0.5 text-cream">{PRICE_ADULT} € {t.card3Adult}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <CounterBtn onClick={() => changeAdults(-1)} disabled={adults <= 1} label="−" />
                      <span className="font-outfit text-xl font-semibold text-cream w-5 text-center">{adults}</span>
                      <CounterBtn onClick={() => changeAdults(1)} disabled={totalPersons >= maxPersons} label="+" />
                    </div>
                  </div>

                  {/* Kids */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-outfit text-sm font-medium text-cream">{t.kids}</p>
                      <p className="font-outfit text-xs mt-0.5 text-cream">{PRICE_KID} € {t.card3Adult}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <CounterBtn onClick={() => changeKids(-1)} disabled={kids <= 0} label="−" />
                      <span className="font-outfit text-xl font-semibold text-cream w-5 text-center">{kids}</span>
                      <CounterBtn onClick={() => changeKids(1)} disabled={totalPersons >= maxPersons} label="+" />
                    </div>
                  </div>
                </div>

                {totalPersons < MIN_TOTAL && (
                  <p className="font-outfit text-xs mt-2 px-1 leading-relaxed text-cream">
                    {totalPersons === 1
                      ? (lang === 'de'
                          ? 'Alleine? Schau später nochmal rein — sobald sich jemand dazubucht, kannst du solo mitfahren.'
                          : 'Going solo? Check back later — once someone else books, you can join on your own.')
                      : t.minPersons}
                  </p>
                )}
                {MIN_TOTAL === 1 && booked >= 1 && (
                  <p className="font-outfit text-xs mt-2 px-1" style={{ color: 'rgba(74,222,128,0.6)' }}>
                    {lang === 'de'
                      ? 'Bereits ' + booked + ' Person' + (booked !== 1 ? 'en' : '') + ' gebucht — du kannst alleine zusteigen.'
                      : booked + ' person' + (booked !== 1 ? 's' : '') + ' already booked — you can join solo.'}
                  </p>
                )}

                {/* Exclusive toggle */}
                {canGoExclusive && (
                  <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <button
                      type="button"
                      onClick={() => setIsExclusive(v => !v)}
                      className="w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all"
                      style={{
                        background: isExclusive ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `1.5px solid ${isExclusive ? 'rgba(212,168,67,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      }}>
                      <div className="text-left">
                        <p className="font-outfit text-sm font-medium text-cream">{t.exclusiveLabel}</p>
                        <p className="font-outfit text-xs mt-0.5" style={{ color: isExclusive ? '#ECC564' : '#F5EDD8' }}>
                          {t.exclusiveDesc}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ml-3"
                        style={{
                          background: isExclusive ? 'rgba(212,168,67,0.25)' : 'rgba(255,255,255,0.06)',
                          border: `1.5px solid ${isExclusive ? '#ECC564' : 'rgba(255,255,255,0.15)'}`,
                        }}>
                        {isExclusive && <span style={{ color: '#ECC564', fontSize: '13px', lineHeight: 1 }}>✓</span>}
                      </div>
                    </button>
                    {isExclusive && (
                      <p className="font-outfit text-xs mt-2 px-1 text-cream">
                        {lang === 'de'
                          ? `Skipper Fynn fährt exklusiv nur mit euch — kein anderer Gast ist dabei.`
                          : `Skipper Fynn sails exclusively with you — no other guests on board.`}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price total */}
              {totalPersons > 0 && (
                <div className="px-6 py-3.5 border-b flex items-center justify-between"
                  style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(212,168,67,0.04)' }}>
                  <span className="font-outfit text-sm text-cream">
                    {totalPersons} {t.persons} · {t.cashNote}
                    {isExclusive && (
                      <span style={{ color: '#ECC564' }}> · exkl. +{totalPersons * PRICE_EXCLUSIVE_SURCHARGE} €</span>
                    )}
                  </span>
                  <span className="font-cormorant text-2xl font-semibold gold-text">{totalPrice} €</span>
                </div>
              )}

              {/* Contact */}
              <div className="px-6 py-5 space-y-4">
                <p className="form-label block mb-1">{lang === 'de' ? 'Platz im Boot sichern' : 'Secure your spot'}</p>
                <div>
                  <label className="form-label block mb-2">{t.nameLabel}</label>
                  <input type="text" placeholder={t.namePlaceholder} value={name}
                    onChange={e => setName(e.target.value)} required
                    className="form-input w-full rounded-xl px-4 py-3"
                    style={{ fontSize: '16px' }} />
                </div>
                <div>
                  <label className="form-label block mb-2">
                    {t.emailLabel}{' '}
                    <span style={{ color: 'var(--cream)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                      {t.emailHint}
                    </span>
                  </label>
                  <input type="email" placeholder={t.emailPlaceholder} value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input w-full rounded-xl px-4 py-3"
                    style={{ fontSize: '16px' }} />
                </div>

                {/* Liability checkbox */}
                <div className="flex gap-3 py-1" style={{ alignItems: 'flex-start' }}>
                  <button type="button"
                    onClick={() => setLiabilityAccepted(v => !v)}
                    style={{
                      marginTop: '2px',
                      width: '20px', height: '20px', minWidth: '20px',
                      borderRadius: '4px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: liabilityAccepted ? 'rgba(212,168,67,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${liabilityAccepted ? 'rgba(212,168,67,0.6)' : 'rgba(255,255,255,0.15)'}`,
                      transition: 'all 0.15s',
                    }}>
                    {liabilityAccepted && <span style={{ color: '#ECC564', fontSize: '12px', lineHeight: 1 }}>✓</span>}
                  </button>
                  <div style={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.875rem', lineHeight: '1.5', color: '#F5EDD8' }}>
                    {lang === 'de' ? 'Ich habe die ' : 'I have read the '}
                    <button type="button" onClick={() => setLiabilityOpen(true)}
                      style={{ color: 'rgba(212,168,67,0.85)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px', padding: 0 }}>
                      {t.liabilityLink}
                    </button>
                    {lang === 'de' ? ' gelesen und akzeptiert.' : ' and accept the conditions.'}
                  </div>
                </div>

                {/* Liability modal */}
                {liabilityOpen && (
                  <div className="fixed inset-0 z-50 overflow-y-auto"
                    style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
                    onClick={() => setLiabilityOpen(false)}>
                    <div className="flex min-h-full items-start justify-center px-4 pt-8 pb-12">
                      <div className="rounded-2xl max-w-md w-full p-7"
                        style={{ background: '#0A1628', border: '1px solid rgba(212,168,67,0.25)' }}
                        onClick={e => e.stopPropagation()}>

                        {/* Section 1: Sicherheitshinweise */}
                        <h3 className="font-cormorant text-2xl font-semibold mb-4 leading-snug" style={{ color: '#ECC564' }}>
                          {lang === 'de' ? 'Sicherheitshinweise' : 'Safety Information'}
                        </h3>
                        <div className="font-outfit text-sm text-cream leading-relaxed space-y-3 mb-6">
                          {t.safetyHints.split('\n\n').map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>

                        <div className="border-t mb-6" style={{ borderColor: 'rgba(212,168,67,0.2)' }} />

                        {/* Section 2: Haftungsausschluss */}
                        <h3 className="font-cormorant text-2xl font-semibold mb-4 leading-snug" style={{ color: '#ECC564' }}>
                          {lang === 'de' ? 'Haftungsausschluss' : 'Disclaimer'}
                        </h3>
                        <div className="font-outfit text-sm text-cream leading-relaxed space-y-4 mb-7">
                          {t.liabilityText.split('\n\n').map((block, i) => (
                            <p key={i} className="whitespace-pre-line">{block}</p>
                          ))}
                        </div>

                        <button onClick={() => { setLiabilityAccepted(true); setLiabilityOpen(false) }}
                          className="w-full rounded-xl py-3.5 font-outfit text-sm font-semibold"
                          style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.35)', color: '#ECC564' }}>
                          {t.liabilityCheck}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {formError && (
                  <p className="font-outfit text-sm rounded-lg px-4 py-2"
                    style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                    {formError}
                  </p>
                )}

                <button type="submit" disabled={submitting || totalPersons < MIN_TOTAL || !liabilityAccepted || (avState !== 'ready' && avState !== 'idle')}
                  className="btn-primary w-full rounded-xl py-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  <span>{submitting ? t.submitting : t.submitBtn}</span>
                </button>
              </div>
            </form>
          )}

          {!success && (avState === 'soldout' || avState === 'blocked') && (
            <div className="mx-5 my-6 rounded-2xl p-7 text-center"
              style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.12)' }}>
              <div className="text-4xl mb-4">{avState === 'blocked' ? '🌧️' : '⚓'}</div>
              <p className="font-cormorant text-2xl font-light mb-2" style={{ color: '#fca5a5' }}>
                {avState === 'blocked' ? t.blockedTitle : t.soldoutTitle}
              </p>
              <p className="font-outfit text-sm leading-relaxed text-cream">
                {avState === 'blocked' ? t.blockedDesc : t.soldoutDesc}
              </p>
            </div>
          )}
        </div>


      </div>
    </section>
  )
}
