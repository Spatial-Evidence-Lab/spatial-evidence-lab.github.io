# CHANGELOG — SEL v3.0 Package 01

## Package 01 — Production Ready

### Added
- `css/sel-theme.css`
  - Complete SEL typography, colour, semantic colour, spacing, radius and shadow tokens.
  - Inter-first typography stack with practical system-font fallbacks.
  - Site-name 500, eyebrow 600 and hero/heading 700 weight tokens.
- `css/sel-layout.css`
  - Responsive container and grid system.
  - 2-, 3-, 4- and 5-column grid utilities.
  - Modular spacing utilities.
  - Breakpoints at 360, 768, 1024 and 1440 px.
  - Global overflow protection for responsive production use.
- `css/sel-components.css`
  - Four global button styles only.
  - KPI, Project, Domain, Dataset, Download and Map card styling.
  - One reusable publication table style.
  - Standard figure/cartographic captions.
  - Sticky publication TOC.
  - Shared breadcrumbs.
  - Shared footer and Back to Top styling.
  - Shared lightbox/publication gallery styling.
  - SEL-styled webmap/OpenLayers/QGIS2Web panel hooks.
- `css/sel-pages.css`
  - Homepage harmonisation only.
  - Typography, metadata, section-number and link consistency.
  - No layout redesign.
- `css/sel-print.css`
  - A4 report print rules.
  - A3 landscape atlas page rules.
  - Print-safe tables, figures, cards and navigation suppression.

### HTML integration
Every HTML page was updated to:
- use `<body id="top">`;
- load the five SEL v3.0 Package 01 stylesheets.

Every HTML page with a footer was updated with:
```html
<div class="back-to-top">
  <a href="#top" class="btn btn-secondary">↑ Back to Top</a>
</div>
```

### Not included
- No new page layouts.
- No content rewrite.
- No changes to project information architecture.
- No replacement of existing maps or qgis2web generated assets.
- No JavaScript framework.
- No dependency on external web fonts.
