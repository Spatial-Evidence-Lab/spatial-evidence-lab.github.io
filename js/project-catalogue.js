(function () {
  'use strict';

  /*
   * Spatial Evidence Lab
   * Project Catalogue
   *
   * Reads project metadata from:
   *   /projects.json
   *
   * Expected taxonomy structure:
   *   project.researchDomain.code
   *   project.researchDomain.name
   *   project.researchDomain.key
   *
   * Also supports:
   *   project.theme
   *   project.subTheme
   *   project.geographicScope
   *   project.geographicLevel
   *   project.status
   *   project.portfolioRole
   */

  const grid = document.querySelector('[data-project-grid]');

  // Do nothing on pages without the project catalogue.
  if (!grid) return;

  /*
   * Resolve the projects.json path.
   *
   * The catalogue page is normally:
   *   /projects/
   *
   * Therefore ../projects.json resolves to:
   *   /projects.json
   */
  const PROJECTS_URL = '../projects.json';

  /*
   * Basic HTML escaping.
   *
   * Project metadata comes from JSON. Escaping prevents characters
   * such as &, < and > from being interpreted as HTML.
   */
  function escapeHTML(value) {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /*
   * Convert an array into readable text.
   *
   * Example:
   * ["National", "County", "Small Area"]
   *
   * becomes:
   * "National · County · Small Area"
   */
  function formatArray(value) {
    if (!Array.isArray(value)) {
      return '';
    }

    return value
      .filter(Boolean)
      .map(escapeHTML)
      .join(' · ');
  }

  /*
   * Create a safe URL.
   *
   * The current project catalogue uses relative or root-relative URLs.
   */
  function getProjectURL(project) {
    if (!project || !project.url) {
      return '#';
    }

    return project.url;
  }

  /*
   * Create one catalogue card.
   */
  function createProjectCard(project) {
    const researchDomain = project.researchDomain || {};
    const theme = project.theme || {};
    const subTheme = project.subTheme || {};
    const geographicScope = project.geographicScope || {};

    const domainKey = researchDomain.key || '';
    const domainName = researchDomain.name || 'Research';

    const themeName = theme.name || '';
    const subThemeName = subTheme.name || '';

    const geographyLevel = formatArray(project.geographicLevel);

    const image = project.image || '';
    const title = project.title || 'Untitled project';
    const summary = project.summary || '';

    const status = project.status || '';
    const portfolioRole = project.portfolioRole || '';

    const geography = project.geography || '';
    const geographyType = project.geographyType || '';

    const taxonomyLine = [
      themeName,
      subThemeName
    ]
      .filter(Boolean)
      .map(escapeHTML)
      .join(' · ');

    const geographyLine = [
      geography,
      geographyType
    ]
      .filter(Boolean)
      .map(escapeHTML)
      .join(' · ');

    return `
      <a
        class="catalogue-card"
        href="${escapeHTML(getProjectURL(project))}"
        data-domain="${escapeHTML(domainKey)}"
        data-domain-name="${escapeHTML(domainName)}"
        data-theme="${escapeHTML(theme.key || '')}"
        data-subtheme="${escapeHTML(subTheme.key || '')}"
        data-status="${escapeHTML(status)}"
        data-portfolio-role="${escapeHTML(project.portfolioRole || '')}"
      >

        <div class="catalogue-image">
          ${
            image
              ? `
                <img
                  src="${escapeHTML(image)}"
                  alt="${escapeHTML(title)}"
                  loading="lazy"
                >
              `
              : ''
          }
        </div>

        <div class="catalogue-body">

          <div class="catalogue-meta">
            <span>${escapeHTML(project.id || '')}</span>
            ${
              status
                ? `<span>${escapeHTML(status)}</span>`
                : ''
            }
          </div>

          <div class="catalogue-domain">
            ${escapeHTML(domainName)}
          </div>

          <h2>${escapeHTML(title)}</h2>

          ${
            taxonomyLine
              ? `
                <div class="catalogue-taxonomy">
                  ${taxonomyLine}
                </div>
              `
              : ''
          }

          ${
            summary
              ? `<p>${escapeHTML(summary)}</p>`
              : ''
          }

          ${
            geographyLine
              ? `
                <div class="catalogue-geography">
                  ${geographyLine}
                </div>
              `
              : ''
          }

          ${
            geographyLevel
              ? `
                <div class="catalogue-level">
                  ${geographyLevel}
                </div>
              `
              : ''
          }

          ${
            portfolioRole
              ? `
                <div class="catalogue-role">
                  ${escapeHTML(portfolioRole)}
                </div>
              `
              : ''
          }

          <span class="catalogue-link">
            View project →
          </span>

        </div>
      </a>
    `;
  }

  /*
   * Render the complete catalogue.
   */
  function renderProjects(projects) {
    if (!Array.isArray(projects) || projects.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="display:block">
          No projects are currently available.
        </div>
      `;

      return;
    }

    grid.innerHTML = projects
      .map(createProjectCard)
      .join('');
  }

  /*
   * Build the research-domain filters.
   *
   * Existing HTML filter buttons are supported.
   *
   * Example:
   *
   * <button data-filter="all">All</button>
   * <button data-filter="people-quality-of-life">
   *   People & Quality of Life
   * </button>
   *
   * The value of data-filter must match:
   *
   * project.researchDomain.key
   */
  function initialiseFilters() {
    const buttons = [
      ...document.querySelectorAll('[data-filter]')
    ];

    const cards = [
      ...grid.querySelectorAll('.catalogue-card')
    ];

    if (!buttons.length || !cards.length) {
      return;
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {

        // Remove active state from every filter.
        buttons.forEach(function (item) {
          item.classList.remove('active');
          item.setAttribute('aria-pressed', 'false');
        });

        // Activate selected filter.
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');

        const filter = button.dataset.filter || 'all';

        cards.forEach(function (card) {

          const cardDomain = card.dataset.domain || '';

          const shouldShow =
            filter === 'all' ||
            cardDomain === filter;

          card.classList.toggle(
            'hidden',
            !shouldShow
          );

          /*
           * Keep accessibility state consistent with visual state.
           */
          card.setAttribute(
            'aria-hidden',
            shouldShow ? 'false' : 'true'
          );
        });
      });
    });
  }

  /*
   * Automatically create research-domain filters if the page
   * contains a filter container.
   *
   * Expected HTML:
   *
   * <div data-project-filters></div>
   *
   * This is optional.
   *
   * If you already have filter buttons in projects/index.html,
   * the script will use those instead.
   */
  function createDomainFilters(projects) {
    const container = document.querySelector(
      '[data-project-filters]'
    );

    if (!container || !Array.isArray(projects)) {
      return;
    }

    /*
     * Collect unique research domains.
     */
    const domains = [];

    projects.forEach(function (project) {
      const domain = project.researchDomain;

      if (!domain || !domain.key) {
        return;
      }

      const exists = domains.some(function (item) {
        return item.key === domain.key;
      });

      if (!exists) {
        domains.push({
          code: domain.code || '',
          name: domain.name || domain.key,
          key: domain.key
        });
      }
    });

    /*
     * Sort alphabetically by display name.
     */
    domains.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    /*
     * Always provide an All Projects button.
     */
    container.innerHTML = `
      <button
        type="button"
        class="filter-button active"
        data-filter="all"
        aria-pressed="true"
      >
        All Projects
      </button>

      ${domains
        .map(function (domain) {
          return `
            <button
              type="button"
              class="filter-button"
              data-filter="${escapeHTML(domain.key)}"
              aria-pressed="false"
            >
              ${escapeHTML(domain.name)}
            </button>
          `;
        })
        .join('')}
    `;
  }

  /*
   * Create optional taxonomy summary information.
   *
   * This allows the page to show how many projects belong
   * to each research domain.
   *
   * Expected HTML:
   *
   * <div data-domain-counts></div>
   *
   * This section is optional.
   */
  function renderDomainCounts(projects) {
    const container = document.querySelector(
      '[data-domain-counts]'
    );

    if (!container || !Array.isArray(projects)) {
      return;
    }

    const counts = {};

    projects.forEach(function (project) {
      const domain = project.researchDomain;

      if (!domain || !domain.key) {
        return;
      }

      if (!counts[domain.key]) {
        counts[domain.key] = {
          name: domain.name || domain.key,
          count: 0
        };
      }

      counts[domain.key].count += 1;
    });

    const entries = Object.keys(counts)
      .map(function (key) {
        return {
          key: key,
          name: counts[key].name,
          count: counts[key].count
        };
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

    container.innerHTML = entries
      .map(function (item) {
        return `
          <div
            class="domain-count"
            data-domain="${escapeHTML(item.key)}"
          >
            <span class="domain-count-name">
              ${escapeHTML(item.name)}
            </span>

            <span class="domain-count-number">
              ${item.count}
            </span>
          </div>
        `;
      })
      .join('');
  }

  /*
   * Add project count if an element exists.
   *
   * Expected HTML:
   *
   * <span data-project-count></span>
   */
  function renderProjectCount(projects) {
    const counter = document.querySelector(
      '[data-project-count]'
    );

    if (!counter || !Array.isArray(projects)) {
      return;
    }

    counter.textContent = projects.length;
  }

  /*
   * Main catalogue initialisation.
   */
  fetch(PROJECTS_URL, {
    cache: 'no-cache'
  })
    .then(function (response) {

      if (!response.ok) {
        throw new Error(
          'Unable to load projects.json: ' +
          response.status
        );
      }

      return response.json();
    })

    .then(function (projects) {

      /*
       * Basic validation.
       */
      if (!Array.isArray(projects)) {
        throw new Error(
          'projects.json must contain an array of projects.'
        );
      }

      /*
       * Remove invalid/null project records.
       */
      projects = projects.filter(function (project) {
        return project &&
          typeof project === 'object' &&
          project.id &&
          project.title;
      });

      /*
       * Render catalogue.
       */
      renderProjects(projects);

      /*
       * Optional automatically generated filters.
       */
      createDomainFilters(projects);

      /*
       * Initialise filters after cards exist.
       */
      initialiseFilters();

      /*
       * Optional domain counts.
       */
      renderDomainCounts(projects);

      /*
       * Optional total project count.
       */
      renderProjectCount(projects);
    })

    .catch(function (error) {

      console.error(
        'Spatial Evidence Lab project catalogue error:',
        error
      );

      grid.innerHTML = `
        <div
          class="empty-state"
          style="display:block"
          role="alert"
        >
          Project catalogue could not be loaded.
          Please refresh the page.
        </div>
      `;
    });

})();
