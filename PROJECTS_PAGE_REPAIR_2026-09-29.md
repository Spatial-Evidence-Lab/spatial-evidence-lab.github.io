# Projects Page Repair — 2026-09-29

## Root cause
The Projects page contained the HTML placeholders for the featured projects and catalogue, but the page did not contain the `[data-project-catalogue]` root expected by `js/sel-projects.js`. The JavaScript therefore returned immediately. In addition, the script had no renderer for `[data-featured-projects]`, so the featured grid could never populate.

## Repair
- Added a single `[data-project-catalogue]` root around the Projects page content.
- Added explicit `/content/projects.json` and `/content/taxonomy.json` data attributes.
- Rebuilt `js/sel-projects.js` so it renders the three defined featured projects: SEL-001, SEL-002 and SEL-003.
- Restored catalogue card rendering for all 14 projects.
- Restored live search.
- Restored multi-select filter controls with checkbox/tick selection.
- Restored filters for Research domain, Theme, Location, Geographic level and Status.
- Restored active-filter chips and Clear all behaviour.
- Made Location a genuine multi-select filter as previously specified.
- Adjusted desktop filter toolbar to five columns, with responsive 3-column and 1-column layouts.
- Fixed the malformed footer text span in the project index.

## Validation
- `node --check js/sel-projects.js` passes.
- `projects.json` contains 14 projects.
- Project index contains one doctype, one head and one body.
- Featured and catalogue data hooks are present.
- Local image paths used by the project cards exist in the repository.

## Note
The live GitHub Pages URL could not be fetched by the available web renderer during this repair, so rendered live-site verification was not possible. The repair was validated against the exact patched repository source and its project/taxonomy data.
