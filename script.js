// Portfolio — Kylian Giard Ouadifi
// Script partagé par index.html et mentions-legales.html (chaque bloc vérifie ses éléments).

const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// ---------- Thème clair / sombre ----------
function currentTheme() {
    return root.dataset.theme || (prefersDark.matches ? 'dark' : 'light');
}

document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        try {
            localStorage.setItem('theme', next);
        } catch (e) { /* stockage indisponible : le choix vaut pour la session */ }
    });
});

// ---------- Header : bordure au scroll ----------
const header = document.getElementById('site-header');
if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ---------- Menu mobile ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');

function setMenu(open) {
    navLinks.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    navToggle.querySelector('i').className = open ? 'fas fa-xmark' : 'fas fa-bars';
    document.body.classList.toggle('menu-open', open);
}

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));
    navLinks.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
            setMenu(false);
            navToggle.focus();
        }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
        if (e.matches) setMenu(false);
    });
}

// ---------- Apparition au scroll ----------
const revealEls = document.querySelectorAll('.reveal, .reveal-lines');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
} else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ---------- Lien actif dans la navigation ----------
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
if (navAnchors.length && 'IntersectionObserver' in window) {
    const byId = new Map([...navAnchors].map((a) => [a.getAttribute('href').slice(1), a]));
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const link = byId.get(entry.target.id);
            if (link && entry.isIntersecting) {
                navAnchors.forEach((a) => a.removeAttribute('aria-current'));
                link.setAttribute('aria-current', 'true');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) sectionObserver.observe(section);
    });
}

// ---------- Modale projet ----------
const dialog = document.getElementById('project-dialog');
if (dialog) {
    const content = dialog.querySelector('.dialog-content');

    document.querySelectorAll('[data-project]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const tpl = document.getElementById('project-' + trigger.dataset.project);
            if (!tpl) return;
            content.replaceChildren(tpl.content.cloneNode(true));
            dialog.style.setProperty('--tint', `var(--tint-${tpl.dataset.tint || 'blue'})`);
            dialog.showModal();
            dialog.scrollTop = 0;
        });
    });

    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());

    // Clic sur le fond (en dehors du contenu) = fermeture
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
    });
}

// ---------- Notification ----------
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
    if (!toast) return;
    document.getElementById('toast-text').textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

// ---------- Copier l'email ----------
const copyBtn = document.getElementById('copy-email');
if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
        const email = document.getElementById('email-link').textContent.trim();
        try {
            await navigator.clipboard.writeText(email);
            showToast('Email copié dans le presse-papier !');
        } catch (e) {
            showToast('Copie impossible — ' + email);
        }
    });
}

// ---------- Formulaire de contact (Formspree) ----------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Envoi…';
        submitBtn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' },
            });
            if (response.ok) {
                showToast('Message envoyé avec succès !');
                contactForm.reset();
            } else {
                showToast("Erreur lors de l'envoi. Réessayez.");
            }
        } catch (err) {
            showToast('Erreur de connexion. Réessayez.');
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });
}
