/* Spatial Evidence Lab — Shared Navigation & Footer
 * Package 02
 * Injects identical navigation/footer across the site.
 * No framework dependency.
 */
(function () {
  "use strict";

  const NAV_ITEMS = [
    { label: "Research", href: "/research/" },
    { label: "Projects", href: "/projects/" },
    { label: "Methods", href: "/methods/" },
    { label: "Data", href: "/data/" },
    { label: "Resources", href: "/resources/" },
    { label: "About", href: "/about/" }
  ];

  const DOMAINS = [
    ["Quality of Life", "/projects/sel-001-ireland-quality-of-life/"],
    ["Public Transport", "/projects/sel-002-bandon-public-transport/"],
    ["Urban & Regional", "/projects/"],
    ["Environment & Climate", "/projects/"],
    ["Population & Society", "/projects/"],
    ["Land Use & Sustainability", "/projects/"]
  ];

  function normalize(path) {
    path = path.replace(/\/index\.html$/, "/");
    if (!path.endsWith("/")) path += "/";
    return path.replace(/\/+/g, "/");
  }

  function sectionFor(path) {
    const p = normalize(path);
    if (p === "/" || p.startsWith("/research/")) return "Research";
    if (p.startsWith("/projects/")) return "Projects";
    if (p.startsWith("/methods/")) return "Methods";
    if (p.startsWith("/data/")) return "Data";
    if (p.startsWith("/resources/")) return "Resources";
    if (p.startsWith("/about/")) return "About";
    return "";
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[c]));
  }

  function currentPage(path) {
    return normalize(window.location.pathname) === normalize(path);
  }

  function buildNav() {
    const section = sectionFor(window.location.pathname);
    const navLinks = NAV_ITEMS.map(item => {
      const active = section === item.label ? ' aria-current="page" class="is-active"' : "";
      return `<a href="${item.href}"${active}>${escapeHTML(item.label)}</a>`;
    }).join("");

    return `
      <header class="sel-site-header" data-sel-header>
        <a class="sel-skip-link" href="#main-content">Skip to content</a>
        <div class="sel-nav-shell">
          <a class="sel-brand" href="/" aria-label="Spatial Evidence Lab home">
            <span class="sel-brand-mark" aria-hidden="true">SEL</span>
            <span class="sel-brand-text">
              <strong>Spatial Evidence Lab</strong>
              <small>Enterprise geospatial research</small>
            </span>
          </a>

          <button class="sel-nav-toggle" type="button"
                  aria-expanded="false" aria-controls="sel-primary-navigation">
            <span></span><span></span><span></span>
            <span class="sel-sr-only">Open navigation</span>
          </button>

          <nav id="sel-primary-navigation" class="sel-primary-nav" aria-label="Primary navigation">
            <div class="sel-nav-links">${navLinks}</div>
            <div class="sel-nav-actions">
              <button class="sel-search-trigger" type="button" aria-label="Search Spatial Evidence Lab">
                <span aria-hidden="true">⌕</span><span>Search</span>
              </button>
              <a class="sel-github-link" href="https://github.com/Spatial-Evidence-Lab"
                 target="_blank" rel="noopener noreferrer" aria-label="Spatial Evidence Lab on GitHub">
                GitHub
              </a>
            </div>
          </nav>
        </div>
      </header>

      <div class="sel-search-dialog" data-sel-search hidden>
        <div class="sel-search-backdrop" data-sel-search-close></div>
        <section class="sel-search-panel" role="dialog" aria-modal="true"
                 aria-labelledby="sel-search-title">
          <button class="sel-search-close" type="button" data-sel-search-close aria-label="Close search">×</button>
          <p class="sel-eyebrow">Spatial Evidence Lab</p>
          <h2 id="sel-search-title">Search the research portfolio</h2>
          <form class="sel-search-form" data-sel-search-form>
            <label for="sel-site-search" class="sel-sr-only">Search</label>
            <input id="sel-site-search" name="q" type="search"
                   placeholder="Search projects, methods, datasets…" autocomplete="off">
            <button type="submit">Search</button>
          </form>
          <p class="sel-search-note">Search is prepared as a shared site interface; connect it to the site index or search service when available.</p>
        </section>
      </div>
    `;
  }

  function buildFooter() {
    const domainLinks = DOMAINS.map(([label, href]) =>
      `<li><a href="${href}">${escapeHTML(label)}</a></li>`
    ).join("");

    return `
      <footer class="sel-site-footer">
        <div class="sel-footer-main">
          <div class="sel-footer-about">
            <a class="sel-footer-brand" href="/">Spatial Evidence Lab</a>
            <p>Independent geospatial research focused on spatial evidence, data engineering, location intelligence and reproducible analysis.</p>
            <a class="sel-footer-github" href="https://github.com/Spatial-Evidence-Lab"
               target="_blank" rel="noopener noreferrer">View SEL on GitHub ↗</a>
          </div>

          <nav class="sel-footer-column" aria-label="Explore">
            <h2>Explore</h2>
            <ul>
              <li><a href="/research/">Research</a></li>
              <li><a href="/projects/">Projects</a></li>
              <li><a href="/methods/">Methods</a></li>
              <li><a href="/data/">Data</a></li>
              <li><a href="/resources/">Resources</a></li>
              <li><a href="/about/">About</a></li>
            </ul>
          </nav>

          <nav class="sel-footer-column" aria-label="Research Domains">
            <h2>Research Domains</h2>
            <ul>${domainLinks}</ul>
          </nav>

          <div class="sel-footer-column sel-footer-connect">
            <h2>Open research</h2>
            <p>Maps, datasets, methods and project documentation are published as reusable spatial evidence.</p>
            <a href="https://github.com/Spatial-Evidence-Lab"
               target="_blank" rel="noopener noreferrer">GitHub repository ↗</a>
          </div>
        </div>

        <div class="sel-footer-bottom">
          <span>© <span data-sel-year></span> Spatial Evidence Lab</span>
          <span>Geospatial research • Spatial data • Evidence</span>
          <button class="sel-back-to-top" type="button" data-sel-top>Back to top ↑</button>
        </div>
      </footer>
    `;
  }

  function ensureMainId() {
    const main = document.querySelector("main");
    if (main && !main.id) main.id = "main-content";
    else if (main && !main.id) main.id = "main-content";
  }

  function init() {
    ensureMainId();

    const headerTarget = document.querySelector("[data-sel-navigation]") ||
                         document.querySelector("header.sel-site-header");
    if (!headerTarget) {
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-sel-navigation", "");
      wrapper.innerHTML = buildNav();
      document.body.prepend(wrapper);
    }

    const footerTarget = document.querySelector("[data-sel-footer]");
    if (!footerTarget && !document.querySelector("footer.sel-site-footer")) {
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-sel-footer", "");
      wrapper.innerHTML = buildFooter();
      document.body.appendChild(wrapper);
    }

    document.querySelectorAll("[data-sel-year]").forEach(el => {
      el.textContent = new Date().getFullYear();
    });

    bindInteractions();
  }

  function bindInteractions() {
    const toggle = document.querySelector(".sel-nav-toggle");
    const nav = document.querySelector("#sel-primary-navigation");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        document.body.classList.toggle("sel-nav-open", !open);
      });

      nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("sel-nav-open");
      }));
    }

    const dialog = document.querySelector("[data-sel-search]");
    const openSearch = document.querySelector(".sel-search-trigger");
    const closeSearch = document.querySelectorAll("[data-sel-search-close]");
    const input = document.querySelector("#sel-site-search");

    if (dialog && openSearch) {
      openSearch.addEventListener("click", () => {
        dialog.hidden = false;
        document.body.classList.add("sel-search-open");
        setTimeout(() => input && input.focus(), 50);
      });
      closeSearch.forEach(el => el.addEventListener("click", () => {
        dialog.hidden = true;
        document.body.classList.remove("sel-search-open");
      }));
      document.addEventListener("keydown", e => {
        if (e.key === "Escape" && !dialog.hidden) {
          dialog.hidden = true;
          document.body.classList.remove("sel-search-open");
        }
      });
    }

    const form = document.querySelector("[data-sel-search-form]");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const q = new FormData(form).get("q");
        if (q) window.location.href = "/resources/?q=" + encodeURIComponent(q);
      });
    }

    const top = document.querySelector("[data-sel-top]");
    if (top) top.addEventListener("click", () => window.scrollTo({top: 0, behavior: "smooth"}));

    const header = document.querySelector("[data-sel-header]");
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, {passive: true});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
