# Spatial Evidence Lab — Canonical Data Architecture

## Source of truth

The public site reads structured catalogue data only from:

- `/content/projects.json` — 14 canonical project records.
- `/content/taxonomy.json` — the controlled research domain, theme, geography and status vocabulary.
- `/js/sel-projects.js` — catalogue filtering and rendering logic.

There are no compatibility copies of the project catalogue or taxonomy in the repository root. Retired duplicate CSS, JavaScript and catalogue files have been removed.

## Compatibility copies

The root `content/projects.json` / `content/taxonomy.json` files and the copies under `/resources/` are retained only as synchronized compatibility copies during the transition. They are not the canonical source and public catalogue code must not read them.

## Project data contract

Every project record has:

- one research domain
- exactly three theme tags
- one geographic place/location
- one publication status

The geographic coordinates in the 14 records are synchronized with the current project-location specification.

## Taxonomy

Seven research domains and 19 unique themes are represented. Each domain contains exactly three theme placements; some themes are intentionally shared across domains.
