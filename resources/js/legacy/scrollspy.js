const sections = [...document.querySelectorAll('[id]')];
const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const spy = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
}), { rootMargin: '-30% 0px -65%' });
sections.forEach(section => spy.observe(section));
