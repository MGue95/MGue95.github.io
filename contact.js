/**
 * Kontakt & Dialog — Direktkontakt, Feldvalidierung und mailto-Auffangnetz.
 *
 * Eigenständiges Modul. script.js baut beim Absenden weiterhin den
 * mailto-Link; dieses Skript setzt nur darauf auf: Es läuft nach dem
 * bestehenden Handler, weil es später eingebunden wird.
 */
(() => {
    'use strict';

    const MAIL = window.MG_MAIL.address();
    const form = document.getElementById('contactForm');
    if (!form) return;

    const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'de');
    const t = (de, en) => (lang() === 'en' ? en : de);

    /* ------------------------------------------------------- Kopieren */

    async function copy(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Clipboard-API braucht einen sicheren Kontext; über file:// und in
            // älteren Browsern gibt es sie nicht.
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly', '');
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                const ok = document.execCommand('copy');
                ta.remove();
                return ok;
            } catch {
                return false;
            }
        }
    }

    function feedback(btn, ok) {
        const label = btn.querySelector('span');
        if (!label) return;
        const original = label.textContent;
        label.textContent = ok
            ? t('Kopiert ✓', 'Copied ✓')
            : t('Klappt nicht — bitte manuell', 'Failed — copy manually');
        btn.dataset.done = ok ? 'true' : 'false';
        setTimeout(() => {
            label.textContent = original;
            delete btn.dataset.done;
        }, 2200);
    }

    document.querySelectorAll('#copyMailBtn, #copyMailBtn2').forEach((btn) => {
        btn.addEventListener('click', async () => feedback(btn, await copy(MAIL)));
    });

    /* ------------------------------------------ Zeichenzähler im Textfeld */

    const message = document.getElementById('formMessage');
    const count = document.getElementById('formCount');
    const max = message ? Number(message.getAttribute('maxlength')) || 1200 : 1200;

    if (message && count) {
        const render = () => {
            const n = message.value.length;
            count.textContent = `${n} / ${max}`;
            count.dataset.warn = String(n > max * 0.9);
        };
        message.addEventListener('input', render);
        render();
    }

    /* ------------------------------------------------ Validierung je Feld */

    const fields = [
        { el: document.getElementById('formName'), msg: () => t('Bitte trag deinen Namen ein.', 'Please enter your name.') },
        {
            el: document.getElementById('formEmail'),
            msg: (v) => (!v
                ? t('Bitte trag deine E-Mail-Adresse ein.', 'Please enter your email address.')
                : t('Diese Adresse sieht nicht vollständig aus.', 'That address looks incomplete.')),
            valid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
        },
        { el: message, msg: () => t('Schreib mir ein paar Worte zu deinem Anliegen.', 'Write a few words about your request.') }
    ].filter((f) => f.el);

    function setError(field, text) {
        const { el } = field;
        let box = el.parentElement.querySelector('.form-error');
        if (text) {
            if (!box) {
                box = document.createElement('p');
                box.className = 'form-error';
                box.id = `${el.id}-error`;
                el.parentElement.appendChild(box);
            }
            box.textContent = text;
            el.setAttribute('aria-invalid', 'true');
            el.setAttribute('aria-describedby', box.id);
        } else if (box) {
            box.remove();
            el.removeAttribute('aria-invalid');
            el.removeAttribute('aria-describedby');
        }
    }

    function check(field, quiet) {
        const value = field.el.value.trim();
        const ok = value && (!field.valid || field.valid(value));
        if (!quiet) setError(field, ok ? '' : field.msg(value));
        return Boolean(ok);
    }

    fields.forEach((field) => {
        // Erst beim Verlassen meckern, beim Tippen nur wieder aufräumen.
        field.el.addEventListener('blur', () => check(field, false));
        field.el.addEventListener('input', () => {
            if (field.el.getAttribute('aria-invalid') === 'true' && check(field, true)) {
                setError(field, '');
            }
        });
    });

    /* ----------------------------------------- Auffangnetz nach dem Senden */

    const fallback = document.getElementById('formFallback');
    const draftBtn = document.getElementById('copyDraftBtn');

    function draftText() {
        const name = document.getElementById('formName')?.value.trim() || '';
        const email = document.getElementById('formEmail')?.value.trim() || '';
        const topic = document.getElementById('formTopic')?.value || '';
        const body = message?.value.trim() || '';
        return [
            `An: ${MAIL}`,
            `${t('Betreff', 'Subject')}: ${topic ? `${topic} – ${t('Anfrage von', 'Request from')} ${name}` : `${t('Anfrage von', 'Request from')} ${name}`}`,
            '',
            `Name: ${name}`,
            `E-Mail: ${email}`,
            `${t('Thema', 'Topic')}: ${topic}`,
            '',
            body
        ].join('\n');
    }

    draftBtn?.addEventListener('click', async () => feedback(draftBtn, await copy(draftText())));

    // Läuft nach dem Handler in script.js: der hat den mailto-Aufruf bereits
    // ausgelöst. Ob ein Mailprogramm aufgeht, kann die Seite nicht erfahren —
    // deshalb wird der manuelle Weg angeboten statt ihn zu erraten.
    form.addEventListener('submit', () => {
        // map statt every: every bricht beim ersten ungültigen Feld ab und
        // würde die übrigen Pflichtfelder unmarkiert lassen.
        const results = fields.map((field) => check(field, false));
        if (!results.every(Boolean)) {
            fields[results.indexOf(false)]?.el.focus();
            return;
        }
        if (!fallback) return;
        setTimeout(() => {
            fallback.hidden = false;
            if (window.lucide?.createIcons) window.lucide.createIcons();
        }, 1200);
    });

    /* ------------------------------------------------------ Sprachwechsel */

    ['lang-de', 'lang-en'].forEach((id) => {
        document.getElementById(id)?.addEventListener('click', () => {
            setTimeout(() => {
                // Fehlermeldungen in der alten Sprache stehen lassen wäre falsch
                fields.forEach((field) => {
                    if (field.el.getAttribute('aria-invalid') === 'true') check(field, false);
                });
                if (message && count) message.dispatchEvent(new Event('input'));
            }, 60);
        });
    });
})();
