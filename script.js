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
       Die System-Map des Hero liegt jetzt in backdrop.js und bedient von dort
       auch "Was ich baue" und die Terminal-Sektion — gleicher Hintergrund in
       allen drei. Nur der Parallax-Versatz des Hero bleibt hier.
       --------------------------------------------------------------------- */
    if (hero) {
        let scrollFrame = 0;
        window.addEventListener('scroll', () => {
            if (scrollFrame) return;
            scrollFrame = requestAnimationFrame(() => {
                const bounds = hero.getBoundingClientRect();
                const shift = Math.max(-80, Math.min(80, bounds.top * -0.12));
                hero.style.setProperty('--hero-shift', `${shift}px`);
                scrollFrame = 0;
            });
        }, { passive: true });
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