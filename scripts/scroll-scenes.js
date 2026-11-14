const scrollMotion = matchMedia('(prefers-reduced-motion: no-preference)');
const backgrounds = document.querySelectorAll('.parallax-section');
const badges = document.querySelectorAll('[data-scroll-tilt]');
const platformLinks = document.querySelectorAll('.platform-link');
const heroScene = document.querySelector('.storm-scene');
const closingScene = document.querySelector('.closing-scene');
let scrollFrame = 0;

const clampUnit = value => Math.max(0, Math.min(1, value));
const mix = (from, to, amount) => from + (to - from) * amount;

function updateScrollScenes() {
  scrollFrame = 0;
  const animate = scrollMotion.matches;
  const viewport = document.documentElement.clientHeight;
  const progress = element => {
    const { top, height } = element.getBoundingClientRect();
    return clampUnit(1 - (top + height / 2) / viewport);
  };

  for (const section of backgrounds) {
    const offset = animate ? (viewport - section.getBoundingClientRect().top) * .3 : 0;
    section.style.setProperty('--scroll-offset', offset + 'px');
  }

  for (const badge of badges) {
    const position = progress(badge);
    const tilt = position < .5 ? mix(14, 11, position * 2) : mix(11, 5, position * 2 - 1);
    badge.style.setProperty('--badge-angle', (animate ? tilt * Number(badge.dataset.scrollTilt) : 0) + 'deg');
    badge.style.setProperty('--badge-offset', (animate ? Math.round(50 * (1 - clampUnit(position * 2))) : 0) + 'px');
    badge.style.setProperty('--badge-blur', (animate ? Math.round(6 * (1 - clampUnit(position / .16))) : 0) + 'px');
  }

  for (const link of platformLinks) {
    link.style.setProperty('--platform-opacity', animate ? clampUnit(progress(link) / .29).toFixed(3) : '1');
  }

  const heroOffset = Math.min(Math.max(-heroScene.getBoundingClientRect().top, 0), heroScene.clientHeight);
  heroScene.style.setProperty('--scene-scroll', animate ? heroOffset : 0);
  heroScene.style.setProperty('--layer-scroll', animate ? heroOffset : 0);
  const closingOffset = -closingScene.getBoundingClientRect().top;
  closingScene.style.setProperty('--scene-scroll', animate ? closingOffset : 0);
  closingScene.style.setProperty('--layer-scroll', animate ? closingOffset : 0);
}

function scheduleScrollUpdate() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollScenes);
}

window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
window.addEventListener('load', scheduleScrollUpdate, { once: true });
scrollMotion.addEventListener('change', scheduleScrollUpdate);
if ('ResizeObserver' in window) {
  const layoutObserver = new ResizeObserver(scheduleScrollUpdate);
  layoutObserver.observe(document.querySelector('main'));
}
updateScrollScenes();

if ('IntersectionObserver' in window) {
  const closingObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    closingScene.classList.add('in-view');
    observer.disconnect();
  }, { rootMargin: '100px' });
  closingObserver.observe(closingScene);
}
