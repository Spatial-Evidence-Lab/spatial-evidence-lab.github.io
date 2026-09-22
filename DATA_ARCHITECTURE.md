# Spatial Evidence Lab — Canonical Data Architecture

## Source of truth

The public site reads structured catalogue data only from:

- `/content/projects.json` — 14 project records
- `/content/taxonomy.json` — 7 research domains and the 19-theme vocabulary
- `/content/research_domains.json` — explicit domain catalogue

`js/sel-projects.js` loads the project and taxonomy data from `/content/`.

## Compatibility copies

The root `projects.json` / `taxonomy.json` files and the copies under `/resources/` are retained only as synchronized compatibility copies during the transition. They are not the canonical source and public catalogue code must not read them.

## Project data contract

Every project record has:

- one research domain
- exactly three theme tags
- one geographic place/location
- one publication status

The geographic coordinates in the 14 records are synchronized with the current project-location specification.

## Taxonomy

Seven research domains and 19 unique themes are represented. Each domain contains exactly three theme placements; some themes are intentionally shared across domains.
