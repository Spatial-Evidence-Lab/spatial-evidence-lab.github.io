/* ============================================================
   sel-interactions.js
   Spatial Evidence Lab — Bandon Public Transport Accessibility
   Interactive behaviour and UI enhancements
   ============================================================ */

(function () {
  "use strict";


  /* ============================================================
     01. DOM READY
     ============================================================ */

  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }


  /* ============================================================
     02. SAFE SELECTORS
     ============================================================ */

  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function qsa(selector, parent) {
    return Array.prototype.slice.call(
      (parent || document).querySelectorAll(selector)
    );
  }


  /* ============================================================
     03. MOBILE NAVIGATION
     ============================================================ */

  function initMobileNavigation() {

    var toggle =
      qs(".menu-toggle") ||
      qs(".sel-menu-toggle") ||
      qs("[data-menu-toggle]");

    var nav =
      qs(".sel-nav-links") ||
      qs(".nav-links") ||
      qs(".mobile-nav") ||
      qs("[data-mobile-nav]");

    if (!toggle || !nav) {
      return;
    }

    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", function () {

      var isOpen =
        nav.classList.toggle("is-open");

      toggle.classList.toggle(
        "is-open",
        isOpen
      );

      toggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      document.body.classList.toggle(
        "nav-open",
        isOpen
      );

    });


    /* Close navigation after selecting a link */

    qsa("a", nav).forEach(function (link) {

      link.addEventListener("click", function () {

        nav.classList.remove("is-open");

        toggle.classList.remove("is-open");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

        document.body.classList.remove(
          "nav-open"
        );

      });

    });


    /* Close with Escape */

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape" &&
          nav.classList.contains("is-open")
        ) {

          nav.classList.remove("is-open");

          toggle.classList.remove("is-open");

          toggle.setAttribute(
            "aria-expanded",
            "false"
          );

          document.body.classList.remove(
            "nav-open"
          );

          toggle.focus();
        }

      }
    );

  }


  /* ============================================================
     04. SMOOTH INTERNAL NAVIGATION
     ============================================================ */

  function initSmoothNavigation() {

    qsa('a[href^="#"]').forEach(function (link) {

      link.addEventListener("click", function (event) {

        var href =
          link.getAttribute("href");

        if (
          !href ||
          href === "#" ||
          href.length < 2
        ) {
          return;
        }

        var target;

        try {
          target = document.querySelector(href);
        } catch (error) {
          return;
        }

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        /*
         * Update the URL without forcing a page jump.
         */

        if (
          window.history &&
          window.history.pushState
        ) {
          window.history.pushState(
            null,
            "",
            href
          );
        }

      });

    });

  }


  /* ============================================================
     05. ACTIVE NAVIGATION SECTION
     ============================================================ */

  function initSectionObserver() {

    var sections = qsa(
      "main section[id], section[id]"
    );

    var links = qsa(
      'nav a[href^="#"], .sel-nav a[href^="#"]'
    );

    if (
      !sections.length ||
      !links.length ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    var linkMap = {};

    links.forEach(function (link) {

      var href =
        link.getAttribute("href");

      if (href && href.length > 1) {
        linkMap[href.substring(1)] = link;
      }

    });


    var observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (!entry.isIntersecting) {
              return;
            }

            links.forEach(function (link) {
              link.classList.remove("active");
            });

            var activeLink =
              linkMap[entry.target.id];

            if (activeLink) {
              activeLink.classList.add("active");
            }

          });

        },
        {
          rootMargin:
            "-25% 0px -65% 0px",
          threshold:0
        }
      );


    sections.forEach(function (section) {
      observer.observe(section);
    });

  }


  /* ============================================================
     06. SCROLL-TO-TOP BUTTON
     ============================================================ */

  function initBackToTop() {

    var button =
      qs(".back-to-top") ||
      qs(".sel-back-to-top") ||
      qs("[data-back-to-top]");

    if (!button) {
      return;
    }

    button.addEventListener(
      "click",
      function () {

        window.scrollTo({
          top:0,
          behavior:"smooth"
        });

      }
    );


    function updateVisibility() {

      button.classList.toggle(
        "is-visible",
        window.scrollY > 500
      );

    }

    window.addEventListener(
      "scroll",
      updateVisibility,
      { passive:true }
    );

    updateVisibility();

  }


  /* ============================================================
     07. EVIDENCE CHAIN
     ============================================================ */

  function initEvidenceChain() {

    var chain =
      qs(".sel-chain") ||
      qs("[data-evidence-chain]");

    if (!chain) {
      return;
    }

    var steps =
      qsa(
        ".sel-chain-step, [data-chain-step]",
        chain
      );

    if (!steps.length) {
      return;
    }


    steps.forEach(function (step, index) {

      step.setAttribute(
        "tabindex",
        "0"
      );

      step.addEventListener(
        "mouseenter",
        function () {
          highlightChainStep(
            steps,
            index
          );
        }
      );

      step.addEventListener(
        "mouseleave",
        function () {
          clearChainHighlight(
            steps
          );
        }
      );

      step.addEventListener(
        "focus",
        function () {
          highlightChainStep(
            steps,
            index
          );
        }
      );

      step.addEventListener(
        "blur",
        function () {
          clearChainHighlight(
            steps
          );
        }
      );

      step.addEventListener(
        "keydown",
        function (event) {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            step.classList.toggle(
              "is-selected"
            );

          }

        }
      );

    });

  }


  function highlightChainStep(
    steps,
    activeIndex
  ) {

    steps.forEach(function (step, index) {

      step.classList.toggle(
        "is-dimmed",
        index !== activeIndex
      );

      step.classList.toggle(
        "is-active",
        index === activeIndex
      );

    });

  }


  function clearChainHighlight(steps) {

    steps.forEach(function (step) {

      step.classList.remove(
        "is-dimmed",
        "is-active"
      );

    });

  }


  /* ============================================================
     08. HORIZONTAL SCROLL — SHIFT + MOUSE WHEEL
     ============================================================ */

  function initHorizontalScroll() {

    qsa(
      ".sel-chain-scroll, .horizontal-scroll, [data-horizontal-scroll]"
    ).forEach(function (container) {

      container.addEventListener(
        "wheel",
        function (event) {

          /*
           * Only convert vertical wheel movement when the
           * element actually has horizontal overflow.
           */

          if (
            container.scrollWidth <=
            container.clientWidth
          ) {
            return;
          }

          if (
            Math.abs(event.deltaY) >
            Math.abs(event.deltaX)
          ) {

            event.preventDefault();

            container.scrollLeft +=
              event.deltaY;

          }

        },
        {
          passive:false
        }
      );

    });

  }


  /* ============================================================
     09. COPY BUTTONS
     ============================================================ */

  function initCopyButtons() {

    qsa(
      "[data-copy], .copy-button"
    ).forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          var selector =
            button.getAttribute(
              "data-copy"
            );

          var text = "";

          if (selector) {

            var source =
              qs(selector);

            if (source) {
              text =
                source.textContent.trim();
            }

          } else {

            text =
              button.getAttribute(
                "data-copy-text"
              ) || "";

          }

          if (!text) {
            return;
          }


          copyText(text).then(
            function () {

              showButtonFeedback(
                button,
                "Copied"
              );

            },
            function () {

              showButtonFeedback(
                button,
                "Copy failed"
              );

            }
          );

        }
      );

    });

  }


  function copyText(text) {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      return navigator.clipboard.writeText(
        text
      );

    }


    return new Promise(
      function (resolve, reject) {

        var textarea =
          document.createElement(
            "textarea"
          );

        textarea.value = text;

        textarea.style.position =
          "fixed";

        textarea.style.opacity =
          "0";

        document.body.appendChild(
          textarea
        );

        textarea.focus();

        textarea.select();

        try {

          var successful =
            document.execCommand(
              "copy"
            );

          document.body.removeChild(
            textarea
          );

          successful
            ? resolve()
            : reject();

        } catch (error) {

          document.body.removeChild(
            textarea
          );

          reject(error);

        }

      }
    );

  }


  function showButtonFeedback(
    button,
    message
  ) {

    var original =
      button.getAttribute(
        "data-original-label"
      );

    if (!original) {

      original =
        button.textContent;

      button.setAttribute(
        "data-original-label",
        original
      );

    }

    button.textContent =
      message;

    button.classList.add(
      "is-success"
    );

    window.setTimeout(
      function () {

        button.textContent =
          original;

        button.classList.remove(
          "is-success"
        );

      },
      1400
    );

  }


  /* ============================================================
     10. DETAILS / ACCORDION ENHANCEMENT
     ============================================================ */

  function initDetails() {

    qsa("details").forEach(
      function (details) {

        details.addEventListener(
          "toggle",
          function () {

            if (!details.open) {
              details.classList.remove(
                "is-open"
              );
              return;
            }

            details.classList.add(
              "is-open"
            );

          }
        );

      }
    );

  }


  /* ============================================================
     11. FILTER BUTTONS
     ============================================================ */

  function initFilters() {

    qsa(
      "[data-filter-group]"
    ).forEach(function (group) {

      var buttons =
        qsa(
          "[data-filter]",
          group
        );

      var items =
        qsa(
          "[data-filter-item]",
          group
        );

      if (
        !buttons.length ||
        !items.length
      ) {
        return;
      }


      buttons.forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            var filter =
              button.getAttribute(
                "data-filter"
              );

            buttons.forEach(
              function (item) {

                item.classList.toggle(
                  "active",
                  item === button
                );

                item.setAttribute(
                  "aria-pressed",
                  item === button
                    ? "true"
                    : "false"
                );

              }
            );


            items.forEach(
              function (item) {

                var category =
                  item.getAttribute(
                    "data-category"
                  );

                var visible =
                  filter === "all" ||
                  filter === category;

                item.hidden =
                  !visible;

                item.classList.toggle(
                  "is-filtered",
                  !visible
                );

              }
            );

          }
        );

      });

    });

  }


  /* ============================================================
     12. REVEAL ON SCROLL
     ============================================================ */

  function initReveal() {

    var elements =
      qsa(
        ".sel-reveal, [data-reveal]"
      );

    if (
      !elements.length ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach(
        function (element) {
          element.classList.add(
            "is-visible"
          );
        }
      );

      return;
    }


    var observer =
      new IntersectionObserver(
        function (entries, obs) {

          entries.forEach(
            function (entry) {

              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "is-visible"
              );

              obs.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold:.08,
          rootMargin:
            "0px 0px -30px 0px"
        }
      );


    elements.forEach(
      function (element) {
        observer.observe(element);
      }
    );

  }


  /* ============================================================
     13. TABLE ROW HIGHLIGHT
     ============================================================ */

  function initTableInteraction() {

    qsa(
      ".sel-data-table tbody tr, table[data-interactive] tbody tr"
    ).forEach(function (row) {

      row.addEventListener(
        "mouseenter",
        function () {
          row.classList.add(
            "is-highlighted"
          );
        }
      );

      row.addEventListener(
        "mouseleave",
        function () {
          row.classList.remove(
            "is-highlighted"
          );
        }
      );

    });

  }


  /* ============================================================
     14. IMAGE LIGHTBOX
     ============================================================ */

  function initLightbox() {

    var images =
      qsa(
        "[data-lightbox], .sel-lightbox"
      );

    if (!images.length) {
      return;
    }


    var overlay =
      document.createElement("div");

    overlay.className =
      "sel-lightbox-overlay";

    overlay.setAttribute(
      "role",
      "dialog"
    );

    overlay.setAttribute(
      "aria-modal",
      "true"
    );

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );


    overlay.innerHTML = `
      <button
        type="button"
        class="sel-lightbox-close"
        aria-label="Close image"
      >
        ×
      </button>

      <figure class="sel-lightbox-figure">
        <img
          class="sel-lightbox-image"
          alt=""
        >
        <figcaption
          class="sel-lightbox-caption"
        ></figcaption>
      </figure>
    `;


    document.body.appendChild(
      overlay
    );


    var image =
      qs(
        ".sel-lightbox-image",
        overlay
      );

    var caption =
      qs(
        ".sel-lightbox-caption",
        overlay
      );

    var close =
      qs(
        ".sel-lightbox-close",
        overlay
      );


    function openLightbox(
      source
    ) {

      image.src =
        source.currentSrc ||
        source.src;

      image.alt =
        source.alt || "";

      caption.textContent =
        source.getAttribute(
          "data-caption"
        ) ||
        source.alt ||
        "";

      overlay.classList.add(
        "is-open"
      );

      overlay.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "lightbox-open"
      );

      close.focus();

    }


    function closeLightbox() {

      overlay.classList.remove(
        "is-open"
      );

      overlay.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "lightbox-open"
      );

      image.removeAttribute(
        "src"
      );

    }


    images.forEach(function (source) {

      source.style.cursor =
        "zoom-in";

      source.addEventListener(
        "click",
        function () {
          openLightbox(source);
        }
      );

    });


    close.addEventListener(
      "click",
      closeLightbox
    );


    overlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target === overlay
        ) {
          closeLightbox();
        }

      }
    );


    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape" &&
          overlay.classList.contains(
            "is-open"
          )
        ) {
          closeLightbox();
        }

      }
    );

  }


  /* ============================================================
     15. HASH TARGET FOCUS
     ============================================================ */

  function initHashFocus() {

    if (!window.location.hash) {
      return;
    }

    window.setTimeout(
      function () {

        var target;

        try {
          target =
            document.querySelector(
              window.location.hash
            );
        } catch (error) {
          return;
        }

        if (!target) {
          return;
        }

        /*
         * Do not permanently alter the tab order.
         */

        target.setAttribute(
          "tabindex",
          "-1"
        );

        target.focus({
          preventScroll:true
        });

      },
      250
    );

  }


  /* ============================================================
     16. PRINT BUTTON
     ============================================================ */

  function initPrint() {

    qsa(
      ".print-button, [data-print]"
    ).forEach(function (button) {

      button.addEventListener(
        "click",
        function () {
          window.print();
        }
      );

    });

  }


  /* ============================================================
     17. EXTERNAL LINKS
     ============================================================ */

  function initExternalLinks() {

    qsa("a[href]").forEach(
      function (link) {

        var href =
          link.getAttribute(
            "href"
          );

        if (
          !href ||
          href.charAt(0) === "#" ||
          href.charAt(0) === "/" ||
          href.indexOf(
            window.location.origin
          ) === 0
        ) {
          return;
        }

        if (
          href.indexOf(
            "http://"
          ) === 0 ||
          href.indexOf(
            "https://"
          ) === 0
        ) {

          link.setAttribute(
            "target",
            "_blank"
          );

          link.setAttribute(
            "rel",
            "noopener noreferrer"
          );

        }

      }
    );

  }


  /* ============================================================
     18. CURRENT YEAR
     ============================================================ */

  function initCurrentYear() {

    var year =
      new Date().getFullYear();

    qsa(
      "[data-current-year], .current-year"
    ).forEach(function (element) {

      element.textContent =
        year;

    });

  }


  /* ============================================================
     19. REDUCED MOTION
     ============================================================ */

  function initReducedMotion() {

    if (
      !window.matchMedia
    ) {
      return;
    }

    var media =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    if (!media.matches) {
      return;
    }

    document.documentElement.classList.add(
      "reduce-motion"
    );

  }


  /* ============================================================
     20. KEYBOARD ACCESSIBILITY
     ============================================================ */

  function initKeyboardState() {

    function keyboardFocus(event) {

      if (
        event.key === "Tab"
      ) {

        document.body.classList.add(
          "keyboard-user"
        );

        document.removeEventListener(
          "keydown",
          keyboardFocus
        );

      }

    }

    document.addEventListener(
      "keydown",
      keyboardFocus
    );


    document.addEventListener(
      "mousedown",
      function () {

        document.body.classList.remove(
          "keyboard-user"
        );

      }
    );

  }


  /* ============================================================
     21. MAP EVENT BRIDGE
     ============================================================ */

  /*
   * Allows the map code to communicate with page components
   * without making this file dependent on Leaflet.
   *
   * Example:
   *
   * window.dispatchEvent(
   *   new CustomEvent("sel:map-feature-selected", {
   *     detail: feature
   *   })
   * );
   */

  function initMapEventBridge() {

    window.addEventListener(
      "sel:map-feature-selected",
      function (event) {

        var detail =
          event.detail || {};

        var id =
          detail.id ||
          detail.area_id ||
          detail.code;

        if (!id) {
          return;
        }

        qsa(
          "[data-area-id]"
        ).forEach(function (element) {

          var matches =
            String(
              element.getAttribute(
                "data-area-id"
              )
            ) === String(id);

          element.classList.toggle(
            "is-map-selected",
            matches
          );

        });

      }
    );


    window.addEventListener(
      "sel:map-feature-cleared",
      function () {

        qsa(
          ".is-map-selected"
        ).forEach(function (element) {

          element.classList.remove(
            "is-map-selected"
          );

        });

      }
    );

  }


  /* ============================================================
     22. EVIDENCE / MAP AREA LINKING
     ============================================================ */

  function initAreaLinks() {

    qsa(
      "[data-area-id]"
    ).forEach(function (element) {

      element.addEventListener(
        "click",
        function () {

          var id =
            element.getAttribute(
              "data-area-id"
            );

          if (!id) {
            return;
          }

          window.dispatchEvent(
            new CustomEvent(
              "sel:area-selected",
              {
                detail:{
                  id:id,
                  source:element
                }
              }
            )
          );

        }
      );

    });

  }


  /* ============================================================
     23. URL PARAMETER SUPPORT
     ============================================================ */

  function initURLState() {

    var params;

    try {
      params =
        new URLSearchParams(
          window.location.search
        );
    } catch (error) {
      return;
    }

    var area =
      params.get("area");

    if (!area) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "sel:area-selected",
        {
          detail:{
            id:area,
            source:"url"
          }
        }
      )
    );

  }


  /* ============================================================
     24. LOADING STATE
     ============================================================ */

  function initLoadingState() {

    document.documentElement.classList.add(
      "sel-js"
    );

    window.setTimeout(
      function () {

        document.documentElement.classList.add(
          "sel-ready"
        );

        document.documentElement.classList.remove(
          "sel-loading"
        );

      },
      0
    );

  }


  /* ============================================================
     25. INITIALISE
     ============================================================ */

  ready(function () {

    initLoadingState();

    initMobileNavigation();

    initSmoothNavigation();

    initSectionObserver();

    initBackToTop();

    initEvidenceChain();

    initHorizontalScroll();

    initCopyButtons();

    initDetails();

    initFilters();

    initReveal();

    initTableInteraction();

    initLightbox();

    initHashFocus();

    initPrint();

    initExternalLinks();

    initCurrentYear();

    initReducedMotion();

    initKeyboardState();

    initMapEventBridge();

    initAreaLinks();

    initURLState();

  });


  /* ============================================================
     26. PUBLIC API
     ============================================================ */

  /*
   * Expose a small API for maps.js and other project scripts.
   *
   * This deliberately avoids exposing internal functions.
   */

  window.SELInteractions = {

    scrollTo:function (selector) {

      var target =
        typeof selector === "string"
          ? qs(selector)
          : selector;

      if (!target) {
        return;
      }

      target.scrollIntoView({
        behavior:
          document.documentElement.classList.contains(
            "reduce-motion"
          )
            ? "auto"
            : "smooth",
        block:"start"
      });

    },


    selectArea:function (id) {

      if (!id) {
        return;
      }

      window.dispatchEvent(
        new CustomEvent(
          "sel:area-selected",
          {
            detail:{
              id:id,
              source:"SELInteractions"
            }
          }
        )
      );

    },


    mapFeatureSelected:function (
      feature
    ) {

      window.dispatchEvent(
        new CustomEvent(
          "sel:map-feature-selected",
          {
            detail:
              feature || {}
          }
        )
      );

    },


    mapFeatureCleared:function () {

      window.dispatchEvent(
        new CustomEvent(
          "sel:map-feature-cleared"
        )
      );

    }

  };


})();
