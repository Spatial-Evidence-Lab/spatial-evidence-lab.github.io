# SEL Canonical Design System — Corrected Integration

This package corrects the previous integration so the site has one shared CSS inheritance chain.

## Canonical stylesheet order

Every primary page loads:

1. `assets/css/design-system.css` — tokens, reset, typography and accessibility
2. `assets/css/layout.css` — shell/container, grids, spacing and overflow safeguards
3. `assets/css/components.css` — shared UI and existing page components
4. `assets/css/navigation.css` — one shared header/navigation
5. `assets/css/footer.css` — one shared footer
6. `assets/css/project.css` — project-page system only, on project pages

Project-specific CSS remains last where required (for example SEL-002 `projects/sel-002-bandon-public-transport/project.css`).

## Typography contract

- Body: Inter 400
- Site name: Inter 500
- Hero eyebrow: Inter 600
- Hero title: Inter 700
- Section number: Inter 600
- Section title: Inter 600
- Metadata: Inter 500

## Layout contract

`.shell` is defined once. Page/section styles do not replace its width with `100vw`, `max-width:none`, or a page-specific shell width. This prevents browser zoom-out from creating excessive horizontal whitespace or reintroducing horizontal overflow.

## Colour contract

The existing SEL dark visual language is retained from the site's established `sel-theme.css` token set. The correction does not introduce a new light colour scheme.

## Important correction

The previous `assets/css/*.css` files were wrappers around legacy stylesheets and therefore did not form a true single system. They also used conflicting token meanings. The corrected files contain the required rules directly and do not use `@import` to pull the old SEL theme/layout/component system into the new system.

The existing legacy CSS files remain in the repository for project/webmap compatibility, but the primary site pages no longer load them directly.
