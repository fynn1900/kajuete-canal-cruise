'use client'

export default function PrintButton() {
  return (
    <button
      type="button"
      className="print-button"
      onClick={() => window.print()}
      aria-label="Menükarte drucken"
    >
      Menükarte drucken
    </button>
  )
}
