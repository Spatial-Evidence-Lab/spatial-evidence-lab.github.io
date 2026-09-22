# Spatial Evidence Lab — Package 03

## Purpose
Locks the canonical project data architecture and final seven-domain / nineteen-theme taxonomy.

## Canonical source
- `/content/projects.json`
- `/content/taxonomy.json`
- `/content/research_domains.json`

## Project contract
All 14 projects contain one research domain, exactly three theme tags, one place/location, and one status. Project coordinates are synchronized to the current specification.

## Compatibility copies
The root `projects.json` / `taxonomy.json` files and the `/resources/` copies are retained as synchronized compatibility copies only. The public catalogue JavaScript reads `/content/`.

## Also updated
- `js/sel-projects.js`
- `resources/js/sel-projects.js`
- both legacy `project-catalogue.js` copies
