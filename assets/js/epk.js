/* ===========================================================================
   Gideok Moon — EPK
   Everything a promoter or a writer needs in one place: what has been said,
   biographies at three lengths, photographs to download, and how to get hold
   of him.
   =========================================================================== */
(function () {
  "use strict";

  var GM = window.GM, S = GM.S, $ = GM.$, el = GM.el, esc = GM.esc;

  /* A panel reads the application with YouTube open beside it, so the page they
     were sent has to put the sound one click away. Streaming links, never a
     download — institutional networks block those. */
  function listen(host) {
    if (!host) return;

    function row(label, meta, href) {
      var a = el("a", "lw__row");
      a.href = href; a.target = "_blank"; a.rel = "noopener";
      a.appendChild(el("span", "lw__name", esc(label)));
      a.appendChild(el("span", "lw__meta mono", esc(meta)));
      a.appendChild(el("span", "lw__go", "↗"));
      return a;
    }

    var watch = el("div", "lw__col");
    watch.appendChild(el("p", "lw__h mono", "Watch"));
    S.works.forEach(function (w) {
      if (!w.videoId) return;
      watch.appendChild(row(w.name + (w.nameSub ? " " + w.nameSub : ""), w.kind,
        "https://youtu.be/" + w.videoId));
    });

    var hear = el("div", "lw__col");
    hear.appendChild(el("p", "lw__h mono", "Hear"));
    S.releases.forEach(function (r) {
      if (!r.link) return;
      hear.appendChild(row(r.title, r.credited + " · " + r.year, r.link));
    });

    host.appendChild(watch);
    host.appendChild(hear);
  }

  GM.boot(function () {
    listen($("#listenList"));
    GM.quotes($("#quotes"));
    GM.bios($("#bios"));
    GM.photos($("#photos"));
    GM.contact($("#contact"));
    GM.social($("#social"));
  });
})();
