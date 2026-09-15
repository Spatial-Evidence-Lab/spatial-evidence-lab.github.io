window.SEL_MAP_CONFIG = {
  "project": {
    "id": "SEL-002",
    "title": "Bandon Public Transport Accessibility Analysis",
    "geography": "CSO Small Areas",
    "reference": "Census 2022"
  },
  "layers": [
    {
      "id": "InterventionPriority_1",
      "variable": "lyr_InterventionPriority_1",
      "title": "Intervention Priority",
      "group": "Equity",
      "default": true,
      "legend": [
        [
          "Critical",
          "#743C68"
        ],
        [
          "High Concern",
          "#B26239"
        ],
        [
          "Concern",
          "#D99A2B"
        ],
        [
          "Emerging",
          "#D5BF71"
        ],
        [
          "Neutral",
          "#F9F6A1"
        ]
      ]
    },
    {
      "id": "BandonPublicTransportAccessibilityAnalysis_2",
      "variable": "lyr_BandonPublicTransportAccessibilityAnalysis_2",
      "title": "Accessibility & Vulnerability",
      "group": "Analysis",
      "default": true
    },
    {
      "id": "Study_boundary_3",
      "variable": "lyr_Study_boundary_3",
      "title": "Study Boundary",
      "group": "Reference",
      "default": true
    },
    {
      "id": "Busstop_4",
      "variable": "lyr_Busstop_4",
      "title": "Bus Stops",
      "group": "Reference",
      "default": true
    }
  ],
  "search": {
    "layerVariable": "lyr_BandonPublicTransportAccessibilityAnalysis_2",
    "fields": [
      "Small Area ID",
      "Electoral Division"
    ],
    "zoom": 15
  },
  "popup": {
    "title": "Bandon Accessibility Evidence",
    "nullLabel": "Not available"
  },
  "measure": {
    "projection": "EPSG:3857",
    "geodesic": true
  }
};
