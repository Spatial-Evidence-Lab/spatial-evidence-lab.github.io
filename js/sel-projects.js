/* =========================================================
   SPATIAL EVIDENCE LAB — PROJECTS CATALOGUE
   Release 3.1 — compact multi-select filters + search
   ========================================================= */
(function () {
    'use strict';

    const featuredIds = ['SEL-001', 'SEL-002', 'SEL-004'];

    const THEME_GROUPS = [
        {
            label: 'QUALITY OF LIFE',
            keys: [
                'quality-of-life-wellbeing',
                'living-conditions',
                'household-conditions',
                'housing',
                'population-vulnerability'
            ]
        },
        {
            label: 'ACCESSIBILITY',
            keys: [
                'accessibility',
                'mobility',
                'infrastructure-planning',
                'regional-analysis'
            ]
        },
        {
            label: 'ENVIRONMENT',
            keys: [
                'environmental-quality',
                'forests-land-cover',
                'land-use',
                'climate-change',
                'natural-hazards',
                'environmental-land-change'
            ]
        },
        {
            label: 'POPULATION',
            keys: [
                'population',
                'demography'
            ]
        },
        {
            label: 'ENERGY',
            keys: [
                'renewable-energy',
                'energy-housing'
            ]
        }
    ];

    const STATUS_OPTIONS = [
        { value: 'Production', label: 'Current' },
        { value: 'Report Published', label: 'Report Published' },
        { value: 'Research', label: 'Research in Progress' },
        { value: 'Planned', label: 'Planned' },
        { value: 'Archived', label: 'Archived' }
    ];

    const state = {
        projects: [],
        taxonomy: null,
        filters: {
            domain: [],
            theme: [],
            place: [],
            status: []
        },
        search: '',
        openPanel: null,
        mobileFiltersOpen: false
    };

    const els = {
        featured: document.querySelector('[data-featured-projects]'),
        grid: document.querySelector('[data-project-grid]'),
        controls: document.querySelector('[data-catalogue-controls]'),
        search: document.querySelector('[data-project-search]'),
        activeFilters: document.querySelector('[data-active-filters]'),
        activeCount: document.querySelector('[data-active-filter-count]'),
        mobileToggle: document.querySelector('[data-mobile-filter-toggle]'),
        count: document.querySelector('[data-project-count]'),
        empty: document.querySelector('[data-project-empty]'),
        mapDots: document.querySelector('[data-map-dots]'),
        mapTooltip: document.querySelector('[data-map-tooltip]'),
        mapCount: document.querySelector('[data-map-count]')
    };

    if (!els.grid || !els.controls) return;

    const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));

    const normalise = (value) => String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const statusLabel = (status) => {
        const item = STATUS_OPTIONS.find((option) => option.value === status);
        return item?.label || status || 'Research in Progress';
    };

    const uniqueSorted = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

    function projectPlaceText(project) {
        return [
            project.location?.name,
            project.geography,
            project.geographyType,
            project.geographicScope?.name
        ].filter(Boolean).join(' | ');
    }

    function projectSearchText(project) {
        const themes = Array.isArray(project.themes)
            ? project.themes.map((theme) => theme?.name).filter(Boolean)
            : [];

        return normalise([
            project.id,
            project.title,
            project.summary,
            project.geography,
            project.geographyType,
            project.location?.name,
            project.researchDomain?.name,
            project.subTheme?.name,
            project.theme?.name,
            ...themes,
            ...(project.tags || []),
            project.portfolioRole,
            statusLabel(project.status)
        ].filter(Boolean).join(' '));
    }

    function placeOptions() {
        return [
            {
                label: 'IRELAND',
                options: [
                    {
                        key: 'ireland-national',
                        label: 'Ireland (National)',
                        matches: (project) => normalise(project.geography) === 'ireland'
                    },
                    {
                        key: 'county-cork',
                        label: 'County Cork',
                        matches: (project) => /county cork|west cork|bandon/i.test(projectPlaceText(project))
                    },
                    {
                        key: 'west-cork',
                        label: 'West Cork',
                        matches: (project) => /west cork/i.test(projectPlaceText(project))
                    },
                    {
                        key: 'bandon',
                        label: 'Bandon',
                        matches: (project) => /bandon/i.test(projectPlaceText(project))
                    },
                    {
                        key: 'county-wicklow',
                        label: 'County Wicklow',
                        matches: (project) => /county wicklow/i.test(projectPlaceText(project))
                    },
                    {
                        key: 'dublin',
                        label: 'Dublin',
                        matches: (project) => /dublin/i.test(projectPlaceText(project))
                    }
                ]
            },
            {
                label: 'EUROPE',
                options: [
                    {
                        key: 'europe',
                        label: 'Europe',
                        matches: (project) => normalise(project.geography) === 'europe'
                    },
                    {
                        key: 'athens',
                        label: 'Athens, Greece',
                        matches: (project) => /athens|greece/i.test(projectPlaceText(project))
                    }
                ]
            },
            {
                label: 'UNITED STATES',
                options: [
                    {
                        key: 'california',
                        label: 'California',
                        matches: (project) => /california/i.test(projectPlaceText(project))
                    },
                    {
                        key: 'miami',
                        label: 'Miami, Florida',
                        matches: (project) => /miami|florida/i.test(projectPlaceText(project))
                    },
                    {
                        key: 'glover',
                        label: 'Glover, Vermont',
                        matches: (project) => /glover|vermont/i.test(projectPlaceText(project))
                    }
                ]
            },
            {
                label: 'SOUTH AMERICA',
                options: [
                    {
                        key: 'rondonia',
                        label: 'Rondônia, Brazil',
                        matches: (project) => /rondonia|rondônia|brazil/i.test(projectPlaceText(project))
                    }
                ]
            }
        ];
    }

    function getThemeOptions() {
        const themes = Array.isArray(state.taxonomy?.themes) ? state.taxonomy.themes : [];
        const byKey = new Map(themes.map((theme) => [theme.key, theme]));

        const grouped = THEME_GROUPS.map((group) => ({
            label: group.label,
            options: group.keys.map((key) => byKey.get(key)).filter(Boolean)
        })).filter((group) => group.options.length);

        const groupedKeys = new Set(grouped.flatMap((group) => group.options.map((theme) => theme.key)));
        const remaining = themes.filter((theme) => !groupedKeys.has(theme.key));

        if (remaining.length) {
            grouped.push({ label: 'OTHER', options: remaining });
        }

        return grouped;
    }

    function getDomainOptions() {
        return (state.taxonomy?.researchDomains || [])
            .slice()
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }

    function projectThemeKeys(project) {
        const keys = Array.isArray(project.themes)
            ? project.themes.map((theme) => theme?.key).filter(Boolean)
            : [];

        if (project.theme?.key && !keys.includes(project.theme.key)) {
            keys.push(project.theme.key);
        }

        return keys;
    }

    function matchesSearch(project, search) {
        const query = normalise(search);
        return !query || projectSearchText(project).includes(query);
    }

    function matchesPlace(project, placeKey) {
        const match = placeOptions()
            .flatMap((group) => group.options)
            .find((option) => option.key === placeKey);

        return match ? match.matches(project) : false;
    }

    function matchesFilters(project, filters = state.filters, search = state.search) {
        if (!matchesSearch(project, search)) return false;

        const domainKey = project.researchDomain?.key;
        const themeKeys = projectThemeKeys(project);

        const domainMatches = !filters.domain.length || filters.domain.includes(domainKey);
        const themeMatches = !filters.theme.length || filters.theme.some((key) => themeKeys.includes(key));
        const placeMatches = !filters.place.length || filters.place.some((key) => matchesPlace(project, key));
        const statusMatches = !filters.status.length || filters.status.includes(project.status);

        return domainMatches && themeMatches && placeMatches && statusMatches;
    }

    function countForFilter(category, value) {
        const trialFilters = {
            domain: [...state.filters.domain],
            theme: [...state.filters.theme],
            place: [...state.filters.place],
            status: [...state.filters.status]
        };
        trialFilters[category] = [value];
        return state.projects.filter((project) => matchesFilters(project, trialFilters, state.search)).length;
    }

    async function loadData() {
        const [projectsResponse, taxonomyResponse] = await Promise.all([
            fetch('/content/projects.json', { cache: 'no-cache' }),
            fetch('/content/taxonomy.json', { cache: 'no-cache' })
        ]);

        if (!projectsResponse.ok || !taxonomyResponse.ok) {
            throw new Error('Project catalogue data could not be loaded.');
        }

        state.projects = await projectsResponse.json();
        state.taxonomy = await taxonomyResponse.json();
    }

    function optionMarkup(category, option, label, checked, count, indentClass = '') {
        const inputId = `filter-${category}-${normalise(option).replace(/[^a-z0-9]+/g, '-')}`;
        return `
            <label class="filter-option ${indentClass}" for="${esc(inputId)}">
                <input
                    id="${esc(inputId)}"
                    type="checkbox"
                    data-filter-option
                    data-filter-category="${esc(category)}"
                    data-filter-value="${esc(option)}"
                    ${checked ? 'checked' : ''}
                >
                <span class="filter-option-label">${esc(label)}</span>
                <span class="filter-option-count">${count}</span>
            </label>`;
    }

    function renderControls() {
        const domains = getDomainOptions();
        const themeGroups = getThemeOptions();
        const places = placeOptions();

        const domainPanel = domains.length
            ? domains.map((domain) => optionMarkup(
                'domain',
                domain.key,
                domain.name,
                state.filters.domain.includes(domain.key),
                countForFilter('domain', domain.key)
            )).join('')
            : '<p class="filter-panel-empty">No domains available.</p>';

        const themePanel = themeGroups.map((group) => `
            <div class="filter-panel-section">
                <p class="filter-panel-heading">${esc(group.label)}</p>
                ${group.options.map((theme) => optionMarkup(
                    'theme',
                    theme.key,
                    theme.name,
                    state.filters.theme.includes(theme.key),
                    countForFilter('theme', theme.key)
                )).join('')}
            </div>
        `).join('');

        const placePanel = places.map((group) => `
            <div class="filter-panel-section">
                <p class="filter-panel-heading">${esc(group.label)}</p>
                ${group.options.map((option) => optionMarkup(
                    'place',
                    option.key,
                    option.label,
                    state.filters.place.includes(option.key),
                    countForFilter('place', option.key)
                )).join('')}
            </div>
        `).join('');

        const statusPanel = STATUS_OPTIONS.map((option) => optionMarkup(
            'status',
            option.value,
            option.label,
            state.filters.status.includes(option.value),
            countForFilter('status', option.value)
        )).join('');

        const configs = [
            { key: 'domain', label: 'DOMAIN', summary: filterSummary('domain', 'All Domains'), panel: domainPanel },
            { key: 'theme', label: 'THEME', summary: filterSummary('theme', 'All Themes'), panel: themePanel },
            { key: 'place', label: 'PLACE', summary: filterSummary('place', 'All Places'), panel: placePanel },
            { key: 'status', label: 'STATUS', summary: filterSummary('status', 'All Statuses'), panel: statusPanel }
        ];

        els.controls.querySelector('[data-filter-toolbar]').innerHTML = configs.map((config) => `
            <div class="filter-popover ${state.openPanel === config.key ? 'panel-open' : ''}" data-filter-popover="${config.key}">
                <button
                    type="button"
                    class="filter-trigger ${state.filters[config.key].length ? 'is-active' : ''}"
                    data-filter-trigger="${config.key}"
                    aria-expanded="${state.openPanel === config.key ? 'true' : 'false'}"
                    aria-controls="filter-panel-${config.key}"
                >
                    <span class="filter-trigger-label">${config.label}</span>
                    <span class="filter-trigger-summary" data-filter-summary="${config.key}">${esc(config.summary)}</span>
                    <span class="filter-trigger-chevron" aria-hidden="true">⌄</span>
                </button>
                <div class="filter-panel" id="filter-panel-${config.key}" ${state.openPanel === config.key ? '' : 'hidden'}>
                    ${config.panel}
                </div>
            </div>
        `).join('');

        updateMobileFilterState();
        renderActiveFilters();
    }

    function filterLabel(category, value) {
        if (category === 'domain') {
            return getDomainOptions().find((domain) => domain.key === value)?.name || value;
        }

        if (category === 'theme') {
            return (state.taxonomy?.themes || []).find((theme) => theme.key === value)?.name || value;
        }

        if (category === 'place') {
            return placeOptions().flatMap((group) => group.options).find((option) => option.key === value)?.label || value;
        }

        if (category === 'status') {
            return statusLabel(value);
        }

        return value;
    }

    function filterSummary(category, fallback) {
        const selected = state.filters[category];
        if (!selected.length) return fallback;
        if (selected.length === 1) return filterLabel(category, selected[0]);
        return `${selected.length} selected`;
    }

    function renderActiveFilters() {
        if (!els.activeFilters) return;

        const chips = [];
        const categoryLabels = {
            domain: 'Domain',
            theme: 'Theme',
            place: 'Place',
            status: 'Status'
        };

        Object.entries(state.filters).forEach(([category, values]) => {
            values.forEach((value) => {
                chips.push(`
                    <span class="filter-chip">
                        <span>${esc(filterLabel(category, value))}</span>
                        <button type="button" aria-label="Remove ${esc(categoryLabels[category])} filter ${esc(filterLabel(category, value))}" data-remove-filter data-filter-category="${esc(category)}" data-filter-value="${esc(value)}">×</button>
                    </span>`);
            });
        });

        if (state.search.trim()) {
            chips.push(`
                <span class="filter-chip">
                    <span>Search: ${esc(state.search.trim())}</span>
                    <button type="button" aria-label="Remove search filter" data-remove-search>×</button>
                </span>`);
        }

        const activeCount = Object.values(state.filters).reduce((sum, values) => sum + values.length, 0) + (state.search.trim() ? 1 : 0);
        if (els.activeCount) els.activeCount.textContent = String(activeCount);

        if (!chips.length) {
            els.activeFilters.hidden = true;
            els.activeFilters.innerHTML = '';
            return;
        }

        els.activeFilters.hidden = false;
        els.activeFilters.innerHTML = `
            <span class="active-filters-label">Active filters</span>
            ${chips.join('')}
            <button type="button" class="filter-clear-all" data-clear-all>Clear All</button>
        `;
    }

    function updateMobileFilterState() {
        if (!els.mobileToggle) return;
        els.mobileToggle.setAttribute('aria-expanded', String(state.mobileFiltersOpen));
    }

    function searchMatches() {
        return state.projects.filter((project) => matchesFilters(project));
    }

    function card(project) {
        return `
            <article class="project-card">
                <a href="${esc(project.url || '/projects/')}">
                    <div class="project-card-image-wrap">
                        <img class="project-card-image" src="${esc(project.image)}" alt="${esc(project.title)}" loading="lazy">
                    </div>
                </a>
                <div class="project-card-body">
                    <div class="project-card-meta-top">
                        <span class="project-card-id">${esc(project.id)}</span>
                        <span class="project-card-status">${esc(statusLabel(project.status))}</span>
                    </div>
                    <div class="project-card-domain">${esc(project.researchDomain?.name || '')}</div>
                    <h3><a href="${esc(project.url || '/projects/')}">${esc(project.title)}</a></h3>
                    <p class="project-card-description">${esc(project.summary || '')}</p>
                    <div class="project-card-bottom">
                        <span class="project-card-location">${esc((project.themes?.map((theme) => theme.name).filter(Boolean).slice(0, 3).join(' · ')) || project.subTheme?.name || project.theme?.name || '')} · ${esc(project.geography || '')}</span>
                        <a class="project-card-link" href="${esc(project.url || '/projects/')}">View project →</a>
                    </div>
                </div>
            </article>`;
    }

    function featuredCard(project, primary) {
        return `
            <a class="featured-project ${primary ? 'featured-project--primary' : 'featured-project--secondary'}" href="${esc(project.url || '/projects/')}">
                <img class="featured-project-image" src="${esc(project.image)}" alt="" loading="lazy">
                <div class="featured-project-body">
                    <div>
                        <span class="featured-project-id">${esc(project.id)}</span>
                        <span class="featured-project-status">${esc(statusLabel(project.status))}</span>
                    </div>
                    <div class="featured-project-domain">${esc(project.researchDomain?.name || '')}</div>
                    <h3>${esc(project.title)}</h3>
                    ${primary ? `<p class="featured-project-description">${esc(project.summary || '')}</p>` : ''}
                    <span class="featured-project-link">View project →</span>
                </div>
            </a>`;
    }

    function renderFeatured() {
        if (!els.featured) return;
        const selected = featuredIds.map((id) => state.projects.find((project) => project.id === id)).filter(Boolean);
        if (!selected.length) return;

        const primary = selected[0];
        const secondary = selected.slice(1);
        els.featured.innerHTML = featuredCard(primary, true) +
            `<div class="featured-secondary-column">${secondary.map((project) => featuredCard(project, false)).join('')}</div>`;
    }

    function renderGrid() {
        const visible = searchMatches();
        els.grid.innerHTML = visible.map(card).join('');
        els.empty.hidden = visible.length !== 0;
        els.count.textContent = `${visible.length} ${visible.length === 1 ? 'project' : 'projects'}`;
    }

    function renderMap() {
        if (!els.mapDots) return;

        const visible = searchMatches().filter((project) => project.location);
        els.mapDots.innerHTML = '';

        const grouped = new Map();
        visible.forEach((project) => {
            const key = `${project.location.latitude}|${project.location.longitude}`;
            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key).push(project);
        });

        grouped.forEach((projects) => {
            projects.forEach((project, index) => {
                const { latitude, longitude } = project.location;
                const baseX = ((longitude + 180) / 360) * 100;
                const baseY = ((90 - latitude) / 180) * 100;
                const angle = projects.length > 1 ? (index / projects.length) * Math.PI * 2 : 0;
                const radius = projects.length > 1 ? 1.1 : 0;
                const x = baseX + Math.cos(angle) * radius;
                const y = baseY + Math.sin(angle) * radius;

                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'project-map-dot';
                button.style.left = `${x}%`;
                button.style.top = `${y}%`;
                button.setAttribute('aria-label', `${project.id}: ${project.title}`);
                button.title = `${project.id} — ${project.title}`;
                button.addEventListener('click', () => showMapTooltip(project, x, y));
                els.mapDots.appendChild(button);
            });
        });

        if (els.mapCount) {
            els.mapCount.textContent = `${visible.length} ${visible.length === 1 ? 'project location' : 'project locations'}`;
        }
    }

    function showMapTooltip(project, x, y) {
        if (!els.mapTooltip) return;
        els.mapTooltip.hidden = false;
        els.mapTooltip.innerHTML = `
            <div class="map-tooltip-id">${esc(project.id)} · ${esc(statusLabel(project.status))}</div>
            <h3>${esc(project.title)}</h3>
            <p>${esc(project.location?.name || project.geography || '')}</p>
            <a href="${esc(project.url || '/projects/')}">View project →</a>`;

        const left = Math.max(8, Math.min(72, x));
        const top = Math.max(8, Math.min(66, y));
        els.mapTooltip.style.left = `${left}%`;
        els.mapTooltip.style.top = `${top}%`;
    }

    function clearAll() {
        state.filters = { domain: [], theme: [], place: [], status: [] };
        state.search = '';
        state.openPanel = null;
        if (els.search) els.search.value = '';
        renderControls();
        renderGrid();
        renderMap();
    }

    function toggleValue(category, value) {
        const values = state.filters[category];
        const index = values.indexOf(value);
        if (index === -1) {
            values.push(value);
        } else {
            values.splice(index, 1);
        }
    }

    function initialiseURLFilters() {
        const params = new URLSearchParams(window.location.search);
        const mappings = ['domain', 'theme', 'status', 'place'];

        mappings.forEach((category) => {
            const requested = params.get(category);
            if (!requested) return;

            const values = requested.split(',').map((value) => value.trim()).filter(Boolean);
            if (category === 'domain') {
                const valid = getDomainOptions().map((item) => item.key);
                state.filters.domain = values.filter((value) => valid.includes(value));
            }

            if (category === 'theme') {
                const valid = (state.taxonomy?.themes || []).map((item) => item.key);
                state.filters.theme = values.filter((value) => valid.includes(value));
            }

            if (category === 'status') {
                const valid = STATUS_OPTIONS.map((item) => item.value);
                state.filters.status = values.filter((value) => valid.includes(value));
            }

            if (category === 'place') {
                const valid = placeOptions().flatMap((group) => group.options).map((item) => item.key);
                state.filters.place = values.filter((value) => valid.includes(value));
            }
        });
    }

    function bindEvents() {
        els.controls.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-filter-trigger]');
            if (trigger) {
                const key = trigger.dataset.filterTrigger;
                state.openPanel = state.openPanel === key ? null : key;
                renderControls();
                return;
            }

            const remove = event.target.closest('[data-remove-filter]');
            if (remove) {
                const category = remove.dataset.filterCategory;
                const value = remove.dataset.filterValue;
                state.filters[category] = state.filters[category].filter((item) => item !== value);
                renderControls();
                renderGrid();
                renderMap();
                return;
            }

            if (event.target.closest('[data-remove-search]')) {
                state.search = '';
                if (els.search) els.search.value = '';
                renderActiveFilters();
                renderGrid();
                renderMap();
                return;
            }

            if (event.target.closest('[data-clear-all]')) {
                clearAll();
            }
        });

        els.controls.addEventListener('change', (event) => {
            const checkbox = event.target.closest('[data-filter-option]');
            if (!checkbox) return;

            toggleValue(checkbox.dataset.filterCategory, checkbox.dataset.filterValue);
            renderControls();
            renderGrid();
            renderMap();
        });

        if (els.search) {
            els.search.addEventListener('input', () => {
                state.search = els.search.value;
                renderActiveFilters();
                renderGrid();
                renderMap();
            });
        }

        if (els.mobileToggle) {
            els.mobileToggle.addEventListener('click', () => {
                state.mobileFiltersOpen = !state.mobileFiltersOpen;
                const toolbar = els.controls.querySelector('[data-filter-toolbar]');
                toolbar.classList.toggle('is-open', state.mobileFiltersOpen);
                updateMobileFilterState();
            });
        }

        document.addEventListener('click', (event) => {
            if (!event.target.closest('[data-filter-popover]')) {
                if (state.openPanel !== null) {
                    state.openPanel = null;
                    renderControls();
                }
            }

            if (!event.target.closest('.project-map-dot, .map-tooltip')) {
                els.mapTooltip.hidden = true;
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && state.openPanel !== null) {
                state.openPanel = null;
                renderControls();
            }
        });
    }

    async function init() {
        try {
            await loadData();
            initialiseURLFilters();
            renderControls();
            if (els.search) els.search.value = state.search;
            renderFeatured();
            renderGrid();
            renderMap();
            bindEvents();
        } catch (error) {
            console.error(error);
            els.grid.innerHTML = '<p class="projects-empty">The project catalogue could not be loaded.</p>';
        }
    }

    init();
})();
