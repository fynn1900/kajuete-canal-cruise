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
      {/* ── HERO — full navy, logo floats via multiply blend ── */}
      <section className="relative px-4 pb-16 overflow-hidden" style={{ background: '#0A1628' }}>

        {/* Soft white glow that fades into navy — logo sits on this */}
        <div className="flex justify-center" style={{
          background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.92) 18%, rgba(255,255,255,0.45) 52%, rgba(10,22,40,0) 100%)',
          paddingTop: '2rem',
          paddingBottom: '4rem',
          marginLeft: '-1rem',
          marginRight: '-1rem',
        }}>
          <div className="animate-float" style={{ isolation: 'isolate' }}>
            <Image
              src="/logo.png"
              alt="Skipper Fynn – Kajüte 1876"
              width={520}
              height={420}
              style={{
                width: 'clamp(200px, 60vw, 400px)',
                height: 'auto',
                display: 'block',
                mixBlendMode: 'multiply',
              }}
              priority
            />
          </div>
        </div>

      {/* ── HEADLINE ── */}
        {/* Stars */}
        <div className="stars">
          {STARS.map(s => (
            <div key={s.id} className="star" style={{
              top: s.top, left: s.left,
              width: `${s.size}px`, height: `${s.size}px`,
              ['--duration' as string]: s.duration,
              ['--delay' as string]: s.delay,
            }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-amber/30 bg-amber/5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-light animate-shimmer" />
            <span className="font-outfit text-xs tracking-[0.18em] uppercase text-amber-light/80">
              11. Mai – 30. September 2026
            </span>
          </div>

          <h1 className="font-cormorant font-light leading-[1.1] mb-4 text-cream"
            style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)' }}>
            Die etwas andere
            <br />
            <em className="gold-text italic">Grachten Rundfahrt</em>
          </h1>

          <p className="font-outfit text-sm md:text-base tracking-wider text-cream/50 mb-10 leading-relaxed">
            Täglich 19:00 Uhr · Friedrichstadt · Max. 6 Personen
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="#buchen" className="btn-primary rounded-full px-10 py-4 text-sm">
              <span>⚓&nbsp; Platz sichern</span>
            </a>
            <a href="#info" className="btn-outline rounded-full px-7 py-3.5 text-sm">
              Mehr erfahren
            </a>
          </div>
        </div>

        {/* Wave into info section */}
        <div className="wave-container" style={{ height: '70px' }}>
          <div className="wave-track wave-1">
            {[0, 1].map(k => (
              <svg key={k} viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0,35 C180,70 360,0 540,35 C720,70 900,0 1080,35 C1260,70 1350,18 1440,35 L1440,70 L0,70 Z" fill="#132240" />
              </svg>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INFO CARDS
      ══════════════════════════════════════ */}
      <section id="info" className="py-14 md:py-20 px-4" style={{ background: '#132240' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-outfit text-xs tracking-[0.2em] uppercase text-amber-light/50 mb-3">An Bord</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream">
              Was euch <em className="gold-text not-italic">erwartet</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="card-glow nautical-border rounded-2xl p-7" style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-4 text-3xl">⛵</div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2">Exklusive Fahrt</h3>
              <p className="font-outfit text-sm text-cream/55 leading-relaxed">
                Mit Skipper Fynn durch die Friedrichstädter Grachten — maximal <strong className="text-cream/80">6 Personen</strong> pro Tour.
                Klein, entspannt, kein Touristenboot.
                <br /><br />
                <strong className="text-amber-light/80">60 Minuten</strong> inklusive Ab- und Anlegen.
              </p>
            </div>

            <div className="card-glow nautical-border rounded-2xl p-7" style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-4 text-3xl">🍺</div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2">Inklusive</h3>
              <p className="font-outfit text-sm text-cream/55 leading-relaxed">
                1× <strong className="text-cream/80">1621 Bier</strong> — das Friedrichstädter Bier — oder Softdrink für jeden an Bord.
                <br /><br />
                Weitere Drinks & <strong className="text-amber-light/80">Grachten Musik</strong> an Bord,
                plus Infos zur Geschichte des Grachtenstädtchens vom Skipper persönlich.
              </p>
            </div>

            <div className="card-glow nautical-border rounded-2xl p-7" style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-4 text-3xl">💰</div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2">Preise</h3>
              <p className="font-outfit text-sm text-cream/55 leading-relaxed">
                <strong className="text-cream/80 text-base">19 €</strong> pro Person
                <br />
                <strong className="text-amber-light/80 text-base">5 €</strong> Kids von 2–7 Jahren
                <br /><br />
                <span className="text-cream/40">Barzahlung an Bord · Keine Vorauszahlung</span>
              </p>
            </div>

            <div className="card-glow nautical-border rounded-2xl p-7" style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(8px)' }}>
              <div className="mb-4 text-3xl">⚠️</div>
              <h3 className="font-cormorant text-2xl font-medium text-cream mb-2">Gut zu wissen</h3>
              <p className="font-outfit text-sm text-cream/55 leading-relaxed">
                Offenes Boot — die Fahrt findet nur bei <strong className="text-cream/80">gutem, trockenem Wetter</strong> statt (mind. 14 °C).
                <br /><br />
                Mindestens <strong className="text-cream/80">2 Personen</strong> müssen gebucht haben, damit wir losfahren.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DESCRIPTION
      ══════════════════════════════════════ */}
      <section className="py-14 md:py-20 px-4 relative overflow-hidden" style={{ background: '#0A1628' }}>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at right center, #2589BF, transparent 65%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="rope-divider mb-12 w-24 mx-auto" />

          <p className="font-outfit text-xs tracking-[0.2em] uppercase text-amber-light/50 mb-6">
            Friedrichstadt · Das Grachtenstädtchen
          </p>

          <blockquote
            className="font-cormorant font-light leading-snug mb-8"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F5EDD8' }}
          >
            „Friedrichstadt vom Wasser aus —
            <br />
            <em className="gold-text">im Abendlicht einfach schön."</em>
          </blockquote>

          <p className="font-outfit text-base text-cream/50 leading-relaxed max-w-xl mx-auto">
            Das kleine Grachtenstädtchen hat was — und vom Boot aus sieht man es nochmal anders.
            Skipper Fynn kennt die Ecken, erzählt was dazu, und das Bier ist auch kalt.
            Passt für Paare, Familien und kleine Gruppen gleichermaßen gut.
          </p>

          <div className="rope-divider mt-12 w-24 mx-auto" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          KAJÜTE 1876 SECTION
      ══════════════════════════════════════ */}
      <section className="py-14 md:py-20 px-4" style={{ background: '#132240' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-outfit text-xs tracking-[0.2em] uppercase text-amber-light/50 mb-3">Start & Ziel</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream">
              Die <em className="gold-text not-italic">Kajüte 1876</em>
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
                    <p className="font-outfit text-xs text-cream/40 tracking-wide">Holmertorstrasse 11 · Friedrichstadt</p>
                  </div>
                </div>

                <p className="font-outfit text-sm text-cream/60 leading-relaxed mb-6">
                  Gästehaus am Wasser, 1621-Bierbar, Veras Flammkuchenküche und Grachtengarten —
                  direkt da, wo die Bootsfahrt startet und endet.
                  Ein antifaschistischer Familienbetrieb, der genauso tickt wie das Boot.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-amber/60 mt-0.5">🍕</span>
                    <div>
                      <p className="font-outfit text-xs font-medium text-cream/70">Veras Flammkuchen</p>
                      <p className="font-outfit text-xs text-cream/40">Täglich 12–19 Uhr</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber/60 mt-0.5">🍺</span>
                    <div>
                      <p className="font-outfit text-xs font-medium text-cream/70">Bierautomat</p>
                      <p className="font-outfit text-xs text-cream/40">Täglich 11–23 Uhr</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber/60 mt-0.5">🌿</span>
                    <div>
                      <p className="font-outfit text-xs font-medium text-cream/70">Grachtengarten</p>
                      <p className="font-outfit text-xs text-cream/40">Wettergeschützte Außenplätze am Wasser</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-5">
                  <span className="font-outfit text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                    ✊ Antifaschistischer Wohlfühlort
                  </span>
                </div>

                <a
                  href="https://app.xn--diekajte-c6a.de/website/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-block rounded-full px-6 py-2.5 text-sm text-center"
                >
                  Kajüte 1876 entdecken →
                </a>
              </div>

              {/* Right — Tisch banner */}
              <div
                className="p-8 md:p-10 flex flex-col justify-center border-t md:border-t-0 md:border-l"
                style={{ background: 'rgba(212,168,67,0.05)', borderColor: 'rgba(212,168,67,0.15)' }}
              >
                <p className="text-2xl mb-4">🍽️</p>
                <h4 className="font-cormorant text-2xl font-medium text-cream mb-3">
                  Vor der Fahrt noch essen?
                </h4>
                <p className="font-outfit text-sm text-cream/55 leading-relaxed mb-6">
                  Viele kommen um 18 Uhr zum Flammkuchen in die Kajüte oder in den Garten —
                  und steigen dann direkt auf&apos;s Boot. Wenn ihr das plant, könnt ihr gerne
                  vorab einen Tisch reservieren.
                </p>
                <a
                  href="https://tally.so/r/9q6Wp1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary rounded-full px-7 py-3 text-sm text-center"
                >
                  <span>Tisch reservieren →</span>
                </a>
                <p className="font-outfit text-xs text-cream/30 mt-3">
                  Tischreservierung und Bootsfahrt sind unabhängig voneinander.
                </p>
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
      <footer className="py-10 px-4 text-center border-t border-cream/5" style={{ background: '#050e1c' }}>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden opacity-60 border border-amber/20 bg-white flex items-center justify-center">
            <Image src="/kajuete-logo.png" alt="Kajüte 1876" width={36} height={36} className="object-contain" />
          </div>
        </div>
        <p className="font-cormorant text-lg text-cream/40 mb-1">Kajüte 1876 · Friedrichstadt</p>
        <p className="font-outfit text-xs tracking-widest uppercase text-cream/20">
          Skipper Fynn · Täglich 19:00 Uhr · 11. Mai – 30. September
        </p>
        <p className="font-outfit text-xs text-cream/20 mt-2">
          Holmertorstrasse 11 · 25840 Friedrichstadt · kontakt@kajuete1876.de
        </p>
        <div className="rope-divider w-16 mx-auto mt-6 opacity-20" />
        <div className="mt-7 flex items-center justify-center gap-2">
          <span className="font-outfit text-xs" style={{ color: 'rgba(245,237,216,0.28)' }}>
            Buchungssystem automatisiert von
          </span>
          <a href="https://optriq.de" target="_blank" rel="noopener noreferrer"
            className="font-outfit text-xs font-semibold tracking-wide"
            style={{ color: 'rgba(212,168,67,0.55)', textDecoration: 'none', letterSpacing: '0.06em' }}>
            OPTRIQ
          </a>
        </div>
      </footer>

    </main>
  )
}
