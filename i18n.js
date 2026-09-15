/**
 * Übersetzung für Attribute.
 *
 * script.js schaltet nur sichtbaren Text um (data-de / data-en). aria-label,
 * title und placeholder blieben dadurch auf Deutsch — für Screenreader-Nutzer
 * war die Seite also nie wirklich englisch.
 *
 * Eine Tabelle statt Attribute im Markup: sie deckt auch das ab, was erst zur
 * Laufzeit entsteht (Overlay-Schaltflächen, Kapitelleiste).
 */
(() => {
    'use strict';

    const MAP = {
        'Malte Gündisch Startseite': 'Malte Gündisch home',
        'Terminal öffnen (Befehlstaste K)': 'Open terminal (Command K)',
        'Terminal öffnen': 'Open terminal',
        'Terminal-Befehl eingeben': 'Enter terminal command',
        'Menü öffnen': 'Open menu',
        'Sprachauswahl': 'Language selection',
        'Steckbrief von Malte Gündisch anzeigen': 'Show profile card for Malte Gündisch',
        'Schwerpunkte': 'Focus areas',
        'Ausgewählte Arbeitsfelder': 'Selected work areas',
        'Projekt-Slider-Steuerung': 'Project slider controls',
        'Nächstes Arbeitsfeld': 'Next work area',
        'Vorheriges Arbeitsfeld': 'Previous work area',
        'Filter für Stack': 'Stack filter',
        'Technologie suchen': 'Search technology',
        'Zertifizierungsübersicht': 'Certification overview',
        'Nach oben scrollen': 'Scroll to top',
        'Schließen': 'Close',
        'Kapitel': 'Chapters',
        'z. B. Dr. Alex Weber': 'e.g. Dr Alex Weber',
        'Worum geht es in deinem Vorhaben oder deiner Frage?':
            'What is your project or question about?'
    };

    const REVERSE = Object.fromEntries(Object.entries(MAP).map(([de, en]) => [en, de]));
    const ATTRS = ['aria-label', 'title', 'placeholder'];

    const apply = (lang) => {
        const table = lang === 'en' ? MAP : REVERSE;
        document.querySelectorAll('[aria-label],[title],[placeholder]').forEach((el) => {
            ATTRS.forEach((attr) => {
                const value = el.getAttribute(attr);
                if (value && table[value]) el.setAttribute(attr, table[value]);
            });
        });
    };

    const current = () => (document.documentElement.lang === 'en' ? 'en' : 'de');

    // Beim Start: script.js stellt die gespeicherte Sprache her, bevor dieses
    // Modul läuft — deshalb den Ist-Zustand übernehmen, nicht raten.
    apply(current());

    ['lang-de', 'lang-en'].forEach((id) => {
        document.getElementById(id)?.addEventListener('click', () => {
            setTimeout(() => apply(current()), 60);
        });
    });
})();
