/* ===========================================================================
   Gideok Moon — front page
   A photograph and a few lines. Everything else has a page of its own now,
   so the front page introduces him and then gets out of the way.
   =========================================================================== */
(function () {
  "use strict";

  var GM = window.GM, S = GM.S, $ = GM.$, el = GM.el, esc = GM.esc;

  GM.boot(function () {
    var h = S.hero, a = S.artist;

    $("#heroRoles").textContent = a.roles;
    $("#heroBase").textContent = a.base;
    GM.setBg($("#heroStill"), [h.image]);

    /* hero.intro, not the press bio: it skips what the kicker and the line under
       the title already say, so nothing on this screen is said twice. The longer
       reads are one click away on Solo and on the EPK page. */
    var host = $("#homeBio");
    if (host) {
      (h.intro || []).forEach(function (p) {
        host.appendChild(el("p", null, esc(p)));
      });
    }

    GM.social($("#social"));

    /* Mouse only, and only if the visitor hasn't asked for less movement:
       nothing here is worth a jitter on a phone or a headache on a desktop. */
    var shot = $("#heroStill"), intro = $(".intro");
    if (shot && intro && window.matchMedia &&
        matchMedia("(hover:hover) and (pointer:fine)").matches &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var place = function (x, y) {
        shot.style.backgroundPosition = (50 + x * 2.5) + "% " + (24 + y * 2.5) + "%";
      };
      intro.addEventListener("pointermove", function (e) {
        var r = intro.getBoundingClientRect();
        place((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
      });
      intro.addEventListener("pointerleave", function () { place(0, 0); });
    }
  });
})();
