/* Spatial Evidence Lab — shared homepage UI */
(function () {
  "use strict";
  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", function () {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.scrollIntoView({behavior:"smooth", block:"start"});
      });
    });

    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = [...document.querySelectorAll(".sel-nav-links a")];
    if ("IntersectionObserver" in window && sections.length && navLinks.length) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const section = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute("href") || "";
            link.classList.toggle("is-home-section", href === "#" + section);
          });
        });
      }, {rootMargin:"-30% 0px -60% 0px"});
      sections.forEach(s => observer.observe(s));
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
