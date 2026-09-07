document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  const target = document.querySelector(link.hash);
  if (target) target.setAttribute('tabindex', '-1');
}));

document.querySelectorAll('.map-card').forEach(card => {
  const title = card.querySelector('h3')?.textContent.trim();
  if (!title) return;
  const explore = card.querySelector('.map-button.primary');
  const download = card.querySelector('.map-button:not(.primary)');
  if (explore) {
    explore.textContent = `Explore ${title} map`;
    explore.setAttribute('aria-label', `Explore ${title} map`);
  }
  if (download) {
    download.textContent = `Download PNG`;
    download.setAttribute('aria-label', `Download PNG for ${title} map`);
  }
});

document.querySelectorAll('.lightbox-link').forEach(link => {
  const alt = link.querySelector('img')?.alt;
  if (alt) link.setAttribute('aria-label', `Open enlarged map: ${alt}`);
});
