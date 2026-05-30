/**
 * Premium animated portfolio — interactions & motion
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Intro sequence ───────────────────────────────────────────
  function initIntro() {
    document.body.classList.add('intro-active');
    const overlay = document.getElementById('introOverlay');

    const hideIntro = () => {
      overlay.classList.add('hidden');
      document.body.classList.remove('intro-active');
      initHeroStagger();
    };

    if (prefersReducedMotion) {
      hideIntro();
      return;
    }

    setTimeout(hideIntro, 2200);
  }

  // ─── Hero staggered reveal ────────────────────────────────────
  function initHeroStagger() {
    const items = document.querySelectorAll('.reveal-stagger');
    items.forEach((el) => {
      const delay = parseInt(el.dataset.delay || '0', 10) * 0.15;
      el.style.animationDelay = `${delay + 0.3}s`;
      el.classList.add('visible');
    });
  }

  // ─── Letter-by-letter text reveal ─────────────────────────────
  function initLetterReveal() {
    document.querySelectorAll('.letter-reveal').forEach((el) => {
      const text = el.dataset.text || el.textContent;
      el.textContent = '';
      const fragment = document.createDocumentFragment();
      let charIndex = 0;

      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        const baseDelay = el.classList.contains('hero-title-accent') ? 1.2 : 0.5;
        span.style.animationDelay = `${baseDelay + charIndex * 0.04}s`;
        fragment.appendChild(span);
        charIndex++;
      });

      el.appendChild(fragment);
    });
  }

  // ─── Section title letter reveal on scroll ────────────────────
  function initStaticLetterReveal() {
    const titles = document.querySelectorAll('.letter-reveal-static');

    titles.forEach((el) => {
      const text = el.dataset.text || el.textContent.trim();
      el.textContent = '';
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.transitionDelay = `${i * 0.03}s`;
        el.appendChild(span);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px 0px -10% 0px' }
    );

    titles.forEach((t) => observer.observe(t));
  }

  // ─── Scroll reveal ────────────────────────────────────────────
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10) * 0.12;
          el.style.transitionDelay = `${delay}s`;
          el.classList.add('visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // ─── Neon particles canvas ────────────────────────────────────
  function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const count = 80;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.hue = Math.random() > 0.5 ? 180 : 260;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < count; i++) particles.push(new Particle());

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();
  }

  // ─── Mouse follow glow ────────────────────────────────────────
  function initMouseGlow() {
    const glow = document.getElementById('mouseGlow');
    if (!glow || prefersReducedMotion) return;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function update() {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      requestAnimationFrame(update);
    }

    update();
  }

  // ─── Parallax scrolling ───────────────────────────────────────
  function initParallax() {
    if (prefersReducedMotion) return;

    const layers = document.querySelectorAll('[data-parallax]:not(.float-icon)');

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          layers.forEach((el) => {
            const speed = parseFloat(el.dataset.parallax) || 0.1;
            el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ─── Timeline progress line ───────────────────────────────────
  function initTimeline() {
    const timeline = document.getElementById('timeline');
    const progress = document.getElementById('timelineProgress');
    const dot = document.getElementById('timelineDot');
    if (!timeline || !progress) return;

    function updateTimeline() {
      const rect = timeline.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const start = rect.top - viewHeight * 0.3;
      const end = rect.bottom - viewHeight * 0.5;
      const total = end - start;
      let pct = 0;

      if (total > 0) {
        pct = Math.min(1, Math.max(0, (viewHeight * 0.5 - rect.top) / (rect.height + viewHeight * 0.2)));
      }

      progress.style.height = `${pct * 100}%`;
      if (dot) dot.style.top = `${pct * 100}%`;
    }

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
  }

  // ─── Nav scroll state & mobile toggle ─────────────────────────
  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
      nav.style.background =
        window.scrollY > 50
          ? 'rgba(3, 5, 8, 0.92)'
          : 'rgba(3, 5, 8, 0.6)';
    }, { passive: true });

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
      });

      links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // ─── Contact form ───────────────────────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const original = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.disabled = true;
      btn.style.animation = 'btnPulse 1s ease-in-out';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  // ─── Smooth active section highlight (optional polish) ──────
  function initSectionTransitions() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-active');
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // ─── Boot ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initLetterReveal();
    initIntro();
    initStaticLetterReveal();
    initScrollReveal();
    initParticles();
    initMouseGlow();
    initParallax();
    initTimeline();
    initNav();
    initContactForm();
    initSectionTransitions();

    if (prefersReducedMotion) {
      document.getElementById('introOverlay')?.classList.add('hidden');
      document.body.classList.remove('intro-active');
      document.querySelectorAll('.reveal-stagger, .reveal-on-scroll').forEach((el) => {
        el.classList.add('visible');
      });
    }
  });
})();
