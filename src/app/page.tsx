'use client'

import Image from 'next/image'
import { useState } from 'react'
import BookingSection from '@/components/BookingSection'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t, lang } = useLanguage()
  const [safetyOpen, setSafetyOpen] = useState(false)

  return (
    <main className="min-h-screen bg-navy">

      {/* ══════════════════════════════════════
          HERO — frost blue background
      ══════════════════════════════════════ */}
      <section className="relative px-4 pb-0"
        style={{ background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 42%, #c2e2f5 58%, #79b8da 75%, #4d97be 100%)' }}>

        {/* Logo */}
        <div className="flex justify-center pt-24 pb-4">
          <div className="animate-float">
            <Image
              src="/logo_new.png"
              alt="1621-Bier & Grachtenfahrt – Kajüte 1876"
              width={520}
              height={420}
              style={{ width: 'clamp(220px, 65vw, 480px)', height: 'auto', display: 'block', mixBlendMode: 'multiply' }}
              priority
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full"
            style={{ border: '1px solid rgba(139,100,20,0.35)', background: 'rgba(139,100,20,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-shimmer" style={{ background: '#7A5800' }} />
            <span className="font-outfit text-xs tracking-[0.18em] uppercase" style={{ color: '#7A5800' }}>
              {t.season}
            </span>
          </div>

          <h1 className="font-cormorant font-bold leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(1.8rem, 7.5vw, 6.5rem)', color: '#7A5200' }}>
            <em className="italic uppercase">{t.heroTitle2}</em>
          </h1>

          <p className="font-outfit text-sm md:text-base tracking-wider mb-7 leading-relaxed"
            style={{ color: 'rgba(10,22,40,0.55)' }}>
            {t.heroSub}
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="#buchen" className="btn-primary rounded-full px-10 py-4 text-sm">
              <span>⚓&nbsp; {t.bookSpot}</span>
            </a>
            <a href="#info" className="rounded-full px-7 py-3.5 text-sm font-outfit font-medium"
              style={{ border: '1.5px solid rgba(10,22,40,0.3)', color: '#0A1628', transition: 'all 0.2s' }}>
              {t.learnMore}
            </a>
          </div>
          <p className="mt-4 font-outfit text-sm tracking-wider" style={{ color: 'rgba(10,22,40,0.5)' }}>
            {lang === 'de' ? 'Nur 6 Plätze pro Abfahrt · Oft schnell ausgebucht' : 'Only 6 spots per trip · Often sold out fast'}
          </p>
        </div>

        {/* Animated wave transition into dark section */}
        <div style={{ position: 'relative', height: '120px', marginTop: '3rem', marginLeft: '-1rem', marginRight: '-1rem', overflow: 'hidden', lineHeight: 0 }}>
          {/* Dark fill at bottom so there's no gap */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: '#132240' }} />

          {/* Wave layer 1 — back */}
          <div className="wave-container" style={{ height: '120px' }}>
            <div className="wave-track wave-1">
              <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: '100px' }}>
                <path d="M0,50 C180,100 360,0 540,50 C720,100 900,0 1080,50 C1260,100 1350,60 1440,50 L1440,100 L0,100 Z" fill="rgba(19,34,64,0.5)" />
              </svg>
              <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: '100px' }}>
                <path d="M0,50 C180,100 360,0 540,50 C720,100 900,0 1080,50 C1260,100 1350,60 1440,50 L1440,100 L0,100 Z" fill="rgba(19,34,64,0.5)" />
              </svg>
            </div>
            {/* Wave layer 2 — mid */}
            <div className="wave-track wave-2" style={{ position: 'absolute', bottom: 0, left: 0, width: '200%' }}>
              <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: '100px' }}>
                <path d="M0,60 C200,20 400,80 600,50 C800,20 1000,70 1200,40 C1320,20 1440,60 1440,60 L1440,100 L0,100 Z" fill="rgba(19,34,64,0.75)" />
              </svg>
              <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: '100px' }}>
                <path d="M0,60 C200,20 400,80 600,50 C800,20 1000,70 1200,40 C1320,20 1440,60 1440,60 L1440,100 L0,100 Z" fill="rgba(19,34,64,0.75)" />
              </svg>
            </div>
            {/* Wave layer 3 — front */}
            <div className="wave-track wave-3" style={{ position: 'absolute', bottom: 0, left: 0, width: '200%' }}>
              <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: '100px' }}>
                <path d="M0,70 C120,40 240,80 360,60 C480,40 600,75 720,55 C840,35 960,70 1080,50 C1200,30 1320,65 1440,70 L1440,100 L0,100 Z" fill="#132240" />
              </svg>
              <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: '100px' }}>
                <path d="M0,70 C120,40 240,80 360,60 C480,40 600,75 720,55 C840,35 960,70 1080,50 C1200,30 1320,65 1440,70 L1440,100 L0,100 Z" fill="#132240" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INFO CARDS
      ══════════════════════════════════════ */}
      <section id="info" className="py-12 md:py-16 px-4" style={{ background: '#132240' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-outfit text-sm tracking-[0.2em] uppercase text-amber-light/70 mb-3">{t.onBoard}</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream">
              {t.whatToExpect} <em className="gold-text not-italic">{t.whatToExpectEm}</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="card-glow nautical-border rounded-2xl p-5" style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-3 text-3xl">🚤</div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2 uppercase">{t.card1Title}</h3>
              <p className="font-outfit text-sm text-cream leading-relaxed">
                {t.card1Text}
                <br /><br />
                <strong className="text-amber-light">{t.card1Sub}</strong>
              </p>
            </div>

            <div className="card-glow rounded-2xl p-5 relative"
              style={{
                background: 'rgba(10,22,40,0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(212,168,67,0.3)',
                borderTop: '2px solid rgba(212,168,67,0.65)',
              }}>
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.35)' }}>
                <span className="font-outfit text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#ECC564' }}>
                  {t.card2Title}
                </span>
              </div>
              <div className="mb-3 text-3xl">🍺</div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-3 uppercase">
                {lang === 'de' ? 'Getränk inklusive' : 'Drink included'}
              </h3>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(212,168,67,0.1)' }}>
                  <span className="text-sm">🍺</span>
                  <span className="font-outfit text-xs font-medium text-cream/80">1621 Bier</span>
                </div>
                <span className="font-outfit text-xs text-cream/30">{lang === 'de' ? 'oder' : 'or'}</span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(212,168,67,0.1)' }}>
                  <span className="text-sm">🥤</span>
                  <span className="font-outfit text-xs font-medium text-cream/80">Softdrink</span>
                </div>
                <span className="font-outfit text-xs text-cream/40">{lang === 'de' ? '— je Person' : '— per person'}</span>
              </div>
              <p className="font-outfit text-sm text-cream leading-relaxed">
                {t.card2Sub}
              </p>
            </div>

            <div className="card-glow nautical-border rounded-2xl p-5" style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-3 text-3xl">💰</div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2 uppercase">{t.card3Title}</h3>
              <p className="font-outfit text-sm text-cream leading-relaxed">
                <strong className="text-cream text-base">19 €</strong> {t.card3Adult}
                <br />
                <strong className="text-amber-light text-base">5 €</strong> {t.card3Kid}
                <br /><br />
                <span className="text-cream/70">{t.card3Note}</span>
              </p>
            </div>

            <div className="card-glow nautical-border rounded-2xl p-5" style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-3 text-3xl">⚠️</div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2 uppercase">{t.card4Title}</h3>
              <p className="font-outfit text-sm text-cream leading-relaxed">
                {t.card4Text}
                <br /><br />
                {t.card4Sub}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DESCRIPTION
      ══════════════════════════════════════ */}
      <section className="py-8 md:py-12 px-4 relative overflow-hidden" style={{ background: '#0A1628' }}>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at right center, #2589BF, transparent 65%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="rope-divider mb-6 w-24 mx-auto" />

          <p className="font-outfit text-sm tracking-[0.2em] uppercase text-amber-light/70 mb-6">
            {t.descLabel}
          </p>

          <blockquote
            className="font-cormorant font-light leading-snug mb-8"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F5EDD8' }}
          >
            {t.descQuote}
            <br />
            <em className="gold-text">{t.descQuoteEm}</em>
          </blockquote>

          <p className="font-outfit text-base text-cream leading-relaxed max-w-xl mx-auto mb-5">
            {t.descText}
          </p>
          <p className="font-outfit text-base text-cream leading-relaxed max-w-xl mx-auto">
            {t.descText2}
          </p>

          <div className="rope-divider mt-6 w-24 mx-auto" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          KAJÜTE 1876 SECTION
      ══════════════════════════════════════ */}
      <section className="py-10 md:py-14 px-4" style={{ background: '#132240' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-outfit text-sm tracking-[0.2em] uppercase text-amber-light/70 mb-3">{t.startGoal}</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream">
              {t.kajueteTitle} <em className="gold-text not-italic">{t.kajueteEm}</em>
            </h2>
          </div>

          <div className="rounded-2xl overflow-hidden nautical-border" style={{ background: 'rgba(10,22,40,0.7)', backdropFilter: 'blur(8px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

              {/* Left — info */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden border border-amber/25 bg-white flex items-center justify-center">
                    <Image src="/kajuete-logo.png" alt="Kajüte 1876" width={56} height={56} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-cormorant text-2xl font-medium text-cream">Kajüte 1876</h3>
                    <p className="font-outfit text-xs text-cream tracking-wide">Holmertorstrasse 11 · Friedrichstadt</p>
                  </div>
                </div>

                <p className="font-outfit text-sm text-cream leading-relaxed mb-6">
                  {t.kajueteDesc}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-amber/60 mt-0.5">🍕</span>
                    <div>
                      <p className="font-outfit text-xs font-medium text-cream">{t.flammkuchenLabel}</p>
                      <p className="font-outfit text-xs text-cream/70">
                        {new Date() >= new Date(new Date().getFullYear(), 4, 15)
                          ? lang === 'de'
                            ? <><span>Täglich 12–19 Uhr</span><br /><span>donnerstags 18–22 Uhr</span></>
                            : <><span>Daily noon–7 PM</span><br /><span>Thursdays 6–10 PM</span></>
                          : lang === 'de' ? 'Täglich 12–19 Uhr' : 'Daily noon–7 PM'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber/60 mt-0.5">🍺</span>
                    <div>
                      <p className="font-outfit text-xs font-medium text-cream">{t.bierLabel}</p>
                      <p className="font-outfit text-xs text-cream/70">{t.bierHours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber/60 mt-0.5">🌊</span>
                    <div>
                      <p className="font-outfit text-xs font-medium text-cream">{t.gardenLabel}</p>
                      <p className="font-outfit text-xs text-cream/70">{t.gardenDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-5">
                  <span className="font-outfit text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {t.antifa}
                  </span>
                </div>

                <a
                  href="https://app.xn--diekajte-c6a.de/website/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-block rounded-full px-6 py-2.5 text-sm text-center"
                >
                  {t.discoverKajuete}
                </a>
              </div>

              {/* Right — Tisch banner */}
              <div
                className="p-8 md:p-10 flex flex-col justify-center border-t md:border-t-0 md:border-l"
                style={{ background: 'rgba(212,168,67,0.05)', borderColor: 'rgba(212,168,67,0.15)' }}
              >
                <p className="text-2xl mb-4">🍽️</p>
                <h4 className="font-cormorant text-2xl font-medium text-cream mb-3">
                  {t.beforeTrip}
                </h4>
                <p className="font-outfit text-sm text-cream leading-relaxed mb-6">
                  {t.beforeTripDesc}
                </p>
                <a
                  href="https://tally.so/r/9q6Wp1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary rounded-full px-7 py-3 text-sm text-center"
                >
                  <span>{t.tableBook}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BOOKING SECTION
      ══════════════════════════════════════ */}
      <div style={{ background: '#0A1628' }}>
        <BookingSection />
      </div>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      {/* Safety Modal */}
      {safetyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSafetyOpen(false)}>
          <div className="rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-8"
            style={{ background: '#0A1628', border: '1px solid rgba(212,168,67,0.25)' }}
            onClick={e => e.stopPropagation()}>
            <h3 className="font-cormorant text-2xl font-medium text-cream mb-5">{t.safetyTitle}</h3>
            <div className="font-outfit text-sm text-cream/60 leading-relaxed space-y-3">
              {t.safetyHints.split('\n\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <button onClick={() => setSafetyOpen(false)}
              className="mt-7 w-full rounded-xl py-3 font-outfit text-sm font-medium"
              style={{ background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.3)', color: '#ECC564' }}>
              Schließen
            </button>
          </div>
        </div>
      )}

      <footer className="py-10 px-4 text-center border-t border-cream/5" style={{ background: '#050e1c' }}>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden opacity-60 border border-amber/20 bg-white flex items-center justify-center">
            <Image src="/kajuete-logo.png" alt="Kajüte 1876" width={36} height={36} className="object-contain" />
          </div>
        </div>
        <p className="font-cormorant text-lg text-cream mb-1">{t.footerSlogan}</p>
        <p className="font-outfit text-xs tracking-widest uppercase text-cream">
          {t.footerSub}
        </p>
        <p className="font-outfit text-xs text-cream mt-2">
          {t.footerAddress}
        </p>
        <div className="mt-4">
          <button onClick={() => setSafetyOpen(true)}
            className="font-outfit text-xs underline underline-offset-2"
            style={{ color: 'rgba(245,237,216,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>
            {t.safetyTitle}
          </button>
        </div>
        <div className="rope-divider w-16 mx-auto mt-6 opacity-20" />
        <div className="mt-8">
          <a
            href="https://optriq.de"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            <div className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-2xl"
              style={{
                background: 'rgba(212,168,67,0.07)',
                border: '1px solid rgba(212,168,67,0.18)',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(212,168,67,0.12)'
                ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.32)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(212,168,67,0.07)'
                ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.18)'
              }}
            >
              <span className="font-outfit font-bold tracking-[0.15em] text-sm"
                style={{ color: 'rgba(212,168,67,0.85)', letterSpacing: '0.15em' }}>
                OPTRIQ
              </span>
              <span className="font-outfit text-xs text-cream" style={{ letterSpacing: '0.04em' }}>
                {lang === 'de' ? 'Website & Buchungssystem' : 'Website & Booking System'}
              </span>
            </div>
          </a>
        </div>
      </footer>

    </main>
  )
}
