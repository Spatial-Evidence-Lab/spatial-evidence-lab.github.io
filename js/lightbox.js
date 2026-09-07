document.querySelectorAll('.lightbox-link').forEach(link => link.addEventListener('click', event => {
  if (window.matchMedia('(max-width: 700px)').matches) return;
  event.preventDefault();
  const dialog = document.createElement('dialog');
  dialog.className = 'image-dialog';
  dialog.innerHTML = `<button aria-label="Close image">×</button><img src="${link.href}" alt="${link.querySelector('img')?.alt || ''}">`;
  document.body.append(dialog); dialog.showModal();
  dialog.querySelector('button').focus();
  dialog.addEventListener('close', () => dialog.remove());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
}));
