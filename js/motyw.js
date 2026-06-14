// Przełącznik motywu Jasny/Ciemny dla portfolio (vanilla; spójny z hubem/site —
// tryb ciemny = klasa body.dark). Boot (założenie klasy z localStorage /
// preferencji systemu) robi inline script w <body> PRZED renderem, żeby tryb
// ciemny nie mignął jasnym. Tutaj tylko podpinamy przyciski i utrwalamy wybór;
// stan początkowy czytamy z body.classList (źródło prawdy = inline boot).
(function () {
  "use strict";

  var KLUCZ = "bijou.motyw";
  var seg = document.querySelector(".motyw-seg");
  if (!seg) return;
  var przyciski = seg.querySelectorAll(".motyw-seg__btn");

  // Odbij aktualny motyw (body.dark) na przyciskach: klasa aktywna + aria-pressed.
  function odswiez() {
    var ciemny = document.body.classList.contains("dark");
    przyciski.forEach(function (b) {
      var aktywny = (b.dataset.motyw === "ciemny") === ciemny;
      b.classList.toggle("motyw-seg__btn--aktywny", aktywny);
      b.setAttribute("aria-pressed", String(aktywny));
    });
  }

  seg.addEventListener("click", function (e) {
    var btn = e.target.closest(".motyw-seg__btn");
    if (!btn) return;
    var ciemny = btn.dataset.motyw === "ciemny";
    document.body.classList.toggle("dark", ciemny);
    try {
      localStorage.setItem(KLUCZ, ciemny ? "ciemny" : "jasny");
    } catch (err) {
      // zapis nieobowiązkowy (np. tryb prywatny)
    }
    odswiez();
  });

  odswiez();
})();
