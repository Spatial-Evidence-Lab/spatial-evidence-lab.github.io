document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  const target = document.querySelector(link.hash);
  if (target) target.setAttribute('tabindex', '-1');
}));
