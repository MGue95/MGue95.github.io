/**
 * mg-shell — interaktive Terminal-Sektion
 *
 * Eigenständiges Modul: hängt sich an #terminal, greift nicht in script.js ein.
 * Inhalte stammen 1:1 aus den übrigen Sektionen der Seite, zweisprachig (de/en).
 */
(() => {
    'use strict';

    const root = document.getElementById('terminal');
    if (!root) return;

    const bodyEl   = root.querySelector('#terminalBody');
    const inputEl  = root.querySelector('#terminalInput');
    const ghostEl  = root.querySelector('#terminalGhost');
    const chipsEl  = root.querySelector('#terminalChips');
    if (!bodyEl || !inputEl) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'de');
    const t = (pair) => (typeof pair === 'string' ? pair : pair[lang()]);

    /* ---------------------------------------------------------------- Daten */

    const HOST = 'malte@guendisch';
    const CWD  = '~/profile';

    const SECTIONS = {
        about: '#about',
        experience: '#experience',
        work: '#selected-work',
        skills: '#skills',
        ai: '#ai-expertise',
        focus: '#focus',
        certs: '#certifications',
        contact: '#contact'
    };

    // Ausgabe-Bausteine: [klasse, text] — Text wird escaped, HTML nur via {html:…}
    const L = (cls, text) => ({ cls, text });
    const RAW = (cls, html) => ({ cls, html });
    const GAP = () => ({ cls: 't-dim', text: '' });

    const kv = (key, value, pad = 14) =>
        RAW('t-line', `<span class="t-key">${esc(key.padEnd(pad))}</span><span class="t-val">${esc(value)}</span>`);

    const bullet = (text) =>
        RAW('t-line', `<span class="t-dim">  ▸ </span><span class="t-val">${esc(text)}</span>`);

    const COMMANDS = {
        help: {
            desc: { de: 'Alle Befehle auflisten', en: 'List all commands' },
            run: () => {
                const out = [
                    L('t-head', t({ de: 'Verfügbare Befehle', en: 'Available commands' })),
                    GAP()
                ];
                Object.keys(COMMANDS).forEach((name) => {
                    out.push(RAW('t-line',
                        `<span class="t-dim">  </span><button type="button" class="t-run" data-cmd="${esc(name)}">${esc(name.padEnd(12))}</button>` +
                        `<span class="t-dim">${esc(t(COMMANDS[name].desc))}</span>`));
                });
                out.push(GAP());
                out.push(L('t-dim', t({
                    de: 'Tipp: TAB vervollständigt, ↑/↓ blättert durch die History.',
                    en: 'Tip: TAB completes, ↑/↓ cycles through history.'
                })));
                return out;
            }
        },

        whoami: {
            desc: { de: 'Kurzprofil', en: 'Short profile' },
            run: () => [
                L('t-head', 'Malte Gündisch'),
                kv(t({ de: 'Rolle', en: 'Role' }), 'Manager Online-Marketing & CRM'),
                kv(t({ de: 'Firma', en: 'Company' }), 'ergoflix Group'),
                kv(t({ de: 'Standort', en: 'Location' }), 'Dinslaken / NRW, ' + t({ de: 'Deutschland', en: 'Germany' })),
                kv(t({ de: 'Erfahrung', en: 'Experience' }), t({ de: '10+ Jahre Online-Marketing', en: '10+ years online marketing' })),
                kv(t({ de: 'Fokus', en: 'Focus' }), 'Salesforce · LLM · Web'),
                GAP(),
                L('t-dim', t({
                    de: 'Marketing denkt in Wirkung. Engineering denkt in Systemen. Ich verbinde beides.',
                    en: 'Marketing thinks in impact. Engineering thinks in systems. I connect both.'
                }))
            ]
        },

        about: {
            desc: { de: 'Über mich', en: 'About me' },
            run: () => [
                L('t-head', t({ de: '# Über mich', en: '# About me' })),
                GAP(),
                L('t-val', t({
                    de: 'Als Manager für Online-Marketing & CRM bei der ergoflix Group verantworte ich die technische Seite von Marketing und Kundendaten. Schwerpunkt: die praktische Weiterentwicklung der Salesforce-Plattform und stabile Integrationen zwischen CRM, Marketing-Automatisierung, Telefonie und Web-Präsenz mit durchgängigem Tracking.',
                    en: 'As Manager Online Marketing & CRM at ergoflix Group I own the technical side of marketing and customer data. Focus: hands-on development of the Salesforce platform and robust integrations between CRM, marketing automation, telephony and web presence with end-to-end tracking.'
                })),
                GAP(),
                L('t-val', t({
                    de: 'Aus mehr als zehn Jahren im Online-Marketing und in der Webentwicklung bringe ich Kenntnisse in Lightning Web Components, Apex, WordPress/PHP, modernem TypeScript-Tooling und im praktischen Einsatz von LLM-Tools mit.',
                    en: 'From more than ten years in online marketing and web development I bring experience in Lightning Web Components, Apex, WordPress/PHP, modern TypeScript tooling and hands-on use of LLM tools.'
                })),
                GAP(),
                hintOpen('about')
            ]
        },

        experience: {
            desc: { de: 'Beruflicher Werdegang', en: 'Career history' },
            run: () => [
                L('t-head', t({ de: '# Berufserfahrung', en: '# Experience' })),
                GAP(),
                RAW('t-line', `<span class="t-ok">2026-01 → ${esc(t({ de: 'heute', en: 'today' }))}</span>  <span class="t-head">Manager Online Marketing &amp; CRM</span> <span class="t-dim">· ergoflix Group</span>`),
                bullet(t({ de: 'Salesforce: LWC, Apex, Flows, Berechtigungen, validierte Prod-Deployments', en: 'Salesforce: LWC, Apex, flows, permissions, validated production deployments' })),
                bullet(t({ de: 'Integrationen: Marketing-Automation, Telefonie, HR und ERP', en: 'Integrations: marketing automation, telephony, HR and ERP' })),
                bullet(t({ de: 'Webdesign & Kampagnen: WordPress/Oxygen, Tracking, Consent, Conversions', en: 'Web design & campaigns: WordPress/Oxygen, tracking, consent, conversions' })),
                bullet(t({ de: 'Reporting: SOQL-KPIs, Google Analytics 4, Looker Studio', en: 'Reporting: SOQL KPIs, Google Analytics 4, Looker Studio' })),
                GAP(),
                RAW('t-line', `<span class="t-ok">2022-04 → 2026-01</span>  <span class="t-head">Online Marketing Specialist</span> <span class="t-dim">· ergoflix Group</span>`),
                bullet(t({ de: 'Online-Marketing und Webdesign im ergoflix-Kontext', en: 'Online marketing and web design in the ergoflix context' })),
                GAP(),
                RAW('t-line', `<span class="t-ok">2019-09 → 2022-03</span>  <span class="t-head">Marketing &amp; E-Commerce Manager</span> <span class="t-dim">· ToCi Vertrieb OHG</span>`),
                bullet(t({ de: 'E-Commerce-Optimierung und digitale Strategie · Hünxe, NRW', en: 'E-commerce optimisation and digital strategy · Hünxe, NRW' })),
                GAP(),
                RAW('t-line', `<span class="t-ok">2015-05 → ${esc(t({ de: 'heute', en: 'today' }))}</span>  <span class="t-head">Marketingexperte</span> <span class="t-dim">· Brauprojekt 777 (${esc(t({ de: 'freiberuflich', en: 'freelance' }))})</span>`),
                bullet(t({ de: 'Webentwicklung, Webdesign und Marketing · Voerde (Niederrhein), NRW', en: 'Web development, web design and marketing · Voerde (Niederrhein), NRW' })),
                GAP(),
                hintOpen('experience')
            ]
        },

        stack: {
            desc: { de: 'Technologien & Werkzeuge', en: 'Technologies & tools' },
            run: () => {
                const groups = [
                    [{ de: 'CRM & Plattform', en: 'CRM & platform' }, 'Salesforce Core · Apex · LWC · Flow Builder · SOQL/SOSL · Salesforce CLI · Data Loader · Make.com · Brevo · HeyFlow · Matelso'],
                    [{ de: 'KI & LLM', en: 'AI & LLM' }, 'Claude API · Claude Code · LLM Workflows · ChatGPT · Gemini · Perplexity · Midjourney'],
                    [{ de: 'Sprachen', en: 'Languages' }, 'TypeScript · JavaScript · PHP · Python · HTML5 · CSS3 · SQL'],
                    [{ de: 'Frontend & CMS', en: 'Frontend & CMS' }, 'WordPress · Oxygen Builder · jQuery · Vanilla JS/CSS · RankMath/Yoast · Plesk/cPanel'],
                    [{ de: 'Analytics', en: 'Analytics' }, 'Google Analytics 4 · Tag Manager · Search Console · Looker Studio · Power BI · Hotjar · Clarity'],
                    [{ de: 'Paid Media', en: 'Paid media' }, 'Google Ads · Performance Max · Microsoft Ads · Meta Ads · YouTube Ads · Outbrain · Taboola · Merchant Center'],
                    [{ de: 'SEO & Consent', en: 'SEO & consent' }, 'Sistrix · Screaming Frog · Lighthouse · Schema.org · Borlabs · Usercentrics/Cookiebot'],
                    [{ de: 'Dev-Tools', en: 'Dev tools' }, 'Git · GitHub · GitHub Actions · npm · VS Code · Postman · Figma · Adobe CC'],
                    [{ de: 'Workflow', en: 'Workflow' }, 'ClickUp · Asana · Notion · Google Workspace · Apps Script · Teams · Granola']
                ];
                const out = [L('t-head', t({ de: '# Stack', en: '# Stack' })), GAP()];
                groups.forEach(([label, items]) => {
                    out.push(RAW('t-line', `<span class="t-accent">${esc(t(label))}</span>`));
                    out.push(RAW('t-line', `<span class="t-dim">  </span><span class="t-val">${esc(items)}</span>`));
                    out.push(GAP());
                });
                out.push(hintOpen('skills'));
                return out;
            }
        },

        ai: {
            desc: { de: 'KI-Tooling & Arbeitsweise', en: 'AI tooling & practice' },
            run: () => [
                L('t-head', t({ de: '# KI, Web & Tooling', en: '# AI, web & tooling' })),
                GAP(),
                RAW('t-line', `<span class="t-ok">[${esc(t({ de: 'fortgeschritten', en: 'advanced' }))}]</span> <span class="t-head">${esc(t({ de: 'KI-Tooling & Prompting', en: 'AI tooling & prompting' }))}</span>`),
                bullet(t({ de: 'Claude API, Prompt-Design und strukturierte Ausgaben für Arbeitsabläufe', en: 'Claude API, prompt design and structured outputs for real workflows' })),
                GAP(),
                RAW('t-line', `<span class="t-ok">[${esc(t({ de: 'fortgeschritten', en: 'advanced' }))}]</span> <span class="t-head">${esc(t({ de: 'KI im Arbeitsalltag', en: 'AI in daily work' }))}</span>`),
                bullet(t({ de: 'Recherche, Textarbeit und wiederkehrende Aufgaben sinnvoll einordnen', en: 'Research, writing and recurring tasks — placed where they actually help' })),
                GAP(),
                RAW('t-line', `<span class="t-ok">[${esc(t({ de: 'fortgeschritten', en: 'advanced' }))}]</span> <span class="t-head">${esc(t({ de: 'Webdesign & digitale Oberflächen', en: 'Web design & digital interfaces' }))}</span>`),
                bullet(t({ de: 'WordPress/Oxygen mit klarer Nutzerführung, Tracking und Performance', en: 'WordPress/Oxygen with clear guidance, clean tracking and performance' })),
                GAP(),
                RAW('t-line', `<span class="t-ok">[${esc(t({ de: 'fortgeschritten', en: 'advanced' }))}]</span> <span class="t-head">${esc(t({ de: 'Marketing-Automation & Tracking', en: 'Marketing automation & tracking' }))}</span>`),
                bullet(t({ de: 'Kampagnen, Consent, Analytics und CRM nachvollziehbar verknüpfen', en: 'Campaigns, consent, analytics and CRM connected and measurable' })),
                GAP(),
                hintOpen('ai')
            ]
        },

        projects: {
            desc: { de: 'Ausgewählte Arbeitsfelder', en: 'Selected fields of work' },
            run: () => [
                L('t-head', t({ de: '# Was ich baue', en: '# What I build' })),
                GAP(),
                RAW('t-line', `<span class="t-accent">01 / CRM PLATFORM</span>  <span class="t-head">${esc(t({ de: 'CRM als Betriebssystem', en: 'CRM as operating system' }))}</span>`),
                bullet(t({ de: 'Salesforce so weiterentwickeln, dass Vertrieb, Marketing und Service mit verlässlichen Daten arbeiten.', en: 'Evolving Salesforce so sales, marketing and service work on reliable data.' })),
                RAW('t-line', `<span class="t-dim">    Salesforce · Apex · LWC · Flow · CRM</span>`),
                GAP(),
                RAW('t-line', `<span class="t-accent">02 / WEB DESIGN</span>     <span class="t-head">${esc(t({ de: 'Websites mit Charakter', en: 'Websites with character' }))}</span>`),
                bullet(t({ de: 'Landingpages, die klar führen, schnell laden und Marken sichtbar machen.', en: 'Landing pages that guide clearly, load fast and make brands visible.' })),
                RAW('t-line', `<span class="t-dim">    WordPress · Oxygen · Responsive · Performance</span>`),
                GAP(),
                RAW('t-line', `<span class="t-accent">03 / MARKETING ENG.</span> <span class="t-head">${esc(t({ de: 'Marketing messbar machen', en: 'Making marketing measurable' }))}</span>`),
                bullet(t({ de: 'Aus einzelnen Touchpoints belastbare Entscheidungen machen.', en: 'Turning single touchpoints into decisions you can defend.' })),
                RAW('t-line', `<span class="t-dim">    GA4 · GTM · WordPress · Consent</span>`),
                GAP(),
                hintOpen('work')
            ]
        },

        focus: {
            desc: { de: 'Aktuelle Schwerpunkte', en: 'Current focus' },
            run: () => [
                L('t-head', t({ de: '# Aktueller Fokus', en: '# Current focus' })),
                GAP(),
                RAW('t-line', `<span class="t-accent">[CRM]</span>  <span class="t-head">CRM & Salesforce ${esc(t({ de: 'Administration', en: 'administration' }))}</span>`),
                bullet(t({ de: 'Flows, Automatisierung, Berechtigungen und eine belastbare Datenbasis', en: 'Flows, automation, permissions and a data base you can build on' })),
                GAP(),
                RAW('t-line', `<span class="t-accent">[DATA]</span> <span class="t-head">Data Strategy & Lead Management</span>`),
                bullet(t({ de: 'Lead-Management, Scoring, Nurturing und Reporting mit Blick auf Geschäftswert', en: 'Lead management, scoring, nurturing and reporting focused on business value' })),
                GAP(),
                RAW('t-line', `<span class="t-accent">[WEB]</span>  <span class="t-head">Webdesign, SEO & Performance Marketing</span>`),
                bullet(t({ de: 'Klare Gestaltung, gute Auffindbarkeit, nachvollziehbarer ROI', en: 'Clear design, strong discoverability, traceable ROI' })),
                GAP(),
                hintOpen('focus')
            ]
        },

        certs: {
            desc: { de: 'Zertifizierungen', en: 'Certifications' },
            run: () => [
                RAW('t-line', `<span class="t-head">${esc(t({ de: '# Zertifizierungen', en: '# Certifications' }))}</span> <span class="t-dim">— 9 ${esc(t({ de: 'verifizierte Nachweise', en: 'verified credentials' }))}</span>`),
                GAP(),
                RAW('t-line', `<span class="t-accent">Anthropic</span> <span class="t-dim">· Anthropic Education · ${esc(t({ de: 'ausgestellt April 2026', en: 'issued April 2026' }))}</span>`),
                bullet('AI Fluency — Framework & Foundations'),
                bullet('Claude-101 (Prompting & Capabilities)'),
                bullet('Claude Code-101 (Agentic CLI & Tooling)'),
                bullet('Claude Code in Action (Production Workflows)'),
                GAP(),
                RAW('t-line', `<span class="t-accent">Google</span> <span class="t-dim">· Google Skillshop · ${esc(t({ de: 'gültig bis April 2027', en: 'valid until April 2027' }))}</span>`),
                bullet(t({ de: 'Google Ads Search-Zertifizierung', en: 'Google Ads Search certification' })),
                bullet('AI-Powered Performance & Smart Bidding'),
                bullet(t({ de: 'Google Analytics-Zertifizierung (GA4)', en: 'Google Analytics certification (GA4)' })),
                GAP(),
                RAW('t-line', `<span class="t-accent">HubSpot</span> <span class="t-dim">· HubSpot Academy</span>`),
                bullet(t({ de: 'Digital Marketing-Zertifizierung', en: 'Digital marketing certification' })),
                GAP(),
                RAW('t-line', `<span class="t-accent">medienreich</span> <span class="t-dim">· ${esc(t({ de: 'ausgestellt Januar 2024', en: 'issued January 2024' }))}</span>`),
                bullet(t({ de: 'Schulung Webentwicklung mit JavaScript', en: 'Training: web development with JavaScript' })),
                GAP(),
                hintOpen('certs')
            ]
        },

        contact: {
            desc: { de: 'Kontaktwege', en: 'How to reach me' },
            run: () => [
                L('t-head', t({ de: '# Kontakt', en: '# Contact' })),
                GAP(),
                RAW('t-line', `<span class="t-key">${esc('E-Mail'.padEnd(12))}</span><a href="${esc(window.MG_MAIL.mailto())}">${esc(t({ de: 'Mail schreiben →', en: 'Write an email →' }))}</a>`),
                RAW('t-line', `<span class="t-key">${esc('LinkedIn'.padEnd(12))}</span><a href="https://www.linkedin.com/in/malte-g%C3%BCndisch-4131131ba/" target="_blank" rel="noopener">/in/malte-guendisch</a>`),
                RAW('t-line', `<span class="t-key">${esc('GitHub'.padEnd(12))}</span><a href="https://github.com/MGue95" target="_blank" rel="noopener">@MGue95</a>`),
                GAP(),
                kv(t({ de: 'Standort', en: 'Location' }), t({ de: 'Deutschland (NRW)', en: 'Germany (NRW)' })),
                kv(t({ de: 'Offen für', en: 'Open to' }), t({ de: 'fachlichen Austausch & Vorträge', en: 'professional exchange & talks' })),
                GAP(),
                hintOpen('contact')
            ]
        },

        neofetch: {
            desc: { de: 'Systeminfo im ASCII-Stil', en: 'System info, ASCII style' },
            run: (args, ctx) => {
                const art = [
                    '   ███╗   ███╗ ██████╗ ',
                    '   ████╗ ████║██╔════╝ ',
                    '   ██╔████╔██║██║  ███╗',
                    '   ██║╚██╔╝██║██║   ██║',
                    '   ██║ ╚═╝ ██║╚██████╔╝',
                    '   ╚═╝     ╚═╝ ╚═════╝ '
                ];
                const info = [
                    ['', 'malte@guendisch'],
                    ['', '───────────────'],
                    ['OS', 'Marketing × Engineering'],
                    ['Host', 'ergoflix Group'],
                    ['Shell', 'mg-shell 1.0'],
                    ['Kernel', 'Salesforce · LWC · Apex'],
                    ['Uptime', t({ de: '10+ Jahre Online-Marketing', en: '10+ years online marketing' })],
                    ['Packages', '9 ' + t({ de: 'Zertifikate', en: 'certifications' })],
                    ['Locale', t({ de: 'Dinslaken / NRW · de_DE', en: 'Dinslaken / NRW · de_DE' })]
                ];
                const out = [GAP()];
                const narrow = ctx.width < 520;

                if (narrow) {
                    // Nebeneinander passt auf schmalen Displays nicht — gestapelt.
                    art.forEach((row) => out.push(RAW('t-art', `<span class="t-ok">${esc(row.trim())}</span>`)));
                    out.push(GAP());
                    info.forEach(([k, v]) => {
                        if (!k) {
                            if (v.startsWith('─')) return;
                            out.push(RAW('t-line', `<span class="t-head">${esc(v)}</span>`));
                            return;
                        }
                        out.push(RAW('t-line',
                            `<span class="t-key">${esc(k.padEnd(9))}</span><span class="t-val">${esc(v)}</span>`));
                    });
                    out.push(GAP());
                    return out;
                }

                const rows = Math.max(art.length, info.length);
                for (let i = 0; i < rows; i++) {
                    const left = (art[i] || '').padEnd(26);
                    const [k, v] = info[i] || ['', ''];
                    const right = k
                        ? `<span class="t-key">${esc(k)}</span><span class="t-dim">: </span><span class="t-val">${esc(v)}</span>`
                        : `<span class="t-head">${esc(v)}</span>`;
                    out.push(RAW('t-art', `<span class="t-ok">${esc(left)}</span>${right}`));
                }
                out.push(GAP());
                return out;
            }
        },

        ls: {
            desc: { de: 'Sektionen der Seite auflisten', en: 'List page sections' },
            run: () => {
                const out = [L('t-dim', t({ de: 'Sektionen in ~/profile:', en: 'Sections in ~/profile:' })), GAP()];
                Object.keys(SECTIONS).forEach((name) => {
                    out.push(RAW('t-line',
                        `<span class="t-dim">  drwxr-xr-x  </span>` +
                        `<button type="button" class="t-run" data-cmd="open ${esc(name)}">${esc(name)}/</button>`));
                });
                out.push(GAP());
                out.push(L('t-dim', t({ de: 'open <name> springt zur Sektion.', en: 'open <name> jumps to the section.' })));
                return out;
            }
        },

        open: {
            desc: { de: 'Zu einer Sektion springen — open <name>', en: 'Jump to a section — open <name>' },
            run: (args) => {
                const target = (args[0] || '').toLowerCase();
                if (!target) {
                    return [L('t-warn', t({ de: 'Nutzung: open <name> — siehe "ls".', en: 'Usage: open <name> — see "ls".' }))];
                }
                if (!SECTIONS[target]) {
                    return [L('t-err', `open: ${target}: ` + t({ de: 'Sektion nicht gefunden.', en: 'no such section.' }))];
                }
                const el = document.querySelector(SECTIONS[target]);
                if (el) {
                    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                }
                return [L('t-ok', `→ ${target}/`)];
            }
        },

        date: {
            desc: { de: 'Aktuelles Datum und Uhrzeit', en: 'Current date and time' },
            run: () => [L('t-val', new Date().toLocaleString(lang() === 'en' ? 'en-GB' : 'de-DE', {
                dateStyle: 'full', timeStyle: 'short'
            }))]
        },

        theme: {
            desc: { de: 'Sprache umschalten (de/en)', en: 'Switch language (de/en)' },
            run: () => {
                const next = lang() === 'de' ? 'en' : 'de';
                document.getElementById(next === 'de' ? 'lang-de' : 'lang-en')?.click();
                return [L('t-ok', next === 'de' ? 'Sprache: Deutsch' : 'Language: English')];
            }
        },

        history: {
            desc: { de: 'Eingegebene Befehle', en: 'Entered commands' },
            run: (args, ctx) => {
                if (!ctx.history.length) {
                    return [L('t-dim', t({ de: '(noch nichts eingegeben)', en: '(nothing entered yet)' }))];
                }
                return ctx.history.map((cmd, i) =>
                    RAW('t-line', `<span class="t-dim">  ${String(i + 1).padStart(3)}  </span><span class="t-val">${esc(cmd)}</span>`));
            }
        },

        sudo: {
            desc: { de: 'Vorsicht.', en: 'Careful.' },
            run: () => [
                L('t-err', t({
                    de: 'malte ist nicht in der sudoers-Datei. Dieser Vorfall wird gemeldet.',
                    en: 'malte is not in the sudoers file. This incident will be reported.'
                })),
                L('t-dim', t({ de: '…nur Spaß. Probier "contact".', en: '…just kidding. Try "contact".' }))
            ]
        },

        cv: {
            desc: { de: 'Lebenslauf als PDF drucken', en: 'Print CV as PDF' },
            run: () => {
                setTimeout(() => window.print(), 400);
                return [
                    L('t-ok', t({
                        de: '→ Druckdialog wird geöffnet. Als Ziel "Als PDF sichern" wählen.',
                        en: '→ Opening the print dialog. Choose "Save as PDF" as the destination.'
                    })),
                    L('t-dim', t({
                        de: 'Die Seite kennt ein eigenes Druck-Layout: Lebenslauf statt Website.',
                        en: 'The page has a dedicated print layout: CV instead of website.'
                    }))
                ];
            }
        },

        share: {
            desc: { de: 'Link zu einem Befehl kopieren — share <befehl>', en: 'Copy a link to a command — share <command>' },
            run: (args) => {
                const cmd = (args[0] || 'whoami').toLowerCase();
                if (!COMMANDS[cmd]) {
                    return [L('t-err', `share: ${cmd}: ` + t({ de: 'unbekannter Befehl.', en: 'unknown command.' }))];
                }
                const url = `${location.origin}${location.pathname}?cmd=${encodeURIComponent(cmd)}`;
                const out = [
                    L('t-dim', t({ de: 'Dieser Link führt direkt zu dieser Ausgabe:', en: 'This link leads straight to that output:' })),
                    RAW('t-line', `<a href="${esc(url)}">${esc(url)}</a>`)
                ];
                navigator.clipboard?.writeText(url).then(
                    () => {},
                    () => {}
                );
                out.push(L('t-ok', t({ de: '✓ in die Zwischenablage kopiert', en: '✓ copied to clipboard' })));
                return out;
            }
        },

        keys: {
            desc: { de: 'Tastenkürzel', en: 'Keyboard shortcuts' },
            run: () => [
                L('t-head', t({ de: '# Tastenkürzel', en: '# Keyboard shortcuts' })),
                GAP(),
                kv('⌘/Ctrl + K', t({ de: 'Terminal überall öffnen', en: 'open the terminal anywhere' }), 16),
                kv('Tab', t({ de: 'Befehl vervollständigen', en: 'complete the command' }), 16),
                kv('→', t({ de: 'Vorschlag übernehmen', en: 'accept the suggestion' }), 16),
                kv('↑ / ↓', t({ de: 'durch die History blättern', en: 'cycle through history' }), 16),
                kv('⌘/Ctrl + L', t({ de: 'Konsole leeren', en: 'clear the console' }), 16),
                kv('Esc', t({ de: 'Eingabe leeren / Overlay schließen', en: 'clear input / close overlay' }), 16)
            ]
        },

        clear: {
            desc: { de: 'Konsole leeren', en: 'Clear the console' },
            run: (args, ctx) => { ctx.clear(); return []; }
        }
    };

    function hintOpen(section) {
        return RAW('t-line',
            `<span class="t-dim">${esc(t({ de: 'Volle Sektion: ', en: 'Full section: ' }))}</span>` +
            `<button type="button" class="t-run" data-cmd="open ${esc(section)}">open ${esc(section)}</button>`);
    }

    function esc(str) {
        return String(str).replace(/[&<>"']/g, (c) => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    function completions(prefix) {
        return Object.keys(COMMANDS).filter((c) => c.startsWith(prefix) && c !== prefix);
    }

    /* ======================================================================
       Shell-Instanz

       Bewusst als Factory: dieselbe Logik trägt die Sektion auf der Seite und
       das ⌘K-Overlay. Geteilt wird nur COMMANDS — History, Busy-Zustand und
       DOM gehören jeder Instanz für sich.
       ====================================================================== */

    function createShell({ scope, bodyEl, inputEl, ghostEl, chipsEl, onCommand }) {
        const history = [];
        let historyIndex = -1;
        let busy = false;
        let booted = false;

        const ctx = {
            get width() { return bodyEl.clientWidth; },
            get history() { return history; },
            clear() { bodyEl.innerHTML = ''; }
        };

        function print(entry) {
            const el = document.createElement('div');
            el.className = 't-line ' + (entry.cls || '');
            if (entry.html !== undefined) el.innerHTML = entry.html;
            else el.textContent = entry.text === '' ? ' ' : entry.text;
            bodyEl.appendChild(el);
            bodyEl.scrollTop = bodyEl.scrollHeight;
            return el;
        }

        function printPrompt(cmd) {
            print(RAW('t-cmd',
                `<span class="t-prompt">${esc(HOST)}</span><span class="t-dim">:</span>` +
                `<span class="t-path">${esc(CWD)}</span><span class="t-dim">$ </span>` +
                `<span class="t-val">${esc(cmd)}</span>`));
        }

        function execute(raw) {
            const line = raw.trim();
            printPrompt(line);
            if (!line) return;

            history.push(line);
            historyIndex = history.length;

            const [name, ...args] = line.split(/\s+/);
            const key = name.toLowerCase();

            if (key === 'echo') {
                print(L('t-val', args.join(' ')));
            } else if (['exit', 'quit', 'logout'].includes(key)) {
                print(L('t-dim', t({
                    de: 'Du kannst hier nicht raus — aber "contact" hilft weiter.',
                    en: 'There is no way out — but "contact" helps.'
                })));
            } else if (!COMMANDS[key]) {
                print(L('t-err', `${name}: ` + t({ de: 'Befehl nicht gefunden.', en: 'command not found.' })));
                print(RAW('t-line',
                    `<span class="t-dim">${esc(t({ de: 'Probier ', en: 'Try ' }))}</span>` +
                    `<button type="button" class="t-run" data-cmd="help">help</button>`));
            } else {
                COMMANDS[key].run(args, ctx).forEach(print);
            }

            onCommand?.(key, args);
        }

        function typeAndRun(cmd) {
            if (busy) return;
            busy = true;
            inputEl.value = '';
            updateGhost();

            if (reduceMotion) {
                execute(cmd);
                busy = false;
                inputEl.focus({ preventScroll: true });
                return;
            }

            let i = 0;
            const tick = () => {
                inputEl.value = cmd.slice(0, ++i);
                if (i < cmd.length) {
                    setTimeout(tick, 28);
                } else {
                    setTimeout(() => {
                        inputEl.value = '';
                        execute(cmd);
                        busy = false;
                        updateGhost();
                        inputEl.focus({ preventScroll: true });
                    }, 160);
                }
            };
            tick();
        }

        function boot(then) {
            if (booted) {
                if (then) typeAndRun(then);
                return;
            }
            booted = true;

            const steps = [
                L('t-dim', 'mg-shell 1.1 — ' + t({ de: 'interaktives Kurzprofil', en: 'interactive profile shell' })),
                RAW('t-rule', ''),
                RAW('t-line', `<span class="t-ok">✓</span> <span class="t-dim">${esc(t({ de: 'Profil geladen', en: 'profile loaded' }))}</span>`),
                RAW('t-line', `<span class="t-ok">✓</span> <span class="t-dim">${esc(t({ de: 'Stack initialisiert (Salesforce · Web · LLM)', en: 'stack initialised (Salesforce · web · LLM)' }))}</span>`),
                RAW('t-line', `<span class="t-ok">✓</span> <span class="t-dim">${esc(t({ de: '9 Zertifikate verifiziert', en: '9 certifications verified' }))}</span>`),
                GAP(),
                // ⌘K gibt es auf Touch-Geräten nicht — dort auf die Chips verweisen
                touchDevice
                    ? RAW('t-line',
                        `<span class="t-val">${esc(t({ de: 'Tipp ', en: 'Tap ' }))}</span>` +
                        `<button type="button" class="t-run" data-cmd="help">help</button>` +
                        `<span class="t-val">${esc(t({ de: ' oder wähl unten einen Befehl.', en: ' or pick a command below.' }))}</span>`)
                    : RAW('t-line',
                        `<span class="t-val">${esc(t({ de: 'Tippe ', en: 'Type ' }))}</span>` +
                        `<button type="button" class="t-run" data-cmd="help">help</button>` +
                        `<span class="t-val">${esc(t({ de: ' — oder öffne die Shell überall mit ', en: ' — or open the shell anywhere with ' }))}</span>` +
                        `<span class="t-key">⌘K</span><span class="t-val">.</span>`)
            ];

            const first = then || 'whoami';

            if (reduceMotion) {
                steps.forEach(print);
                typeAndRun(first);
                return;
            }

            busy = true;
            let i = 0;
            const next = () => {
                if (i < steps.length) {
                    print(steps[i++]);
                    setTimeout(next, i <= 2 ? 90 : 230);
                } else {
                    busy = false;
                    setTimeout(() => typeAndRun(first), 320);
                }
            };
            next();
        }

        function updateGhost() {
            if (!ghostEl) return;
            const value = inputEl.value;
            const match = value && !value.includes(' ') ? completions(value.toLowerCase())[0] : null;
            ghostEl.textContent = match ? value + match.slice(value.length) : '';
            ghostEl.parentElement.dataset.empty = String(!value);
        }

        inputEl.addEventListener('input', updateGhost);
        updateGhost();

        inputEl.addEventListener('keydown', (e) => {
            if (busy && e.key !== 'Escape') { e.preventDefault(); return; }

            if (e.key === 'Enter') {
                e.preventDefault();
                const value = inputEl.value;
                inputEl.value = '';
                updateGhost();
                execute(value);
                return;
            }

            if (e.key === 'Tab') {
                e.preventDefault();
                const value = inputEl.value.toLowerCase();
                const matches = completions(value);
                if (matches.length === 1) {
                    inputEl.value = matches[0];
                } else if (matches.length > 1) {
                    printPrompt(inputEl.value);
                    print(L('t-dim', '  ' + matches.join('   ')));
                }
                updateGhost();
                return;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!history.length) return;
                historyIndex = Math.max(0, historyIndex - 1);
                inputEl.value = history[historyIndex] || '';
                updateGhost();
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!history.length) return;
                historyIndex = Math.min(history.length, historyIndex + 1);
                inputEl.value = history[historyIndex] || '';
                updateGhost();
                return;
            }

            if (e.key === 'ArrowRight' && ghostEl && ghostEl.textContent) {
                inputEl.value = ghostEl.textContent;
                updateGhost();
                return;
            }

            if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                ctx.clear();
                return;
            }

            if (e.key === 'Escape' && inputEl.value) {
                e.stopPropagation();
                inputEl.value = '';
                updateGhost();
            }
        });

        scope.querySelector('.terminal-window')?.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) return;
            if (window.getSelection()?.toString()) return;
            inputEl.focus({ preventScroll: true });
        });

        const runFromTarget = (e) => {
            const btn = e.target.closest('[data-cmd]');
            if (!btn) return;
            e.preventDefault();
            typeAndRun(btn.dataset.cmd);
        };
        bodyEl.addEventListener('click', runFromTarget);
        chipsEl?.addEventListener('click', runFromTarget);

        return {
            boot,
            run: typeAndRun,
            focus: () => inputEl.focus({ preventScroll: true }),
            reset: () => { ctx.clear(); booted = false; busy = false; },
            isBooted: () => booted
        };
    }

    /* ---------------------------------------------- Instanz 1: die Sektion */

    const sectionShell = createShell({
        scope: root,
        bodyEl: root.querySelector('#terminalBody'),
        inputEl: root.querySelector('#terminalInput'),
        ghostEl: root.querySelector('#terminalGhost'),
        chipsEl: root.querySelector('#terminalChips')
    });

    /* --------------------------------------------- Instanz 2: ⌘K-Overlay */

    const CHIPS = ['whoami', 'experience', 'stack', 'ai', 'projects', 'certs', 'contact', 'cv'];

    const overlay = document.createElement('div');
    overlay.className = 'terminal-overlay';
    overlay.id = 'terminalOverlay';
    overlay.hidden = true;
    overlay.innerHTML = `
        <div class="terminal-overlay-backdrop" data-close></div>
        <div class="terminal-overlay-panel" role="dialog" aria-modal="true" aria-label="mg-shell">
            <div class="terminal-window">
                <div class="terminal-bar">
                    <div class="terminal-dots" aria-hidden="true"><span></span><span></span><span></span></div>
                    <span class="terminal-title">malte@guendisch — ~/profile — mg-shell</span>
                    <button type="button" class="terminal-close" data-close aria-label="Schließen">ESC</button>
                </div>
                <div class="terminal-body" id="overlayBody" role="log" aria-live="polite" tabindex="0"></div>
                <div class="terminal-inputline">
                    <span class="t-prompt" aria-hidden="true">malte@guendisch<span class="t-dim">:</span><span class="t-path">~/profile</span><span class="t-dim">$</span></span>
                    <span class="terminal-input-wrap">
                        <span class="terminal-ghost" id="overlayGhost" aria-hidden="true"></span>
                        <input type="text" id="overlayInput" autocomplete="off" autocapitalize="off"
                               autocorrect="off" spellcheck="false" placeholder="help"
                               aria-label="Terminal-Befehl eingeben">
                    </span>
                </div>
            </div>
            <div class="terminal-chips" id="overlayChips">
                ${CHIPS.map((c) => `<button type="button" class="terminal-chip" data-cmd="${c}">${c}</button>`).join('')}
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const overlayPanel = overlay.querySelector('.terminal-overlay-panel');
    let lastFocused = null;

    const overlayShell = createShell({
        scope: overlay,
        bodyEl: overlay.querySelector('#overlayBody'),
        inputEl: overlay.querySelector('#overlayInput'),
        ghostEl: overlay.querySelector('#overlayGhost'),
        chipsEl: overlay.querySelector('#overlayChips'),
        // "open" soll die Sektion zeigen und "cv" die Seite drucken —
        // beides funktioniert nur, wenn das Overlay vorher aus dem Weg ist.
        onCommand: (name) => {
            if (name === 'open') setTimeout(closeOverlay, 260);
            if (name === 'cv') closeOverlay();
        }
    });

    function openOverlay(command) {
        if (!overlay.hidden) {
            if (command) overlayShell.run(command);
            return;
        }
        lastFocused = document.activeElement;
        overlay.hidden = false;
        document.body.classList.add('terminal-overlay-open');
        requestAnimationFrame(() => overlay.classList.add('is-open'));
        overlayShell.boot(command);
        overlayShell.focus();
    }

    function closeOverlay() {
        if (overlay.hidden) return;
        overlay.classList.remove('is-open');
        document.body.classList.remove('terminal-overlay-open');
        const finish = () => {
            overlay.hidden = true;
            if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
        };
        if (reduceMotion) finish();
        else setTimeout(finish, 180);
    }

    overlay.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) closeOverlay();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            overlay.hidden ? openOverlay() : closeOverlay();
            return;
        }
        if (e.key === 'Escape' && !overlay.hidden) {
            closeOverlay();
            return;
        }
        // Fokus im Overlay halten
        if (e.key === 'Tab' && !overlay.hidden) {
            const focusables = overlayPanel.querySelectorAll('button, input, a[href]');
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Auslöser in der Navigation
    document.querySelectorAll('[data-open-shell]').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openOverlay();
        });
    });

    /* ------------------------------------- Sprachwechsel: Konsolen neu füllen */

    ['lang-de', 'lang-en'].forEach((id) => {
        document.getElementById(id)?.addEventListener('click', () => {
            setTimeout(() => {
                // Bereits gedruckte Ausgabe bliebe in der alten Sprache stehen.
                if (sectionShell.isBooted()) { sectionShell.reset(); sectionShell.boot(); }
                if (overlayShell.isBooted()) { overlayShell.reset(); if (!overlay.hidden) overlayShell.boot(); }
            }, 60);
        });
    });

    /* ------------------------------------------- Start beim Ins-Bild-Kommen */

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    sectionShell.boot();
                    io.disconnect();
                }
            });
        }, { threshold: 0.25 });
        io.observe(root);
    } else {
        sectionShell.boot();
    }

    /* ------------------------------------------------ Teilbare Befehls-Links */

    // ?cmd=stack (oder #cmd=stack) öffnet die Seite direkt auf dieser Ausgabe.
    const requested = (() => {
        const fromQuery = new URLSearchParams(location.search).get('cmd');
        if (fromQuery) return fromQuery;
        const m = location.hash.match(/^#cmd=(.+)$/);
        return m ? decodeURIComponent(m[1]) : null;
    })();

    if (requested) {
        const name = requested.trim().split(/\s+/)[0].toLowerCase();
        if (COMMANDS[name]) {
            root.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            setTimeout(() => sectionShell.boot(requested.trim()), reduceMotion ? 0 : 700);
        }
    }
})();
