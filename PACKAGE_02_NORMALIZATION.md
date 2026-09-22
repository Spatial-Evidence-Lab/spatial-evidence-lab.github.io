# SEL Package 02 — Public Site Normalization

Implemented against the repository snapshot supplied on 22 September 2026.

## Main fixes
- All primary pages use `/assets/css/` for the canonical design-system foundation and page-specific extension CSS.
- All primary pages and project pages use `/js/sel-site.js` from the site root.
- The canonical footer, including `Back to top ↑`, is present across primary and project pages.
- Projects landing now loads `/js/sel-projects.js`.
- Projects catalogue loads `/content/projects.json` and `/content/taxonomy.json`.
- SEL-002 publication stylesheet is migrated into `/assets/css/sel-002-publication.css`.
- SEL-008–SEL-014 now have resolvable project pages based only on canonical catalogue metadata.
- SEL-001 map image reference uses the existing `/media/homepage/qol-map.jpg` asset.
- The Methods duplicate `<main>` landmark is removed.
- Project URLs in the catalogue now resolve to their corresponding pages.
