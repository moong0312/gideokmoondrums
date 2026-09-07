/* ===========================================================================
   Gideok Moon — Solo
   The page a promoter lands on for the solo work: the full biography, the
   solo project running now, and the records released under his own name.
   =========================================================================== */
(function () {
  "use strict";

  var GM = window.GM, S = GM.S, $ = GM.$, el = GM.el, esc = GM.esc;

  function find(id) {
    for (var i = 0; i < S.works.length; i++) {
      if (S.works[i].id === id) return S.works[i];
    }
    return null;
  }

  function section(id, build) {
    var sec = $("#" + id);
    if (!sec) return;
    if (!build(sec.querySelector("[data-host]"))) sec.remove();
    else sec.hidden = false;
  }

  GM.boot(function () {
    var w = find("solo");

    /* Biography — the long one. The shorter cuts are on the EPK page, where
       someone is there to copy a specific length. */
    section("soBioSec", function (host) {
      var long = null;
      S.bios.forEach(function (b) { if (b.id === "long") long = b; });
      if (!long) long = S.bios[S.bios.length - 1];
      if (!long) return 0;
      long.text.split("\n\n").forEach(function (p) {
        host.appendChild(el("p", null, esc(p)));
      });
      return 1;
    });

    /* The solo project running now. */
    section("soProjSec", function (host) {
      if (!w) return 0;

      var head = el("div", "pj__head");
      head.appendChild(el("h2", "pj__name",
        esc(w.name) + (w.nameSub ? ' <span class="pj__sub">' + esc(w.nameSub) + "</span>" : "")));
      if (w.status) head.appendChild(el("span", "pj__kind", esc(w.status)));
      host.appendChild(head);

      var lu = el("ul", "work__lineup");
      (w.lineup || []).forEach(function (m) { lu.appendChild(el("li", null, esc(m))); });
      host.appendChild(lu);

      if (w.text) host.appendChild(el("p", "wp__lead", esc(w.text)));
      (w.about || []).filter(function (p) { return p && p.trim(); })
        .forEach(function (p) { host.appendChild(el("p", "pj__p", esc(p))); });

      if (w.videoId) {
        var box = el("div", "wp__video");
        var f = el("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + w.videoId;
        f.title = w.name + " — video";
        f.loading = "lazy";
        f.allow = "accelerometer; clipboard-write; encrypted-media; picture-in-picture";
        f.allowFullscreen = true;
        box.appendChild(f);
        host.appendChild(box);
      }
      return 1;
    });

    /* Records under his own name. */
    section("soRelSec", function (host) {
      var rs = S.releases.filter(function (r) { return r.work === "solo"; });
      rs.forEach(function (r) { host.appendChild(GM.releaseCard(r)); });
      return rs.length;
    });

    section("soLiveSec", function (host) {
      var ds = S.live.dates.filter(function (d) { return d.work === "solo"; });
      return GM.dates(host, ds, "all");
    });
  });
})();
