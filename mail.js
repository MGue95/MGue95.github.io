/**
 * Adresse zusammensetzen statt sie auszuschreiben.
 *
 * Nirgends im ausgelieferten HTML, CSS oder in den übrigen Skripten steht die
 * Adresse als zusammenhängende Zeichenkette — sie entsteht erst hier im
 * Browser. Das hält die üblichen Harvester ab, die schlicht nach dem Muster
 * dem üblichen Adressmuster greifen. Ein Bot, der JavaScript ausführt, kommt
 * trotzdem dran; einen vollständigen Schutz gibt es nicht.
 *
 * Muss vor script.js, terminal.js und contact.js geladen werden.
 */
(() => {
    'use strict';

    const USER = ['malte', 'guendisch'].join('');
    const HOST = ['gmail', 'com'].join('.');

    const address = () => `${USER}@${HOST}`;

    const mailto = (params) => {
        const query = params
            ? '?' + Object.entries(params)
                .filter(([, v]) => v)
                .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
                .join('&')
            : '';
        return `mailto:${address()}${query}`;
    };

    window.MG_MAIL = { address, mailto };

    // Platzhalter im Markup füllen: data-mail="text" schreibt die Adresse,
    // data-mail="link" setzt zusätzlich das href.
    const fill = () => {
        document.querySelectorAll('[data-mail]').forEach((el) => {
            const mode = el.getAttribute('data-mail');
            if (mode === 'text' || mode === 'link') el.textContent = address();
            if (mode === 'link' || mode === 'href') el.setAttribute('href', mailto());
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fill);
    } else {
        fill();
    }
})();
