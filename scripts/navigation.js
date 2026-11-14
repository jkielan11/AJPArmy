const header = document.querySelector('.site-header');
const toggle = header.querySelector('.menu-toggle');
const menu = header.querySelector('.site-nav');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

if (!header.classList.contains('blog-header')) {
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}
