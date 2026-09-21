# Spatial Evidence Lab — Package 01: Complete Design System

Package 01 establishes the reusable visual and interaction system for `spatial-evidence-lab.github.io`.

## Included

1. **Inter typography system** — hero, display, headings, body, captions, metadata and overlines.
2. **Semantic colour tokens** — info, success, warning, danger and discovery, plus brand/surface/text tokens.
3. **Responsive spacing** — 4px through 128px token scale.
4. **Responsive grids** — `.grid-2`, `.grid-3`, `.grid-4`, `.grid-5`.
5. **KPI strip** — `.kpi-strip` / `.kpi` for the homepage and project hero statistics.
6. **Research domain cards** — `.domain-card`.
7. **Project cards** — `.project-card-ui`.
8. **Download cards** — `.download-card`.
9. **Dataset cards** — `.dataset-card`.
10. **Publication/map cards** — `.publication-card`, `.map-card-ui`.
11. **Methodology timeline** — `.method-timeline`, `.method-step`.
12. **Statistics tables** — `.table-wrap`, `.stats-table`.
13. **Figure/map captions** — `.figure`, `.figure__caption`.
14. **Sticky TOC** — `.sticky-toc` with active-section state.
15. **Breadcrumbs** — `.breadcrumbs`.
16. **Navigation** — `.nav-primary` and accessible hover/current states.
17. **Footer** — `.footer-ui` system.
18. **Lightbox** — `.sel-lightbox`, activated by `[data-lightbox]` or `.map-card-ui__image`.
19. **Webmap panel** — `.webmap-panel`.
20. **Mobile-first breakpoints** — 1100px, 900px and 700px.
21. **Publication print system** — A4 portrait and A3 landscape support.

## Integration

The package adds `css/sel-design-system.css` to all current HTML pages and enhances `js/sel-site.js`. The design-system stylesheet is also imported by `sel-theme.css`, so pages that already load the theme inherit the tokens.

No project data, map assets, report content or existing project-specific CSS was deleted.

## Examples

### Four-column KPI strip

```html
<div class="kpi-strip">
  <div class="kpi"><strong class="kpi-value">8,196</strong><span class="kpi-label">Residents</span><span class="kpi-note">Census 2022</span></div>
  <div class="kpi"><strong class="kpi-value">30 km</strong><span class="kpi-label">To Cork City</span><span class="kpi-note">Commuter & gateway node</span></div>
  <div class="kpi"><strong class="kpi-value">4</strong><span class="kpi-label">Principal bus stops</span><span class="kpi-note">Regional network modelled</span></div>
  <div class="kpi"><strong class="kpi-value">60 / 40</strong><span class="kpi-label">Weighting</span><span class="kpi-note">Vulnerability / access deficit</span></div>
</div>
```

### Methodology timeline

```html
<div class="method-timeline">
  <article class="method-step"><h3 class="method-step__title">Question</h3><p class="method-step__text">Define the spatial question.</p></article>
  <article class="method-step"><h3 class="method-step__title">Geography</h3><p class="method-step__text">Set the analytical geography.</p></article>
  <article class="method-step"><h3 class="method-step__title">Data</h3><p class="method-step__text">Assemble verified sources.</p></article>
  <article class="method-step"><h3 class="method-step__title">Indicators</h3><p class="method-step__text">Construct comparable measures.</p></article>
  <article class="method-step"><h3 class="method-step__title">Analysis</h3><p class="method-step__text">Test spatial relationships.</p></article>
  <article class="method-step"><h3 class="method-step__title">Evidence</h3><p class="method-step__text">Communicate maps and findings.</p></article>
</div>
```

## Package boundary

This is **Package 01 — Design System**. It establishes the reusable foundation; subsequent packages can consume these tokens and components without redesigning the visual language.
