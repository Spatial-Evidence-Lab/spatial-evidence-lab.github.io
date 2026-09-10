(function () {
'use strict';

const grid = document.querySelector('[data-project-grid]');
const filterContainer = document.querySelector('[data-project-filters]');

if (!grid) {
console.error(
'Spatial Evidence Lab: [data-project-grid] was not found.'
);
return;
}

const PROJECTS_URL = '../projects.json';
const TAXONOMY_URL = '../taxonomy.json';

function escapeHTML(value) {
return String(value ?? '')
.replace(/&/g, '&')
.replace(/</g, '<')
.replace(/>/g, '>')
.replace(/"/g, '"')
.replace(/'/g, ''');
}

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

  if (
    taxonomy &&
    Array.isArray(taxonomy.researchDomains)
  ) {
    const matchingDomain =
      taxonomy.researchDomains.find(function (domain) {
        return (
          domain.code === project.researchDomain.code &&
          domain.key === project.researchDomain.key
        );
      });

    if (!matchingDomain) {
      errors.push(
        'researchDomain "' +
          project.researchDomain.code +
          '" does not exist in taxonomy.json.'
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

if (!Array.isArray(project.geographicLevel)) {
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

function renderProject(project) {
const domainKey =
project.researchDomain &&
project.researchDomain.key
? project.researchDomain.key
: '';

const domainName =
  project.researchDomain &&
  project.researchDomain.name
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

      <h2>
        ${escapeHTML(project.title)}
      </h2>

      <p>
        ${escapeHTML(project.summary)}
      </p>

      <div class="catalogue-taxonomy">

        ${
          project.theme
            ? `
              <span>
                ${escapeHTML(project.theme.name)}
              </span>
            `
            : ''
        }

        ${
          project.subTheme
            ? `
              <span>
                ${escapeHTML(project.subTheme.name)}
              </span>
            `
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

function showError(message) {
grid.innerHTML = <div class="empty-state" style="display:block" role="alert" > ${escapeHTML(message)} </div> ;
}

function buildFilters(taxonomy) {
if (!filterContainer) {
console.warn(
'Spatial Evidence Lab: [data-project-filters] was not found.'
);
return;
}

if (
  !taxonomy ||
  !Array.isArray(taxonomy.researchDomains)
) {
  throw new Error(
    'taxonomy.json does not contain researchDomains.'
  );
}

const domains = taxonomy.researchDomains
  .slice()
  .sort(function (a, b) {
    return (
      (a.displayOrder || 999) -
      (b.displayOrder || 999)
    );
  });

filterContainer.innerHTML = `
  <button
    type="button"
    class="filter-button active"
    data-filter="all"
    aria-pressed="true"
  >
    All
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

function initialiseFilters() {
if (!filterContainer) {
return;
}

const buttons = Array.from(
  filterContainer.querySelectorAll('[data-filter]')
);

const cards = Array.from(
  grid.querySelectorAll('.catalogue-card')
);

console.info(
  'Spatial Evidence Lab: initialising filters.',
  {
    buttons: buttons.length,
    cards: cards.length
  }
);

if (!buttons.length) {
  console.warn(
    'Spatial Evidence Lab: no filter buttons found.'
  );
  return;
}

if (!cards.length) {
  console.warn(
    'Spatial Evidence Lab: no project cards found.'
  );
  return;
}

buttons.forEach(function (button) {

  button.addEventListener('click', function (event) {

    event.preventDefault();

    const selectedFilter =
      this.getAttribute('data-filter');

    console.log(
      'Spatial Evidence Lab: filter selected:',
      selectedFilter
    );

    /*
     * Update button state.
     */
    buttons.forEach(function (btn) {

      const isActive =
        btn === button;

      btn.classList.toggle(
        'active',
        isActive
      );

      btn.setAttribute(
        'aria-pressed',
        isActive ? 'true' : 'false'
      );

    });

    /*
     * Filter project cards.
     */
    let visibleCount = 0;

    cards.forEach(function (card) {

      const cardDomain =
        card.getAttribute('data-domain');

      const showCard =
        selectedFilter === 'all' ||
        cardDomain === selectedFilter;

      /*
       * Use both the hidden property and
       * the hidden attribute so the filtering
       * does not depend on CSS implementation.
       */
      card.hidden = !showCard;

      if (showCard) {
        card.removeAttribute('aria-hidden');
        visibleCount++;
      } else {
        card.setAttribute(
          'aria-hidden',
          'true'
        );
      }

      console.log(
        'Project:',
        cardDomain,
        '→',
        showCard ? 'SHOW' : 'HIDE'
      );

    });

    console.info(
      'Spatial Evidence Lab:',
      visibleCount,
      'projects visible for filter:',
      selectedFilter
    );

  });

});


}

/*

Load projects and taxonomy.
*/
Promise.all([
fetch(PROJECTS_URL, {
cache: 'no-cache'
}),
fetch(TAXONOMY_URL, {
  cache: 'no-cache'
})


])

.then(async function (responses) {

  const projectsResponse = responses[0];
  const taxonomyResponse = responses[1];

  if (!projectsResponse.ok) {
    throw new Error(
      'Could not load projects.json (' +
      projectsResponse.status +
      ').'
    );
  }

  if (!taxonomyResponse.ok) {
    throw new Error(
      'Could not load taxonomy.json (' +
      taxonomyResponse.status +
      ').'
    );
  }

  const projects =
    await projectsResponse.json();

  const taxonomy =
    await taxonomyResponse.json();

  return {
    projects: projects,
    taxonomy: taxonomy
  };
})

.then(function (data) {

  const projects = data.projects;
  const taxonomy = data.taxonomy;

  /*
   * Validate projects.json.
   */
  if (!Array.isArray(projects)) {
    throw new Error(
      'projects.json must contain an array.'
    );
  }

  /*
   * Validate taxonomy.json.
   */
  if (
    !taxonomy ||
    !Array.isArray(taxonomy.researchDomains)
  ) {
    throw new Error(
      'taxonomy.json must contain researchDomains.'
    );
  }

  /*
   * Validate every project.
   */
  const validationErrors = [];

  projects.forEach(function (project) {

    const errors =
      validateProject(
        project,
        taxonomy
      );

    if (errors.length) {
      validationErrors.push({
        id: project && project.id
          ? project.id
          : 'UNKNOWN',

        errors: errors
      });
    }

  });

  /*
   * Stop if validation fails.
   */
  if (validationErrors.length) {

    console.group(
      'Spatial Evidence Lab — Catalogue Validation'
    );

    validationErrors.forEach(function (item) {

      console.group(
        '❌ ' + item.id
      );

      item.errors.forEach(function (error) {
        console.error(error);
      });

      console.groupEnd();

    });

    console.groupEnd();

    showError(
      'The project catalogue contains validation errors. Please check the browser console.'
    );

    return;
  }

  /*
   * Successful validation.
   */
  console.info(
    'Spatial Evidence Lab: ' +
    projects.length +
    ' projects validated successfully.'
  );

  /*
   * Build taxonomy-driven filters.
   */
  buildFilters(taxonomy);

  /*
   * Render project cards.
   */
  grid.innerHTML = projects
    .map(renderProject)
    .join('');

  /*
   * Initialise filtering AFTER
   * cards and buttons exist.
   */
  initialiseFilters();

})

.catch(function (error) {

  console.error(
    'Spatial Evidence Lab project catalogue error:',
    error
  );

  showError(
    'Project catalogue could not be loaded. Please refresh the page or check the browser console.'
  );

});


})();
