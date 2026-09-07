/* ===========================================================================
   Gideok Moon — project pages
   One renderer behind every project page. A page names the projects it shows
   with data-works on <body>; each is drawn from its entry in data.js together
   with the releases and dates that point back at it, so a page collects its
   own history rather than repeating it by hand.

   data-head="page" means the page is about a single project and its <h1> is
   that project's name, so the block does not repeat the heading. Without it
   the <h1> is whatever the file says and each project gets its own heading —
   which is what More projects needs.
   =========================================================================== */
(function () {
  "use strict";

  var GM = window.GM, S = GM.S, $ = GM.$, el = GM.el, esc = GM.esc;

  var ids = (document.body.getAttribute("data-works") || "")
    .split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  var headIsPage = document.body.getAttribute("data-head") === "page";

  function find(id) {
    for (var i = 0; i < S.works.length; i++) {
      if (S.works[i].id === id) return S.works[i];
    }
    return null;
  }

  /* A project with no album or no video yet should read as finished, not as a
     page with holes in it, so an empty part is left out rather than headed. */
  function part(host, label, build) {
    var box = el("div", "pj__part");
    var body = el("div", "pj__body");
    if (!build(body)) return;
    box.appendChild(el("p", "eyebrow", esc(label)));
    box.appendChild(body);
    host.appendChild(box);
  }

  function block(w) {
    var b = el("article", "pj rv");
    b.id = "p-" + w.id;

    if (!headIsPage) {
      var h = el("div", "pj__head");
      h.appendChild(el("h2", "pj__name",
        esc(w.name) + (w.nameSub ? ' <span class="pj__sub">' + esc(w.nameSub) + "</span>" : "")));
      h.appendChild(el("span", "pj__kind", esc(w.kind)));
      b.appendChild(h);
    }

    var lu = el("ul", "work__lineup");
    (w.lineup || []).forEach(function (m) { lu.appendChild(el("li", null, esc(m))); });
    b.appendChild(lu);

    if (w.text) b.appendChild(el("p", "wp__lead", esc(w.text)));

    (w.about || []).filter(function (p) { return p && p.trim(); })
      .forEach(function (p) { b.appendChild(el("p", "pj__p", esc(p))); });

    var acts = el("div", "wp__acts");
    if (w.more) {
      var pk = el("a", "btn btn--ghost", "Press kit ↗");
      pk.href = w.more; pk.target = "_blank"; pk.rel = "noopener";
      acts.appendChild(pk);
    }
    if (w.status) acts.appendChild(el("p", "work__status", esc(w.status)));
    if (acts.childNodes.length) b.appendChild(acts);

    /* A real embed rather than a hand-off to a player: someone deciding whether
       to book this should be able to press play where they are. */
    part(b, "Watch", function (host) {
      if (!w.videoId) return 0;
      var box = el("div", "wp__video");
      var f = el("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + w.videoId;
      f.title = w.name + " — video";
      f.loading = "lazy";
      f.allow = "accelerometer; clipboard-write; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      box.appendChild(f);
      host.appendChild(box);
      return 1;
    });

    part(b, "Releases", function (host) {
      var rs = S.releases.filter(function (r) { return r.work === w.id; });
      var grid = el("div", "wp__rels");
      rs.forEach(function (r) { grid.appendChild(GM.releaseCard(r)); });
      host.appendChild(grid);
      return rs.length;
    });

    part(b, "Live", function (host) {
      var ds = S.live.dates.filter(function (d) { return d.work === w.id; });
      var ul = el("ul", "dates");
      GM.dates(ul, ds, "all");
      host.appendChild(ul);
      if (ds.length) {
        var p = el("p", "wp__all");
        var a = el("a", "link", "All performances →");
        a.href = "performances.html";
        p.appendChild(a);
        host.appendChild(p);
      }
      return ds.length;
    });

    return b;
  }

  GM.boot(function () {
    var host = $("#wList");
    if (!host) return;

    var picked = ids.map(find).filter(Boolean);

    if (headIsPage && picked.length) {
      var w = picked[0];
      document.title = w.name + " — Gideok Moon";
      var k = $("#wKind"), n = $("#wName");
      if (k) k.textContent = w.kind;
      if (n) {
        n.innerHTML = esc(w.name) +
          (w.nameSub ? ' <span class="wp__sub">' + esc(w.nameSub) + "</span>" : "");
      }
    }

    picked.forEach(function (w) { host.appendChild(block(w)); });
  });
})();
