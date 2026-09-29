/* ==========================================================
   SPATIAL EVIDENCE LAB — PROJECT CATALOGUE

   Owns the Projects landing page only:
   - Featured projects
   - Project catalogue
   - Search
   - Multi-select filters
   - Filter state and cards

   Data sources:
   /content/projects.json
   /content/taxonomy.json
   ========================================================== */

(function () {
    "use strict";

    const catalogue = document.querySelector("[data-project-catalogue]");
    if (!catalogue) return;

    const projectsURL = catalogue.dataset.projectsUrl || "/content/projects.json";
    const taxonomyURL = catalogue.dataset.taxonomyUrl || "/content/taxonomy.json";

    const featuredGrid = catalogue.querySelector("[data-featured-projects]");
    const grid = catalogue.querySelector("[data-project-grid]");
    const count = catalogue.querySelector("[data-project-count]");
    const emptyState = catalogue.querySelector("[data-project-empty]");
    const filterToolbar = catalogue.querySelector("[data-filter-toolbar]");
    const searchInput = catalogue.querySelector("[data-project-search]");
    const activeFiltersEl = catalogue.querySelector("[data-active-filters]");
    const mobileToggle = catalogue.querySelector("[data-mobile-filter-toggle]");
    const mobileToggleCount = catalogue.querySelector("[data-active-filter-count]");

    if (!grid) return;

    let projects = [];
    let taxonomy = {};
    let filterState = {};
    let openFilter = null;

    const FILTERS = [
        { key: "researchDomain", label: "Research domain", type: "objectName", source: "researchDomains" },
        { key: "theme", label: "Theme", type: "themeName", source: "themes" },
        { key: "location", label: "Location", type: "locationName" },
        { key: "geographicLevel", label: "Geographic level", type: "array" },
        { key: "status", label: "Status", type: "array", source: "statusDefinitions" }
    ];

    const featuredIds = ["SEL-001", "SEL-002", "SEL-003"];

    const escapeHTML = (value) => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const valuesFor = (project, filter) => {
        const raw = project[filter.key];

        if (filter.type === "objectName") {
            return raw && raw.name ? [raw.name] : [];
        }

        if (filter.type === "themeName") {
            return Array.isArray(raw) ? raw.map(v => v && v.name).filter(Boolean) : [];
        }

        if (filter.type === "locationName") {
            return raw && raw.name ? [raw.name] : [];
        }

        if (filter.type === "array") {
            return Array.isArray(raw) ? raw.map(v => typeof v === "object" && v ? v.name : v).filter(Boolean) : (raw ? [raw] : []);
        }

        return [];
    };

    const searchableText = (project) => {
        const themes = valuesFor(project, { key: "theme", type: "themeName" });
        const domain = valuesFor(project, { key: "researchDomain", type: "objectName" });
        const location = valuesFor(project, { key: "location", type: "locationName" });
        return [
            project.id,
            project.title,
            project.summary,
            project.geography,
            project.geographicType,
            project.analyticalScale,
            project.status,
            project.tags,
            project.subTheme,
            project.theme,
            themes,
            domain,
            location,
            project.metadata
        ].flat(Infinity).filter(Boolean).join(" ").toLowerCase();
    };

    const taxonomyValues = (filter) => {
        const source = filter.source && taxonomy[filter.source];
        if (!Array.isArray(source)) return [];
        return source.map(item => typeof item === "object" && item ? item.name : item).filter(Boolean);
    };

    const uniqueProjectValues = (filter) => {
        const values = new Set();
        projects.forEach(project => valuesFor(project, filter).forEach(value => values.add(value)));
        const preferred = taxonomyValues(filter);
        const ordered = preferred.filter(value => values.has(value));
        [...values].sort((a, b) => a.localeCompare(b)).forEach(value => {
            if (!ordered.includes(value)) ordered.push(value);
        });
        return ordered;
    };

    const projectMatches = (project) => {
        const query = (searchInput?.value || "").trim().toLowerCase();
        if (query && !searchableText(project).includes(query)) return false;

        return FILTERS.every(filter => {
            const selected = filterState[filter.key] || [];
            if (!selected.length) return true;
            const values = valuesFor(project, filter);
            return selected.some(value => values.includes(value));
        });
    };

    const filteredProjects = () => projects.filter(projectMatches);

    const renderFeatured = () => {
        if (!featuredGrid) return;
        const selected = featuredIds
            .map(id => projects.find(project => project.id === id))
            .filter(Boolean);

        featuredGrid.innerHTML = "";

        if (!selected.length) return;

        const primary = selected[0];
        featuredGrid.appendChild(createFeaturedCard(primary, "primary"));

        const secondaryColumn = document.createElement("div");
        secondaryColumn.className = "featured-secondary-column";
        selected.slice(1, 3).forEach(project => {
            secondaryColumn.appendChild(createFeaturedCard(project, "secondary"));
        });
        featuredGrid.appendChild(secondaryColumn);
    };

    const createFeaturedCard = (project, size) => {
        const article = document.createElement("a");
        article.className = `featured-project featured-project--${size}`;
        article.href = project.url || "#";

        const domain = valuesFor(project, { key: "researchDomain", type: "objectName" })[0] || "";
        const location = valuesFor(project, { key: "location", type: "locationName" })[0] || project.geography || "";
        const image = project.image || "";

        article.innerHTML = `
            ${image ? `<img class="featured-project-image" src="${escapeHTML(image)}" alt="" loading="lazy">` : ""}
            <div class="featured-project-body">
                <div>
                    <span class="featured-project-id">${escapeHTML(project.id)}</span>
                    <span class="featured-project-status">${escapeHTML(project.status || "")}</span>
                </div>
                <p class="featured-project-domain">${escapeHTML(domain)} · ${escapeHTML(location)}</p>
                <h3>${escapeHTML(project.title)}</h3>
                <p class="featured-project-description">${escapeHTML(project.summary || "")}</p>
                <span class="featured-project-link">View project →</span>
            </div>
        `;
        return article;
    };

    const createProjectCard = (project) => {
        const article = document.createElement("article");
        article.className = "project-card";
        article.dataset.projectId = project.id || "";

        const domain = valuesFor(project, { key: "researchDomain", type: "objectName" })[0] || "";
        const location = valuesFor(project, { key: "location", type: "locationName" })[0] || project.geography || "";
        const theme = valuesFor(project, { key: "theme", type: "themeName" })[0] || "";
        const image = project.image || "";

        article.innerHTML = `
            <a class="project-card-link" href="${escapeHTML(project.url || "#")}">
                ${image ? `<div class="project-card-image-wrap"><img class="project-card-image" src="${escapeHTML(image)}" alt="" loading="lazy"></div>` : ""}
                <div class="project-card-body">
                    <div class="project-card-meta-top">
                        <span class="project-card-id">${escapeHTML(project.id)}</span>
                        <span class="project-card-status">${escapeHTML(project.status || "")}</span>
                    </div>
                    <p class="project-card-domain">${escapeHTML(domain)}${theme ? ` · ${escapeHTML(theme)}` : ""}</p>
                    <h3>${escapeHTML(project.title || "Untitled project")}</h3>
                    ${project.summary ? `<p class="project-card-description">${escapeHTML(project.summary)}</p>` : ""}
                    <div class="project-card-bottom">
                        <span class="project-card-location">${escapeHTML(location)}</span>
                        <span class="project-card-link">View project →</span>
                    </div>
                </div>
            </a>
        `;
        return article;
    };

    const updateCount = (visible) => {
        if (count) count.textContent = `${visible.length} ${visible.length === 1 ? "project" : "projects"}`;
        if (emptyState) emptyState.hidden = visible.length !== 0;
    };

    const renderProjects = () => {
        const visible = filteredProjects();
        grid.innerHTML = "";
        visible.forEach(project => grid.appendChild(createProjectCard(project)));
        updateCount(visible);
        renderActiveFilters();
    };

    const renderActiveFilters = () => {
        if (!activeFiltersEl) return;
        activeFiltersEl.innerHTML = "";
        const active = [];

        FILTERS.forEach(filter => {
            (filterState[filter.key] || []).forEach(value => active.push({ filter, value }));
        });

        if (!active.length) {
            activeFiltersEl.hidden = true;
            if (mobileToggleCount) mobileToggleCount.textContent = "0";
            return;
        }

        activeFiltersEl.hidden = false;
        const label = document.createElement("span");
        label.className = "active-filters-label";
        label.textContent = "Selected";
        activeFiltersEl.appendChild(label);

        active.forEach(({ filter, value }) => {
            const chip = document.createElement("span");
            chip.className = "filter-chip";
            chip.innerHTML = `${escapeHTML(value)} <button type="button" aria-label="Remove ${escapeHTML(value)} filter">×</button>`;
            chip.querySelector("button").addEventListener("click", () => {
                filterState[filter.key] = (filterState[filter.key] || []).filter(item => item !== value);
                syncFilterControls();
                renderProjects();
            });
            activeFiltersEl.appendChild(chip);
        });

        const clear = document.createElement("button");
        clear.type = "button";
        clear.className = "filter-clear-all";
        clear.textContent = "Clear all";
        clear.addEventListener("click", clearFilters);
        activeFiltersEl.appendChild(clear);

        if (mobileToggleCount) mobileToggleCount.textContent = String(active.length);
    };

    const closeOpenFilter = () => {
        if (!openFilter) return;
        const panel = openFilter.querySelector(".filter-panel");
        const trigger = openFilter.querySelector(".filter-trigger");
        if (panel) panel.hidden = true;
        if (trigger) trigger.setAttribute("aria-expanded", "false");
        openFilter = null;
    };

    const makeFilter = (filter) => {
        const wrap = document.createElement("div");
        wrap.className = "filter-popover";
        wrap.dataset.filterKey = filter.key;

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "filter-trigger";
        trigger.setAttribute("aria-expanded", "false");
        trigger.innerHTML = `
            <span class="filter-trigger-label">${escapeHTML(filter.label)}</span>
            <span class="filter-trigger-summary">All</span>
            <span class="filter-trigger-chevron" aria-hidden="true">⌄</span>
        `;

        const panel = document.createElement("div");
        panel.className = "filter-panel";
        panel.hidden = true;
        panel.setAttribute("role", "group");
        panel.setAttribute("aria-label", filter.label);

        const values = uniqueProjectValues(filter);
        if (!values.length) {
            panel.innerHTML = `<div class="filter-panel-empty">No values available.</div>`;
        } else {
            const heading = document.createElement("p");
            heading.className = "filter-panel-heading";
            heading.textContent = "Select one or more";
            panel.appendChild(heading);

            values.forEach(value => {
                const label = document.createElement("label");
                label.className = "filter-option";
                label.innerHTML = `
                    <input type="checkbox" value="${escapeHTML(value)}">
                    <span class="filter-option-label">${escapeHTML(value)}</span>
                    <span class="filter-option-count"></span>
                `;
                const checkbox = label.querySelector("input");
                checkbox.addEventListener("change", () => {
                    const selected = new Set(filterState[filter.key] || []);
                    checkbox.checked ? selected.add(value) : selected.delete(value);
                    filterState[filter.key] = [...selected];
                    updateFilterTrigger(wrap, filter);
                    renderProjects();
                });
                panel.appendChild(label);
            });
        }

        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            if (openFilter && openFilter !== wrap) closeOpenFilter();
            const isOpen = !panel.hidden;
            panel.hidden = isOpen;
            trigger.setAttribute("aria-expanded", String(!isOpen));
            openFilter = isOpen ? null : wrap;
        });

        wrap.appendChild(trigger);
        wrap.appendChild(panel);
        return wrap;
    };

    const updateFilterTrigger = (wrap, filter) => {
        const selected = filterState[filter.key] || [];
        const trigger = wrap.querySelector(".filter-trigger");
        const summary = wrap.querySelector(".filter-trigger-summary");
        trigger?.classList.toggle("is-active", selected.length > 0);
        if (summary) {
            summary.textContent = selected.length === 0
                ? "All"
                : selected.length === 1
                    ? selected[0]
                    : `${selected.length} selected`;
        }
    };

    const initialiseFilters = () => {
        if (!filterToolbar) return;
        filterToolbar.innerHTML = "";
        FILTERS.forEach(filter => {
            filterState[filter.key] = [];
            filterToolbar.appendChild(makeFilter(filter));
        });
        syncFilterControls();
    };

    const syncFilterControls = () => {
        FILTERS.forEach(filter => {
            const wrap = filterToolbar?.querySelector(`[data-filter-key="${CSS.escape(filter.key)}"]`);
            if (!wrap) return;
            const selected = new Set(filterState[filter.key] || []);
            wrap.querySelectorAll("input[type=checkbox]").forEach(input => {
                input.checked = selected.has(input.value);
            });
            updateFilterTrigger(wrap, filter);
        });
    };

    const clearFilters = () => {
        FILTERS.forEach(filter => { filterState[filter.key] = []; });
        if (searchInput) searchInput.value = "";
        syncFilterControls();
        renderProjects();
    };

    searchInput?.addEventListener("input", renderProjects);

    mobileToggle?.addEventListener("click", () => {
        const isOpen = filterToolbar.classList.toggle("is-open");
        mobileToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
        if (openFilter && !openFilter.contains(event.target)) closeOpenFilter();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeOpenFilter();
    });

    const loadCatalogue = async () => {
        try {
            const [projectsResponse, taxonomyResponse] = await Promise.all([
                fetch(projectsURL, { cache: "no-store" }),
                fetch(taxonomyURL, { cache: "no-store" })
            ]);

            if (!projectsResponse.ok || !taxonomyResponse.ok) {
                throw new Error("Unable to load project catalogue data.");
            }

            projects = await projectsResponse.json();
            taxonomy = await taxonomyResponse.json();

            initialiseFilters();
            renderFeatured();
            renderProjects();
        } catch (error) {
            console.error("SEL project catalogue:", error);
            if (featuredGrid) featuredGrid.innerHTML = "";
            grid.innerHTML = "";
            if (emptyState) {
                emptyState.hidden = false;
                emptyState.textContent = "Project catalogue could not be loaded.";
            }
        }
    };

    window.SELProjects = {
        getProjects: () => projects,
        getFilteredProjects: filteredProjects,
        getTaxonomy: () => taxonomy,
        getFilters: () => JSON.parse(JSON.stringify(filterState)),
        render: renderProjects,
        clearFilters
    };

    loadCatalogue();
})();
