/* ==========================================================
   SPATIAL EVIDENCE LAB
   CORE SITE JAVASCRIPT

   Responsibilities:
   - Header state
   - Shared anchor scrolling
   - Publication reading progress
   - Shared publication section navigation

   Does NOT handle:
   - Map atlas / lightbox
   - Project catalogue
   - Taxonomy / filtering
   - SEL-002-specific presentation
   ========================================================== */

(function () {
    "use strict";


    /* ======================================================
       00. SHARED MOBILE NAVIGATION
       ====================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.getElementById("site-nav");

    if (menuToggle && siteNav) {

        const closeMenu = () => {
            siteNav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        };

        menuToggle.addEventListener("click", () => {
            const open = siteNav.classList.toggle("is-open");
            menuToggle.setAttribute(
                "aria-expanded",
                String(open)
            );
        });

        siteNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });
    }


    /* ======================================================
       01. HEADER SCROLL STATE
       ====================================================== */

    const header = document.querySelector(".site-header");

    if (header) {

        const updateHeaderState = () => {
            header.classList.toggle(
                "scrolled",
                window.scrollY > 8
            );
        };

        updateHeaderState();

        window.addEventListener(
            "scroll",
            updateHeaderState,
            { passive: true }
        );
    }


    /* ======================================================
       02. SHARED ANCHOR SCROLLING
       ====================================================== */

    const anchorLinks = document.querySelectorAll(
        'a[href^="#"]:not([href="#"])'
    );

    anchorLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            /*
             * Preserve the URL hash without forcing
             * the browser to jump a second time.
             */
            if (history.replaceState) {
                history.replaceState(
                    null,
                    "",
                    targetId
                );
            }
        });

    });


    /* ======================================================
       03. PUBLICATION READING PROGRESS
       ====================================================== */

    const progressBar = document.querySelector(
        ".publication-progress-bar"
    );

    if (progressBar) {

        const updateReadingProgress = () => {

            const documentHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;

            if (documentHeight <= 0) {
                progressBar.style.width = "0%";
                return;
            }

            const progress =
                (window.scrollY / documentHeight) * 100;

            progressBar.style.width =
                `${Math.min(100, Math.max(0, progress))}%`;
        };

        updateReadingProgress();

        window.addEventListener(
            "scroll",
            updateReadingProgress,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            updateReadingProgress
        );
    }


    /* ======================================================
       04. PUBLICATION SECTION SCROLLSPY
       ====================================================== */

    const tocLinks = Array.from(
        document.querySelectorAll(
            ".publication-toc a[href^='#']"
        )
    );

    const publicationSections = tocLinks
        .map((link) => {
            const id = link.getAttribute("href");

            if (!id) {
                return null;
            }

            return document.querySelector(id);
        })
        .filter(Boolean);


    if (
        tocLinks.length &&
        publicationSections.length
    ) {

        const setActiveSection = (sectionId) => {

            tocLinks.forEach((link) => {

                const isActive =
                    link.getAttribute("href") ===
                    `#${sectionId}`;

                if (isActive) {
                    link.setAttribute(
                        "aria-current",
                        "true"
                    );
                } else {
                    link.removeAttribute(
                        "aria-current"
                    );
                }

            });
        };


        const observer = new IntersectionObserver(
            (entries) => {

                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                    );

                if (!visibleEntries.length) {
                    return;
                }

                setActiveSection(
                    visibleEntries[0].target.id
                );
            },
            {
                rootMargin:
                    "-120px 0px -60% 0px",
                threshold: 0
            }
        );


        publicationSections.forEach((section) => {
            observer.observe(section);
        });


        /*
         * Establish an initial state before scrolling.
         */
        const firstSection =
            publicationSections[0];

        if (firstSection) {
            setActiveSection(
                firstSection.id
            );
        }
    }


})();
