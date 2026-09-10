(function () {
  'use strict';

  const grid = document.querySelector('[data-project-grid]');

  if (!grid) {
    return;
  }

  const PROJECTS_URL = '../projects.json';
  const TAXONOMY_URL = '../taxonomy.json';

  /**
   * Safely escape text before inserting it into HTML.
   */
  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Validate that a project has the expected taxonomy structure.
   */
  function validateProject(project, taxonomy) {
    const errors = [];

    if (!project || typeof project !== 'object') {
      return ['Project is not an object.'];
    }

    if (!project.id) {
      errors.push('Missing project id.');
    }

    if (!project.title) {
      errors.push('Missing project title.');
    }

    if (!project.researchDomain) {
      errors.push('Missing researchDomain.');
    } else {
      if (!project.researchDomain.code) {
        errors.push('Missing researchDomain.code.');
      }

      if (!project.researchDomain.name) {
        errors.push('Missing researchDomain.name.');
      }

      if (!project.researchDomain.key) {
        errors.push('Missing researchDomain.key.');
      }

      if (taxonomy && Array.isArray(taxonomy.researchDomains)) {
        const domainExists = taxonomy.researchDomains.some(
          domain =>
            domain.code === project.researchDomain.code &&
            domain.key === project.researchDomain.key
        );

        if (!domainExists) {
          errors.push(
            `researchDomain "${project.researchDomain.code}" does not exist in taxonomy.json.`
          );
        }
      }
    }

    if (!project.theme) {
      errors.push('Missing theme.');
    }

    if (!project.subTheme) {
      errors.push('Missing subTheme.');
    }

    if (!project.geographicScope) {
      errors.push('Missing geographicScope.');
    }

    if (!project.geographicLevel) {
      errors.push('Missing geographicLevel.');
    } else if (!Array.isArray(project.geographicLevel)) {
      errors.push('geographicLevel must be an array.');
    }

    if (!project.status) {
      errors.push('Missing status.');
    }

    if (!project.portfolioRole) {
      errors.push('Missing portfolioRole.');
    }

    if (!project.summary) {
      errors.push('Missing summary.');
    }

    if (!project.image) {
      errors.push('Missing image.');
    }

    if (!project.url) {
      errors.push('Missing url.');
    }

    return errors;
  }

  /**
   * Build a project card.
   */
  function renderProject(project) {
    const domainKey = project.researchDomain
      ? project.researchDomain.key
      : '';

    const domainName = project.researchDomain
      ? project.researchDomain.name
      : '';

    return `
      <a
        class="catalogue-card"
        href="${escapeHTML(project.url)}"
        data-domain="${escapeHTML(domainKey)}"
        data-research-domain="${escapeHTML(domainKey)}"
      >
        <div class="catalogue-image">
          <img
            src="${escapeHTML(project.image)}"
            alt="${escapeHTML(project.title)}"
            loading="lazy"
          >
        </div>

        <div class="catalogue-body">

          <div class="catalogue-meta">
            <span>${escapeHTML(project.id)}</span>
            <span>${escapeHTML(project.status)}</span>
          </div>

          <div class="catalogue-domain">
            ${escapeHTML(domainName)}
          </div>

          <h2>${escapeHTML(project.title)}</h2>

          <p>${escapeHTML(project.summary)}</p>

          <div class="catalogue-taxonomy">
            ${
              project.theme
                ? `<span>${escapeHTML(project.theme.name)}</span>`
                : ''
            }

            ${
              project.subTheme
                ? `<span>${escapeHTML(project.subTheme.name)}</span>`
                : ''
            }
          </div>

          <span class="catalogue-link">
            View project →
          </span>

        </div>
      </a>
    `;
  }

  /**
   * Display an error message inside the catalogue.
   */
  function showError(message) {
    grid.innerHTML = `
      <div
        class="empty-state"
        style="display:block"
        role="alert"
      >
        ${escapeHTML(message)}
      </div>
    `;
  }

  /**
   * Create filter buttons from taxonomy research domains.
   *
   * This does not redesign the filters yet.
   * It simply makes the existing filter system work
   * with researchDomain.key.
   */
  function buildFilters(taxonomy) {
    const filterContainer = document.querySelector('[data-project-filters]');

    if (!filterContainer) {
      return;
    }

    if (
      !taxonomy ||
      !Array.isArray(taxonomy.researchDomains)
    ) {
      return;
    }

    const domains = [...taxonomy.researchDomains]
      .sort((a, b) => {
        return (a.displayOrder || 999) - (b.displayOrder || 999);
      });

    filterContainer.innerHTML = `
      <button
        type="button"
        class="active"
        data-filter="all"
      >
        All research
      </button>

      ${domains.map(domain => `
        <button
          type="button"
          data-filter="${escapeHTML(domain.key)}"
        >
          ${escapeHTML(domain.name)}
        </button>
      `).join('')}
    `;
  }

  /**
   * Initialise filtering.
   */
  function initialiseFilters() {
    const buttons = [
      ...document.querySelectorAll('[data-filter]')
    ];

    const cards = [
      ...grid.querySelectorAll('.catalogue-card')
    ];

    buttons.forEach(button => {
      button.addEventListener('click', function () {
        buttons.forEach(btn => {
          btn.classList.remove('active');
        });

        this.classList.add('active');

        const filter = this.dataset.filter;

        cards.forEach(card => {
          const domain = card.dataset.domain;

          const shouldHide =
            filter !== 'all' &&
            domain !== filter;

          card.classList.toggle(
            'hidden',
            shouldHide
          );
        });
      });
    });
  }

  /**
   * Load projects and taxonomy together.
   */
  Promise.all([
    fetch(PROJECTS_URL),
    fetch(TAXONOMY_URL)
  ])
    .then(async ([projectsResponse, taxonomyResponse]) => {

      if (!projectsResponse.ok) {
        throw new Error(
          `Could not load projects.json (${projectsResponse.status}).`
        );
      }

      if (!taxonomyResponse.ok) {
        throw new Error(
          `Could not load taxonomy.json (${taxonomyResponse.status}).`
        );
      }

      const projects = await projectsResponse.json();
      const taxonomy = await taxonomyResponse.json();

      return {
        projects,
        taxonomy
      };
    })
    .then(({ projects, taxonomy }) => {

      /*
       * Basic JSON structure validation.
       */
      if (!Array.isArray(projects)) {
        throw new Error(
          'projects.json must contain an array of projects.'
        );
      }

      if (
        !taxonomy ||
        !Array.isArray(taxonomy.researchDomains)
      ) {
        throw new Error(
          'taxonomy.json must contain a researchDomains array.'
        );
      }

      /*
       * Validate every project.
       */
      const validationErrors = [];

      projects.forEach(project => {
        const errors = validateProject(
          project,
          taxonomy
        );

        if (errors.length) {
          validationErrors.push({
            id: project && project.id
              ? project.id
              : 'UNKNOWN',
            errors
          });
        }
      });

      /*
       * Log validation information.
       */
      if (validationErrors.length) {

        console.group(
          'Spatial Evidence Lab — Project Catalogue Validation'
        );

        validationErrors.forEach(item => {
          console.group(`❌ ${item.id}`);

          item.errors.forEach(error => {
            console.error(error);
          });

          console.groupEnd();
        });

        console.groupEnd();

        showError(
          'The project catalogue contains validation errors. Open the browser console for details.'
        );

        return;
      }

      console.info(
        `Spatial Evidence Lab: ${projects.length} projects validated successfully.`
      );

      /*
       * Build taxonomy-driven filters.
       */
      buildFilters(taxonomy);

      /*
       * Render catalogue.
       */
      grid.innerHTML = projects
        .map(renderProject)
        .join('');

      /*
       * Initialise filters after rendering.
       */
      initialiseFilters();
    })
    .catch(error => {

      console.error(
        'Spatial Evidence Lab project catalogue error:',
        error
      );

      showError(
        'Project catalogue could not be loaded. Please refresh the page or check the browser console.'
      );
    });

})();
