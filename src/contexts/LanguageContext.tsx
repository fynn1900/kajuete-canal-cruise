'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const translations = {
  de: {
    // Badge
    season: '11. Mai – 30. September 2026',
    // Hero
    heroTitle1: 'Die etwas andere',
    heroTitle2: 'Grachten Rundfahrt',
    heroSub: 'Täglich 19:00 Uhr · Friedrichstadt · Max. 6 Personen',
    bookSpot: 'Platz sichern',
    learnMore: 'Mehr erfahren',
    // Info section
    onBoard: 'An Bord',
    whatToExpect: 'Was euch',
    whatToExpectEm: 'erwartet',
    card1Title: 'Exklusive Fahrt',
    card1Text: 'Mit Skipper Fynn durch die Friedrichstädter Grachten — maximal 6 Personen pro Tour. Klein, entspannt, kein Touristenboot.',
    card1Sub: '60 Minuten inklusive Ab- und Anlegen.',
    card2Title: 'Inklusive',
    card2Text: '1× 1621 Bier — das Friedrichstädter Bier — oder Softdrink für jeden an Bord.',
    card2Sub: 'Weitere Drinks & Grachten Musik an Bord, plus Infos zur Geschichte des Grachtenstädtchens vom Skipper persönlich.',
    card3Title: 'Preise',
    card3Adult: 'pro Person',
    card3Kid: 'Kids von 2–7 Jahren',
    card3Note: 'Barzahlung an Bord · Keine Vorauszahlung',
    card4Title: 'Gut zu wissen',
    card4Text: 'Offenes Boot — die Fahrt findet nur bei gutem, trockenem Wetter statt (mind. 14 °C).',
    card4Sub: 'Mindestens 2 Personen müssen gebucht haben, damit wir losfahren.',
    // Description
    descLabel: 'Friedrichstadt · Das Grachtenstädtchen',
    descQuote: '„Friedrichstadt vom Wasser aus —',
    descQuoteEm: 'im Abendlicht einfach schön."',
    descText: 'Das kleine Grachtenstädtchen hat was — und vom Boot aus sieht man es nochmal anders. Skipper Fynn kennt die Ecken, erzählt was dazu, und das Bier ist auch kalt. Passt für Paare, Familien und kleine Gruppen gleichermaßen gut.',
    // Kajüte section
    startGoal: 'Start & Ziel',
    kajueteTitle: 'Die',
    kajueteEm: 'Kajüte 1876',
    kajueteDesc: 'Gästehaus am Wasser, 1621-Bierbar, Veras Flammkuchenküche und Grachtengarten — direkt da, wo die Bootsfahrt startet und endet. Ein antifaschistischer Familienbetrieb, der genauso tickt wie das Boot.',
    flammkuchenLabel: 'Veras Flammkuchen',
    flammkuchenHours: 'Täglich 12–19 Uhr',
    bierLabel: 'Bierautomat',
    bierHours: 'Täglich 11–23 Uhr',
    gardenLabel: 'Grachtengarten',
    gardenDesc: 'Wettergeschützte Außenplätze am Wasser',
    antifa: '✊ Antifaschistischer Wohlfühlort',
    discoverKajuete: 'Kajüte 1876 entdecken →',
    beforeTrip: 'Vor der Fahrt noch essen',
    beforeTripDesc: 'Viele kommen um 18 Uhr zum Flammkuchen in die Kajüte oder in den Garten — und steigen dann direkt auf\'s Boot. Wenn ihr das plant, könnt ihr gerne vorab einen Tisch reservieren.',
    tableBook: 'Tisch reservieren →',
    tableNote: 'Tischreservierung und Bootsfahrt sind unabhängig voneinander.',
    // Booking
    reservation: 'Reservierung',
    secureSpot: 'Platz',
    secureSpotEm: 'sichern',
    bookingSub: 'Täglich 19:00 Uhr · Max. 6 Personen · Kajüten-Gracht',
    chooseDate: 'Datum wählen',
    seasonNote: 'Saison: 11. Mai – 30. September',
    loading: 'Wird geladen…',
    spotsLeft: 'frei',
    of: 'von',
    noTrip: 'Keine Fahrt',
    soldOut: 'Ausgebucht',
    loadError: 'Konnte nicht geladen werden — bitte Seite neu laden.',
    successTitle: 'Reservierung erhalten!',
    successSub: 'Bis zum',
    successNote: 'Barzahlung vor Ort · 19€ p.P. · Kids 2–7 Jahre 5€',
    blockedTitle: 'Kein Törn an diesem Tag.',
    blockedDesc: 'Skipper Fynn legt hier eine Pause ein. Schau gerne auf ein anderes Datum.',
    soldoutTitle: 'Ausgebucht.',
    soldoutDesc: 'Alle 6 Plätze sind weg — aber vielleicht gibt es noch einen anderen Abend.',
    persons: 'Personen',
    adults: 'Erwachsene & ab 8 Jahren',
    kids: 'Kleine Kids (2–7 Jahre)',
    cashNote: 'Barzahlung vor Ort',
    minPersons: 'Mindestens 2 Personen nötig für eine Fahrt.',
    namePlaceholder: 'Dein Name',
    emailPlaceholder: 'deine@mail.de',
    nameLabel: 'Name *',
    emailLabel: 'E-Mail',
    emailHint: '(für Bestätigungsmail)',
    submitBtn: 'Jetzt reservieren',
    submitting: 'Wird gesendet…',
    footerNote: 'Offenes Boot · Nur bei gutem Wetter (mind. 14°C) · Min. 2 Personen für Abfahrt',
    blockedAvail: 'Skipper Fynn macht an diesem Tag eine Pause — bitte wähle ein anderes Datum.',
    soldoutAvail: 'Alle 6 Plätze sind für diesen Tag vergeben — bitte wähle ein anderes Datum.',
    nameError: 'Bitte Namen eingeben.',
    minError: 'Mindestens 2 Personen für eine Fahrt nötig.',
    // Footer
    footerSlogan: 'Kajüte 1876 · Friedrichstadt',
    footerSub: 'Skipper Fynn · Täglich 19:00 Uhr · 11. Mai – 30. September',
    footerAddress: 'Holmertorstrasse 11 · 25840 Friedrichstadt · kontakt@kajuete1876.de',
    automatedBy: 'Buchungssystem automatisiert von',
  },
  en: {
    season: 'May 11 – September 30, 2026',
    heroTitle1: 'The Canal Cruise',
    heroTitle2: 'with a Difference',
    heroSub: 'Daily 7 PM · Friedrichstadt · Max. 6 People',
    bookSpot: 'Book a Spot',
    learnMore: 'Learn More',
    onBoard: 'On Board',
    whatToExpect: 'What',
    whatToExpectEm: 'to Expect',
    card1Title: 'Exclusive Tour',
    card1Text: 'With Skipper Fynn through the canals of Friedrichstadt — max. 6 people per tour. Intimate, relaxed, no tourist boat.',
    card1Sub: '60 minutes including casting off and docking.',
    card2Title: 'Included',
    card2Text: '1× 1621 Beer — the local Friedrichstadt beer — or a soft drink for everyone on board.',
    card2Sub: 'More drinks & canal music on board, plus stories about the little Dutch town from the skipper himself.',
    card3Title: 'Prices',
    card3Adult: 'per person',
    card3Kid: 'Kids aged 2–7',
    card3Note: 'Cash on board · No prepayment',
    card4Title: 'Good to Know',
    card4Text: 'Open boat — trips only run in good, dry weather (min. 14°C / 57°F).',
    card4Sub: 'At least 2 people must have booked for the trip to depart.',
    descLabel: 'Friedrichstadt · The Little Dutch Town',
    descQuote: '"Friedrichstadt from the water —',
    descQuoteEm: 'simply beautiful in the evening light."',
    descText: 'This little canal town has something special — and from the water it looks even better. Skipper Fynn knows every corner, shares stories along the way, and the beer is cold. Perfect for couples, families, and small groups alike.',
    startGoal: 'Start & Finish',
    kajueteTitle: 'The',
    kajueteEm: 'Kajüte 1876',
    kajueteDesc: 'Waterside guesthouse, 1621 beer bar, Vera\'s tarte flambée kitchen and canal garden — right where the boat tour starts and ends. An antifascist family business with the same vibe as the boat.',
    flammkuchenLabel: 'Vera\'s Tarte Flambée',
    flammkuchenHours: 'Daily 12–7 PM',
    bierLabel: 'Beer Vending Machine',
    bierHours: 'Daily 11 AM–11 PM',
    gardenLabel: 'Canal Garden',
    gardenDesc: 'Sheltered outdoor seating on the water',
    antifa: '✊ Antifascist Feel-Good Place',
    discoverKajuete: 'Discover Kajüte 1876 →',
    beforeTrip: 'Dinner before the trip',
    beforeTripDesc: 'Many guests come at 6 PM for tarte flambée at the Kajüte or garden — then hop straight on the boat. Feel free to book a table in advance.',
    tableBook: 'Reserve a Table →',
    tableNote: 'Table reservation and boat trip are independent.',
    reservation: 'Reservation',
    secureSpot: 'Book your',
    secureSpotEm: 'Spot',
    bookingSub: 'Daily 7 PM · Max. 6 People · Kajüten-Gracht',
    chooseDate: 'Choose a Date',
    seasonNote: 'Season: May 11 – September 30',
    loading: 'Loading…',
    spotsLeft: 'available',
    of: 'of',
    noTrip: 'No Trip',
    soldOut: 'Sold Out',
    loadError: 'Could not load — please reload the page.',
    successTitle: 'Reservation received!',
    successSub: 'See you on',
    successNote: 'Cash on site · €19 p.p. · Kids 2–7 years €5',
    blockedTitle: 'No trip on this day.',
    blockedDesc: 'Skipper Fynn is taking a break. Please check another date.',
    soldoutTitle: 'Sold out.',
    soldoutDesc: 'All 6 spots are gone — but maybe another evening works.',
    persons: 'People',
    adults: 'Adults & 8 years+',
    kids: 'Little Kids (2–7 years)',
    cashNote: 'Cash on site',
    minPersons: 'At least 2 people required for a trip.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    nameLabel: 'Name *',
    emailLabel: 'Email',
    emailHint: '(for confirmation)',
    submitBtn: 'Book Now',
    submitting: 'Sending…',
    footerNote: 'Open boat · Good weather only (min. 14°C) · Min. 2 people to depart',
    blockedAvail: 'Skipper Fynn is taking a break today — please choose another date.',
    soldoutAvail: 'All 6 spots for this day are taken — please choose another date.',
    nameError: 'Please enter your name.',
    minError: 'At least 2 people required for a trip.',
    footerSlogan: 'Kajüte 1876 · Friedrichstadt',
    footerSub: 'Skipper Fynn · Daily 7 PM · May 11 – September 30',
    footerAddress: 'Holmertorstrasse 11 · 25840 Friedrichstadt · kontakt@kajuete1876.de',
    automatedBy: 'Booking system automated by',
  },
} as const

type Lang = 'de' | 'en'
type T = typeof translations.de

const LanguageContext = createContext<{ lang: Lang; t: T; toggle: () => void }>({
  lang: 'de',
  t: translations.de,
  toggle: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('de')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved === 'de' || saved === 'en') setLang(saved)
  }, [])

  function toggle() {
    const next: Lang = lang === 'de' ? 'en' : 'de'
    setLang(next)
    localStorage.setItem('lang', next)
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
