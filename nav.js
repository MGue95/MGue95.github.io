/**
 * Kopfzeile: Farbwechsel je Sektion und gleitender Aktiv-Indikator.
 *
 * Eigenständiges Modul. Den aktiven Link setzt weiterhin script.js über
 * die Klasse .active — hier wird nur darauf reagiert.
 */
(() => {
    'use strict';

    const header = document.getElementById('navbar');
    const menu = document.getElementById('navMenu');
    if (!header || !menu) return;

    const sections = Array.from(document.querySelectorAll('section[id]'));

    /* ------------------------------------ 1. Hell oder dunkel darunter */

    const isDark = (sec) => {
        const m = getComputedStyle(sec).backgroundColor.match(/\d+/g);
        if (!m) return false;
        return (+m[0] * 0.299 + +m[1] * 0.587 + +m[2] * 0.114) < 100;
    };

    // Einmal vorab bestimmen: die Hintergründe ändern sich zur Laufzeit nicht.
    const tone = new Map(sections.map((sec) => [sec, isDark(sec)]));

    const updateTone = () => {
        const edge = header.getBoundingClientRect().height + 4;
        let under = sections[0];
        sections.forEach((sec) => {
            const b = sec.getBoundingClientRect();
            if (b.top <= edge && b.bottom > edge) under = sec;
        });
        header.dataset.over = tone.get(under) ? 'dark' : 'light';
    };

    /* --------------------------------- 2. Pille hinter dem aktiven Link */

    const marker = document.createElement('span');
    marker.className = 'nav-marker';
    marker.setAttribute('aria-hidden', 'true');
    menu.appendChild(marker);

    const moveMarker = () => {
        const active = menu.querySelector('.nav-link.active');
        if (!active || getComputedStyle(menu).display === 'none') {
            marker.dataset.ready = 'false';
            return;
        }
        const m = menu.getBoundingClientRect();
        const a = active.getBoundingClientRect();
        if (!a.width) { marker.dataset.ready = 'false'; return; }
        marker.style.width = `${a.width}px`;
        marker.style.transform = `translate(${a.left - m.left}px, -50%)`;
        marker.dataset.ready = 'true';
    };

    // script.js schaltet .active beim Scrollen um — darauf reagieren, statt
    // die Zuordnung ein zweites Mal zu berechnen.
    const observer = new MutationObserver(moveMarker);
    menu.querySelectorAll('.nav-link').forEach((link) => {
        observer.observe(link, { attributes: true, attributeFilter: ['class'] });
        link.addEventListener('mouseenter', () => {
            const m = menu.getBoundingClientRect();
            const a = link.getBoundingClientRect();
            marker.style.width = `${a.width}px`;
            marker.style.transform = `translate(${a.left - m.left}px, -50%)`;
            marker.dataset.ready = 'true';
        });
    });

    menu.addEventListener('mouseleave', moveMarker);

    /* ------------------------------------------------------------ Start */

    // Der Hero rückt um die Kopfzeilenhöhe nach oben — die Höhe ändert sich
    // mit dem gescrollten Zustand, deshalb messen statt raten.
    const strip = document.querySelector('.brand-strip');

    const publishHeight = () => {
        const root = document.documentElement.style;
        root.setProperty('--header-h', `${Math.round(header.getBoundingClientRect().height)}px`);
        // Die Techleiste bricht je nach Breite um — ihre Höhe muss gemessen
        // werden, damit sie zusammen mit dem Hero genau den Schirm füllt.
        if (strip) root.setProperty('--strip-h', `${Math.round(strip.getBoundingClientRect().height)}px`);
    };

    const update = () => { publishHeight(); updateTone(); moveMarker(); };

    window.addEventListener('scroll', updateTone, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    ['lang-de', 'lang-en'].forEach((id) => {
        document.getElementById(id)?.addEventListener('click', () => setTimeout(moveMarker, 80));
    });

    // Schriften verschieben die Linkbreiten — danach neu messen.
    if (document.fonts?.ready) document.fonts.ready.then(moveMarker);

    if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(publishHeight);
        ro.observe(header);
        if (strip) ro.observe(strip);
    }

    update();
    window.addEventListener('load', update);
})();
