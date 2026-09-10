/* =========================================================
   SPATIAL EVIDENCE LAB
   PROJECT CATALOGUE
   Taxonomy-aware catalogue rendering and filtering
   ========================================================= */

(function () {
    "use strict";

    const grid = document.querySelector("[data-project-grid]");
    const filterBar = document.querySelector("[data-project-filters]");

    if (!grid) return;

    const PROJECTS_URL = "../projects.json";
    const TAXONOMY_URL = "../taxonomy.json";

    let projects = [];
    let taxonomy = null;

    /* =====================================================
       HELPERS
       ===================================================== */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normaliseKey(value) {
        return String(value ?? "")
            .trim()
            .toLowerCase();
    }

    function getResearchDomain(project) {
        return project &&
            project.researchDomain &&
            typeof project.researchDomain === "object"
            ? project.researchDomain
            : null;
    }

    function getProjectDomainKey(project) {
        const domain = getResearchDomain(project);

        return domain && domain.key
            ? normaliseKey(domain.key)
            : "";
    }

    function getProjectDomainName(project) {
        const domain = getResearchDomain(project);

        return domain && domain.name
            ? domain.name
            : "Unclassified";
    }

    /* =====================================================
       TAXONOMY VALIDATION
       ===================================================== */

    function validateTaxonomy(data) {
        const errors = [];

        if (!data || typeof data !== "object") {
            errors.push("taxonomy.json is not a valid JSON object.");
            return errors;
        }

        if (!Array.isArray(data.researchDomains)) {
            errors.push("taxonomy.json is missing researchDomains.");
            return errors;
        }

        const domainKeys = new Set();
        const domainCodes = new Set();

        data.researchDomains.forEach((domain, domainIndex) => {
            const prefix = `researchDomains[${domainIndex}]`;

            if (!domain.code) {
                errors.push(`${prefix} is missing code.`);
            }

            if (!domain.name) {
                errors.push(`${prefix} is missing name.`);
            }

            if (!domain.key) {
                errors.push(`${prefix} is missing key.`);
            }

            if (domain.code) {
                if (domainCodes.has(domain.code)) {
                    errors.push(`Duplicate research domain code: ${domain.code}`);
                }

                domainCodes.add(domain.code);
            }

            if (domain.key) {
                if (domainKeys.has(domain.key)) {
                    errors.push(`Duplicate research domain key: ${domain.key}`);
                }

                domainKeys.add(domain.key);
            }

            if (!Array.isArray(domain.themes)) {
                errors.push(`${prefix}.themes must be an array.`);
                return;
            }

            const themeKeys = new Set();
            const themeCodes = new Set();

            domain.themes.forEach((theme, themeIndex) => {
                const themePrefix = `${prefix}.themes[${themeIndex}]`;

                if (!theme.code) {
                    errors.push(`${themePrefix} is missing code.`);
                }

                if (!theme.name) {
                    errors.push(`${themePrefix} is missing name.`);
                }

                if (!theme.key) {
                    errors.push(`${themePrefix} is missing key.`);
                }

                if (theme.code) {
                    if (themeCodes.has(theme.code)) {
                        errors.push(
                            `Duplicate theme code within ${domain.code}: ${theme.code}`
                        );
                    }

                    themeCodes.add(theme.code);
                }

                if (theme.key) {
                    if (themeKeys.has(theme.key)) {
                        errors.push(
                            `Duplicate theme key within ${domain.code}: ${theme.key}`
                        );
                    }

                    themeKeys.add(theme.key);
                }

                if (!Array.isArray(theme.subThemes)) {
                    errors.push(`${themePrefix}.subThemes must be an array.`);
                    return;
                }

                const subThemeKeys = new Set();
                const subThemeCodes = new Set();

                theme.subThemes.forEach((subTheme, subThemeIndex) => {
                    const subPrefix =
                        `${themePrefix}.subThemes[${subThemeIndex}]`;

                    if (!subTheme.code) {
                        errors.push(`${subPrefix} is missing code.`);
                    }

                    if (!subTheme.name) {
                        errors.push(`${subPrefix} is missing name.`);
                    }

                    if (!subTheme.key) {
                        errors.push(`${subPrefix} is missing key.`);
                    }

                    if (subTheme.code) {
                        if (subThemeCodes.has(subTheme.code)) {
                            errors.push(
                                `Duplicate sub-theme code within ${theme.code}: ${subTheme.code}`
                            );
                        }

                        subThemeCodes.add(subTheme.code);
                    }

                    if (subTheme.key) {
                        if (subThemeKeys.has(subTheme.key)) {
                            errors.push(
                                `Duplicate sub-theme key within ${theme.code}: ${subTheme.key}`
                            );
                        }

                        subThemeKeys.add(subTheme.key);
                    }
                });
            });
        });

        return errors;
    }

    /* =====================================================
       PROJECT VALIDATION
       ===================================================== */

    function validateProjects(data) {
        const errors = [];

        if (!Array.isArray(data)) {
            errors.push("projects.json must contain an array.");
            return errors;
        }

        const projectIDs = new Set();

        data.forEach((project, index) => {
            const prefix = `projects[${index}]`;

            if (!project.id) {
                errors.push(`${prefix} is missing id.`);
            }

            if (!project.title) {
                errors.push(`${prefix} is missing title.`);
            }

            if (!project.researchDomain) {
                errors.push(`${prefix} is missing researchDomain.`);
            } else {
                if (!project.researchDomain.code) {
                    errors.push(`${prefix}.researchDomain is missing code.`);
                }

                if (!project.researchDomain.name) {
                    errors.push(`${prefix}.researchDomain is missing name.`);
                }

                if (!project.researchDomain.key) {
                    errors.push(`${prefix}.researchDomain is missing key.`);
                }
            }

            if (project.id) {
                if (projectIDs.has(project.id)) {
                    errors.push(`Duplicate project ID: ${project.id}`);
                }

                projectIDs.add(project.id);
            }
        });

        return errors;
    }

    /* =====================================================
       CROSS-VALIDATION
       ===================================================== */

    function validateProjectTaxonomyRelationships(projectList, taxonomyData) {
        const errors = [];

        if (
            !taxonomyData ||
            !Array.isArray(taxonomyData.researchDomains)
        ) {
            return errors;
        }

        const taxonomyDomains = new Map(
            taxonomyData.researchDomains.map(domain => [
                normaliseKey(domain.key),
                domain
            ])
        );

        projectList.forEach(project => {
            const domain = getResearchDomain(project);

            if (!domain) return;

            const taxonomyDomain =
                taxonomyDomains.get(normaliseKey(domain.key));

            if (!taxonomyDomain) {
                errors.push(
                    `${project.id}: researchDomain "${domain.key}" does not exist in taxonomy.json.`
                );

                return;
            }

            if (
                domain.code &&
                taxonomyDomain.code &&
                domain.code !== taxonomyDomain.code
            ) {
                errors.push(
                    `${project.id}: researchDomain code "${domain.code}" does not match taxonomy code "${taxonomyDomain.code}".`
                );
            }

            if (
                domain.name &&
                taxonomyDomain.name &&
                domain.name !== taxonomyDomain.name
            ) {
                errors.push(
                    `${project.id}: researchDomain name "${domain.name}" does not match taxonomy name "${taxonomyDomain.name}".`
                );
            }
        });

        return errors;
    }

    /* =====================================================
       VALIDATION REPORT
       ===================================================== */

    function reportValidation(errors) {
        if (!errors.length) {
            console.info(
                "[SEL] Taxonomy validation passed."
            );

            console.info(
                `[SEL] ${projects.length} project records loaded.`
            );

            return true;
        }

        console.error(
            "[SEL] Taxonomy validation failed:"
        );

        errors.forEach(error => {
            console.error(`[SEL] ${error}`);
        });

        return false;
    }

    /* =====================================================
       FILTER CREATION
       ===================================================== */

    function createFilterButtons() {
        if (!filterBar || !taxonomy) return;

        const domains = [...taxonomy.researchDomains]
            .sort(
                (a, b) =>
                    Number(a.displayOrder || 999) -
                    Number(b.displayOrder || 999)
            );

        filterBar.innerHTML = `
            <button
                class="filter-button active"
                type="button"
                data-filter="all"
                aria-pressed="true">
                All
            </button>
        `;

        domains.forEach(domain => {
            const button = document.createElement("button");

            button.className = "filter-button";
            button.type = "button";
            button.dataset.filter = domain.key;
            button.setAttribute("aria-pressed", "false");
            button.textContent = domain.name;

            filterBar.appendChild(button);
        });
    }

    /* =====================================================
       PROJECT CARD
       ===================================================== */

    function createProjectCard(project) {
        const domain = getResearchDomain(project);

        const domainName = domain
            ? domain.name
            : "Unclassified";

        const domainKey = domain
            ? domain.key
            : "";

        const themeName =
            project.theme && project.theme.name
                ? project.theme.name
                : "";

        const subThemeName =
            project.subTheme && project.subTheme.name
                ? project.subTheme.name
                : "";

        const geography =
            project.geography || "";

        const status =
            project.status || "";

        const title =
            project.title || "";

        const summary =
            project.summary || "";

        const image =
            project.image || "";

        const url =
            project.url || "#";

        return `
            <a
                class="catalogue-card"
                href="${escapeHTML(url)}"
                data-domain="${escapeHTML(domainKey)}"
                data-domain-name="${escapeHTML(domainName)}"
                data-theme="${escapeHTML(themeName)}"
                data-subtheme="${escapeHTML(subThemeName)}">

                <div class="catalogue-image">
                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(title)}"
                        loading="lazy">
                </div>

                <div class="catalogue-body">

                    <div class="catalogue-meta">
                        <span>${escapeHTML(project.id)}</span>
                        <span>${escapeHTML(status)}</span>
                    </div>

                    <p class="catalogue-domain">
                        ${escapeHTML(domainName)}
                    </p>

                    <h2>${escapeHTML(title)}</h2>

                    <p>${escapeHTML(summary)}</p>

                    <div class="catalogue-context">

                        ${
                            themeName
                                ? `<span>${escapeHTML(themeName)}</span>`
                                : ""
                        }

                        ${
                            subThemeName
                                ? `<span>${escapeHTML(subThemeName)}</span>`
                                : ""
                        }

                        ${
                            geography
                                ? `<span>${escapeHTML(geography)}</span>`
                                : ""
                        }

                    </div>

                    <span class="catalogue-link">
                        View project →
                    </span>

                </div>
            </a>
        `;
    }

    /* =====================================================
       RENDER PROJECTS
       ===================================================== */

    function renderProjects(list) {
        if (!list.length) {
            grid.innerHTML = `
                <div
                    class="empty-state"
                    style="display:block">
                    No projects match this research domain.
                </div>
            `;

            return;
        }

        grid.innerHTML = list
            .map(createProjectCard)
            .join("");
    }

    /* =====================================================
       FILTER PROJECTS
       ===================================================== */

    function filterProjects(filter) {
        const selectedFilter =
            normaliseKey(filter);

        const cards =
            [...grid.querySelectorAll(".catalogue-card")];

        cards.forEach(card => {
            const cardDomain =
                normaliseKey(card.dataset.domain);

            const visible =
                selectedFilter === "all" ||
                cardDomain === selectedFilter;

            card.classList.toggle(
                "hidden",
                !visible
            );

            card.setAttribute(
                "aria-hidden",
                visible ? "false" : "true"
            );
        });
    }

    /* =====================================================
       FILTER EVENTS
       ===================================================== */

    function initialiseFilters() {
        if (!filterBar) return;

        filterBar.addEventListener("click", event => {
            const button =
                event.target.closest("[data-filter]");

            if (!button) return;

            const filter =
                button.dataset.filter || "all";

            filterBar
                .querySelectorAll("[data-filter]")
                .forEach(btn => {
                    const active =
                        btn === button;

                    btn.classList.toggle(
                        "active",
                        active
                    );

                    btn.setAttribute(
                        "aria-pressed",
                        active ? "true" : "false"
                    );
                });

            filterProjects(filter);
        });
    }

    /* =====================================================
       LOAD JSON
       ===================================================== */

    async function loadJSON(url) {
        const response =
            await fetch(url, {
                cache: "no-cache"
            });

        if (!response.ok) {
            throw new Error(
                `Could not load ${url} (${response.status})`
            );
        }

        return response.json();
    }

    /* =====================================================
       INITIALISE
       ===================================================== */

    async function initialiseCatalogue() {
        try {
            const results =
                await Promise.all([
                    loadJSON(PROJECTS_URL),
                    loadJSON(TAXONOMY_URL)
                ]);

            projects = results[0];
            taxonomy = results[1];

            const validationErrors = [
                ...validateProjects(projects),
                ...validateTaxonomy(taxonomy),
                ...validateProjectTaxonomyRelationships(
                    projects,
                    taxonomy
                )
            ];

            const valid =
                reportValidation(validationErrors);

            if (!valid) {
                grid.innerHTML = `
                    <div
                        class="empty-state"
                        style="display:block">
                        The project catalogue contains taxonomy errors.
                        Please check the browser console.
                    </div>
                `;

                return;
            }

            createFilterButtons();

            renderProjects(projects);

            initialiseFilters();

        } catch (error) {
            console.error(
                "[SEL] Catalogue loading error:",
                error
            );

            grid.innerHTML = `
                <div
                    class="empty-state"
                    style="display:block">
                    Project catalogue could not be loaded.
                    Please refresh the page.
                </div>
            `;
        }
    }

    initialiseCatalogue();

})();
