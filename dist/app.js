'use strict';

/* Leads Ascend — no runtime libraries. Content stays fully visible with JS disabled. */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Mobile navigation ---------- */
const mobileMenu = document.querySelector('.mobile-nav');
mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => mobileMenu.removeAttribute('open'));
});
mobileMenu?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    mobileMenu.removeAttribute('open');
    mobileMenu.querySelector('summary')?.focus();
  }
});

/* ---------- Scroll-reveal (only when a block enters view) ---------- */
const revealTargets = document.querySelectorAll(
  '.section-head, .service, .process article, .guarantee, .book, .faqs details, .cta, .stat'
);
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('reveal-enter');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => revealObserver.observe(el));
}

/* ---------- ROI calculator (animated results) ---------- */
const roiSection = document.querySelector('.roi-section');
const apptsEl = document.querySelector('#roi-appts');
const valueEl = document.querySelector('#roi-value');
const closeEl = document.querySelector('#roi-close');

if (roiSection && apptsEl && valueEl && closeEl) {
  const outAppts = document.querySelector('[data-roi-out="appts"]');
  const outValue = document.querySelector('[data-roi-out="value"]');
  const outClose = document.querySelector('[data-roi-out="close"]');
  const basisEl = document.querySelector('[data-roi-basis] b');
  const monthlyEl = document.querySelector('#roi-monthly');
  const annualEl = document.querySelector('#roi-annual');

  const fmt = (n) => Math.round(n).toLocaleString('en-GB');

  // Tween one number element from its last value to a target.
  function tweenTo(el, target) {
    const from = Number(el.dataset.val || 0);
    el.dataset.val = target;
    if (reduceMotion.matches) { el.textContent = fmt(target); return; }
    cancelAnimationFrame(Number(el.dataset.raf || 0));
    const start = performance.now();
    const duration = 450;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (target - from) * eased);
      if (p < 1) el.dataset.raf = requestAnimationFrame(step);
    };
    el.dataset.raf = requestAnimationFrame(step);
  }

  function update() {
    const appts = +apptsEl.value;
    const value = +valueEl.value;
    const close = +closeEl.value;
    outAppts.textContent = appts;
    outValue.textContent = value.toLocaleString('en-GB');
    outClose.textContent = close;

    const newCustomers = appts * (close / 100);
    const monthly = newCustomers * value;
    basisEl.textContent = newCustomers % 1 === 0
      ? newCustomers.toLocaleString('en-GB')
      : newCustomers.toFixed(1);
    tweenTo(monthlyEl, monthly);
    tweenTo(annualEl, monthly * 12);
  }

  [apptsEl, valueEl, closeEl].forEach((el) => el.addEventListener('input', update));

  // Populate on first view so the results count up from zero.
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const roiObserver = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        update();
        obs.disconnect();
      }
    }, { threshold: 0.35 });
    roiObserver.observe(roiSection);
  } else {
    update();
  }
}

/* ---------- Hero simulation: lead → instant reply → booked ---------- */
const simSteps = [...document.querySelectorAll('[data-sim-step]')];
const simTimer = document.querySelector('[data-sim-timer]');

if (simSteps.length === 3 && simTimer) {
  if (reduceMotion.matches) {
    // Static, fully visible: show the finished state and a representative reply time.
    simSteps.forEach((step) => step.classList.add('active'));
    simTimer.textContent = '0.9s';
  } else {
    let rafId = 0;
    const timeouts = [];
    const clearCycle = () => {
      cancelAnimationFrame(rafId);
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;
    };

    const runCycle = () => {
      clearCycle();
      simSteps.forEach((step) => step.classList.remove('active', 'typing'));
      simTimer.textContent = '0.0s';

      const started = performance.now();
      let timerFrozen = false;
      const tickTimer = (now) => {
        if (timerFrozen) return;
        simTimer.textContent = ((now - started) / 1000).toFixed(1) + 's';
        rafId = requestAnimationFrame(tickTimer);
      };
      rafId = requestAnimationFrame(tickTimer);

      // 1) Enquiry arrives
      timeouts.push(setTimeout(() => simSteps[0].classList.add('active'), 250));
      // 2) AI replies in under a second — freeze the timer to show the response time
      timeouts.push(setTimeout(() => {
        simSteps[1].classList.add('active', 'typing');
        timerFrozen = true;
        cancelAnimationFrame(rafId);
      }, 950));
      // 3) Appointment booked
      timeouts.push(setTimeout(() => simSteps[2].classList.add('active'), 2100));
      // Hold on the finished state, then loop
      timeouts.push(setTimeout(runCycle, 4800));
    };

    // Only animate while the simulation is on screen.
    if ('IntersectionObserver' in window) {
      const simEl = simSteps[0].closest('.sim');
      const simObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) runCycle();
          else clearCycle();
        }
      }, { threshold: 0.25 });
      simObserver.observe(simEl);
    } else {
      runCycle();
    }
  }
}
