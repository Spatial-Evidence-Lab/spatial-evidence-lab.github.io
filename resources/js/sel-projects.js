/* =========================================================
   SPATIAL EVIDENCE LAB — PROJECTS CATALOGUE
   ========================================================= */
(function () {
    'use strict';

    const featuredIds = ['SEL-001', 'SEL-002', 'SEL-004'];
    const state = {
        projects: [],
        taxonomy: null,
        filters: { domain: '', theme: '', place: '', status: '' }
    };

    const els = {
        featured: document.querySelector('[data-featured-projects]'),
        grid: document.querySelector('[data-project-grid]'),
        filters: document.querySelector('[data-project-filters]'),
        count: document.querySelector('[data-project-count]'),
        empty: document.querySelector('[data-project-empty]'),
        reset: document.querySelector('[data-reset-filters]'),
        mapDots: document.querySelector('[data-map-dots]'),
        mapTooltip: document.querySelector('[data-map-tooltip]'),
        mapCount: document.querySelector('[data-map-count]')
    };

    if (!els.grid || !els.filters) return;

    const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));

    const statusLabel = (status) => {
        if (status === 'Production') return 'Current';
        if (status === 'Research') return 'Research';
        return status || 'Research';
    };

    const uniqueSorted = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

    async function loadData() {
        const [projectsResponse, taxonomyResponse] = await Promise.all([
            fetch('/projects.json', { cache: 'no-cache' }),
            fetch('/taxonomy.json', { cache: 'no-cache' })
        ]);

        if (!projectsResponse.ok || !taxonomyResponse.ok) {
            throw new Error('Project catalogue data could not be loaded.');
        }

        state.projects = await projectsResponse.json();
        state.taxonomy = await taxonomyResponse.json();
    }

    function populateDomains() {
        const select = els.filters.querySelector('[data-filter="domain"]');
        if (!select) return;

        const domains = (state.taxonomy?.researchDomains || []).slice().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        select.innerHTML = '<option value="">All domains</option>' + domains.map((domain) =>
            `<option value="${esc(domain.key)}">${esc(domain.name)}</option>`
        ).join('');
    }

    function populateThemes() {
        const select = els.filters.querySelector('[data-filter="theme"]');
        if (!select) return;

        const domainKey = state.filters.domain;
        let themes = [];

        if (domainKey) {
            const domain = (state.taxonomy?.researchDomains || []).find((item) => item.key === domainKey);
            themes = domain?.themes || [];
        } else {
            themes = (state.taxonomy?.researchDomains || []).flatMap((domain) => domain.themes || []);
        }

        const seen = new Set();
        themes = themes.filter((theme) => {
            if (seen.has(theme.key)) return false;
            seen.add(theme.key);
            return true;
        }).sort((a, b) => a.name.localeCompare(b.name));

        const current = state.filters.theme;
        select.innerHTML = '<option value="">All themes</option>' + themes.map((theme) =>
            `<option value="${esc(theme.key)}">${esc(theme.name)}</option>`
        ).join('');

        if (themes.some((theme) => theme.key === current)) {
            select.value = current;
        } else {
            state.filters.theme = '';
            select.value = '';
        }
    }

    function populatePlaces() {
        const select = els.filters.querySelector('[data-filter="place"]');
        if (!select) return;

        const places = uniqueSorted(state.projects.map((project) => project.location?.name || project.geography));
        select.innerHTML = '<option value="">All places</option>' + places.map((place) =>
            `<option value="${esc(place)}">${esc(place)}</option>`
        ).join('');
    }

    function populateStatuses() {
        const select = els.filters.querySelector('[data-filter="status"]');
        if (!select) return;

        const statuses = uniqueSorted(state.projects.map((project) => project.status));
        select.innerHTML = '<option value="">All statuses</option>' + statuses.map((status) =>
            `<option value="${esc(status)}">${esc(statusLabel(status))}</option>`
        ).join('');
    }

    function projectMatches(project) {
        const domainKey = project.researchDomain?.key;
        const projectThemeKeys = (Array.isArray(project.themes) ? project.themes : [])
            .map((theme) => theme?.key)
            .filter(Boolean);
        if (project.theme?.key && !projectThemeKeys.includes(project.theme.key)) {
            projectThemeKeys.push(project.theme.key);
        }
        const place = project.location?.name || project.geography;

        return (!state.filters.domain || domainKey === state.filters.domain)
            && (!state.filters.theme || projectThemeKeys.includes(state.filters.theme))
            && (!state.filters.place || place === state.filters.place)
            && (!state.filters.status || project.status === state.filters.status);
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
        const visible = state.projects.filter(projectMatches);
        els.grid.innerHTML = visible.map(card).join('');
        els.empty.hidden = visible.length !== 0;
        els.count.textContent = `${visible.length} ${visible.length === 1 ? 'project' : 'projects'}`;
    }

    function renderMap() {
        if (!els.mapDots) return;
        const visible = state.projects.filter(projectMatches).filter((project) => project.location);
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

    function updateResetState() {
        const active = Object.values(state.filters).some(Boolean);
        els.reset.hidden = !active;
    }

    function bindFilters() {
        els.filters.querySelectorAll('[data-filter]').forEach((select) => {
            select.addEventListener('change', () => {
                const key = select.dataset.filter;
                state.filters[key] = select.value;
                if (key === 'domain') populateThemes();
                renderGrid();
                renderMap();
                updateResetState();
            });
        });

        els.reset.addEventListener('click', () => {
            state.filters = { domain: '', theme: '', place: '', status: '' };
            els.filters.querySelectorAll('[data-filter]').forEach((select) => { select.value = ''; });
            populateThemes();
            renderGrid();
            renderMap();
            updateResetState();
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.project-map-dot, .map-tooltip')) {
                els.mapTooltip.hidden = true;
            }
        });
    }

    async function init() {
        try {
            await loadData();
            populateDomains();
            populateThemes();
            populatePlaces();
            populateStatuses();
            renderFeatured();
            renderGrid();
            renderMap();
            bindFilters();
        } catch (error) {
            console.error(error);
            els.grid.innerHTML = '<p class="projects-empty">The project catalogue could not be loaded.</p>';
        }
    }

    init();
})();
