# Spatial Evidence Lab — Release 3.1 Project Filter Layout

This release updates only the **Projects catalogue interface** and its filtering behavior. The locked 7-domain / 19-theme taxonomy remains unchanged.

## Canonical data sources

- `/content/projects.json`
- `/content/taxonomy.json`

`/js/sel-projects.js` continues to load only those canonical sources.

## UI changes

- Keyword search across project metadata.
- Compact multi-select Domain, Theme, Place and Status toolbar.
- Active filter chips with one-click removal.
- Clear All action.
- Theme options grouped into five subject groups for scanning while retaining all 19 canonical themes.
- Place options presented hierarchically without modifying the underlying project geography fields.
- Status display normalized in the interface (`Production` → `Current`; `Research` → `Research in Progress`) without changing source data.
- Filtered project count and filtered map locations update immediately.
- Mobile filter drawer/accordion behavior.
- Canonical SEL palette retained; no bright cyan palette introduced.

## Files changed

- `projects/index.html`
- `js/sel-projects.js`
- `assets/css/projects.css` (new)

## Taxonomy

No changes were made to `/content/taxonomy.json`.
