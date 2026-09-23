# Spatial Evidence Lab — Website Architecture

## Canonical CSS ownership

The organisation website uses one CSS architecture:

```text
assets/css/
├── design-system.css   # tokens: colour, typography, spacing, radius, shadows, motion
├── layout.css          # global shell, containers, grids, page frame, responsive layout
├── components.css      # reusable buttons, shared cards/section heading, back-to-top
├── navigation.css      # site header and navigation
├── footer.css          # site footer
├── home.css            # Home-only layout and content presentation
├── projects.css        # Projects-only layout and catalogue presentation
├── methods.css         # Methods-only layout and content presentation
├── data.css            # Data-only layout and content presentation
└── about.css           # About-only layout and content presentation
```

`components.css` must not contain page-specific Home, Projects, Methods, Data or About styles, nor navigation/footer implementations.

## Content ownership

| Content | Home | Projects | Methods | Data | About |
|---|---|---|---|---|---|
| SEL identity | Brief | — | — | — | Primary |
| Research domains | Overview | Filters | — | Data categories | Definitions |
| Geographic scope | Overview | Project locations | — | Dataset coverage | Explanation |
| Six-stage workflow | Short version | — | Primary | — | — |
| Analytical methods | — | Project-specific | Primary | — | — |
| Research quality | — | — | Primary | — | — |
| Research principles | — | — | Technical implementation | — | Primary |
| Data landscape | — | Project data | — | Primary | — |
| Data sources | — | Project sources | — | Primary | — |
| Provenance | — | Project metadata | — | Primary | — |
| Licensing | — | Project-specific | — | Primary | — |
| Featured research | Primary | Primary | — | — | — |
| Project catalogue | — | Primary | — | — | — |

This table is the site's content-governance model. New content should be placed according to this ownership rather than duplicated across pages.

## Repository structure

The root `/resources/` directory was a duplicate organisation-site tree. It is not referenced by the canonical organisation pages or current project pages. It is therefore retired from the organisation-site architecture. The separate `resources/` folders generated inside individual project webmaps are project assets and must remain in place.
