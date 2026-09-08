/* ===========================================================================
   Gideok Moon — Albums
   The discography, and the one page that carries the bottom player: hearing a
   record while reading down the rest of the list is the point here.
   =========================================================================== */
(function () {
  "use strict";

  var GM = window.GM, S = GM.S, $ = GM.$, el = GM.el;

  GM.boot(function () {
    /* No featured block above the list: it was the first album again, told
       twice. Covers with a track carry their own play button instead, and it
       hands off to the bottom player so the music keeps going down the page. */
    var lead = $("#relLeader"), side = $("#relSideman");
    S.releases.forEach(function (r) {
      (r.role === "leader" ? lead : side).appendChild(GM.releaseCard(r));
    });

    window.wirePlayer();
  });
})();
