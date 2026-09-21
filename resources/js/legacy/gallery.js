document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const items = [...gallery.querySelectorAll('[data-gallery-item]')];
  gallery.querySelectorAll('[data-gallery-next]').forEach(button => button.addEventListener('click', () => {
    const active = items.findIndex(item => item.classList.contains('active'));
    items.forEach(item => item.classList.remove('active'));
    items[(active + 1) % items.length]?.classList.add('active');
  }));
});
