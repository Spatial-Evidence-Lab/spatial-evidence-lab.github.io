(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    const cfg = window.SEL_MAP_CONFIG || {};
    const sidebar = document.getElementById("map-sidebar");
    const openBtn = document.getElementById("sidebar-open");
    const closeBtn = document.getElementById("sidebar-close");
    const controls = document.getElementById("layer-controls");
    const legend = document.getElementById("custom-legend");
    const input = document.getElementById("layer-search");
    const searchBtn = document.getElementById("layer-search-btn");
    const status = document.getElementById("search-status");
    const measureOutput = document.getElementById("measure-output");

    function toggleSidebar(open) {
      if (!sidebar) return;
      sidebar.classList.toggle("is-open", open);
      if (openBtn) openBtn.setAttribute("aria-expanded", String(open));
    }
    if (openBtn) openBtn.addEventListener("click", () => toggleSidebar(true));
    if (closeBtn) closeBtn.addEventListener("click", () => toggleSidebar(false));

    const getLayer = (item) => window[item.variable];

    function buildLayerControls() {
      if (!controls || !cfg.layers) return;
      controls.innerHTML = "";
      let group = "";
      cfg.layers.forEach((item, index) => {
        if (item.group !== group) {
          group = item.group;
          const heading = document.createElement("div");
          heading.className = "layer-group";
          heading.textContent = group;
          controls.appendChild(heading);
        }
        const layer = getLayer(item);
        if (!layer) return;
        layer.setVisible(item.default !== false);
        const row = document.createElement("div");
        row.className = "layer-control";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = layer.getVisible();
        checkbox.id = "layer-toggle-" + index;
        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = item.title;
        checkbox.addEventListener("change", () => layer.setVisible(checkbox.checked));
        row.appendChild(checkbox);
        row.appendChild(label);
        controls.appendChild(row);
      });
    }

    function addLegendItem(label, color, outline) {
      const row = document.createElement("div");
      row.className = "legend-item";
      const swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.style.background = color;
      if (outline) swatch.style.border = "2px solid " + outline;
      const text = document.createElement("span");
      text.textContent = label;
      row.appendChild(swatch);
      row.appendChild(text);
      legend.appendChild(row);
    }

    function buildLegend() {
      if (!legend) return;
      legend.innerHTML = "";
      const priority = cfg.layers && cfg.layers.find(x => x.id === "InterventionPriority_1");
      if (priority && priority.legend) {
        const title = document.createElement("div");
        title.className = "layer-group";
        title.textContent = "Intervention priority";
        legend.appendChild(title);
        priority.legend.forEach(item => addLegendItem(item[0], item[1]));
      }
      const note = document.createElement("p");
      note.className = "control-help";
      note.textContent = "The accessibility layer is interrogated through feature popups; map colours remain those produced by the QGIS 4.2.2 export.";
      legend.appendChild(note);
    }

    function featuresForLayer(item) {
      const layer = getLayer(item);
      if (!layer || !layer.getSource || !layer.getSource().getFeatures) return [];
      return layer.getSource().getFeatures();
    }

    function searchFeatures(term) {
      const searchCfg = cfg.search || {};
      const layer = window[searchCfg.layerVariable];
      if (!layer || !layer.getSource) {
        status.textContent = "Search layer unavailable.";
        return;
      }
      const q = term.trim().toLowerCase();
      if (!q) {
        status.textContent = "Enter a Small Area ID or Electoral Division.";
        return;
      }
      const fields = searchCfg.fields || [];
      const matches = layer.getSource().getFeatures().filter(feature =>
        fields.some(field => String(feature.get(field) ?? "").toLowerCase().includes(q))
      );
      if (!matches.length) {
        status.textContent = "No matching Small Area or Electoral Division found.";
        return;
      }
      const feature = matches[0];
      const geometry = feature.getGeometry();
      if (geometry && window.map) {
        const view = window.map.getView();
        const extent = geometry.getExtent();
        view.fit(extent, { duration: 500, padding: [120, 380, 120, 420], maxZoom: searchCfg.zoom || 15 });
      }
      status.textContent = matches.length + " match" + (matches.length === 1 ? "" : "es") + " found. Showing the first result.";
      feature.set("_selSearchMatch", true);
      setTimeout(() => feature.set("_selSearchMatch", false), 1800);
    }

    if (searchBtn) searchBtn.addEventListener("click", () => searchFeatures(input.value));
    if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") searchFeatures(input.value); });

    /* Measurement controls use native OpenLayers interactions and a temporary
       vector layer. This deliberately sits outside the qgis2web generated
       layer list so the generated data and styles remain untouched. */
    let measureLayer = null;
    let drawInteraction = null;

    function ensureMeasureLayer() {
      if (!window.map || !window.ol) return null;
      if (measureLayer) return measureLayer;
      measureLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        zIndex: 999,
        properties: { name: "SEL measurement layer" }
      });
      map.addLayer(measureLayer);
      return measureLayer;
    }

    function formatDistance(line) {
      const sphere = new ol.Sphere(6371008.8);
      const coords = line.getCoordinates();
      let metres = 0;
      for (let i = 1; i < coords.length; i++) {
        metres += sphere.haversineDistance(
          ol.proj.toLonLat(coords[i - 1]),
          ol.proj.toLonLat(coords[i])
        );
      }
      return metres < 1000 ? metres.toFixed(0) + " m" : (metres / 1000).toFixed(2) + " km";
    }

    function formatArea(polygon) {
      const sphere = new ol.Sphere(6371008.8);
      const ring = polygon.getLinearRing(0).getCoordinates();
      const lonLat = ring.map(c => ol.proj.toLonLat(c));
      const area = Math.abs(sphere.geodesicArea(lonLat));
      return area < 10000 ? area.toFixed(0) + " m²" : (area / 1000000).toFixed(3) + " km²";
    }

    function startMeasure(type) {
      if (!window.map || !window.ol) return;
      const layer = ensureMeasureLayer();
      if (!layer) return;
      if (drawInteraction) map.removeInteraction(drawInteraction);
      const geometryType = type === "area" ? "Polygon" : "LineString";
      drawInteraction = new ol.interaction.Draw({ source: layer.getSource(), type: geometryType });
      drawInteraction.on("drawend", function (event) {
        const geom = event.feature.getGeometry();
        measureOutput.textContent = type === "area" ? "Area: " + formatArea(geom) : "Distance: " + formatDistance(geom);
        map.removeInteraction(drawInteraction);
        drawInteraction = null;
      });
      map.addInteraction(drawInteraction);
      measureOutput.textContent = type === "area" ? "Click to draw an area; double-click to finish." : "Click to draw a line; double-click to finish.";
    }

    function clearMeasure() {
      if (drawInteraction && window.map) map.removeInteraction(drawInteraction);
      drawInteraction = null;
      if (measureLayer) measureLayer.getSource().clear();
      if (measureOutput) measureOutput.textContent = "No measurement";
    }

    document.querySelectorAll("[data-tool]").forEach(button => {
      button.addEventListener("click", function () {
        const tool = button.getAttribute("data-tool");
        if (tool === "distance" || tool === "area") startMeasure(tool);
        if (tool === "clear") clearMeasure();
      });
    });

    /* Popup title enhancement. qgis2web remains responsible for feature
       discovery and field construction; this hook adds a stable publication
       heading without replacing the generated content. */
    function enhancePopup() {
      const content = document.getElementById("popup-content");
      if (!content || !content.innerHTML) return;
      if (content.querySelector(".sel-popup-title")) return;
      const title = document.createElement("div");
      title.className = "sel-popup-title";
      title.textContent = (cfg.popup && cfg.popup.title) || "Bandon Accessibility Evidence";
      content.insertBefore(title, content.firstChild);
    }
    if (window.map) {
      window.map.on("singleclick", function () { setTimeout(enhancePopup, 0); });
    }

    buildLayerControls();
    buildLegend();
  });
})();