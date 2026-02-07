function toggleMobileMenu() {
    document.getElementById('mobile-menu-overlay').classList.toggle('active');
    document.getElementById('mobile-menu-panel').classList.toggle('active');
    document.body.style.overflow = document.getElementById('mobile-menu-overlay').classList.contains('active') ? 'hidden' : '';
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
                if (window.innerWidth <= 768) {
                    entry.target.classList.add('mobile-reveal');
                }
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.card-3d');
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed / 100);
        el.style.transform = `translateY(${yPos}px)`;
    });
    lastScroll = scrolled;
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.bento-card, .card-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});

function openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
}

function copyEmail() {
    navigator.clipboard.writeText('Kylian-giard@outlook.fr');
    showNotif('Email copié dans le presse-papier !');
}

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showNotif('Message envoyé avec succès !');
                    form.reset();
                } else {
                    showNotif('Erreur lors de l\'envoi. Réessayez.');
                }
            } catch (error) {
                showNotif('Erreur de connexion. Réessayez.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

function showNotif(msg) {
    const notif = document.getElementById('notification');
    document.getElementById('notif-text').innerText = msg;
    notif.classList.remove('translate-y-32');
    setTimeout(() => notif.classList.add('translate-y-32'), 3000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (document.getElementById('mobile-menu-overlay').classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
});

if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', () => {
        const rippleElements = document.querySelectorAll('.magnetic-btn, .bento-card');
        rippleElements.forEach(el => {
            el.classList.add('ripple-effect');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        const cards = document.querySelectorAll('.bento-card, .transform-3d');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                console.log('Swiped left');
            }
            if (touchEndX > touchStartX + 50) {
                console.log('Swiped right');
            }
        }
    }
});

window.addEventListener('load', () => {
    if (window.innerWidth <= 768) {
        const statusBadge = document.querySelector('.glow-effect');
        if (statusBadge) {
            statusBadge.classList.add('mobile-pulse');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const mobileObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting && window.innerWidth <= 768) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, idx * 150);
            }
        });
    }, observerOptions);
    
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.bento-card, .transform-3d').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            mobileObserver.observe(card);
        });
    }
});
