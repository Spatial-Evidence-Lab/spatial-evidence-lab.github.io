(function () {

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');

    if (toggle && nav) {

        toggle.addEventListener('click', function () {

            const open = nav.classList.toggle('open');

            toggle.setAttribute(
                'aria-expanded',
                String(open)
            );

        });

    }


    /* =====================================================
       PROJECT SECTION TOC
    ===================================================== */

    const sections = [
        ...document.querySelectorAll('.project-section[id]')
    ];

    const links = [
        ...document.querySelectorAll('.project-toc a[href^="#"]')
    ];

    if (
        sections.length &&
        links.length &&
        'IntersectionObserver' in window
    ) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        links.forEach(function (link) {

                            link.classList.toggle(
                                'active',
                                link.getAttribute('href') ===
                                '#' + entry.target.id
                            );

                        });

                    });

                },
                {
                    rootMargin: '-25% 0px -60% 0px',
                    threshold: 0
                }
            );


        sections.forEach(function (section) {
            observer.observe(section);
        });

    }


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    document
        .querySelectorAll('[data-year]')
        .forEach(function (element) {

            element.textContent =
                new Date().getFullYear();
        });

    /* =====================================================
       BACK TO TOP
    ===================================================== */

    if (!document.querySelector('.back-to-top')) {

        const backToTop = document.createElement('a');

        backToTop.className = 'back-to-top';
        backToTop.href = '#top';
        backToTop.textContent = 'Back to Top';
        backToTop.setAttribute('aria-label', 'Back to top');

        document.body.appendChild(backToTop);

        backToTop.addEventListener('click', function (event) {

            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });

        });

        const updateBackToTopVisibility = function () {

            backToTop.classList.toggle(
                'is-visible',
                window.scrollY > window.innerHeight / 2
            );

        };

        window.addEventListener(
            'scroll',
            updateBackToTopVisibility,
            { passive: true }
        );

        updateBackToTopVisibility();

    }


})();
