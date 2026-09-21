# SEL Canonical Layout Correction

## Canonical inheritance
Every primary page now loads, in this exact order:
1. `assets/css/design-system.css`
2. `assets/css/layout.css`
3. `assets/css/components.css`
4. `assets/css/navigation.css`
5. `assets/css/footer.css`
6. `assets/css/project.css` on project-detail pages

## Canonical page frame
- Desktop content max: 1200px
- Horizontal gutter: `clamp(16px, 2vw, 32px)`
- `.shell`, `.container`, `.container-wide`, and `.sel-shell` resolve to the same frame
- No `100vw` layout widths
- No page component may reset the shell to `max-width:none`
- Grid/flex children use `min-width:0` to prevent content-driven overflow

## Projects catalogue
The Projects page uses the same 1200px shell as Home, Methods, Data, Resources and About. The catalogue grid is constrained by that shell; it cannot extend beyond the page frame.

## Project detail pages
The shared project system is loaded before project-specific CSS. SEL-002's publication stylesheet no longer imports the old global design system or defines a separate 1240px page frame.
