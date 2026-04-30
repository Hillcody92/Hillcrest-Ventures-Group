// =====================
// HERO ENTRANCE
// =====================
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
});

// =====================
// SCROLL REVEAL
// =====================

// Auto-stagger: assign data-reveal + staggered delays to direct children of [data-stagger]
document.querySelectorAll('[data-stagger]').forEach(container => {
    Array.from(container.children).forEach((child, i) => {
        if (!child.hasAttribute('data-reveal')) {
            child.setAttribute('data-reveal', '');
        }
        child.style.transitionDelay = `${i * 0.13}s`;
    });
});

// Intersection Observer — fires once per element, then unobserves
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// =====================
// DESKTOP NAV DROPDOWN (click to open)
// =====================
document.querySelectorAll('.nav__has-dropdown').forEach(item => {
    const trigger = item.querySelector('.nav__dropdown-trigger');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
        // Close all other open dropdowns
        document.querySelectorAll('.nav__has-dropdown').forEach(other => {
            if (other !== item) {
                other.classList.remove('is-open');
                other.querySelector('.nav__dropdown-trigger').setAttribute('aria-expanded', 'false');
            }
        });
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.nav__has-dropdown').forEach(item => {
        item.classList.remove('is-open');
        item.querySelector('.nav__dropdown-trigger').setAttribute('aria-expanded', 'false');
    });
});

// =====================
// ACTIVE NAV LINK
// =====================
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links li:not(.nav__has-dropdown) > a:not(.nav__cta)').forEach(link => {
    if (link.getAttribute('href') === currentFile) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
    }
});

// =====================
// MOBILE PLATFORMS DROPDOWN
// =====================
const mobilePlatformsTrigger = document.getElementById('mobilePlatformsTrigger');
const mobilePlatformsItems = document.getElementById('mobilePlatformsItems');

if (mobilePlatformsTrigger && mobilePlatformsItems) {
    mobilePlatformsTrigger.addEventListener('click', () => {
        const isOpen = mobilePlatformsItems.classList.toggle('is-open');
        mobilePlatformsTrigger.classList.toggle('is-open', isOpen);
    });
}

// =====================
// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu(open) {
    mobileMenu.classList.toggle('is-open', open);
    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    if (open) {
        s1.style.transform = 'translateY(7px) rotate(45deg)';
        s2.style.opacity = '0';
        s3.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        s1.style.transform = '';
        s2.style.opacity = '';
        s3.style.transform = '';
    }
}

hamburger.addEventListener('click', () => {
    toggleMenu(!mobileMenu.classList.contains('is-open'));
});

hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') toggleMenu(!mobileMenu.classList.contains('is-open'));
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

// =====================
// FAQ ACCORDION
// =====================
document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('faq__item--open');
        document.querySelectorAll('.faq__item--open').forEach(i => {
            i.classList.remove('faq__item--open');
            i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            i.querySelector('.faq__icon').textContent = '+';
        });
        if (!isOpen) {
            item.classList.add('faq__item--open');
            btn.setAttribute('aria-expanded', 'true');
            btn.querySelector('.faq__icon').textContent = '−';
        }
    });
});

// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20
        ? '0 2px 24px rgba(0,0,0,0.3)'
        : 'none';
}, { passive: true });
