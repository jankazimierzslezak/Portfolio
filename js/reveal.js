// Ruch 2.0 dla portfolio (bijoupath.com): zdjęcie „kurtyny" (html.is-ready),
// wjazd intro przy starcie (html.gotowe), dolna krawędź nagłówka po przewinięciu
// (header.przewinieta) oraz odsłanianie treści przy przewijaniu (.odslon).
// CSS (ruch.css/style.css) gasi ruch przy prefers-reduced-motion — tu tylko
// dokładamy klasy. Niezależne od logiki osi czasu (script.js).
(function () {
  "use strict";
  var h = document.documentElement;

  // Pokaż stronę (kurtyna) + wjazd intro po pierwszej klatce.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      h.classList.add("is-ready");
      h.classList.add("gotowe");
    });
  });

  // Dolna krawędź nagłówka pojawia się po przewinięciu (klasa „przewinieta").
  var naglowek = document.querySelector("header");
  function naScroll() {
    if (naglowek) naglowek.classList.toggle("przewinieta", window.scrollY > 24);
  }
  window.addEventListener("scroll", naScroll, { passive: true });
  naScroll();

  // Odsłanianie przy przewijaniu.
  var cele = document.querySelectorAll(".odslon");
  if (!("IntersectionObserver" in window)) {
    cele.forEach(function (el) {
      el.classList.add("widoczne");
    });
    return;
  }
  var io = new IntersectionObserver(
    function (wpisy) {
      wpisy.forEach(function (w) {
        if (w.isIntersecting) {
          w.target.classList.add("widoczne");
          io.unobserve(w.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  cele.forEach(function (el) {
    io.observe(el);
  });
})();
