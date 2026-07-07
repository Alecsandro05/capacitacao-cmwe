(function () {
  "use strict";

  var STORAGE_KEY = "cmwe-theme";
  var THEMES = ["padrao", "alto-contraste"];
  var THEME_LABELS = {
    "padrao": "Modo padrão",
    "alto-contraste": "Alto contraste"
  };

  function applyTheme(theme) {
    if (theme === "padrao") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    var btn = document.querySelector("[data-a11y-toggle]");
    if (btn) {
      var next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
      btn.setAttribute("aria-label", "Acessibilidade: " + THEME_LABELS[theme] + ". Clique para mudar para " + THEME_LABELS[next] + ".");
      btn.title = THEME_LABELS[theme];
      btn.setAttribute("aria-pressed", theme !== "padrao" ? "true" : "false");
    }
  }

  function getStoredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return THEMES.indexOf(stored) !== -1 ? stored : "padrao";
    } catch (e) {
      return "padrao";
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage indisponível: segue sem persistir */
    }
  }

  function initTheme() {
    applyTheme(getStoredTheme());
  }

  function cycleTheme() {
    var current = getStoredTheme();
    var idx = THEMES.indexOf(current);
    var next = THEMES[(idx + 1) % THEMES.length];
    storeTheme(next);
    applyTheme(next);
  }

  function initModuleImageFallback() {
    document.querySelectorAll(".module-card-media img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.closest(".module-card-media").classList.add("media-fallback");
        img.remove();
      });
    });
  }

  function initNavToggle() {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var mainNav = document.getElementById("main-nav");
    if (!navToggle || !mainNav) return;

    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initNavToggle();
    initModuleImageFallback();

    var btn = document.querySelector("[data-a11y-toggle]");
    if (btn) {
      btn.addEventListener("click", cycleTheme);
    }
  });
})();
