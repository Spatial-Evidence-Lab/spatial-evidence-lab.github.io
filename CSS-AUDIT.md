# SEL-002 CSS audit — three-file stack → one file

## Files reviewed

| File | Role (as written) | Problems |
|------|-------------------|----------|
| `project-sel002.css` | Primary publication stylesheet | Solid base; good tokens, atlas, dark findings, responsive rules |
| `project-sel002-redesign.css` | Editorial palette + atlas controls overrides | **Re-declares almost every token** with different values; conflicts with base; adds headline strip, method-diagram, limitations-accordion that the final HTML no longer needs in the same form |
| `project-sel002-refinements.css` | Homepage frame alignment + gallery grid | Forces frame width; makes section heads italic; restores a **gallery grid** that competes with the carousel; uses `--sel-*` / `--p-*` tokens that are not defined in the SEL-002 stack |

## Concrete conflicts fixed by consolidation

1. **Token drift**  
   Base uses `--sel002-ink: #172A3A`, redesign switches to `#17231F`, different greens, service/vulnerability colours, and a different blue. Cascading both files made accent colours unpredictable.

2. **Atlas vs gallery**  
   Base defines `.atlas-viewer` (carousel). Refinements force `.map-gallery-grid { display: grid !important }` and ignore the carousel when both are present. The rewritten page uses **only the carousel**.

3. **Section-head layout**  
   Base uses a two-column grid for section heads. Refinements override to `display: flex; flex-direction: column` and italic titles. Consolidated file keeps the cleaner column layout from refinements (eyebrow → title → intro) without the italic override unless desired.

4. **Findings table colour**  
   Redesign set the hotspot table to light background inside the dark band (`background: #FCFCF8; color: #17231F`), which broke the dark-band design. Consolidated version keeps the dark table styling from the base file.

5. **Output card featured span**  
   Redesign reset `.output-card.featured` to single-cell sizing; base had a 2×2 span. Consolidated keeps a simple featured top-border treatment (no grid span) so the six-card outputs grid stays even.

6. **Unused / dead rules removed**  
   - `.headline-evidence-strip` / `.headline-metrics-grid` (metrics now live in Overview)  
   - `.method-diagram` branching diagram (page uses the simpler `.method-flow`)  
   - `.limitations-accordion` (boundaries are always-visible grid)  
   - Side-TOC rules already marked `display: none`

## Result

**One file:** `/home/workdir/artifacts/project-sel002.css`

- Single token set (forest/navy identity from the original base).  
- Carousel atlas fully styled (index, stage, caption, controls).  
- Dark findings band preserved.  
- Homepage-aligned frame via `--sel002-gutter` / `--sel002-frame`.  
- No competing gallery grid.  
- Responsive breakpoints for tablet (≤1050px) and mobile (≤760px).  
- Reduced-motion support.

## Deployment note

Replace the three linked stylesheets in the page `<head>` with a single:

```html
<link rel="stylesheet" href="/assets/css/pages/project-sel002.css">
```

Delete or archive `project-sel002-redesign.css` and `project-sel002-refinements.css` so they cannot override the consolidated file again.
