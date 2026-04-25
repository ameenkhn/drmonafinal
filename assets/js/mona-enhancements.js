(function () {
  var body = document.body;
  if (!body) return;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var preloader = document.querySelector(".mona-preloader");
  var header = document.querySelector("#vl-header-sticky");
  var preloaderHidden = false;

  function updateHeaderOffset() {
    if (!header) return;
    document.documentElement.style.setProperty("--mona-header-offset", header.offsetHeight + "px");
  }

  function hidePreloader() {
    if (!preloader || preloaderHidden) return;
    preloaderHidden = true;
    body.classList.remove("mona-loading");
    preloader.classList.add("is-hidden");

    window.setTimeout(function () {
      if (preloader && preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }, 420);
  }

  window.addEventListener("load", function () {
    updateHeaderOffset();
    window.setTimeout(hidePreloader, prefersReducedMotion ? 40 : 180);
  });

  updateHeaderOffset();
  window.addEventListener("resize", updateHeaderOffset);
  window.addEventListener("orientationchange", updateHeaderOffset);
  window.setTimeout(updateHeaderOffset, 250);

  window.addEventListener("pageshow", hidePreloader);
  window.setTimeout(hidePreloader, 1800);

  var revealTargets = document.querySelectorAll([
    ".mona-page-hero-inner",
    ".mona-hero-copy",
    ".mona-hero-visual",
    ".mona-section-header",
    ".mona-trust-card",
    ".mona-card",
    ".mona-service-card",
    ".mona-video-card",
    ".mona-gallery-card",
    ".mona-quote-card",
    ".mona-contact-card",
    ".mona-media-card",
    ".mona-stat",
    ".mona-photo-stack",
    ".mona-contact-grid",
    ".mona-interest-spotlight",
    ".mona-interest-card",
    ".mona-interest-cta"
  ].join(","));

  revealTargets.forEach(function (node, index) {
    if (node.hasAttribute("data-mona-reveal")) return;
    node.setAttribute(
      "data-mona-reveal",
      node.matches(".mona-hero-copy, .mona-hero-visual, .mona-page-hero-inner") ? "hero" : "card"
    );
    node.style.setProperty("--mona-reveal-delay", Math.min(index * 45, 240) + "ms");
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (node) {
      node.classList.add("is-visible");
    });
    return;
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  });

  revealTargets.forEach(function (node) {
    revealObserver.observe(node);
  });
}());
