document.querySelectorAll('.lightbox-link').forEach(link => link.addEventListener('click', event => {
  if (window.matchMedia('(max-width: 700px)').matches) return;
  event.preventDefault();
  const previousFocus = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'image-dialog';
  const imageAlt = link.querySelector('img')?.alt || 'Enlarged map';
  dialog.setAttribute('aria-label', imageAlt);
  dialog.innerHTML = `<button type="button" aria-label="Close image">×</button><img src="${link.href}" alt="${imageAlt}">`;
  document.body.append(dialog); dialog.showModal();
  dialog.querySelector('button').focus();
  dialog.addEventListener('close', () => {
    dialog.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
}));
