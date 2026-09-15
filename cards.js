/**
 * Karten-Interaktion für Stack, KI, Fokus, Zertifikate und Kontaktkanäle.
 *
 * Eigenständiges Modul: fasst script.js nicht an, sondern beobachtet nur
 * dessen Ergebnis (die .hidden-Klassen des Stack-Filters).
 */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'de');
    const t = (de, en) => (lang() === 'en' ? en : de);

    const CARD_SELECTOR = '.skill-card, .ai-card, .focus-card, .cert-card, .channel-item';
    const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));
    if (!cards.length) return;

    /* ------------------------------------------------ 1. Lichtkegel */

    // Ein Listener für alle Karten statt einer pro Karte. Zwei Custom
    // Properties direkt zu setzen ist billiger als der Umweg über
    // requestAnimationFrame — und läuft auch dort, wo rAF gedrosselt wird.
    document.addEventListener('mousemove', (e) => {
        // e.target ist nicht zwingend ein Element (Textknoten, document)
        const target = e.target instanceof Element ? e.target : null;
        const card = target?.closest(CARD_SELECTOR);
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${Math.round(e.clientX - rect.left)}px`);
        card.style.setProperty('--my', `${Math.round(e.clientY - rect.top)}px`);
    }, { passive: true });

    cards.forEach((card) => {
        card.addEventListener('mouseenter', () => { card.dataset.lit = 'true'; });
        card.addEventListener('mouseleave', () => { card.dataset.lit = 'false'; });
    });

    /* --------------------------------------- 2. Gestaffeltes Einblenden */

    if (!reduceMotion && 'IntersectionObserver' in window) {
        cards.forEach((card) => { card.dataset.reveal = 'out'; });

        const io = new IntersectionObserver((entries) => {
            // Nach Position sortieren, damit die Staffelung der Leserichtung folgt
            const shown = entries.filter((en) => en.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top ||
                                a.boundingClientRect.left - b.boundingClientRect.left);

            shown.forEach((entry, i) => {
                const card = entry.target;
                setTimeout(() => { card.dataset.reveal = 'in'; }, Math.min(i, 8) * 70);
                io.unobserve(card);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        cards.forEach((card) => io.observe(card));
    }

    /* ------------------------------------------ 3. Zähler der Stack-Sektion */

    const grid = document.getElementById('skillsGrid');
    const header = document.querySelector('.section-skills .section-header');
    if (!grid || !header) return;

    const skillCards = Array.from(grid.querySelectorAll('.skill-card'));
    const totalPills = grid.querySelectorAll('.skill-pills span').length;

    const meter = document.createElement('div');
    meter.className = 'stack-meter';
    meter.innerHTML = `
        <span class="stack-meter-item">
            <span class="stack-meter-num" id="meterCategories">0</span>
            <span class="stack-meter-label" data-de="Kategorien" data-en="Categories">Kategorien</span>
        </span>
        <span class="stack-meter-item">
            <span class="stack-meter-num" id="meterTech">0</span>
            <span class="stack-meter-label" data-de="Technologien" data-en="Technologies">Technologien</span>
        </span>
        <span class="stack-meter-status" id="meterStatus" role="status" aria-live="polite"></span>`;
    header.appendChild(meter);

    const numCategories = meter.querySelector('#meterCategories');
    const numTech = meter.querySelector('#meterTech');
    const status = meter.querySelector('#meterStatus');

    function countUp(el, target) {
        if (reduceMotion) { el.textContent = String(target); return; }
        const duration = 900;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min(1, (now - start) / duration);
            // ease-out, damit die Zahl am Ende ausläuft statt hart zu stoppen
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    let counted = false;
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || counted) return;
            counted = true;
            countUp(numCategories, skillCards.length);
            countUp(numTech, totalPills);
            countObserver.disconnect();
        });
    }, { threshold: 0.3 });
    countObserver.observe(meter);

    /* -------------------------------- 4. Auf Filter und Suche reagieren */

    const empty = document.createElement('p');
    empty.className = 'stack-empty';
    empty.hidden = true;
    grid.appendChild(empty);

    const renderEmpty = (query) => {
        empty.innerHTML = '';
        empty.append(t(`Nichts gefunden für „${query}“.`, `Nothing found for “${query}”.`));
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = t('Suche zurücksetzen', 'Reset search');
        btn.addEventListener('click', () => {
            const input = document.getElementById('stackSearch');
            if (!input) return;
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.focus();
        });
        empty.appendChild(btn);
    };

    let lastVisible = null;

    const update = () => {
        const visible = skillCards.filter((c) => !c.classList.contains('hidden'));
        const input = document.getElementById('stackSearch');
        const query = input ? input.value.trim() : '';
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

        // Leerzustand
        if (!visible.length && query) {
            renderEmpty(query);
            empty.hidden = false;
        } else {
            empty.hidden = true;
        }

        // Statuszeile im Zähler
        const filtered = query || activeFilter !== 'all';
        if (filtered) {
            const shownPills = visible.reduce(
                (sum, c) => sum + c.querySelectorAll('.skill-pills span').length, 0);
            status.textContent = t(
                `${shownPills} von ${totalPills} sichtbar`,
                `${shownPills} of ${totalPills} shown`);
            status.dataset.active = 'true';
        } else {
            status.dataset.active = 'false';
        }

        // Neu erschienene Karten kurz einschwingen lassen
        if (!reduceMotion) {
            const key = visible.map((c) => c.dataset.category).join('|');
            if (key !== lastVisible) {
                visible.forEach((card) => {
                    card.dataset.reveal = 'in';
                    card.dataset.settling = 'true';
                    card.addEventListener('animationend', () => {
                        delete card.dataset.settling;
                    }, { once: true });
                });
            }
            lastVisible = key;
        }
    };

    // script.js setzt die .hidden-Klassen — wir reagieren nur darauf.
    const mo = new MutationObserver(update);
    skillCards.forEach((card) => mo.observe(card, { attributes: true, attributeFilter: ['class'] }));

    document.getElementById('lang-de')?.addEventListener('click', () => setTimeout(update, 60));
    document.getElementById('lang-en')?.addEventListener('click', () => setTimeout(update, 60));

    update();
})();
