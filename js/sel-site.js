(function () {
  'use strict';

  /* Mobile navigation */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* Sticky TOC / section tracking */
  const sections = [...document.querySelectorAll('[data-toc-section], .project-section[id], main section[id]')];
  const links = [...document.querySelectorAll('.project-toc a[href^="#"], .sticky-toc a[href^="#"]')];
  if (sections.length && links.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }

  /* Accessible image lightbox. Any .map-card-ui__image or [data-lightbox] can open it. */
  const lightboxTargets = [...document.querySelectorAll('[data-lightbox], .map-card-ui__image')];
  if (lightboxTargets.length) {
    let box = document.querySelector('.sel-lightbox');
    if (!box) {
      box = document.createElement('div');
      box.className = 'sel-lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', 'Image preview');
      box.innerHTML = '<div class="sel-lightbox__figure"><button class="sel-lightbox__close" type="button" aria-label="Close image">×</button><img alt=""><div class="sel-lightbox__caption"></div></div>';
      document.body.appendChild(box);
    }
    const image = box.querySelector('img');
    const caption = box.querySelector('.sel-lightbox__caption');
    const close = () => { box.classList.remove('is-open'); document.body.classList.remove('lightbox-open'); };
    box.querySelector('.sel-lightbox__close').addEventListener('click', close);
    box.addEventListener('click', e => { if (e.target === box) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    lightboxTargets.forEach(target => {
      target.addEventListener('click', () => {
        const src = target.dataset.lightbox || target.currentSrc || target.src;
        if (!src) return;
        image.src = src;
        image.alt = target.alt || '';
        caption.textContent = target.dataset.caption || target.closest('.map-card-ui, figure')?.querySelector('.figure__caption, .map-card-ui__caption')?.textContent || '';
        box.classList.add('is-open');
        document.body.classList.add('lightbox-open');
      });
    });
  }

  /* Current year */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
