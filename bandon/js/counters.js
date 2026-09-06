/* ============================================================
   counters.js
   Spatial Evidence Lab — Bandon Project
   Animated statistical counters / evidence metrics
   ============================================================ */

(function () {
  "use strict";


  /* ============================================================
     01. CONFIGURATION
     ============================================================ */

  var SELECTOR = "[data-counter]";

  var DEFAULT_DURATION = 1600;

  var DEFAULT_EASING = "easeOutCubic";

  var OBSERVER_THRESHOLD = 0.25;


  /* ============================================================
     02. STATE
     ============================================================ */

  var counters = [];

  var observer = null;


  /* ============================================================
     03. DOCUMENT READY
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

    initialise();

  });


  /* ============================================================
     05. INITIALISE COUNTERS
     ============================================================ */

  function initialise() {

    collectCounters();

    if (!counters.length) {
      return;
    }

    createObserver();

  }


  /* ============================================================
     06. COLLECT COUNTERS
     ============================================================ */

  function collectCounters() {

    counters =
      Array.prototype.slice.call(
        document.querySelectorAll(
          SELECTOR
        )
      );


    counters.forEach(function (element) {

      prepareCounter(element);

    });

  }


  /* ============================================================
     07. PREPARE COUNTER
     ============================================================ */

  function prepareCounter(element) {

    if (
      element.dataset.counterPrepared ===
      "true"
    ) {
      return;
    }


    /*
     * Store the target value.
     */

    var target =
      parseFloat(
        element.getAttribute(
          "data-counter"
        )
      );


    if (
      Number.isNaN(target)
    ) {
      return;
    }


    /*
     * Store the original displayed value.
     */

    element.dataset.counterTarget =
      String(target);


    /*
     * Optional formatting parameters.
     */

    var decimals =
      element.getAttribute(
        "data-counter-decimals"
      );


    if (
      decimals === null
    ) {

      decimals =
        getDecimalPlaces(target);

    } else {

      decimals =
        parseInt(
          decimals,
          10
        );

    }


    element.dataset.counterDecimals =
      String(
        Number.isNaN(decimals)
          ? 0
          : decimals
      );


    /*
     * Optional duration.
     */

    var duration =
      parseInt(
        element.getAttribute(
          "data-counter-duration"
        ) ||
        DEFAULT_DURATION,
        10
      );


    element.dataset.counterDuration =
      String(
        Number.isNaN(duration)
          ? DEFAULT_DURATION
          : duration
      );


    /*
     * Preserve prefix / suffix.
     */

    var prefix =
      element.getAttribute(
        "data-counter-prefix"
      );


    var suffix =
      element.getAttribute(
        "data-counter-suffix"
      );


    if (
      prefix === null
    ) {
      prefix = "";
    }


    if (
      suffix === null
    ) {
      suffix = "";
    }


    element.dataset.counterPrefix =
      prefix;

    element.dataset.counterSuffix =
      suffix;


    /*
     * Store thousands separator setting.
     */

    var separator =
      element.getAttribute(
        "data-counter-separator"
      );


    if (
      separator === null
    ) {

      separator = ",";

    }


    element.dataset.counterSeparator =
      separator;


    /*
     * Optional start value.
     */

    var start =
      parseFloat(
        element.getAttribute(
          "data-counter-start"
        )
      );


    if (
      Number.isNaN(start)
    ) {

      start = 0;

    }


    element.dataset.counterStart =
      String(start);


    /*
     * Display the initial value.
     */

    element.textContent =
      formatValue(
        start,
        element
      );


    element.dataset.counterPrepared =
      "true";

  }


  /* ============================================================
     08. INTERSECTION OBSERVER
     ============================================================ */

  function createObserver() {

    /*
     * Respect reduced-motion preferences.
     */

    if (
      window.matchMedia &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {

      counters.forEach(function (element) {

        showFinalValue(element);

      });

      return;

    }


    /*
     * IntersectionObserver is preferred because counters should
     * animate when the evidence card actually enters the viewport.
     */

    if (
      "IntersectionObserver" in window
    ) {

      observer =
        new IntersectionObserver(
          function (entries) {

            entries.forEach(function (entry) {

              if (
                entry.isIntersecting
              ) {

                animateCounter(
                  entry.target
                );

                observer.unobserve(
                  entry.target
                );

              }

            });

          },
          {
            threshold:
              OBSERVER_THRESHOLD
          }
        );


      counters.forEach(function (element) {

        observer.observe(
          element
        );

      });


    } else {

      /*
       * Fallback for older browsers.
       */

      counters.forEach(function (element) {

        animateCounter(
          element
        );

      });

    }

  }


  /* ============================================================
     09. ANIMATE COUNTER
     ============================================================ */

  function animateCounter(element) {

    if (
      !element ||
      element.dataset.counterAnimated ===
        "true"
    ) {
      return;
    }


    element.dataset.counterAnimated =
      "true";


    var start =
      parseFloat(
        element.dataset.counterStart
      );


    var target =
      parseFloat(
        element.dataset.counterTarget
      );


    var duration =
      parseInt(
        element.dataset.counterDuration,
        10
      );


    if (
      Number.isNaN(start)
    ) {
      start = 0;
    }


    if (
      Number.isNaN(target)
    ) {
      return;
    }


    if (
      Number.isNaN(duration) ||
      duration < 0
    ) {
      duration =
        DEFAULT_DURATION;
    }


    /*
     * If no animation is requested, show the target immediately.
     */

    if (
      duration === 0
    ) {

      showFinalValue(
        element
      );

      return;

    }


    var startTime =
      null;


    function frame(timestamp) {

      if (
        startTime === null
      ) {

        startTime =
          timestamp;

      }


      var elapsed =
        timestamp -
        startTime;


      var progress =
        Math.min(
          elapsed / duration,
          1
        );


      var eased =
        easing(
          progress
        );


      var value =
        start +
        (
          target - start
        ) *
        eased;


      element.textContent =
        formatValue(
          value,
          element
        );


      if (
        progress < 1
      ) {

        window.requestAnimationFrame(
          frame
        );

      } else {

        showFinalValue(
          element
        );

        element.dispatchEvent(
          new CustomEvent(
            "sel:counterComplete",
            {
              detail:{
                value:target
              }
            }
          )
        );

      }

    }


    window.requestAnimationFrame(
      frame
    );

  }


  /* ============================================================
     10. FINAL VALUE
     ============================================================ */

  function showFinalValue(element) {

    var target =
      parseFloat(
        element.dataset.counterTarget
      );


    if (
      Number.isNaN(target)
    ) {
      return;
    }


    element.textContent =
      formatValue(
        target,
        element
      );


    element.dataset.counterAnimated =
      "true";

  }


  /* ============================================================
     11. FORMATTING
     ============================================================ */

  function formatValue(
    value,
    element
  ) {

    var decimals =
      parseInt(
        element.dataset.counterDecimals ||
        "0",
        10
      );


    var prefix =
      element.dataset.counterPrefix ||
      "";


    var suffix =
      element.dataset.counterSuffix ||
      "";


    var separator =
      element.dataset.counterSeparator;


    if (
      separator === undefined
    ) {

      separator = ",";

    }


    /*
     * Prevent floating point artefacts during animation.
     */

    var rounded =
      Number(
        value.toFixed(
          decimals
        )
      );


    var fixed =
      rounded.toFixed(
        decimals
      );


    var parts =
      fixed.split(".");


    /*
     * Add thousands separators.
     */

    if (
      separator !== "none" &&
      separator !== ""
    ) {

      parts[0] =
        parts[0].replace(
          /\B(?=(\d{3})+(?!\d))/g,
          separator
        );

    }


    var formatted =
      parts.join(
        decimals > 0
          ? "."
          : ""
      );


    return (
      prefix +
      formatted +
      suffix
    );

  }


  /* ============================================================
     12. DECIMAL PLACES
     ============================================================ */

  function getDecimalPlaces(value) {

    if (
      Math.floor(value) === value
    ) {

      return 0;

    }


    var stringValue =
      String(value);


    var decimalPart =
      stringValue.split(
        "."
      )[1];


    return decimalPart
      ? decimalPart.length
      : 0;

  }


  /* ============================================================
     13. EASING
     ============================================================ */

  function easing(progress) {

    /*
     * Ease-out cubic.
     *
     * Starts quickly and settles smoothly at the target,
     * which works well for statistical evidence cards.
     */

    return 1 -
      Math.pow(
        1 - progress,
        3
      );

  }


  /* ============================================================
     14. REFRESH
     ============================================================ */

  function refresh() {

    if (
      observer
    ) {

      observer.disconnect();

      observer =
        null;

    }


    counters = [];

    initialise();

  }


  /* ============================================================
     15. RESET
     ============================================================ */

  function reset() {

    counters.forEach(function (element) {

      var start =
        parseFloat(
          element.dataset.counterStart ||
          "0"
        );


      element.dataset.counterAnimated =
        "false";


      element.textContent =
        formatValue(
          start,
          element
        );

    });

  }


  /* ============================================================
     16. RUN ALL
     ============================================================ */

  function runAll() {

    counters.forEach(function (element) {

      animateCounter(
        element
      );

    });

  }


  /* ============================================================
     17. PROGRAMMATIC COUNTER
     ============================================================ */

  function run(element) {

    if (
      typeof element ===
      "string"
    ) {

      element =
        document.querySelector(
          element
        );

    }


    if (!element) {
      return;
    }


    prepareCounter(
      element
    );


    animateCounter(
      element
    );

  }


  /* ============================================================
     18. DYNAMIC DOM SUPPORT
     ============================================================ */

  /*
   * Example:
   *
   * <span
   *   data-counter="18919"
   *   data-counter-suffix="+"
   * >
   *   0
   * </span>
   *
   * More examples:
   *
   * data-counter="96"
   * data-counter-suffix="%"
   *
   * data-counter="12.5"
   * data-counter-decimals="1"
   * data-counter-suffix=" min"
   *
   * data-counter="42"
   * data-counter-prefix="€"
   *
   */


  /* ============================================================
     19. PUBLIC API
     ============================================================ */

  window.SELCounters = {

    refresh: refresh,

    reset: reset,

    run: run,

    runAll: runAll

  };


})();
