# SEL-002 — Canonical map numbering / naming scheme

Atlas side-index is numbered **00–06**. Publication IDs remain **01.00–01.06**.

| Map ID | Atlas short name           | Map title                                  | Subtitle                                                              | Image stem (sequential)             |
|--------|----------------------------|--------------------------------------------|-----------------------------------------------------------------------|-------------------------------------|
| 01.00  | Network Baseline           | Base Context & Transit Infrastructure      | Bandon Built-Up Areas (BUA) and Network Baseline                      | SEL002_Map00_NetworkBaseline        |
| 01.01  | Walking Accessibility      | Physical Pedestrian Catchments             | Network-Based Isochronal Walkability Analysis                         | SEL002_Map01_ServiceFrequency       |
| 01.02  | Pedestrian Network         | Pedestrian Network Context                 | Footpath Coverage and Pedestrian Crossing Networks                    | SEL002_Map02_WalkingAccessibility   |
| 01.03  | Service Frequency          | Headway & Operational Frequency            | Peak-Period Transit Service Quality                                   | SEL002_Map03_Vulnerability          |
| 01.04  | Population Vulnerability   | Demographic Vulnerability & Demand         | Spatial Distribution of Relative Population Vulnerability             | SEL002_Map04_AccessDeficit          |
| 01.05  | Composite Accessibility    | Composite Accessibility Index (CAI)        | Combined Pedestrian Accessibility and Scheduled Service Availability  | SEL002_Map05_CompositeAccessibility |
| 01.06  | Final Screening            | Targeted Intervention Framework            | Spatial Screening Priorities for Further Investigation                | SEL002_Map06_InterventionPriority   |

## Evidence chain (UI)

`BASE CONTEXT → PEDESTRIAN CATCHMENTS → PEDESTRIAN NETWORK → HEADWAY & FREQUENCY → VULNERABILITY → CAI → TARGETED SCREENING`

## Atlas reading guide

- **01.00–01.02** Transport system — network, stops, walking-access conditions
- **01.03–01.05** Spatial condition — service, vulnerability, composite accessibility
- **01.06** Final screening — accessibility–vulnerability overlap

## Findings → map index

| Finding              | data-map-index | Opens      |
|----------------------|----------------|------------|
| Walking access       | 1              | 01.01      |
| Service availability | 3              | 01.03      |
| Vulnerability        | 4              | 01.04      |
| Access deficit / CAI | 5              | 01.05      |
| Spatial overlap      | 6              | 01.06      |

## Image path convention

- Page (webp): `/assets/maps/sel-002-bandon/page/{stem}.webp`
- Full (png):  `/assets/maps/sel-002-bandon/full/{stem}.png`

**Note:** Image stems remain sequential Map00–Map06 as deployed on the site.
If the on-disk map content does not match the new titles (e.g. Map01 file is still the service-frequency map), rename or regenerate assets so file content matches the title table above.
