'use strict';

const modal = document.querySelector('#brief-dialog');
const form = document.querySelector('#brief-form');
const result = document.querySelector('#brief-result');
const industryInput = document.querySelector('#industry');
const serviceInput = document.querySelector('#service');
const goalInput = document.querySelector('#goal');
const briefText = document.querySelector('#brief-text');
const copyStatus = document.querySelector('#copy-status');
const copyButton = document.querySelector('#copy-brief');
const initialCopyStatus = copyStatus.textContent;
let opener;
let briefRevision = 0;

// Each CTA starts with its own context, preserving only the visitor's written goal.
document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => {
    opener = button;
    briefRevision += 1;
    form.hidden = false;
    result.hidden = true;
    industryInput.value = button.dataset.industry || 'Other service business';
    serviceInput.value = button.dataset.service || 'More enquiries';
    goalInput.setCustomValidity('');
    copyStatus.textContent = initialCopyStatus;
    copyButton.disabled = false;
    document.querySelector('.mobile-nav')?.removeAttribute('open');
    modal.showModal();
    document.body.classList.add('dialog-open');
  });
});

document.querySelector('.close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target !== modal) return;
  const bounds = modal.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) modal.close();
});
modal.addEventListener('close', () => {
  briefRevision += 1;
  document.body.classList.remove('dialog-open');
  opener?.focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const goal = goalInput.value.trim();
  if (!goal) {
    goalInput.setCustomValidity('Please describe your goal.');
    goalInput.reportValidity();
    return;
  }
  const service = serviceInput.value;
  const next = service === '5-lead pilot'
    ? 'Agree what counts as a relevant enquiry, then confirm pilot pricing, advertising budget and timing before launching a campaign around your first five leads.'
    : service === 'Custom AI integration'
      ? 'Start by mapping one repetitive workflow, the tools involved and where a person should take over.'
      : 'Start by reviewing your ideal customer, current enquiry journey and the opportunities you want to create.';
  briefText.value = `Leads Ascend — Growth brief\n\nIndustry: ${industryInput.value}\nFocus: ${service}\nMy goal: ${goal}\n\nSuggested starting point: ${next}`;
  briefRevision += 1;
  copyStatus.textContent = initialCopyStatus;
  form.hidden = true;
  result.hidden = false;
  copyButton.focus();
});
goalInput.addEventListener('input', () => goalInput.setCustomValidity(''));
document.querySelector('#edit-brief').addEventListener('click', () => {
  briefRevision += 1;
  form.hidden = false;
  result.hidden = true;
  industryInput.focus();
});
copyButton.addEventListener('click', async () => {
  const revision = briefRevision;
  copyButton.disabled = true;
  try {
    await navigator.clipboard.writeText(briefText.value);
    if (revision === briefRevision && modal.open) {
      copyStatus.textContent = 'Brief copied. Nothing has been sent — keep it for your conversation with Leads Ascend.';
    }
  } catch {
    if (revision === briefRevision && modal.open) {
      briefText.focus();
      briefText.select();
      copyStatus.textContent = 'Automatic copying is unavailable. Select and copy the brief above to keep it.';
    }
  } finally {
    copyButton.disabled = false;
  }
});

const mobileMenu = document.querySelector('.mobile-nav');
mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => mobileMenu.removeAttribute('open'));
});
mobileMenu?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    mobileMenu.removeAttribute('open');
    mobileMenu.querySelector('summary').focus();
  }
});

// Animate only when a section enters view. Content stays visible if JS is unavailable.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets = document.querySelectorAll('.section-head, .service, .ai-feature, .industry-card, .process article, .about, .faq-section, .cta, .pilot');
let revealObserver;
function configureMotion() {
  revealObserver?.disconnect();
  if (motionPreference.matches) {
    revealTargets.forEach((element) => element.classList.remove('reveal-enter'));
    return;
  }
  if (!('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('reveal-enter');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  revealTargets.forEach((element) => revealObserver.observe(element));
}
configureMotion();
motionPreference.addEventListener?.('change', configureMotion);
