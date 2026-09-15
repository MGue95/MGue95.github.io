/**
 * MALTE GÜNDISCH — PERSÖNLICHE VORSTELLUNGSSEITE
 * Zweisprachigkeit (DE/EN), Stack-Filterung & Live-Suche, Lucide Icons,
 * Portrait-Flip (Hover am Desktop, Tap/Enter am Touch- und Tastaturgerät),
 * mobiles Menü, Kontaktformular & dynamisches Jahr.
 */

document.addEventListener('DOMContentLoaded', () => {
    const initIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    };
    initIcons();

    const langDeBtn = document.getElementById('lang-de');
    const langEnBtn = document.getElementById('lang-en');
    const yearSpan = document.getElementById('year');
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    const stackSearchInput = document.getElementById('stackSearch');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const scrollProgress = document.getElementById('scrollProgress');
    const sectionLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const workSlider = document.getElementById('workSlider');
    const workSlides = workSlider ? Array.from(workSlider.querySelectorAll('.work-slide')) : [];
    const workPrev = document.getElementById('workPrev');
    const workNext = document.getElementById('workNext');
    const workCount = document.getElementById('workCount');
    const workProgress = document.getElementById('workProgress');
    const hero = document.getElementById('hero');
    const heroCanvas = document.getElementById('heroCanvas');
    const portraitCard = document.querySelector('.portrait-card');
    const revealSections = document.querySelectorAll('.reveal-section');
    const magneticControls = document.querySelectorAll('.btn, .slider-button');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)');

    let currentLang = localStorage.getItem('mg_preferred_lang') || 'de';
    let currentCategory = 'all';
    let toastTimeout = null;

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    /* ---------------------------------------------------------------------
       Bilingual engine (DE / EN)
       --------------------------------------------------------------------- */
    const translatableElements = document.querySelectorAll('[data-de], [data-en]');

    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('mg_preferred_lang', lang);
        document.documentElement.lang = lang;

        if (langDeBtn && langEnBtn) {
            langDeBtn.classList.toggle('active', lang === 'de');
            langEnBtn.classList.toggle('active', lang === 'en');
            langDeBtn.setAttribute('aria-pressed', String(lang === 'de'));
            langEnBtn.setAttribute('aria-pressed', String(lang === 'en'));
        }

        document.title = lang === 'de'
            ? 'Malte Gündisch – Online-Marketing & CRM | Web & Systems'
            : 'Malte Gündisch – Online Marketing & CRM | Web & Systems';

        translatableElements.forEach((el) => {
            const translation = el.getAttribute(`data-${lang}`);
            if (!translation) return;
            const textSpan = el.querySelector('span[data-de]') || el;
            if (textSpan === el && el.children.length === 0) {
                el.textContent = translation;
            } else if (textSpan !== el) {
                textSpan.textContent = translation;
            }
        });

        if (stackSearchInput) {
            stackSearchInput.placeholder = lang === 'de'
                ? 'Technologie suchen (z. B. Apex, Claude, GA4)...'
                : 'Search technology (e.g. Apex, Claude, GA4)...';
        }

        initIcons();
    };

    langDeBtn?.addEventListener('click', () => setLanguage('de'));
    langEnBtn?.addEventListener('click', () => setLanguage('en'));
    setLanguage(currentLang);

    /* ---------------------------------------------------------------------
       Portrait flip card — hover on desktop, tap/Enter everywhere else
       --------------------------------------------------------------------- */
    if (portraitCard) {
        const portraitBack = portraitCard.querySelector('.portrait-back');

        const setPortraitState = (isFlipped) => {
            portraitCard.classList.toggle('is-flipped', isFlipped);
            portraitCard.setAttribute('aria-pressed', String(isFlipped));
            portraitCard.setAttribute('aria-label', isFlipped
                ? 'Steckbrief von Malte Gündisch schließen'
                : 'Steckbrief von Malte Gündisch anzeigen');
            portraitBack?.setAttribute('aria-hidden', isFlipped ? 'false' : 'true');
        };

        // Fine-pointer devices (mouse/trackpad): flip on hover.
        portraitCard.addEventListener('pointerenter', (event) => {
            if (event.pointerType !== 'mouse' || !fineHover.matches) return;
            setPortraitState(true);
        });
        portraitCard.addEventListener('pointerleave', (event) => {
            if (event.pointerType !== 'mouse' || !fineHover.matches) return;
            setPortraitState(false);
        });

        // Touch and keyboard: toggle on tap / Enter / Space.
        portraitCard.addEventListener('click', (event) => {
            if (event.pointerType === 'mouse' && fineHover.matches) return;
            setPortraitState(!portraitCard.classList.contains('is-flipped'));
        });
        portraitCard.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            setPortraitState(!portraitCard.classList.contains('is-flipped'));
        });
        portraitCard.addEventListener('focusout', () => {
            if (!fineHover.matches) return;
            setPortraitState(false);
        });
    }

    /* ---------------------------------------------------------------------
       Reveal sections once (single orchestrated entrance, not per-card)
       --------------------------------------------------------------------- */
    if (!reducedMotion.matches && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });
        revealSections.forEach((section) => revealObserver.observe(section));
    } else {
        revealSections.forEach((section) => section.classList.add('is-visible'));
    }

    /* ---------------------------------------------------------------------
       Small magnetic pull on pointer-capable controls
       --------------------------------------------------------------------- */
    magneticControls.forEach((control) => {
        control.addEventListener('pointermove', (event) => {
            if (event.pointerType === 'touch' || reducedMotion.matches) return;
            const bounds = control.getBoundingClientRect();
            const x = (event.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
            const y = (event.clientY - (bounds.top + bounds.height / 2)) / bounds.height;
            control.style.transform = `translate(${x * 4}px, ${y * 4}px)`;
        }, { passive: true });
        control.addEventListener('pointerleave', () => {
            control.style.removeProperty('transform');
        }, { passive: true });
    });

    /* ---------------------------------------------------------------------
       Hero system-map canvas — capped DPR, single RAF loop, paused when
       the hero is scrolled out of view or the tab is hidden.
       --------------------------------------------------------------------- */
    if (hero && heroCanvas) {
        const context = heroCanvas.getContext('2d');
        const pointer = { x: -1000, y: -1000 };
        const nodes = [];
        let frame = 0;
        let width = 0;
        let height = 0;
        let scrollFrame = 0;
        let isVisible = true;

        const resizeCanvas = () => {
            const bounds = hero.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            width = bounds.width;
            height = bounds.height;
            heroCanvas.width = Math.floor(width * ratio);
            heroCanvas.height = Math.floor(height * ratio);
            heroCanvas.style.width = `${width}px`;
            heroCanvas.style.height = `${height}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            nodes.length = 0;
            const columns = Math.max(7, Math.floor(width / 115));
            const rows = Math.max(5, Math.floor(height / 115));
            for (let row = 0; row < rows; row += 1) {
                for (let column = 0; column < columns; column += 1) {
                    nodes.push({
                        x: ((column + 0.5) / columns) * width,
                        y: ((row + 0.5) / rows) * height,
                        phase: (row * columns + column) * 0.37,
                        active: (row + column) % 7 === 0
                    });
                }
            }
            drawSystemMap(0);
        };

        const drawSystemMap = (time) => {
            context.clearRect(0, 0, width, height);
            const currentTime = time * 0.00035;

            const gridSize = 96;
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(184, 205, 198, 0.06)';
            for (let x = 0; x <= width; x += gridSize) {
                context.beginPath();
                context.moveTo(x, 0);
                context.lineTo(x, height);
                context.stroke();
            }
            for (let y = 0; y <= height; y += gridSize) {
                context.beginPath();
                context.moveTo(0, y);
                context.lineTo(width, y);
                context.stroke();
            }

            for (let lane = 0; lane < 5; lane += 1) {
                const baseY = height * (0.18 + lane * 0.16);
                const bend = 22 + lane * 7;
                context.strokeStyle = lane === 2 ? 'rgba(143, 211, 255, 0.25)' : 'rgba(184, 205, 198, 0.14)';
                context.beginPath();
                context.moveTo(0, baseY);
                context.bezierCurveTo(width * 0.24, baseY - bend, width * 0.34, baseY + bend, width * 0.56, baseY);
                context.bezierCurveTo(width * 0.76, baseY - bend, width * 0.84, baseY + bend, width, baseY - bend * 0.3);
                context.stroke();

                const pulsePosition = (currentTime * 0.16 + lane * 0.19) % 1;
                const pulseX = width * pulsePosition;
                const pulseY = baseY + Math.sin(pulsePosition * Math.PI * 3 + lane) * bend * 0.35;
                context.fillStyle = lane === 2 ? 'rgba(143, 211, 255, 0.9)' : 'rgba(184, 205, 198, 0.7)';
                context.fillRect(pulseX - 2, pulseY - 2, 4, 4);
            }

            nodes.forEach((node) => {
                if (!node.active) return;
                const x = node.x + Math.sin(currentTime + node.phase) * 3;
                const y = node.y + Math.cos(currentTime * 0.8 + node.phase) * 3;
                context.fillStyle = 'rgba(184, 205, 198, 0.55)';
                context.fillRect(x - 2, y - 2, 4, 4);
            });

            if (pointer.x > 0 && pointer.y > 0) {
                context.strokeStyle = 'rgba(143, 211, 255, 0.34)';
                context.setLineDash([3, 6]);
                context.beginPath();
                context.moveTo(pointer.x, 0);
                context.lineTo(pointer.x, height);
                context.moveTo(0, pointer.y);
                context.lineTo(width, pointer.y);
                context.stroke();
                context.setLineDash([]);
                context.beginPath();
                context.arc(pointer.x, pointer.y, 22 + Math.sin(currentTime * 8) * 3, 0, Math.PI * 2);
                context.stroke();
            }

            if (!reducedMotion.matches && isVisible && !document.hidden) {
                frame = requestAnimationFrame(drawSystemMap);
            }
        };

        const startLoop = () => {
            if (reducedMotion.matches || document.hidden || !isVisible || frame) return;
            frame = requestAnimationFrame(drawSystemMap);
        };
        const stopLoop = () => {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
        };

        hero.addEventListener('pointermove', (event) => {
            const bounds = hero.getBoundingClientRect();
            pointer.x = event.clientX - bounds.left;
            pointer.y = event.clientY - bounds.top;
        }, { passive: true });
        hero.addEventListener('pointerleave', () => {
            pointer.x = -1000;
            pointer.y = -1000;
        }, { passive: true });

        window.addEventListener('scroll', () => {
            if (scrollFrame) return;
            scrollFrame = requestAnimationFrame(() => {
                const bounds = hero.getBoundingClientRect();
                const shift = Math.max(-80, Math.min(80, bounds.top * -0.12));
                hero.style.setProperty('--hero-shift', `${shift}px`);
                scrollFrame = 0;
            });
        }, { passive: true });

        window.addEventListener('resize', resizeCanvas, { passive: true });
        if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resizeCanvas).observe(hero);

        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                isVisible = entries[0]?.isIntersecting ?? true;
                if (isVisible) startLoop();
                else stopLoop();
            }, { threshold: 0 }).observe(hero);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopLoop();
            else startLoop();
        });

        reducedMotion.addEventListener?.('change', () => {
            if (reducedMotion.matches) stopLoop();
            else startLoop();
        });

        resizeCanvas();
        startLoop();
    }

    /* ---------------------------------------------------------------------
       Native scroll-snap work slider — keyboard, buttons, drag
       --------------------------------------------------------------------- */
    if (workSlider && workSlides.length) {
        let activeSlide = 0;
        let pointerFrame = null;
        let dragStartX = 0;
        let dragStartScroll = 0;
        let isDragging = false;

        const setWorkSlideState = (index) => {
            activeSlide = Math.max(0, Math.min(index, workSlides.length - 1));
            if (workCount) workCount.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(workSlides.length).padStart(2, '0')}`;
            if (workProgress) workProgress.style.width = `${((activeSlide + 1) / workSlides.length) * 100}%`;
            workSlides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', slideIndex === activeSlide ? 'false' : 'true'));
        };

        const updateWorkSlider = (index) => {
            const nextIndex = Math.max(0, Math.min(index, workSlides.length - 1));
            setWorkSlideState(nextIndex);
            workSlider.scrollTo({ left: workSlides[nextIndex].offsetLeft, behavior: 'smooth' });
        };

        workPrev?.addEventListener('click', () => updateWorkSlider(activeSlide - 1));
        workNext?.addEventListener('click', () => updateWorkSlider(activeSlide + 1));
        workSlider.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') updateWorkSlider(activeSlide + 1);
            if (event.key === 'ArrowLeft') updateWorkSlider(activeSlide - 1);
        });
        workSlider.addEventListener('scroll', () => {
            const nextIndex = workSlides.reduce((closestIndex, slide, slideIndex) => {
                const currentDistance = Math.abs(slide.offsetLeft - workSlider.scrollLeft);
                const closestDistance = Math.abs(workSlides[closestIndex].offsetLeft - workSlider.scrollLeft);
                return currentDistance < closestDistance ? slideIndex : closestIndex;
            }, 0);
            if (nextIndex !== activeSlide) setWorkSlideState(nextIndex);
        }, { passive: true });

        workSlider.addEventListener('pointermove', (event) => {
            if (event.pointerType === 'touch' || reducedMotion.matches) return;
            const slide = event.target.closest('.work-slide');
            if (!slide) return;
            slide.classList.add('is-hovered');
            const bounds = slide.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width) * 100;
            const y = ((event.clientY - bounds.top) / bounds.height) * 100;
            if (pointerFrame) cancelAnimationFrame(pointerFrame);
            pointerFrame = requestAnimationFrame(() => {
                slide.style.setProperty('--pointer-x', `${x}%`);
                slide.style.setProperty('--pointer-y', `${y}%`);
                slide.style.setProperty('--tilt-x', `${(50 - y) / 16}deg`);
                slide.style.setProperty('--tilt-y', `${(x - 50) / 16}deg`);
            });
        });

        workSlider.addEventListener('pointerleave', () => {
            workSlides.forEach((slide) => {
                slide.classList.remove('is-hovered');
                slide.style.removeProperty('--pointer-x');
                slide.style.removeProperty('--pointer-y');
                slide.style.removeProperty('--tilt-x');
                slide.style.removeProperty('--tilt-y');
            });
        });

        workSlider.addEventListener('pointerdown', (event) => {
            if (event.pointerType !== 'mouse' || event.button !== 0) return;
            isDragging = true;
            dragStartX = event.clientX;
            dragStartScroll = workSlider.scrollLeft;
            workSlider.classList.add('is-dragging');
            workSlider.setPointerCapture(event.pointerId);
        });
        workSlider.addEventListener('pointermove', (event) => {
            if (!isDragging) return;
            workSlider.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
        });
        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false;
            workSlider.classList.remove('is-dragging');
        };
        workSlider.addEventListener('pointerup', stopDragging);
        workSlider.addEventListener('pointercancel', stopDragging);

        setWorkSlideState(0);
    }

    /* ---------------------------------------------------------------------
       Sticky nav state + scroll progress
       --------------------------------------------------------------------- */
    const updateScrollState = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        if (scrollProgress) scrollProgress.style.width = `${progress}%`;

        let activeSection = sections[0];
        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= 140) activeSection = section;
        });
        sectionLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${activeSection?.id}`;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    };
    updateScrollState();

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
            updateScrollState();
        }, { passive: true });
    }

    /* ---------------------------------------------------------------------
       Stack filter & live search
       --------------------------------------------------------------------- */
    const applyStackFilters = () => {
        const query = stackSearchInput ? stackSearchInput.value.toLowerCase().trim() : '';

        skillCards.forEach((card) => {
            const category = card.dataset.category;
            const categoryMatches = (currentCategory === 'all' || category === currentCategory);

            if (!categoryMatches) {
                card.classList.add('hidden');
                return;
            }

            if (!query) {
                card.classList.remove('hidden');
                card.querySelectorAll('.skill-pills span').forEach((pill) => pill.classList.remove('matched'));
                return;
            }

            const titleText = (card.querySelector('.skill-category-title')?.textContent || '').toLowerCase();
            const pills = Array.from(card.querySelectorAll('.skill-pills span'));
            let hasPillMatch = false;

            pills.forEach((pill) => {
                const text = pill.textContent.toLowerCase();
                if (text.includes(query)) {
                    pill.classList.add('matched');
                    hasPillMatch = true;
                } else {
                    pill.classList.remove('matched');
                }
            });

            card.classList.toggle('hidden', !(titleText.includes(query) || hasPillMatch));
        });
    };

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.filter;
            filterButtons.forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            applyStackFilters();
        });
    });

    stackSearchInput?.addEventListener('input', applyStackFilters);

    /* ---------------------------------------------------------------------
       Toast helper
       --------------------------------------------------------------------- */
    const showToast = (message) => {
        if (!toast || !toastMessage) return;
        if (toastTimeout) clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toast.classList.add('show');
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
    };

    /* ---------------------------------------------------------------------
       Contact form → mailto draft
       --------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('formName')?.value.trim();
            const email = document.getElementById('formEmail')?.value.trim();
            const topic = document.getElementById('formTopic')?.value;
            const message = document.getElementById('formMessage')?.value.trim();

            if (!name || !email || !message) {
                showToast(currentLang === 'de'
                    ? 'Bitte fülle alle Pflichtfelder (*) aus.'
                    : 'Please fill in all required fields (*).');
                return;
            }

            const subject = encodeURIComponent(topic ? `${topic} - Anfrage von ${name}` : `Anfrage von ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\nThema: ${topic || 'Allgemein'}\n\n${message}`);
            const mailtoUrl = `${window.MG_MAIL.mailto()}?subject=${subject}&body=${body}`;

            const submitBtn = document.getElementById('submitFormBtn');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i data-lucide="mail-open" class="icon-sm"></i> <span>${currentLang === 'de' ? 'E-Mail-Entwurf geöffnet' : 'Email draft opened'}</span>`;
                initIcons();
            }

            window.location.href = mailtoUrl;
            showToast(currentLang === 'de' ? 'E-Mail-Entwurf wird geöffnet.' : 'Opening email draft.');

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                    initIcons();
                }
            }, 4000);
        });
    }

    /* ---------------------------------------------------------------------
       Mobile navigation toggle
       --------------------------------------------------------------------- */
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            initIcons();
        });

        navMenu.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});