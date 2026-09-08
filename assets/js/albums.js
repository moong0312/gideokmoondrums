/* ===========================================================================
   Gideok Moon — Albums
   The discography, and the one page that carries the bottom player: hearing a
   record while reading down the rest of the list is the point here.
   =========================================================================== */
(function () {
  "use strict";

  var GM = window.GM, S = GM.S, $ = GM.$, el = GM.el;

  GM.boot(function () {
    /* No featured block above the list — it was the first album again, told
       twice. Covers with a track carry their own play button, which hands off
       to the bottom player so the music keeps going down the page.

       One grid rather than two headed groups: as leader he has two records, so
       that row sat half-empty beside a full row of four. Six in three columns
       is two full rows, and the role rides on each card instead of a heading. */
    var host = $("#relAll");
    var order = { leader: 0, sideman: 1 };
    S.releases.slice()
      .sort(function (a, b) { return (order[a.role] - order[b.role]) || (b.year - a.year); })
      .forEach(function (r) { host.appendChild(GM.releaseCard(r)); });

    window.wirePlayer();
  });
})();
