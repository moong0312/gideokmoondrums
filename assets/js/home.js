/* ===========================================================================
   Gideok Moon — front page
   The page as a poster: the name set large, three prints overlapping, then
   the next dates and the projects.
   =========================================================================== */
(function () {
  "use strict";
  var GM = window.GM, S = GM.S, $ = GM.$, el = GM.el, esc = GM.esc;

  GM.boot(function () {
    var a = S.artist, intro = S.hero.intro || [];

    $("#pxRoles").innerHTML = a.roles.split("·").map(function (r) { return esc(r.trim()); })
      .concat(esc(a.base)).join(" <i></i> ");
    $("#pxLead").textContent = intro[0] || "";
    $("#pxMore").textContent = intro[1] || "";
    GM.social($("#social"));

    /* What is next. Dates still to come, soonest first; when the calendar is
       empty the heading says Recent and the latest three stand in, so the
       block never sits there with nothing in it. */
    var today = new Date().toISOString().slice(0, 10);
    var all = S.live.dates.slice().sort(function (x, y) { return x.date < y.date ? -1 : 1; });
    var next = all.filter(function (d) { return d.date >= today; }).slice(0, 4);
    if (!next.length) { next = all.slice(-3).reverse(); $("#nxLabel").textContent = "Recent"; }
    next.forEach(function (d) {
      var li = el("li"), row = el("div");
      row.appendChild(el("span", "nx__d", esc(d.label.replace(/, \d{4}$/, ""))));
      row.appendChild(el("span", "nx__w", esc(d.project)));
      row.appendChild(el("span", "nx__v", esc(d.venue)));
      li.appendChild(row); $("#nx").appendChild(li);
    });

    /* The projects as the page's own large type — the navigation again, but
       as something to read rather than a row of labels. One line per page, so
       the album that shares the Solo page does not get a second entry. */
    var seen = {};
    S.works.forEach(function (w) {
      if (seen[w.page]) return; seen[w.page] = 1;
      var li = el("li"), link = el("a");
      link.href = w.page;
      link.appendChild(el("span", "pl__n", esc(w.name) + (w.nameSub ? " <small>" + esc(w.nameSub) + "</small>" : "")));
      link.appendChild(el("span", "pl__k", esc(w.kind) + " →"));
      li.appendChild(link); $("#pl").appendChild(li);
    });

    /* The three prints drift at different depths under the pointer, so the
       stack reads as layered rather than flat. Mouse only, and not at all for
       anyone who asked for less motion. */
    var stage = $("#pxStage");
    if (stage && window.matchMedia &&
        matchMedia("(hover:hover) and (pointer:fine)").matches &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var pics = stage.querySelectorAll(".px__pic");
      var top = document.querySelector(".px__top");
      var move = function (x, y) {
        for (var i = 0; i < pics.length; i++) {
          var d = +pics[i].getAttribute("data-depth");
          pics[i].style.transform = "translate(" + (x * d).toFixed(1) + "px," + (y * d).toFixed(1) + "px)";
        }
      };
      top.addEventListener("pointermove", function (e) {
        var r = top.getBoundingClientRect();
        move((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
      });
      top.addEventListener("pointerleave", function () { move(0, 0); });
    }
  });
})();
