/* ---------------------------------------------------------------------------
   Gideok Moon — light/dark toggle
   The initial theme is set synchronously by an inline script in <head> (so
   there's no flash of the wrong theme); this file only wires up the button
   and keeps its label in sync.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  var root = document.documentElement;
  var btn  = document.getElementById("themeToggle");
  if (!btn) return;

  function label(theme) {
    // The button always names the mode a click will switch *to*.
    btn.textContent = theme === "dark" ? "Light" : "Dark";
  }

  label(root.getAttribute("data-theme"));

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("gm-theme", next); } catch (e) {}
    label(next);
  });
})();
