# Spatial Evidence Lab — Site Unification Audit
## 24 September 2026

### Canonical reference

The Methods page is the visual and structural reference for the shared site shell:

- Header/footer: identical markup across all primary pages.
- HERO hierarchy: eyebrow → title → italic subtitle → regular description → metadata/CTA.
- SECTION hierarchy: numbered title → italic subtitle → regular description → content.
- Typography weights: site name 500; hero eyebrow 600; hero title 700; section number/title 600; body 400; metadata 500.
- Inter is the site font and the same 400/500/600/700/800 font set is loaded across pages.

### Canonical files

- `assets/css/design-system.css` — global tokens/reset.
- `assets/css/layout.css` — global shell/layout.
- `assets/css/components.css` — reusable components and component typography.
- `assets/css/navigation.css` — navigation.
- `assets/css/footer.css` — footer.
- `assets/css/sel-section-system.css` — **single HERO + SECTION hierarchy**.
- `assets/css/project.css` — project-page layout/content components.
- `assets/css/sel-002-publication.css` — SEL-002 publication-specific map/report modules only.
- `js/sel-site.js` — shared page behaviour.
- `js/sel-projects.js` — project catalogue filtering/rendering.
- `content/projects.json` — single project catalogue source.
- `content/taxonomy.json` — single taxonomy/status source.

### Conflicts removed

The retired `css/` design-system package and `js/legacy/` were removed. This eliminates the previous competing token, layout, component, navigation and page systems.

Removed duplicate catalogue/template sources:

- root `projects.json`
- root `taxonomy.json`
- `content/projects/SEL-001.json`
- `content/projects/SEL-002.json`
- `content/projects/SEL-003.json`
- `content/research_domains.json`
- `content/projects/_template/`
- duplicate Bandon `projects/sel-002-bandon-public-transport/project.css`

Removed unused duplicate branding/project imagery that was not referenced by the active site.

Retired package/design-system documentation that described the old system was removed so it cannot be mistaken for the current implementation.

The individual SEL-002 webmap `resources/` directory was **not** removed.

### Status vocabulary

The project catalogue now uses only:

- `Exploratory`
- `In development`
- `Published`
- `Archived`

Legacy portfolio/status terminology has been removed from the catalogue.

Current mapping:

- SEL-001 → Published
- SEL-002 → Published
- SEL-003–SEL-007 → In development
- SEL-008–SEL-014 → Exploratory

Exploratory project pages use the requested research-record wording:
> Initial spatial research record. Detailed analysis and outputs will be added as the project develops.

### Geography metadata

Every project record now carries:

- LOCATION
- GEOGRAPHIC TYPE
- ANALYTICAL SCALE
- RESEARCH DOMAIN
- SUBTHEME
- STATUS

The previous mixed presentation of geography scope/level/research labels has been replaced in project-page presentation by this controlled metadata block.

### Project titles

Project titles were normalised to:

**[Place] + [subject] + [analytical purpose]**

Examples:

- Ireland Quality of Life Spatial Index
- Bandon Public Transport Accessibility and Equity Analysis
- West Cork Public Transport Accessibility Analysis
- Ireland Forestry and Land Use Spatial Analysis
- Greater Athens Heat Risk and Environmental Quality Assessment
- County Wicklow Wind Energy Potential Assessment
- Rondônia Deforestation and Forest Loss Analysis
- Europe Forest Change Analysis, 2017–2025
- Glover, Vermont Solar Energy Potential Assessment
- Miami Coastal Inundation Impact Assessment
- Ireland Household Renewable Energy Potential Analysis
- California Wildfire Impact Assessment
- Dublin Urban Activity and Footfall Analysis
- Ireland Population Distribution Spatial Analysis

### Project structures

**Exploratory / research-record pages**
1. Overview
2. Study area
3. Research focus
4. Themes
5. Status
6. Reproducibility

**Published/substantive pages**
1. Overview
2. Study area
3. Data
4. Method
5. Evidence
6. Findings
7. Outputs
8. Interpretation
9. Reproducibility
10. Related research

Optional modules remain available for published work, including interactive maps, map atlases, policy material, technical appendices and downloads.

### Page-specific changes

- Home: Geographic Scope wording changed to “From local places to international case studies” and the requested supporting text.
- Projects: geographic-scope section/map removed defensively; catalogue now uses the shared section hierarchy.
- Methods/Data/About: shared hierarchy retained and made canonical rather than independently styled.
- SEL-001: retained substantive index evidence while normalising hero, metadata and section labels.
- SEL-002: retained publication/map/report evidence while normalising hero, metadata, core section sequence and optional modules.
- SEL-003–SEL-014: simplified to the exploratory six-section research-record structure.

### Verification

Automated repository checks completed:

- 19 primary pages audited.
- Header markup identical across all 19 primary pages apart from active navigation state.
- Footer markup identical across all 19 primary pages.
- No missing active absolute CSS/JS/image references after corrections.
- No `Flagship`, `Report Published`, or `Completed` legacy status labels remain in visible primary-page text.
- `projects/index.html` contains no Geographic Scope section.
- Catalogue contains 14 projects and no `portfolioRole` field.
- Individual webmap assets were preserved.
