/* ============================================================
   BRICKHAUS CONSTRUCTION LTD — main.js
   ============================================================ */

(function () {
  'use strict';

  /* --- STICKY HEADER SCROLL CLASS -------------------------- */
  const header = document.getElementById('header');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- MOBILE NAV TOGGLE ----------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click (mobile)
    mainNav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  /* --- SMOOTH ANCHOR SCROLL (offset for fixed header) ------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --- CONTACT FORM (client-side only placeholder) --------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn = contactForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      // Placeholder — replace with fetch() to Cloudflare Worker
      setTimeout(() => {
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Enquiry';
        }
      }, 800);
    });
  }

  /* --- HERO LOAD ANIMATION --------------------------------- */
  const animateHero = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const heroEls = [
      { sel: '.hero__eyebrow',     delay: 0,   from: 'bottom' },
      { sel: '.hero__heading',     delay: 120, from: 'bottom' },
      { sel: '.hero__rule',        delay: 240, from: 'left'   },
      { sel: '.hero__sub',         delay: 320, from: 'bottom' },
      { sel: '.hero__actions',     delay: 420, from: 'bottom' },
      { sel: '.hero__credentials', delay: 540, from: 'bottom' },
    ];

    const fromBottom = 'translateY(28px)';
    const fromLeft   = 'translateX(-32px)';

    heroEls.forEach(({ sel, delay, from }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.opacity   = '0';
      el.style.transform = from === 'left' ? fromLeft : fromBottom;
      el.style.transition = `opacity 0.7s ease, transform 0.7s ease`;
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translate(0)';
      }, delay + 100); // 100ms after paint
    });
  };

  /* --- SCROLL-TRIGGERED REVEALS ---------------------------- */
  const animateOnScroll = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    // --- Helper: prepare an element for reveal
    const hide = (el, dx = 0, dy = 24) => {
      el.style.opacity    = '0';
      el.style.transform  = `translate(${dx}px, ${dy}px)`;
      el.style.transition = `opacity 0.65s ease, transform 0.65s ease`;
    };

    // --- Helper: reveal with optional delay
    const reveal = (el, delay = 0) => {
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translate(0, 0)';
      }, delay);
    };

    // --- Helper: build an observer that fires once per element
    const makeObserver = (callback, threshold = 0.15) =>
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          callback(entry.target);
          entry.target._revealObserver.unobserve(entry.target);
        });
      }, { threshold });

    // ── 1. SECTION EYEBROWS — slide in from left ─────────────
    document.querySelectorAll('.section__eyebrow').forEach(el => {
      hide(el, -40, 0);
      const obs = makeObserver(t => reveal(t, 0));
      obs.observe(el);
      el._revealObserver = obs;
    });

    // ── 2. SECTION HEADINGS — slide up ───────────────────────
    document.querySelectorAll('.section__heading').forEach(el => {
      hide(el, 0, 32);
      const obs = makeObserver(t => reveal(t, 80));
      obs.observe(el);
      el._revealObserver = obs;
    });

    // ── 3. SECTION SUBTEXT — slide up, after heading ─────────
    document.querySelectorAll('.section__sub').forEach(el => {
      hide(el, 0, 24);
      const obs = makeObserver(t => reveal(t, 160));
      obs.observe(el);
      el._revealObserver = obs;
    });

    // ── 4. ABOUT — left panel from left, right panel from right
    const aboutCopy   = document.querySelector('.about__copy');
    const aboutVisual = document.querySelector('.about__visual');

    if (aboutCopy) {
      hide(aboutCopy, -48, 0);
      const obs = makeObserver(t => reveal(t, 0), 0.1);
      obs.observe(aboutCopy);
      aboutCopy._revealObserver = obs;
    }

    if (aboutVisual) {
      hide(aboutVisual, 48, 0);
      const obs = makeObserver(t => reveal(t, 100), 0.1);
      obs.observe(aboutVisual);
      aboutVisual._revealObserver = obs;
    }

    // ── 5. ABOUT body paragraphs — stagger up ────────────────
    document.querySelectorAll('.about__text').forEach((el, i) => {
      hide(el, 0, 20);
      const obs = makeObserver(t => reveal(t, 200 + i * 80));
      obs.observe(el);
      el._revealObserver = obs;
    });

    // ── 6. SERVICE CARDS — stagger up in rows of 3 ───────────
    document.querySelectorAll('.service-card').forEach((el, i) => {
      hide(el, 0, 28);
      const obs = makeObserver(t => reveal(t, (i % 3) * 100));
      obs.observe(el);
      el._revealObserver = obs;
    });

    // ── 7. VALUE GRID items — stagger up ─────────────────────
    document.querySelectorAll('.value-item').forEach((el, i) => {
      hide(el, 0, 20);
      const obs = makeObserver(t => reveal(t, i * 70), 0.05);
      obs.observe(el);
      el._revealObserver = obs;
    });

    // ── 8. PROJECT CARDS — stagger up ────────────────────────
    document.querySelectorAll('.project-card').forEach((el, i) => {
      hide(el, 0, 28);
      const obs = makeObserver(t => reveal(t, i * 100));
      obs.observe(el);
      el._revealObserver = obs;
    });

    // ── 9. CONTACT — copy from left, form from right ─────────
    const contactCopy = document.querySelector('.contact__copy');
    const contactForm = document.querySelector('.contact__form');

    if (contactCopy) {
      hide(contactCopy, -48, 0);
      const obs = makeObserver(t => reveal(t, 0), 0.1);
      obs.observe(contactCopy);
      contactCopy._revealObserver = obs;
    }

    if (contactForm) {
      hide(contactForm, 48, 0);
      const obs = makeObserver(t => reveal(t, 120), 0.1);
      obs.observe(contactForm);
      contactForm._revealObserver = obs;
    }

    // ── 10. FOOTER COLUMNS — stagger up left to right ────────
    document.querySelectorAll('.footer__brand, .footer__col').forEach((el, i) => {
      hide(el, 0, 24);
      const obs = makeObserver(t => reveal(t, i * 80), 0.1);
      obs.observe(el);
      el._revealObserver = obs;
    });

    // ── 11. ABOUT STAT STACK — slide up ──────────────────────
    const statStack = document.querySelector('.about__stat-stack');
    if (statStack) {
      hide(statStack, 0, 24);
      const obs = makeObserver(t => reveal(t, 200), 0.1);
      obs.observe(statStack);
      statStack._revealObserver = obs;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      animateHero();
      animateOnScroll();
    });
  } else {
    animateHero();
    animateOnScroll();
  }

})();
