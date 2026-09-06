/* ============================================================
   lightbox.js
   Spatial Evidence Lab — Bandon Project
   Image / map / figure lightbox
   ============================================================ */

(function () {
  "use strict";


  /* ============================================================
     01. CONFIGURATION
     ============================================================ */

  var SELECTORS = [
    "[data-lightbox]",
    ".sel-lightbox",
    ".lightbox-trigger",
    "img[data-lightbox-image]"
  ].join(",");


  /* ============================================================
     02. STATE
     ============================================================ */

  var overlay = null;
  var lightboxImage = null;
  var caption = null;
  var counter = null;
  var closeButton = null;
  var previousButton = null;
  var nextButton = null;

  var items = [];
  var currentIndex = -1;
  var lastFocusedElement = null;


  /* ============================================================
     03. DOM READY
     ============================================================ */

  function ready(callback) {

    if (
      document.readyState !== "loading"
    ) {
      callback();
    } else {
      document.addEventListener(
        "DOMContentLoaded",
        callback
      );
    }

  }


  /* ============================================================
     04. INITIALISE
     ============================================================ */

  ready(function () {

    createLightbox();

    collectItems();

    bindEvents();

  });


  /* ============================================================
     05. CREATE LIGHTBOX
     ============================================================ */

  function createLightbox() {

    if (
      document.getElementById(
        "sel-lightbox"
      )
    ) {

      overlay =
        document.getElementById(
          "sel-lightbox"
        );

      cacheElements();

      return;
    }


    overlay =
      document.createElement("div");

    overlay.id =
      "sel-lightbox";

    overlay.className =
      "sel-lightbox-overlay";

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    overlay.setAttribute(
      "role",
      "dialog"
    );

    overlay.setAttribute(
      "aria-modal",
      "true"
    );


    overlay.innerHTML = `

      <div
        class="sel-lightbox-backdrop"
        data-lightbox-close
      ></div>


      <div
        class="sel-lightbox-dialog"
        role="document"
      >

        <button
          type="button"
          class="sel-lightbox-close"
          aria-label="Close image viewer"
          data-lightbox-close
        >
          <span aria-hidden="true">×</span>
        </button>


        <button
          type="button"
          class="sel-lightbox-prev"
          aria-label="Previous image"
          data-lightbox-prev
        >
          <span aria-hidden="true">‹</span>
        </button>


        <figure
          class="sel-lightbox-figure"
        >

          <div
            class="sel-lightbox-image-wrap"
          >

            <img
              class="sel-lightbox-image"
              src=""
              alt=""
            >

            <div
              class="sel-lightbox-loading"
              aria-hidden="true"
            >
              Loading…
            </div>

          </div>


          <figcaption
            class="sel-lightbox-caption"
          ></figcaption>


          <div
            class="sel-lightbox-counter"
            aria-live="polite"
          ></div>

        </figure>


        <button
          type="button"
          class="sel-lightbox-next"
          aria-label="Next image"
          data-lightbox-next
        >
          <span aria-hidden="true">›</span>
        </button>

      </div>

    `;


    document.body.appendChild(
      overlay
    );

    cacheElements();

  }


  /* ============================================================
     06. CACHE ELEMENTS
     ============================================================ */

  function cacheElements() {

    lightboxImage =
      overlay.querySelector(
        ".sel-lightbox-image"
      );

    caption =
      overlay.querySelector(
        ".sel-lightbox-caption"
      );

    counter =
      overlay.querySelector(
        ".sel-lightbox-counter"
      );

    closeButton =
      overlay.querySelector(
        ".sel-lightbox-close"
      );

    previousButton =
      overlay.querySelector(
        ".sel-lightbox-prev"
      );

    nextButton =
      overlay.querySelector(
        ".sel-lightbox-next"
      );

  }


  /* ============================================================
     07. COLLECT LIGHTBOX ITEMS
     ============================================================ */

  function collectItems() {

    items =
      Array.prototype.slice.call(
        document.querySelectorAll(
          SELECTORS
        )
      );

    /*
     * Only image elements are treated as direct image sources.
     * Elements such as links or cards can provide their image
     * through data-lightbox-src.
     */

    items =
      items.filter(function (element) {

        if (
          element.matches("img")
        ) {
          return !!(
            element.currentSrc ||
            element.src
          );
        }

        return !!(
          element.getAttribute(
            "data-lightbox-src"
          ) ||
          element.getAttribute(
            "href"
          )
        );

      });

  }


  /* ============================================================
     08. BIND EVENTS
     ============================================================ */

  function bindEvents() {

    document.addEventListener(
      "click",
      function (event) {

        var trigger =
          event.target.closest(
            SELECTORS
          );

        if (!trigger) {
          return;
        }

        /*
         * Ignore clicks originating inside the lightbox itself.
         */

        if (
          overlay &&
          overlay.contains(trigger)
        ) {
          return;
        }

        event.preventDefault();

        var index =
          items.indexOf(trigger);

        /*
         * DOM may have changed since initialisation.
         */

        if (index === -1) {

          collectItems();

          index =
            items.indexOf(trigger);

        }

        if (index === -1) {
          return;
        }

        open(index);

      }
    );


    if (closeButton) {

      closeButton.addEventListener(
        "click",
        close
      );

    }


    if (previousButton) {

      previousButton.addEventListener(
        "click",
        function () {
          previous();
        }
      );

    }


    if (nextButton) {

      nextButton.addEventListener(
        "click",
        function () {
          next();
        }
      );

    }


    if (overlay) {

      overlay.addEventListener(
        "click",
        function (event) {

          /*
           * Clicking the backdrop closes the viewer.
           */

          if (
            event.target.matches(
              "[data-lightbox-close]"
            )
          ) {
            close();
          }

        }
      );

    }


    document.addEventListener(
      "keydown",
      handleKeyboard
    );


    /*
     * Basic swipe support for mobile.
     */

    initTouch();

  }


  /* ============================================================
     09. OPEN
     ============================================================ */

  function open(index) {

    if (
      !items.length ||
      index < 0 ||
      index >= items.length
    ) {
      return;
    }

    currentIndex =
      index;

    lastFocusedElement =
      document.activeElement;

    overlay.classList.add(
      "is-open"
    );

    overlay.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "sel-lightbox-open"
    );

    document.documentElement.classList.add(
      "sel-lightbox-active"
    );


    update();


    /*
     * Move focus into the dialog.
     */

    window.setTimeout(
      function () {

        if (closeButton) {
          closeButton.focus();
        }

      },
      50
    );

  }


  /* ============================================================
     10. CLOSE
     ============================================================ */

  function close() {

    if (
      !overlay ||
      !overlay.classList.contains(
        "is-open"
      )
    ) {
      return;
    }

    overlay.classList.remove(
      "is-open"
    );

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "sel-lightbox-open"
    );

    document.documentElement.classList.remove(
      "sel-lightbox-active"
    );


    /*
     * Clear the image after the close animation.
     */

    window.setTimeout(
      function () {

        if (
          !overlay.classList.contains(
            "is-open"
          )
        ) {

          lightboxImage.removeAttribute(
            "src"
          );

          lightboxImage.alt =
            "";

          caption.textContent =
            "";

          counter.textContent =
            "";

        }

      },
      250
    );


    /*
     * Return keyboard focus to the original trigger.
     */

    if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus ===
        "function"
    ) {

      window.setTimeout(
        function () {

          try {
            lastFocusedElement.focus();
          } catch (error) {
            /* Ignore focus restoration errors. */
          }

        },
        20
      );

    }

    lastFocusedElement =
      null;

    currentIndex =
      -1;

  }


  /* ============================================================
     11. UPDATE CURRENT IMAGE
     ============================================================ */

  function update() {

    if (
      currentIndex < 0 ||
      currentIndex >= items.length
    ) {
      return;
    }

    var item =
      items[currentIndex];

    var source =
      getSource(item);

    var alt =
      getAlt(item);

    var text =
      getCaption(item);


    if (!source) {
      return;
    }


    /*
     * Show loading state while a large map / figure loads.
     */

    overlay.classList.add(
      "is-loading"
    );


    lightboxImage.alt =
      alt;


    lightboxImage.onload =
      function () {

        overlay.classList.remove(
          "is-loading"
        );

      };


    lightboxImage.onerror =
      function () {

        overlay.classList.remove(
          "is-loading"
        );

        overlay.classList.add(
          "has-error"
        );

        caption.textContent =
          "Unable to load this image.";

      };


    overlay.classList.remove(
      "has-error"
    );


    /*
     * Set image source.
     */

    lightboxImage.src =
      source;


    /*
     * Caption.
     */

    caption.textContent =
      text;


    /*
     * Counter.
     */

    if (items.length > 1) {

      counter.textContent =
        (
          currentIndex + 1
        ) +
        " / " +
        items.length;

    } else {

      counter.textContent =
        "";

    }


    /*
     * Navigation controls.
     */

    var multiple =
      items.length > 1;

    previousButton.hidden =
      !multiple;

    nextButton.hidden =
      !multiple;


    /*
     * Keep controls visually available for looping galleries.
     */

    previousButton.setAttribute(
      "aria-label",
      "Previous image"
    );

    nextButton.setAttribute(
      "aria-label",
      "Next image"
    );


    /*
     * Update browser history only if explicitly requested.
     */

    var historyId =
      item.getAttribute(
        "data-lightbox-id"
      );

    if (historyId) {

      try {

        var url =
          new URL(
            window.location.href
          );

        url.hash =
          "image-" +
          historyId;

        window.history.replaceState(
          {
            lightbox:true,
            image:historyId
          },
          "",
          url.toString()
        );

      } catch (error) {
        /* Ignore malformed URLs. */
      }

    }

  }


  /* ============================================================
     12. SOURCE
     ============================================================ */

  function getSource(item) {

    if (
      item.matches("img")
    ) {

      return (
        item.getAttribute(
          "data-lightbox-src"
        ) ||
        item.currentSrc ||
        item.src
      );

    }


    return (
      item.getAttribute(
        "data-lightbox-src"
      ) ||
      item.getAttribute(
        "href"
      )
    );

  }


  /* ============================================================
     13. ALT TEXT
     ============================================================ */

  function getAlt(item) {

    if (
      item.matches("img")
    ) {

      return (
        item.getAttribute(
          "data-lightbox-alt"
        ) ||
        item.getAttribute(
          "alt"
        ) ||
        ""
      );

    }


    return (
      item.getAttribute(
        "data-lightbox-alt"
      ) ||
      item.getAttribute(
        "aria-label"
      ) ||
      ""
    );

  }


  /* ============================================================
     14. CAPTION
     ============================================================ */

  function getCaption(item) {

    var explicit =
      item.getAttribute(
        "data-caption"
      );

    if (explicit) {
      return explicit;
    }


    var title =
      item.getAttribute(
        "data-lightbox-title"
      );

    if (title) {
      return title;
    }


    /*
     * For figures, use the associated figcaption.
     */

    var figure =
      item.closest("figure");

    if (figure) {

      var figureCaption =
        figure.querySelector(
          "figcaption"
        );

      if (
        figureCaption &&
        figureCaption.textContent.trim()
      ) {

        return figureCaption
          .textContent
          .trim();

      }

    }


    /*
     * For linked images, use the link title.
     */

    return (
      item.getAttribute(
        "title"
      ) ||
      ""
    );

  }


  /* ============================================================
     15. NEXT
     ============================================================ */

  function next() {

    if (
      items.length < 2
    ) {
      return;
    }

    currentIndex =
      (
        currentIndex + 1
      ) %
      items.length;

    update();

  }


  /* ============================================================
     16. PREVIOUS
     ============================================================ */

  function previous() {

    if (
      items.length < 2
    ) {
      return;
    }

    currentIndex =
      (
        currentIndex - 1 +
        items.length
      ) %
      items.length;

    update();

  }


  /* ============================================================
     17. KEYBOARD CONTROLS
     ============================================================ */

  function handleKeyboard(event) {

    if (
      !overlay ||
      !overlay.classList.contains(
        "is-open"
      )
    ) {
      return;
    }


    switch (event.key) {

      case "Escape":

        event.preventDefault();

        close();

        break;


      case "ArrowRight":

        event.preventDefault();

        next();

        break;


      case "ArrowLeft":

        event.preventDefault();

        previous();

        break;


      case "Home":

        if (items.length > 1) {

          event.preventDefault();

          currentIndex =
            0;

          update();

        }

        break;


      case "End":

        if (items.length > 1) {

          event.preventDefault();

          currentIndex =
            items.length - 1;

          update();

        }

        break;

    }

  }


  /* ============================================================
     18. TOUCH / SWIPE
     ============================================================ */

  function initTouch() {

    if (!overlay) {
      return;
    }

    var startX = 0;
    var startY = 0;
    var endX = 0;
    var endY = 0;


    overlay.addEventListener(
      "touchstart",
      function (event) {

        if (
          !event.touches ||
          !event.touches.length
        ) {
          return;
        }

        startX =
          event.touches[0].clientX;

        startY =
          event.touches[0].clientY;

      },
      {
        passive:true
      }
    );


    overlay.addEventListener(
      "touchend",
      function (event) {

        if (
          !event.changedTouches ||
          !event.changedTouches.length
        ) {
          return;
        }

        endX =
          event.changedTouches[0].clientX;

        endY =
          event.changedTouches[0].clientY;


        var deltaX =
          endX - startX;

        var deltaY =
          endY - startY;


        /*
         * Only treat predominantly horizontal movement
         * as a gallery swipe.
         */

        if (
          Math.abs(deltaX) <
          50
        ) {
          return;
        }

        if (
          Math.abs(deltaX) <=
          Math.abs(deltaY)
        ) {
          return;
        }


        if (
          deltaX < 0
        ) {
          next();
        } else {
          previous();
        }

      },
      {
        passive:true
      }
    );

  }


  /* ============================================================
     19. DYNAMIC CONTENT SUPPORT
     ============================================================ */

  /*
   * If maps, charts or project components add images after page
   * load, they can call:
   *
   * window.SELLighbox.refresh();
   */

  function refresh() {

    collectItems();

  }


  /* ============================================================
     20. PROGRAMMATIC OPEN
     ============================================================ */

  function openElement(element) {

    if (!element) {
      return;
    }

    collectItems();

    var index =
      items.indexOf(element);

    if (index === -1) {
      return;
    }

    open(index);

  }


  /* ============================================================
     21. PUBLIC API
     ============================================================ */

  window.SELLighbox = {

    open:open,

    close:close,

    next:next,

    previous:previous,

    refresh:refresh,

    openElement:openElement

  };


})();
