# SEL project-page build guide

## 1. Start from the template

Copy:

`projects/_template/index.html`

to:

`projects/sel-XXX-project-slug/index.html`

## 2. Use the canonical URL pattern

`/projects/sel-XXX-project-slug/`

Do not create a new top-level project folder unless there is a technical reason.

## 3. Required project metadata

- Project ID
- Project title
- Research domain
- Country / region
- Analytical geography
- Reference year / period
- Status
- Hero image
- Short project description
- Research questions
- Methodology workflow
- Source datasets
- Verified evidence maps
- Findings
- Outputs
- Limitations
- Reproducibility information

## 4. Images

Project catalogue images are stored in:

`assets/projects/SEL-XXX.jpg`

Use **1600 × 900 px (16:9)** for all catalogue/hero images.

## 5. Evidence rule

Do not populate Findings, Metrics or Outputs with invented values. If an item is not verified, use a neutral placeholder during development and remove it before publication.

## 6. SEL-001 special case

The Quality of Life Index is the flagship index variant. Its methodology pipeline is:

`35 Indicators → Normalised Indicator Scores → URAF / Contextual Adjustment → Weighted Indicator Scores → 7 QOL Themes → Small Area QOL Index → 18,919 Small Areas`

The current page uses seven themes: Community, Environment, Health, Housing, Mobility, Socioeconomic and Walkability.

Before publication, verify the 35-indicator architecture against the authoritative database, indicator catalogue, maps and report.

## 7. SEL-002 special case

The Bandon page is the reference implementation for a completed spatial accessibility project. Its existing evidence maps and report have been copied to the canonical project route.

## 8. Adding a new project to the catalogue

Add one object to `projects.json`:

```json
{
  "id": "SEL-XXX",
  "title": "Project title",
  "domain": "Accessibility",
  "status": "Production",
  "summary": "Short evidence-based description.",
  "image": "/assets/projects/SEL-XXX.jpg",
  "url": "/projects/sel-XXX-project-slug/"
}
```

Then add the project page and verify all links before committing.
