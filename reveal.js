/**
 * Auftritt der Seite und Kapitelleiste.
 *
 * Eigenständiges Modul: markiert Elemente selbst per data-rv, damit das
 * Markup unangetastet bleibt und die Sprachumschaltung in script.js
 * weiterhin ungestört Textinhalte austauschen kann.
 */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------ 1. Auftritt im Hero */

    // Reihenfolge = Lesereihenfolge. Das Porträt kommt zuletzt.
    const HERO_SEQUENCE = [
        '.hero-meta',
        '.hero-skill-rail',
        '.hero-headline',
        '.hero-subline',
        '.hero-facts, .hero-fact-grid',
        '.hero-links',
        '.hero-visual'
    ];

    const heroParts = HERO_SEQUENCE
        .map((sel) => document.querySelector(sel))
        .filter(Boolean);

    if (!reduceMotion) heroParts.forEach((el) => { el.dataset.rv = 'out'; });

    const playHero = () => {
        heroParts.forEach((el, i) => {
            setTimeout(() => { el.dataset.rv = 'in'; }, 120 + i * 110);
        });
    };

    if (reduceMotion) {
        // nichts zu tun — data-rv wurde gar nicht erst gesetzt
    } else if (document.readyState === 'complete') {
        requestAnimationFrame(playHero);
    } else {
        window.addEventListener('load', () => requestAnimationFrame(playHero));
    }

    /* ------------------------------ 2. Überschriften beim Hineinscrollen */

    if (!reduceMotion && 'IntersectionObserver' in window) {
        const headings = document.querySelectorAll(
            '.section-title, .terminal-head h2, .channel-title'
        );
        headings.forEach((el) => { el.dataset.rv = 'out'; });

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.dataset.rv = 'in';
                io.unobserve(entry.target);
            });
        }, { threshold: 0.35, rootMargin: '0px 0px -5% 0px' });

        headings.forEach((el) => io.observe(el));
    }

    /* ------------------------------------------------ 3. Kapitelleiste */

    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (sections.length < 3) return;

    const labelFor = (sec) => {
        const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (link) return link.textContent.trim();
        const h = sec.querySelector('h1, h2');
        return h ? h.textContent.trim() : sec.id;
    };

    const list = document.createElement('ul');
    list.className = 'chapters';
    list.setAttribute('aria-label', 'Kapitel');

    const items = sections.map((sec) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = labelFor(sec);
        btn.addEventListener('click', () => {
            sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        });
        li.appendChild(btn);
        list.appendChild(li);
        return { sec, li, btn };
    });

    document.body.appendChild(list);

    // Beschriftung bei Sprachwechsel nachziehen
    ['lang-de', 'lang-en'].forEach((id) => {
        document.getElementById(id)?.addEventListener('click', () => {
            setTimeout(() => items.forEach((it) => { it.btn.textContent = labelFor(it.sec); }), 80);
        });
    });

    const isDark = (sec) => {
        const m = getComputedStyle(sec).backgroundColor.match(/\d+/g);
        if (!m) return false;
        return (+m[0] * 0.299 + +m[1] * 0.587 + +m[2] * 0.114) < 100;
    };

    // Gleiches Muster wie der Scroll-Spy der Navigation in script.js: ein
    // schlichter Scroll-Handler. Ein IntersectionObserver mit rootMargin-Band
    // wäre eleganter, aktualisierte hier aber nicht zuverlässig.
    const setActive = (target) => {
        items.forEach((it) => { it.li.dataset.active = String(it.sec === target); });
        list.dataset.onDark = String(isDark(target));
    };

    const update = () => {
        let active = sections[0];
        sections.forEach((sec) => {
            if (sec.getBoundingClientRect().top <= window.innerHeight * 0.45) active = sec;
        });
        setActive(active);
        // Leiste erst zeigen, wenn der Hero weitgehend verlassen ist
        list.dataset.visible = String(window.scrollY > window.innerHeight * 0.6);
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
})();
