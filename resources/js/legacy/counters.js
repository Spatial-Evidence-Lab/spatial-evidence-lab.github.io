const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const node = entry.target, target = Number(node.dataset.counter || 0), suffix = node.dataset.suffix || '';
  const start = performance.now(), duration = 900;
  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    node.textContent = `${Math.round((1 - Math.pow(1 - progress, 3)) * target).toLocaleString()}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick); counterObserver.unobserve(node);
}), { threshold: .6 });
document.querySelectorAll('[data-counter]').forEach(node => counterObserver.observe(node));
