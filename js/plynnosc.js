// Płynny, inercyjny scroll całej strony (bijoupath.com) przez Lenis.
// Kółko myszy daje natywnie skokowy, „schodkowy" ruch — Lenis wygładza go
// subtelnym poślizgiem, ciągłym od hero przez „what I do" i oś czasu aż po stopkę.
// Oś czasu (script.js) i dolna krawędź nagłówka (reveal.js) czytają REALNY
// window.scrollY / getBoundingClientRect, który Lenis zachowuje (przewija okno
// naprawdę, nie udaje transformem) — więc działają bez zmian. Dotyk zostaje
// natywny; reduced-motion wyłącza wygładzanie.
(function () {
  "use strict";

  // Reduced-motion: nie wygładzamy — zostaje natywny scroll (oś czasu ma już
  // własny fallback do przeciągania).
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // CDN nie wstał (offline / niezgodne SRI) — cichy powrót do natywnego scrolla.
  if (typeof Lenis === "undefined") return;

  var lenis = new Lenis({
    lerp: 0.12,         // subtelne dociąganie; ↓ = większy poślizg, ↑ = bliżej natywnego
    smoothWheel: true,  // dotyk zostaje natywny (smoothTouch domyślnie wyłączony)
    wheelMultiplier: 1
  });

  // Udostępniamy instancję — zabezpieczenie pod ewentualny lenis.resize()
  // wywoływany z osi czasu, gdy ta zmienia wysokość toru (.tl-track).
  window.lenis = lenis;

  function raf(czas) {
    lenis.raf(czas);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Kotwice (np. logo „Bijou" href="#") — płynny powrót/dojazd przez Lenis,
  // spójny z resztą scrolla zamiast natywnego skoku.
  document.addEventListener("click", function (e) {
    if (!e.target || !e.target.closest) return;
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var cel = a.getAttribute("href");
    e.preventDefault();
    lenis.scrollTo(cel === "#" ? 0 : cel);
  });
})();
