// Language toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const langDeBtn = document.getElementById('lang-de');
    const langEnBtn = document.getElementById('lang-en');
    const yearSpan = document.getElementById('year');

    // Set current year
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Get all translatable elements
    const translatableElements = document.querySelectorAll('[data-de], [data-en]');

    // Function to set language
    const setLanguage = (lang) => {
        // Update active button
        langDeBtn.classList.toggle('active', lang === 'de');
        langEnBtn.classList.toggle('active', lang === 'en');

        // Update translatable elements
        translatableElements.forEach(el => {
            if (lang === 'de' && el.dataset.de) {
                el.textContent = el.dataset.de;
            } else if (lang === 'en' && el.dataset.en) {
                el.textContent = el.dataset.en;
            }
        });
    };

    // Event listeners
    langDeBtn.addEventListener('click', () => setLanguage('de'));
    langEnBtn.addEventListener('click', () => setLanguage('en'));

    // Default language (de)
    setLanguage('de');
});