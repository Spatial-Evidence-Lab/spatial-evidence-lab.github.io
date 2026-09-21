# Spatial Evidence Lab — Site-wide Shell & Colour Update

This package standardises the SEL website around one dark UI colour system and one canonical site header/footer.

## Upload / apply

1. Upload the contents of `css/` to the repository, preserving the folder structure.
2. Run `tools/apply_site_shell_update.py` from the repository root. It updates the listed HTML pages in place while preserving their page-specific content and CSS.
3. Review the Git diff, then commit/push.

The script takes the header and footer from the repository root `index.html` as the canonical shell, converts page navigation to absolute site paths, sets the appropriate active navigation item, adds `sel-standards.css`, and fixes legacy `portfolio.css` references.

## Scope

The following HTML pages are normalised:
- `index.html`
- `projects/index.html`
- `methods/index.html`
- `data/index.html`
- `resources/index.html`
- `about/index.html`
- `projects/_template/index.html`
- `projects/sel-001-ireland-quality-of-life/index.html`
- `projects/sel-002-bandon-public-transport/index.html`
- `projects/sel-003-west-cork-public-transport/index.html`
- `projects/sel-004-ireland-forestry-land-use/index.html`
- `projects/sel-005-greater-athens-heat-risk/index.html`
- `projects/sel-006-county-wicklow-wind-energy/index.html`
- `projects/sel-007-rondonia-deforestation/index.html`

## Design-system rules

- `css/sel-theme.css` is the single source of website UI colour tokens.
- `css/sel-components.css` owns the shared header/footer and common controls.
- `css/sel-standards.css` contains shared standards only and does not define a competing palette.
- Website UI colours remain separate from cartographic/map colours.
- Map ID `#004DA8` is not changed.
- `css/legacy/portfolio.css` remains a legacy page-layout stylesheet; the new shared shell and semantic tokens prevent the old palette from becoming the site-wide UI.

## Important

The HTML script deliberately uses the current root `index.html` as the canonical header/footer source rather than generating replacement page content. This minimises the risk of changing research-page copy, project metadata, maps, downloads, or publication content.
