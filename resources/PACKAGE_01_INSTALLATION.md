# SEL v3.0 — Package 01 Installation

## Package
`SEL_v3.0_Package_01_Production_Ready.zip`

## Purpose
Package 01 establishes the Spatial Evidence Lab v3.0 production CSS system and the small HTML integration required for the shared Back to Top component.

## Installation
1. Back up the current site.
2. Extract the package into the site root, preserving the existing directory structure.
3. Confirm the five files exist under `css/`:
   - `sel-theme.css`
   - `sel-layout.css`
   - `sel-components.css`
   - `sel-pages.css`
   - `sel-print.css`
4. Confirm every HTML page links the five stylesheets.
5. Confirm every page uses `<body id="top">`.
6. Confirm every page containing a footer has the shared Back to Top component immediately before `</footer>`.
7. Test at 360, 768, 1024 and 1440 px viewport widths.
8. Test publication pages in A4 print preview and atlas pages in A3 landscape print preview.

## Scope
This package is production-ready CSS infrastructure. It does not redesign page structure, rewrite page content, or alter the existing information architecture.

## Notes
The package is intentionally additive. Existing selectors remain in place; SEL v3.0 selectors provide the harmonised production system and can be adopted progressively.
