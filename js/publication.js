/* ==========================================================
   SPATIAL EVIDENCE LAB
   PUBLICATION JAVASCRIPT

   Responsibilities:
   - Map atlas
   - Image enlargement
   - Lightbox
   - Publication-specific media interaction

   Used by:
   - Full publication pages
   - SEL-002
   - Future publication-style projects

   Does NOT handle:
   - Header state
   - Global navigation
   - Reading progress
   - Project catalogue filtering
   ========================================================== */

(function () {
    "use strict";


    /* ======================================================
       01. LIGHTBOX ELEMENT
       ====================================================== */

    const atlasLinks = document.querySelectorAll(
        ".atlas-thumb a, " +
        ".map-atlas-figure a[data-lightbox], " +
        "[data-publication-lightbox]"
    );

    if (!atlasLinks.length) {
        return;
    }


    /* ======================================================
       02. CREATE LIGHTBOX
       ====================================================== */

    const lightbox = document.createElement("div");

    lightbox.className =
        "publication-lightbox";

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    lightbox.innerHTML = `
        <div class="publication-lightbox-backdrop"></div>

        <div
            class="publication-lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Expanded publication figure"
        >

            <button
                type="button"
                class="publication-lightbox-close"
                aria-label="Close image"
            >
                ×
            </button>

            <button
                type="button"
                class="publication-lightbox-prev"
                aria-label="Previous image"
            >
                ←
            </button>

            <figure class="publication-lightbox-figure">

                <img
                    class="publication-lightbox-image"
                    src=""
                    alt=""
                >

                <figcaption
                    class="publication-lightbox-caption"
                ></figcaption>

            </figure>

            <button
                type="button"
                class="publication-lightbox-next"
                aria-label="Next image"
            >
                →
            </button>

        </div>
    `;

    document.body.appendChild(lightbox);


    /* ======================================================
       03. COLLECT ATLAS ITEMS
       ====================================================== */

    const items = Array.from(atlasLinks)
        .map((link) => {

            const image =
                link.querySelector("img") ||
                link.closest("figure")?.querySelector("img");

            if (!image) {
                return null;
            }

            return {
                link,
                image,
                source:
                    link.dataset.lightboxSrc ||
                    link.getAttribute("href") ||
                    image.currentSrc ||
                    image.src,

                alt:
                    link.dataset.lightboxAlt ||
                    image.alt ||
                    "",

                caption:
                    link.dataset.lightboxCaption ||
                    link
                        .closest("figure")
                        ?.querySelector("figcaption")
                        ?.textContent
                        ?.trim() ||
                    ""
            };
        })
        .filter(Boolean);


    if (!items.length) {
        lightbox.remove();
        return;
    }


    /* ======================================================
       04. LIGHTBOX REFERENCES
       ====================================================== */

    const lightboxImage =
        lightbox.querySelector(
            ".publication-lightbox-image"
        );

    const lightboxCaption =
        lightbox.querySelector(
            ".publication-lightbox-caption"
        );

    const closeButton =
        lightbox.querySelector(
            ".publication-lightbox-close"
        );

    const previousButton =
        lightbox.querySelector(
            ".publication-lightbox-prev"
        );

    const nextButton =
        lightbox.querySelector(
            ".publication-lightbox-next"
        );

    const backdrop =
        lightbox.querySelector(
            ".publication-lightbox-backdrop"
        );


    let currentIndex = 0;


    /* ======================================================
       05. DISPLAY IMAGE
       ====================================================== */

    const showImage = (index) => {

        currentIndex =
            (index + items.length) %
            items.length;

        const item =
            items[currentIndex];

        lightboxImage.src =
            item.source;

        lightboxImage.alt =
            item.alt;

        lightboxCaption.textContent =
            item.caption;

        previousButton.hidden =
            items.length <= 1;

        nextButton.hidden =
            items.length <= 1;
    };


    /* ======================================================
       06. OPEN
       ====================================================== */

    const openLightbox = (index) => {

        showImage(index);

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        lightbox.classList.add(
            "is-open"
        );

        document.body.classList.add(
            "publication-lightbox-open"
        );

        closeButton.focus();
    };


    /* ======================================================
       07. CLOSE
       ====================================================== */

    const closeLightbox = () => {

        lightbox.classList.remove(
            "is-open"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "publication-lightbox-open"
        );

        lightboxImage.src = "";
        lightboxCaption.textContent = "";
    };


    /* ======================================================
       08. ATLAS EVENTS
       ====================================================== */

    items.forEach((item, index) => {

        item.link.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openLightbox(index);
            }
        );

    });


    /* ======================================================
       09. CONTROLS
       ====================================================== */

    closeButton.addEventListener(
        "click",
        closeLightbox
    );

    backdrop.addEventListener(
        "click",
        closeLightbox
    );

    previousButton.addEventListener(
        "click",
        () => showImage(currentIndex - 1)
    );

    nextButton.addEventListener(
        "click",
        () => showImage(currentIndex + 1)
    );


    /* ======================================================
       10. KEYBOARD CONTROLS
       ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !lightbox.classList.contains(
                    "is-open"
                )
            ) {
                return;
            }

            switch (event.key) {

                case "Escape":
                    closeLightbox();
                    break;

                case "ArrowLeft":
                    showImage(
                        currentIndex - 1
                    );
                    break;

                case "ArrowRight":
                    showImage(
                        currentIndex + 1
                    );
                    break;
            }

        }
    );

})();
