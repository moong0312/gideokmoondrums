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

    $("#heroKicker").textContent = h.kicker;
    $("#heroL1").textContent = h.line1;
    $("#heroL2").textContent = h.line2;
    $("#heroRoles").textContent = a.roles;
    $("#heroBase").textContent = a.base;
    GM.setBg($("#heroStill"), [h.image]);

    /* The short bio, not the statement: someone who has just arrived wants to
       know who this is in a few seconds, and the longer reads are a click away
       on Solo and on the EPK page. */
    var host = $("#homeBio");
    var short = null;
    S.bios.forEach(function (b) { if (b.id === "short") short = b; });
    if (!short) short = S.bios[0];
    if (host && short) {
      short.text.split("\n\n").forEach(function (p) {
        host.appendChild(el("p", null, esc(p)));
      });
    }

    GM.social($("#social"));
  });
})();
