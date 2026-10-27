/**
 * CaptureOCR — Main JS (ported from ebook-voice-player)
 * - Mobile nav toggle
 * - Scroll reveal (IntersectionObserver)
 * - Smooth scroll for anchor links
 * - Video lazy-load optimization
 */
(() => {
  'use strict';

  // ================================================================
  // Mobile Navigation
  // ================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      siteNav.classList.toggle('open');
    });

    // Close on link click
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('open');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('open');
        navToggle.focus();
      }
    });
  }

  // ================================================================
  // Scroll Reveal (IntersectionObserver)
  // ================================================================
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ================================================================
  // Smooth Scroll for Anchor Links
  // ================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL without scroll
        history.pushState(null, '', targetId);
      }
    });
  });

  // ================================================================
  // Video Preload Optimization
  // ================================================================
  // Only preload metadata; full video loads on user interaction
  document.querySelectorAll('video[preload="none"]').forEach(video => {
    const playPromise = video.play?.();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked - that's fine, user will click play
      });
    }
  });

  // ================================================================
  // FAQ Details Polyfill (for older browsers)
  // ================================================================
  if (!HTMLDetailsElement.prototype.open) {
    // Native <details> is supported in all modern browsers
    // This is just a safety net
    document.querySelectorAll('details').forEach(details => {
      const summary = details.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', e => {
          e.preventDefault();
          details.open = !details.open;
        });
      }
    });
  }

  // ================================================================
  // Console Easter Egg
  // ================================================================
  console.log('%cCaptureOCR', 'font-size:24px;font-weight:700;color:#2563eb', '%cScreenshot OCR → Markdown/CSV', 'font-size:14px;color:#4a5568');
  console.log('%c🔗 Microsoft Store:', 'font-size:12px;color:#6b7280', 'https://apps.microsoft.com/store/detail/9PBP8VBG4RJ1');
})();