/* ===========================================================================
   Gideok Moon — Albums
   The discography, and the one page that carries the bottom player: hearing a
   record while reading down the rest of the list is the point here.
   =========================================================================== */
(function () {
  "use strict";

  var GM = window.GM, S = GM.S, $ = GM.$, el = GM.el;

  GM.boot(function () {
    /* The featured item is a track, not a clip: send it to the bottom player so
       it keeps playing while the visitor reads on. */
    var f = S.featured;
    var box = $("#featuredVideo");
    if (box && f && f.videoId) {
      $("#ftTitle").textContent = f.title;
      $("#ftMeta").textContent = f.meta;
      if (f.square) box.closest(".feature").classList.add("feature--square");

      var thumb = el("div", "ytbox__thumb");
      box.appendChild(thumb);
      box.appendChild(el("div", "ytbox__play", "<i></i>"));
      GM.setBg(thumb, [f.image].concat(GM.ytThumb(f.videoId)));

      box.setAttribute("role", "button");
      box.setAttribute("tabindex", "0");
      box.setAttribute("aria-label", "Play " + f.title);

      var go = function () { window.Player.playById(f.videoId, f.title, f.meta); };
      box.addEventListener("click", go);
      box.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    } else if (box) {
      var sec = box.closest("section");
      if (sec) sec.remove();
    }

    var lead = $("#relLeader"), side = $("#relSideman");
    S.releases.forEach(function (r) {
      (r.role === "leader" ? lead : side).appendChild(GM.releaseCard(r));
    });

    window.wirePlayer();
  });
})();
