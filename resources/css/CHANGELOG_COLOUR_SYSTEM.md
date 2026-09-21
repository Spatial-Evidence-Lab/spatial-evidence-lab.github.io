# SEL Dark UI Colour System — CSS Update

Updated to align the website with the original SEL dark UI and the organisation logo.

## Updated files
- `sel-theme.css` — master colour tokens, accessibility accents, muted research-domain colours.
- `sel-design-system.css` — semantic colour aliases now inherit from `sel-theme.css`; light component surfaces were converted to the dark UI system.
- `sel-components.css` — buttons, navigation, header and footer now use the revised SEL accent system.
- `sel-project.css` — project/publication interface now uses the dark SEL palette; teal is restrained and cyan is removed as a UI colour.
- `sel-pages.css` — homepage hero overlay darkened to match the revised palette.

## Unchanged
- `sel-layout.css` — no layout changes.
- `sel-print.css` — no changes; print remains independently controlled.

## Not supplied
- `sel-standards.css` was not present in the uploaded ZIP, so it was not modified.

## Master UI colours
- Background: `#071318`
- Section: `#0B1B22`
- Surface: `#10262D`
- Raised: `#163139`
- Border: `#29444A`
- Brand blue: `#142433`
- Deep brand teal: `#146B7F`
- UI teal: `#3A97A0`
- UI light teal: `#5AAEB3`
- Warm logo accent: `#E48458`
- Primary text: `#F1F6F5`
- Secondary text: `#D6E2E1`
- Body text: `#A7B8BA`
- Muted text: `#718589`

## Cartographic colours
Map ID colour `#004DA8` and white map-ID text are intentionally not changed. Map/cartographic colours remain separate from the website UI palette.

## Important
The stylesheet still contains backward-compatible aliases such as `--sel-blue` and `--sel-cyan` so existing markup does not break. New code should use `--sel-accent`, `--sel-accent-dark`, `--sel-accent-soft`, and the foundation tokens instead.

## sel-standards.css — updated

The shared visual standards file has been aligned with the master SEL dark UI system.

Changes:
- Removed its competing `:root` colour palette.
- Removed the bright `#00D7E8` cyan definition.
- Removed the old navy/teal/cream palette definitions.
- `sel-theme.css` is now the single owner of colour tokens.
- Primary buttons use `--sel-accent`.
- Dark buttons use `--sel-brand-blue`.
- Map buttons use `--sel-brand-teal`; this does not alter cartographic Map ID colours.
- Download buttons use `--sel-warm`.
- Outline buttons now use the restrained SEL border/accent system.
- Back-to-top control uses the new dark/teal system.
- Component focus states use `--sel-accent-soft`.
- No map ID colour was changed.

