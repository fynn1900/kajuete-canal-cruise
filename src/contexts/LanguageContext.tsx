'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const translations = {
  de: {
    // Badge
    season: 'Saison 2026',
    // Hero
    heroTitle1: 'Die etwas andere',
    heroTitle2: '1621 Grachtenfahrt',
    heroSub: 'Täglich 19 Uhr · Friedrichstadt · Max. 6 Personen',
    bookSpot: 'Platz sichern',
    learnMore: 'Mehr erfahren',
    // Info section
    onBoard: 'An Bord',
    whatToExpect: 'Was euch',
    whatToExpectEm: 'erwartet',
    card1Title: 'Exklusive Fahrt',
    card1Text: 'Exklusive 1621-Bier & Grachtenfahrt mit max. 6 Personen. Entspannter Abendtörn mit unserem Skipper Fynn.',
    card1Sub: '60 Minuten inkl. Ab- und Anlegen direkt an der Kajütengracht.',
    card2Title: '1621 Bier inklusive',
    card2Text: 'Im Abendlicht inkl. 1× 1621-Bier für Friedrichstadt / Softdrink.',
    card2Sub: 'Grachtenmusik und Geschichten über Friedrichstadt im Abendlicht auf dem Wasser genießen.',
    card3Title: 'Preise',
    card3Adult: 'pro Person',
    card3Kid: 'Kids von 2–7 Jahren',
    card3Note: 'Bezahlung in der Kajüte · Keine Vorauszahlung',
    card3Exclusive: 'Exklusive Fahrt mit Skipper Fynn nur für euch zwei / eure Gruppe / Familie · +6 € pro Person',
    card4Title: 'Gut zu wissen',
    card4Text: 'Offenes Boot — die Fahrt findet nur bei gutem, trockenem Wetter statt (mind. 14 °C).',
    card4Sub: 'Wir fahren ab 2 Personen.',
    // Description
    descLabel: 'Das Grachtenstädtchen in Nordfriesland',
    descQuote: 'Kajüte 1876, 1621 Bier!',
    descQuoteEm: 'Das ist Friedrichstadt!',
    descText: 'Kehrt in die Kajüte 1876 ein und kombiniert Euren Flammkuchen-Abend mit einer 1621-Bier & Grachtenfahrt. Lernt unser 1621 und das kleine Grachtenstädtchen auf ganz besondere Art kennen. Vom Boot aus ist Friedrichstadt am schönsten und das 1621-Bier am leckersten.',
    descText2: 'Kajüten-Skipper Fynn zeigt euch die Holländerstadt von der Wasserseite, erzählt über unser Bier und sein Friedrichstadt. Und das 1621-Bier an Bord ist garantiert schön kalt. Das besondere Kajüten-Event für Paare, Familien und kleine Gruppen. Prost & Willkommen in der Kajüte 1876 und an Bord!',
    // Kajüte section
    startGoal: 'Start & Ziel',
    kajueteTitle: 'Die',
    kajueteEm: 'Kajüte 1876',
    kajueteDesc: 'Gästehaus am Wasser, 1621-Bierbar, Veras Flammkuchenküche und Grachtengarten — direkt da, wo die Bootsfahrt startet und endet.',
    flammkuchenLabel: 'Veras Flammkuchenküche',
    flammkuchenHours: '12–19 Uhr',
    bierLabel: 'Bierautomat',
    bierHours: 'Täglich 11–23 Uhr',
    gardenLabel: 'Grachtengarten',
    gardenDesc: 'Überdachte Plätze an der Gracht. Immer offen.',
    antifa: '✊ Antifaschistischer Wohlfühlort',
    discoverKajuete: 'Kajüte 1876 entdecken →',
    beforeTrip: 'Vor der Fahrt bei uns essen',
    beforeTripDesc: 'Kommt doch um 17:30 oder 18 Uhr zum Flammkuchen-Essen. Hier könnt ihr einen Tisch reservieren.',
    tableBook: 'Tisch reservieren →',
    tableNote: 'Tischreservierung und Bootsfahrt sind unabhängig voneinander.',
    // Booking
    reservation: 'Reservierung',
    secureSpot: 'Platz im Boot',
    secureSpotEm: 'sichern',
    bookingSub: 'Täglich 19 Uhr · Max. 6 Personen · Kajüten-Gracht',
    chooseDate: 'Datum wählen',
    seasonNote: 'Saison 2026',
    loading: 'Wird geladen…',
    spotsLeft: 'frei',
    of: 'von',
    noTrip: 'Keine Fahrt',
    soldOut: 'Ausgebucht',
    loadError: 'Konnte nicht geladen werden — bitte Seite neu laden.',
    successTitle: 'Reservierung erhalten!',
    successSub: 'Bis zum',
    successNote: 'Zahlung vor Ort (Bar & Karte) · 19 € p.P. · Kids 2–7 Jahre 5 €',
    blockedTitle: 'Kein Törn an diesem Tag.',
    blockedDesc: 'Skipper Fynn legt hier eine Pause ein. Schau gerne auf ein anderes Datum.',
    soldoutTitle: 'Ausgebucht.',
    soldoutDesc: 'Alle 6 Plätze sind weg — aber vielleicht gibt es noch einen anderen Abend.',
    persons: 'Personen',
    adults: 'Personen ab 8 Jahren',
    kids: 'Kids (2–7 Jahre)',
    cashNote: 'Zahlung vor Ort (Bar & Karte)',
    minPersons: 'Mindestens 2 Personen nötig für eine Fahrt.',
    namePlaceholder: 'Dein Name',
    emailPlaceholder: 'deine@mail.de',
    nameLabel: 'Name *',
    emailLabel: 'E-Mail',
    emailHint: '(für Bestätigungsmail)',
    submitBtn: 'Jetzt reservieren',
    submitting: 'Wird gesendet…',
    footerNote: 'Offenes Boot · Nur bei gutem Wetter (mind. 14°C)',
    blockedAvail: 'Skipper Fynn macht an diesem Tag eine Pause — bitte wähle ein anderes Datum.',
    soldoutAvail: 'Alle 6 Plätze sind für diesen Tag vergeben — bitte wähle ein anderes Datum.',
    nameError: 'Bitte Namen eingeben.',
    minError: 'Mindestens 2 Personen für eine Fahrt nötig.',
    // Exclusive
    exclusiveLabel: 'Exklusive Fahrt — Skipper Fynn nur für euch',
    exclusiveDesc: '+6 € pro Person · Ihr habt Boot & Skipper ganz für euch',
    // Safety & Liability
    safetyTitle: 'Sicherheitshinweise',
    safetyHints: 'Schwimmwesten sind an Bord vorhanden und auf Wunsch verfügbar.\n\nBitte während der Fahrt sitzen bleiben — das Boot ist schmal und offen.\n\nKinder müssen jederzeit beaufsichtigt werden.\n\nBei starkem Wind, Regen oder unter 14 °C findet keine Fahrt statt. Ihr werdet so früh wie möglich informiert.\n\nDer Skipper entscheidet vor Ort über die Sicherheit der Fahrt.',
    liabilityTitle: 'Sicherheitshinweise & den Haftungsausschluss',
    liabilityText: 'für die 1621-Bier & Grachtenfahrt der Kajüte 1876\n\nMit meiner Online-Reservierung einer 1621-Bier & Grachtenfahrt bestätige ich, dass ich an der 1621-Bier & Grachtenfahrt teilnehme und die folgenden Bedingungen akzeptiere:\n\n1. Teilnahme auf eigene Verantwortung\nIch nehme auf eigene Gefahr teil. Der Betreiber (Kajüte 1876) und der Skipper haften nicht für Unfälle, Verletzungen oder Schäden, die durch mein eigenes Verhalten oder höhere Gewalt entstehen.\n\n2. Sicherheitsregeln\n• Ich trage während der Fahrt die bereitgestellte Schwimmweste.\n• Ich befolge die Anweisungen des Skippers.\n\n3. Haftungsbeschränkung\nDie Kajüte 1876 und der Skipper haften nicht für Schäden an Ihrem Eigentum (z. B. Handys, Kameras), Verletzungen durch Nichtbeachten der Sicherheitshinweise sowie wetterbedingte Absagen.\n\n4. Datenschutz\nMeine Daten werden nur für die Reservierung / Buchung verwendet und nicht an Dritte weitergegeben.',
    liabilityCheck: 'Ich habe die Sicherheitshinweise & den Haftungsausschluss gelesen und stimme zu.',
    liabilityLink: 'Sicherheitshinweise & den Haftungsausschluss',
    liabilityRequired: 'Bitte Sicherheitshinweise & Haftungsausschluss akzeptieren.',
    // Footer
    footerSlogan: 'Kajüte 1876 · Friedrichstadt',
    footerSub: '1621 Bier & Grachtenfahrt · Täglich 19 Uhr',
    footerAddress: 'Holmertorstrasse 11 · 25840 Friedrichstadt · kontakt@kajuete1876.de',
    automatedBy: 'Buchungssystem automatisiert von',
  },
  en: {
    season: 'Season 2026',
    heroTitle1: 'The Canal Cruise',
    heroTitle2: '1621 Canal Cruise',
    heroSub: 'Daily 7 PM · Friedrichstadt · Max. 6 People',
    bookSpot: 'Book a Spot',
    learnMore: 'Learn More',
    onBoard: 'On Board',
    whatToExpect: 'What',
    whatToExpectEm: 'to Expect',
    card1Title: 'Exclusive Tour',
    card1Text: 'Exclusive 1621-Beer & Canal Cruise with max. 6 people. A relaxed evening on the water with our Skipper Fynn.',
    card1Sub: '60 minutes incl. casting off and docking right at the Kajüten-Gracht.',
    card2Title: '1621 Beer included',
    card2Text: 'In the evening light incl. 1× 1621 Beer for Friedrichstadt / soft drink.',
    card2Sub: 'Canal music and stories about Friedrichstadt — enjoyed in the evening light on the water.',
    card3Title: 'Prices',
    card3Adult: 'per person',
    card3Kid: 'Kids aged 2–7',
    card3Note: 'Payment at the Kajüte · No prepayment',
    card3Exclusive: 'Exclusive trip with Skipper Fynn just for the two of you / your group / family · +€6 per person',
    card4Title: 'Good to Know',
    card4Text: 'Open boat — trips only run in good, dry weather (min. 14°C / 57°F).',
    card4Sub: 'We depart from 2 people.',
    descLabel: 'The Little Dutch Town in North Frisia',
    descQuote: 'Kajüte 1876, 1621 Beer!',
    descQuoteEm: "That's Friedrichstadt!",
    descText: 'Come to Kajüte 1876 and combine your tarte flambée evening with a 1621-Beer & Canal Cruise. Get to know our 1621 and the little canal town in a very special way. Friedrichstadt is most beautiful from the water — and the 1621 beer tastes best on board.',
    descText2: 'Canal Skipper Fynn shows you the Dutch town from the water, shares stories about our beer and his Friedrichstadt. The 1621 beer on board is guaranteed ice cold. The special Kajüte event for couples, families and small groups. Cheers & Welcome to Kajüte 1876 and on board!',
    startGoal: 'Start & Finish',
    kajueteTitle: 'The',
    kajueteEm: 'Kajüte 1876',
    kajueteDesc: 'Waterside guesthouse, 1621 beer bar, Vera\'s tarte flambée kitchen and canal garden — right where the boat tour starts and ends.',
    flammkuchenLabel: 'Vera\'s Tarte Flambée',
    flammkuchenHours: 'noon–7 PM',
    bierLabel: 'Beer Vending Machine',
    bierHours: 'Daily 11 AM–11 PM',
    gardenLabel: 'Canal Garden',
    gardenDesc: 'Sheltered seating by the canal. Always open.',
    antifa: '✊ Antifascist Feel-Good Place',
    discoverKajuete: 'Discover Kajüte 1876 →',
    beforeTrip: 'Eat with us before the trip',
    beforeTripDesc: 'Come for tarte flambée at 5:30 or 6 PM. Here you can reserve a table.',
    tableBook: 'Reserve a Table →',
    tableNote: 'Table reservation and boat trip are independent.',
    reservation: 'Reservation',
    secureSpot: 'Secure your',
    secureSpotEm: 'Spot',
    bookingSub: 'Daily 7 PM · Max. 6 People · Kajüten-Gracht',
    chooseDate: 'Choose a Date',
    seasonNote: 'Season 2026',
    loading: 'Loading…',
    spotsLeft: 'available',
    of: 'of',
    noTrip: 'No Trip',
    soldOut: 'Sold Out',
    loadError: 'Could not load — please reload the page.',
    successTitle: 'Reservation received!',
    successSub: 'See you on',
    successNote: 'Payment on site (cash & card) · €19 p.p. · Kids 2–7 years €5',
    blockedTitle: 'No trip on this day.',
    blockedDesc: 'Skipper Fynn is taking a break. Please check another date.',
    soldoutTitle: 'Sold out.',
    soldoutDesc: 'All 6 spots are gone — but maybe another evening works.',
    persons: 'People',
    adults: 'People aged 8+',
    kids: 'Kids (2–7 years)',
    cashNote: 'Payment on site (cash & card)',
    minPersons: 'At least 2 people required for a trip.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    nameLabel: 'Name *',
    emailLabel: 'Email',
    emailHint: '(for confirmation)',
    submitBtn: 'Book Now',
    submitting: 'Sending…',
    footerNote: 'Open boat · Good weather only (min. 14°C)',
    blockedAvail: 'Skipper Fynn is taking a break today — please choose another date.',
    soldoutAvail: 'All 6 spots for this day are taken — please choose another date.',
    nameError: 'Please enter your name.',
    minError: 'At least 2 people required for a trip.',
    exclusiveLabel: 'Exclusive trip — Skipper Fynn just for you',
    exclusiveDesc: '+€6 per person · Boat & skipper all to yourselves',
    safetyTitle: 'Safety Information',
    safetyHints: 'Life jackets are available on board on request.\n\nPlease remain seated while the boat is moving — it is a narrow, open vessel.\n\nChildren must be supervised at all times.\n\nTrips are cancelled in strong wind, rain, or below 14°C / 57°F. You will be notified as early as possible.\n\nThe skipper has final say on trip safety.',
    liabilityTitle: 'Safety Information & the Disclaimer',
    liabilityText: 'for the 1621-Beer & Canal Cruise by Kajüte 1876\n\nBy making an online reservation for a 1621-Beer & Canal Cruise, I confirm that I will participate and accept the following conditions:\n\n1. Participation at Own Risk\nI participate at my own risk. The operator (Kajüte 1876) and the skipper are not liable for accidents, injuries or damage caused by my own behaviour or force majeure.\n\n2. Safety Rules\n• I will wear the life jacket provided during the trip.\n• I will follow the skipper\'s instructions.\n\n3. Limitation of Liability\nKajüte 1876 and the skipper are not liable for damage to your belongings (e.g. phones, cameras), injuries caused by ignoring safety instructions, or weather-related cancellations.\n\n4. Data Protection\nMy data will only be used for the reservation / booking and will not be passed on to third parties.',
    liabilityCheck: 'I have read the Safety Information & the Disclaimer and agree.',
    liabilityLink: 'Safety Information & the Disclaimer',
    liabilityRequired: 'Please accept the Safety Information & Disclaimer.',
    footerSlogan: 'Kajüte 1876 · Friedrichstadt',
    footerSub: '1621 Beer & Canal Cruise · Daily 7 PM',
    footerAddress: 'Holmertorstrasse 11 · 25840 Friedrichstadt · kontakt@kajuete1876.de',
    automatedBy: 'Booking system automated by',
  },
} as const

type Lang = 'de' | 'en'
type T = { [K in keyof typeof translations.de]: string }

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
