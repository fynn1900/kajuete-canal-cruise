import Image from 'next/image'
import BookingSection from '@/components/BookingSection'

const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  top: `${Math.round(5 + (i * 3.1) % 80)}%`,
  left: `${Math.round(2 + (i * 7.3) % 96)}%`,
  duration: `${2.5 + (i % 5) * 0.7}s`,
  delay: `${(i * 0.4) % 4}s`,
  size: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
}))

export default function Home() {
  return (
    <main className="min-h-screen bg-navy">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-24 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(175deg, #050e1c 0%, #0A1628 45%, #0d1f3b 100%)' }}>

        {/* Stars */}
        <div className="stars">
          {STARS.map(s => (
            <div
              key={s.id}
              className="star"
              style={{
                top: s.top,
                left: s.left,
                width: `${s.size}px`,
                height: `${s.size}px`,
                ['--duration' as string]: s.duration,
                ['--delay' as string]: s.delay,
              }}
            />
          ))}
        </div>

        {/* Radial glow behind logo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 65%)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">

          {/* Logo */}
          <div className="mb-8 animate-float">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <Image
                src="/logo.png"
                alt="Skipper Fynn – Kajüte 1876"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Season badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-amber/30 bg-amber/5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-light animate-shimmer" />
            <span className="font-outfit text-xs tracking-[0.18em] uppercase text-amber-light/80">
              11. Mai – 30. September 2025
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-cormorant font-light leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', color: '#F5EDD8' }}>
            Die etwas andere
            <br />
            <em className="gold-text italic">Grachten Rundfahrt</em>
          </h1>

          {/* Subline */}
          <p className="font-outfit text-sm md:text-base tracking-wider text-cream/55 mb-10 leading-relaxed">
            Täglich 19:00 Uhr&nbsp;&nbsp;·&nbsp;&nbsp;Friedrichstadt&nbsp;&nbsp;·&nbsp;&nbsp;Max. 6 Personen
          </p>

          {/* CTA */}
          <a
            href="#buchen"
            className="btn-primary rounded-full px-10 py-4 text-sm"
          >
            <span>⚓&nbsp; Jetzt Platz sichern</span>
          </a>

          {/* Scroll hint */}
          <div className="mt-16 flex flex-col items-center gap-2 opacity-30">
            <span className="font-outfit text-xs tracking-widest uppercase">Mehr erfahren</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <path d="M8 4v16M2 14l6 6 6-6" stroke="#F5EDD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Animated waves */}
        <div className="wave-container" style={{ height: '90px' }}>
          <div className="wave-track wave-1">
            {[0, 1].map(k => (
              <svg key={k} viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0,45 C180,90 360,0 540,45 C720,90 900,0 1080,45 C1260,90 1350,22 1440,45 L1440,90 L0,90 Z"
                  fill="#132240" />
              </svg>
            ))}
          </div>
          <div className="wave-track wave-2" style={{ marginTop: '-70px' }}>
            {[0, 1].map(k => (
              <svg key={k} viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0,55 C200,10 400,80 600,40 C800,0 1000,70 1200,35 C1320,15 1380,60 1440,40 L1440,90 L0,90 Z"
                  fill="#0A1628" opacity="0.8" />
              </svg>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INFO CARDS
      ══════════════════════════════════════ */}
      <section id="info" className="py-20 px-4" style={{ background: '#132240' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-outfit text-xs tracking-[0.2em] uppercase text-amber-light/50 mb-3">An Bord</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream">
              Was euch <em className="gold-text italic not-italic">erwartet</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1 */}
            <div className="card-glow nautical-border rounded-2xl p-7"
              style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-4">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="17" stroke="rgba(212,168,67,0.3)" strokeWidth="1" />
                  <text x="18" y="24" textAnchor="middle" fontSize="18">⛵</text>
                </svg>
              </div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2">Exklusive Fahrt</h3>
              <p className="font-outfit text-sm text-cream/55 leading-relaxed">
                Mit Skipper Fynn durch die Grachten – maximal <strong className="text-cream/80">6 Personen</strong> pro Fahrt.
                Persönlich, entspannt, unvergesslich.
                <br /><br />
                <strong className="text-amber-light/80">60 Minuten</strong> inklusive Ab- und Anlegen.
                Direkt an der Hütten-Gracht.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card-glow nautical-border rounded-2xl p-7"
              style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-4">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="17" stroke="rgba(212,168,67,0.3)" strokeWidth="1" />
                  <text x="18" y="24" textAnchor="middle" fontSize="18">🍺</text>
                </svg>
              </div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2">Inklusive</h3>
              <p className="font-outfit text-sm text-cream/55 leading-relaxed">
                1× <strong className="text-cream/80">1621 Bier</strong> (das Friedrichstädter Bier) oder Softdrink
                für jede Person an Bord.
                <br /><br />
                Weitere Drinks & <strong className="text-amber-light/80">Grachten Musik</strong> an Bord –
                für die perfekte Abendstimmung auf dem Wasser.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card-glow nautical-border rounded-2xl p-7"
              style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-4">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="17" stroke="rgba(212,168,67,0.3)" strokeWidth="1" />
                  <text x="18" y="24" textAnchor="middle" fontSize="18">💰</text>
                </svg>
              </div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2">Preise</h3>
              <p className="font-outfit text-sm text-cream/55 leading-relaxed">
                <strong className="text-cream/80 text-base">19 €</strong> pro Person&emsp;
                <span className="text-cream/40 text-xs">(Spende)</span>
                <br />
                <strong className="text-amber-light/80 text-base">5 €</strong> Kids von 2–7 Jahren
                <br /><br />
                <span className="text-cream/40">Barzahlung an Bord · Keine Online-Zahlung erforderlich</span>
              </p>
            </div>

            {/* Card 4 – Hinweis */}
            <div className="card-glow rounded-2xl p-7"
              style={{
                background: 'rgba(10,22,40,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(212,168,67,0.15)',
                borderTop: '2px solid rgba(212,168,67,0.35)',
              }}>
              <div className="mb-4">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="17" stroke="rgba(212,168,67,0.3)" strokeWidth="1" />
                  <text x="18" y="24" textAnchor="middle" fontSize="18">⚠️</text>
                </svg>
              </div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2">Wichtiger Hinweis</h3>
              <p className="font-outfit text-sm text-cream/55 leading-relaxed">
                Offenes Boot – Fahrt nur bei <strong className="text-cream/80">gutem & trockenem Wetter</strong>{' '}
                (mindestens 14 °C).
                <br /><br />
                Mindestens <strong className="text-cream/80">2 Personen</strong> müssen gebucht haben, damit die Fahrt stattfindet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DESCRIPTION
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: '#0A1628' }}>
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at right center, #2589BF, transparent 65%)' }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="rope-divider mb-12 w-24 mx-auto" />

          <p className="font-outfit text-xs tracking-[0.2em] uppercase text-amber-light/50 mb-6">
            Friedrichstadt · Das holländische Städtchen
          </p>

          <blockquote className="font-cormorant font-light leading-snug mb-8"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F5EDD8' }}>
            „Erlebe Friedrichstadt vom Wasser aus –
            <br />
            <em className="gold-text">ein Muss im Abendlicht."</em>
          </blockquote>

          <p className="font-outfit text-base text-cream/50 leading-relaxed max-w-xl mx-auto">
            Das Trachtstädtchen wie du es noch nicht gesehen hast. Mit Skipper Fynn gleitest du durch
            die stillen Grachten, während die Abendsonne die Giebelfassaden in Gold taucht.
            Entspanntes Abenteuer für Paare, Familien und kleine Gruppen.
          </p>

          <div className="rope-divider mt-12 w-24 mx-auto" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          TISCH RESERVIERUNG BANNER
      ══════════════════════════════════════ */}
      <section className="py-14 px-4" style={{ background: '#132240' }}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-8 md:p-10 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(212,168,67,0.05) 100%)',
              border: '1.5px solid rgba(212,168,67,0.3)',
            }}>
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.15) 0%, transparent 65%)' }}
            />
            <div className="relative z-10">
              <p className="text-2xl mb-4">🍽️</p>
              <h3 className="font-cormorant text-2xl md:text-3xl font-medium text-cream mb-4">
                Tisch vorher reservieren – Plätze an Bord sichern
              </h3>
              <p className="font-outfit text-sm text-cream/60 leading-relaxed mb-7 max-w-lg mx-auto">
                Wenn ihr vorher um <strong className="text-amber-light">18:00 Uhr</strong> einen Tisch in der{' '}
                <strong className="text-cream/80">Kajüte</strong> oder im{' '}
                <strong className="text-cream/80">Garten</strong> zum Flammkuchen reserviert –
                sichert ihr euch gleichzeitig eure Plätze auf der Abendfahrt.
              </p>
              <a
                href="#reservierung"
                className="btn-outline inline-block rounded-full px-8 py-3 text-sm"
              >
                Tisch reservieren →
              </a>
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
      <footer className="py-10 px-4 text-center border-t border-cream/5" style={{ background: '#050e1c' }}>
        <div className="mb-4">
          <Image src="/logo.png" alt="Skipper Fynn" width={64} height={64} className="mx-auto opacity-70 object-contain" />
        </div>
        <p className="font-cormorant text-lg text-cream/40 mb-1">Kajüte 1876 · Friedrichstadt</p>
        <p className="font-outfit text-xs tracking-widest uppercase text-cream/20">
          Skipper Fynn · Täglich 19:00 Uhr · 11. Mai – 30. September
        </p>
        <div className="rope-divider w-16 mx-auto mt-6 opacity-20" />
      </footer>

    </main>
  )
}
