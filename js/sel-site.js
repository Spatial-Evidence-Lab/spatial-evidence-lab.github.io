(function () {

    "use strict";


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");


    if (toggle && nav) {

        toggle.addEventListener("click", function () {

            const open = nav.classList.toggle("open");

            toggle.setAttribute(
                "aria-expanded",
                String(open)
            );

        });


        /*
           Close mobile navigation when a navigation link
           is selected.
        */

        nav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                if (window.innerWidth <= 800) {

                    nav.classList.remove("open");

                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            });

        });

    }


    /* =====================================================
       SECTION TABLE OF CONTENTS
    ===================================================== */

    const sections = Array.from(
        document.querySelectorAll(
            ".project-section[id]"
        )
    );


    const links = Array.from(
        document.querySelectorAll(
            '.project-toc a[href^="#"]'
        )
    );


    if (
        sections.length &&
        links.length &&
        "IntersectionObserver" in window
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
                                "active",
                                link.getAttribute("href") ===
                                "#" + entry.target.id
                            );

                        });

                    });

                },
                {
                    rootMargin: "-25% 0px -60% 0px",
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
        .querySelectorAll("[data-year]")
        .forEach(function (element) {

            element.textContent =
                new Date().getFullYear();

        });


})();

