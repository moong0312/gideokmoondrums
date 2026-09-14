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

    /* One solo project, drawn the same way whichever it is: words on the left,
       and beside them the video — or, for a record with no video yet, the
       record itself, so the right-hand column is never left empty. */
    var shown = {};   /* records already drawn inside a project block */

    function project(w) {
      return function (host) {
        if (!w) return 0;

        var head = el("div", "pj__head");
        head.appendChild(el("h2", "pj__name",
          esc(w.name) + (w.nameSub ? ' <span class="pj__sub">' + esc(w.nameSub) + "</span>" : "")));
        if (w.status) head.appendChild(el("span", "pj__kind", esc(w.status)));
        host.appendChild(head);

        var top = el("div", "pj__top");
        var intro = el("div", "pj__intro");

        var lu = el("ul", "work__lineup");
        (w.lineup || []).forEach(function (m) { lu.appendChild(el("li", null, esc(m))); });
        intro.appendChild(lu);

        if (w.text) intro.appendChild(el("p", "wp__lead", esc(w.text)));
        (w.about || []).filter(function (p) { return p && p.trim(); })
          .forEach(function (p) { intro.appendChild(el("p", "pj__p", esc(p))); });

        if (w.credits && w.credits.length) {
          var cr = el("ul", "pj__credits");
          w.credits.forEach(function (c) { cr.appendChild(el("li", null, esc(c))); });
          intro.appendChild(cr);
        }
        top.appendChild(intro);

        var media = null;
        if (w.videoId) {
          media = el("div", "pj__media");
          var box = el("div", "wp__video");
          var f = el("iframe");
          f.src = "https://www.youtube-nocookie.com/embed/" + w.videoId;
          f.title = w.name + " — video";
          f.loading = "lazy";
          f.allow = "accelerometer; clipboard-write; encrypted-media; picture-in-picture";
          f.allowFullscreen = true;
          box.appendChild(f);
          media.appendChild(box);
        } else {
          var rs = S.releases.filter(function (r) { return r.work === w.id; });
          if (rs.length) {
            media = el("div", "pj__media pj__media--record");
            rs.forEach(function (r) { media.appendChild(GM.releaseCard(r)); shown[r.title] = 1; });
          }
        }
        if (media) {
          top.className = "pj__top pj__top--split";
          top.appendChild(media);
        }
        host.appendChild(top);
        return 1;
      };
    }

    /* The solo project running now, then the album it grew out of. */
    section("soProjSec", project(find("solo")));
    section("soAllaSec", project(find("alla-prima")));

    /* Records under his own name, and the dates, abreast — one album alone was
       a card in a third of a row with the rest of the row empty. */
    var sec = $("#soFootSec");
    if (sec) {
      /* Records from any solo project, except one already standing in for a
         video above — so a record appears on this page exactly once, wherever
         it fits. */
      var soloIds = S.works.filter(function (w) { return w.page === "solo.html"; })
        .map(function (w) { return w.id; });
      var rs = S.releases.filter(function (r) {
        return soloIds.indexOf(r.work) !== -1 && !shown[r.title];
      });
      var ds = S.live.dates.filter(function (d) { return d.work === "solo"; });
      rs.forEach(function (r) { sec.querySelector("[data-rel]").appendChild(GM.releaseCard(r)); });
      GM.dates(sec.querySelector("[data-live]"), ds, "all");

      if (!rs.length) sec.querySelector("#soRel").remove();
      if (!ds.length) sec.querySelector("#soLive").remove();
      if (!rs.length || !ds.length) {
        var cols = sec.querySelector(".pj__cols");
        if (cols) cols.className = "pj__cols";
      }
      if (!rs.length && !ds.length) sec.remove(); else sec.hidden = false;
    }
  });
})();
