import type { Metadata } from 'next'
import PrintButton from './PrintButton'
import './menu.css'

export const metadata: Metadata = {
  title: 'Menü zum Vatertag',
  description: 'Eine kleine Menükarte zum Vatertag.',
}

export default function VatertagMenuPage() {
  return (
    <main className="menu-page">
      <PrintButton />

      <article className="menu-card" aria-label="Vatertag Menükarte">
        <header className="menu-head">
          <div className="rule rule-top" aria-hidden />
          <p className="kicker">Donnerstag · 14. Mai 2026</p>
          <h1 className="title">
            <span className="title-line">Menü</span>
            <span className="title-amp">zum</span>
            <span className="title-line">Vatertag</span>
          </h1>
          <p className="dedication">— für Papa, mit Liebe —</p>
          <div className="rule rule-bottom" aria-hidden />
        </header>

        <section className="courses">
          <Course
            roman="I"
            label="Vorspeise"
            name="Lieblinge & Nicht-Lieblinge"
            note="Eine kleine Auswahl an Köstlichkeiten — das eine oder andere darf liegen bleiben."
          />

          <Ornament />

          <Course
            roman="II"
            label="Hauptgang"
            name="Sansibas Lachsnudeln"
            note="Hausgemacht, mit ganz viel Herz aus der Küche."
          />

          <Ornament />

          <Course
            roman="III"
            label="Nachtisch"
            name="Anikes Schokoladenkuchen"
            note="Süßer Abschluss eines schönen Tages."
          />
        </section>

        <footer className="menu-foot">
          <div className="rule rule-bottom" aria-hidden />
          <p className="signature">Guten Appetit, lieber Papa</p>
          <p className="ornament-line" aria-hidden>❦</p>
        </footer>
      </article>
    </main>
  )
}

function Course({
  roman,
  label,
  name,
  note,
}: {
  roman: string
  label: string
  name: string
  note?: string
}) {
  return (
    <div className="course">
      <div className="course-meta">
        <span className="roman" aria-hidden>{roman}</span>
        <span className="course-label">{label}</span>
      </div>
      <h2 className="course-name">{name}</h2>
      {note && <p className="course-note">{note}</p>}
    </div>
  )
}

function Ornament() {
  return (
    <div className="ornament" aria-hidden>
      <span className="dash" />
      <span className="diamond">◆</span>
      <span className="dash" />
    </div>
  )
}
