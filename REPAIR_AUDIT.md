# Repository repair audit — 2026-09-26

## Repairs applied
- Repointed shared stylesheets to the current `assets/css/core/`, `assets/css/components/`, `assets/css/pages/`, and `assets/css/publication/` layout.
- Replaced the obsolete `/js/sel-site.js` reference with the existing `/js/navigation.js` and included `/js/core.js` for the shared site pages.
- Replaced the removed section-system stylesheet reference with the existing callout and figure component stylesheets.
- Repaired the site-wide wordmark sizing and header alignment so the logo stays within a compact 32–42 px box and does not stretch the navigation.
- Repaired SEL-002 Bandon map image references to the canonical `assets/maps/sel-002-bandon/` full, web, and thumbnail asset directories.
- Updated Bandon map metadata/download references to the canonical map filenames.

## Validation
- Scanned 22 HTML pages for local stylesheet, script, image, and source references: **0 missing local references** after repair.
- Remaining CSS URL warnings are limited to optional Font Awesome font variants not present in the webmap export; the supplied solid font files are present. Root-relative `/media/hero-map.jpg` references resolve to the existing media asset on the published site.

## Deployment note
The site uses root-relative `/assets/...` and `/media/...` paths, which are appropriate when published at the domain root (`https://spatial-evidence-lab.github.io/`). If deployed under a repository subpath instead, a base-path strategy would be required.
