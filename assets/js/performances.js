/* ===========================================================================
   Gideok Moon — full performance archive
   Renders every date in data.js, grouped by year. No build step.
   =========================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var $ = function (s) { return document.querySelector(s); };

  var dates   = S.live.dates;
  var vidOnly = false;

  function render() {
    var list = vidOnly ? dates.filter(function (d) { return d.video; }) : dates;
    var host = $("#years");
    host.innerHTML = "";

    window.liveByYear(list).forEach(function (grp) {
      var wrap = document.createElement("section");
      wrap.className = "yr";

      var h = document.createElement("h2");
      h.className = "yr__h";
      h.textContent = grp[0];
      wrap.appendChild(h);

      var ul = document.createElement("ul");
      ul.className = "dates dates--all";
      grp[1].forEach(function (d) { ul.appendChild(window.liveRow(d, "all")); });
      wrap.appendChild(ul);

      host.appendChild(wrap);
    });

    $("#empty").hidden = list.length > 0;
    $("#count").textContent =
      list.length + (list.length === 1 ? " date" : " dates") +
      (vidOnly ? " with video" : ", 2021 – 2026");

    reveal();
  }

  /* Rows fade in as they arrive; re-run after every re-render. */
  function reveal() {
    var items = document.querySelectorAll(".rv:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      [].forEach.call(items, function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    [].forEach.call(items, function (n) { io.observe(n); });
  }

  function init() {
    render();
    $("#venues").textContent = S.live.venues;
    $("#yr").textContent = new Date().getFullYear();

    var btn = $("#vidOnly");
    btn.addEventListener("click", function () {
      vidOnly = !vidOnly;
      btn.setAttribute("aria-pressed", String(vidOnly));
      btn.classList.toggle("is-on", vidOnly);
      render();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
