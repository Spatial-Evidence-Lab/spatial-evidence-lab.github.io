/* ==========================================================
   SPATIAL EVIDENCE LAB
   PROJECT CATALOGUE JAVASCRIPT

   Responsibilities:
   - Project catalogue
   - projects.json
   - taxonomy.json
   - Filters
   - Project cards
   - Filter state
   - Catalogue map/filter behaviour

   Does NOT handle:
   - Publication pages
   - Map atlas
   - Lightbox
   - Global navigation
   - Header state
   ========================================================== */

(function () {
    "use strict";


    /* ======================================================
       01. CATALOGUE INITIALISATION
       ====================================================== */

    const catalogue =
        document.querySelector(
            "[data-project-catalogue]"
        );

    if (!catalogue) {
        return;
    }


    /* ======================================================
       02. CONFIGURATION
       ====================================================== */

    const projectsURL =
        catalogue.dataset.projectsUrl ||
        "/content/projects.json";

    const taxonomyURL =
        catalogue.dataset.taxonomyUrl ||
        "/content/taxonomy.json";


    /* ======================================================
       03. ELEMENTS
       ====================================================== */

    const grid =
        catalogue.querySelector(
            "[data-project-grid]"
        );

    const count =
        catalogue.querySelector(
            "[data-project-count]"
        );

    const emptyState =
        catalogue.querySelector(
            "[data-project-empty]"
        );

    const filters =
        Array.from(
            catalogue.querySelectorAll(
                "[data-project-filter]"
            )
        );


    if (!grid) {
        return;
    }


    /* ======================================================
       04. STATE
       ====================================================== */

    let projects = [];
    let taxonomy = {};
    let activeFilters = {};


    /* ======================================================
       05. NORMALISE DATA
       ====================================================== */

    const normaliseArray = (value) => {

        if (Array.isArray(value)) {
            return value;
        }

        if (
            typeof value === "string" &&
            value.trim()
        ) {
            return [value];
        }

        return [];
    };


    /* ======================================================
       06. LOAD DATA
       ====================================================== */

    const loadCatalogue = async () => {

        try {

            const [
                projectsResponse,
                taxonomyResponse
            ] = await Promise.all([
                fetch(projectsURL),
                fetch(taxonomyURL)
            ]);

            if (
                !projectsResponse.ok ||
                !taxonomyResponse.ok
            ) {
                throw new Error(
                    "Unable to load project catalogue data."
                );
            }

            projects =
                await projectsResponse.json();

            taxonomy =
                await taxonomyResponse.json();

            initialiseFilters();

            renderProjects();

        } catch (error) {

            console.error(
                "SEL project catalogue:",
                error
            );

            grid.innerHTML = "";

            if (emptyState) {
                emptyState.hidden = false;
                emptyState.textContent =
                    "Project catalogue could not be loaded.";
            }
        }
    };


    /* ======================================================
       07. FILTER INITIALISATION
       ====================================================== */

    const initialiseFilters = () => {

        filters.forEach((filter) => {

            const field =
                filter.dataset.projectFilter;

            if (!field) {
                return;
            }

            activeFilters[field] = "";

            /*
             * Populate filter options from the
             * project data rather than hardcoding
             * project-specific values.
             */

            const values = new Set();

            projects.forEach((project) => {

                normaliseArray(
                    project[field]
                ).forEach((value) => {
                    values.add(value);
                });

            });

            /*
             * Taxonomy can provide the preferred
             * ordering for domain/theme filters.
             */

            let orderedValues =
                Array.from(values).sort();

            if (
                taxonomy[field] &&
                Array.isArray(taxonomy[field])
            ) {
                orderedValues =
                    taxonomy[field].filter(
                        (value) =>
                            values.has(value)
                    );
            }

            orderedValues.forEach((value) => {

                const option =
                    document.createElement("option");

                option.value = value;
                option.textContent = value;

                filter.appendChild(option);
            });


            filter.addEventListener(
                "change",
                () => {

                    activeFilters[field] =
                        filter.value;

                    renderProjects();
                }
            );

        });
    };


    /* ======================================================
       08. FILTER PROJECTS
       ====================================================== */

    const filteredProjects = () => {

        return projects.filter(
            (project) => {

                return Object.entries(
                    activeFilters
                ).every(
                    ([field, value]) => {

                        if (!value) {
                            return true;
                        }

                        return normaliseArray(
                            project[field]
                        ).includes(value);
                    }
                );

            }
        );
    };


    /* ======================================================
       09. PROJECT CARD
       ====================================================== */

    const createProjectCard = (project) => {

        const article =
            document.createElement("article");

        article.className =
            "project-card";

        article.dataset.projectId =
            project.id || "";

        const title =
            project.title ||
            "Untitled project";

        const summary =
            project.summary ||
            "";

        const href =
            project.url ||
            project.path ||
            "#";

        article.innerHTML = `
            <a
                class="project-card-link"
                href="${href}"
            >

                <div class="project-card-content">

                    <span class="project-card-id">
                        ${project.id || ""}
                    </span>

                    <h3 class="project-card-title">
                        ${title}
                    </h3>

                    ${
                        summary
                            ? `<p class="project-card-summary">
                                ${summary}
                               </p>`
                            : ""
                    }

                </div>

            </a>
        `;

        return article;
    };


    /* ======================================================
       10. RENDER PROJECTS
       ====================================================== */

    const renderProjects = () => {

        const visibleProjects =
            filteredProjects();

        grid.innerHTML = "";

        visibleProjects.forEach(
            (project) => {
                grid.appendChild(
                    createProjectCard(project)
                );
            }
        );


        if (count) {
            count.textContent =
                visibleProjects.length;
        }


        if (emptyState) {
            emptyState.hidden =
                visibleProjects.length !== 0;
        }
    };


    /* ======================================================
       11. PUBLIC FILTER API
       ====================================================== */

    window.SELProjects = {

        getProjects() {
            return projects;
        },

        getFilteredProjects() {
            return filteredProjects();
        },

        getTaxonomy() {
            return taxonomy;
        },

        getFilters() {
            return {
                ...activeFilters
            };
        },

        render() {
            renderProjects();
        }

    };


    /* ======================================================
       12. START
       ====================================================== */

    loadCatalogue();

})();
