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

    /* Words on the left, the video beside them rather than a screen further
       down — the text column alone left half the page empty. */
    var top = el("div", "pj__top");
    var intro = el("div", "pj__intro");

    /* With members written out further down, a one-line line-up above the
       text would say the same thing twice. */
    if (!(w.members && w.members.length)) {
      var lu = el("ul", "work__lineup");
      (w.lineup || []).forEach(function (m) { lu.appendChild(el("li", null, esc(m))); });
      intro.appendChild(lu);
    }

    if (w.text) intro.appendChild(el("p", "wp__lead", esc(w.text)));

    (w.about || []).filter(function (p) { return p && p.trim(); })
      .forEach(function (p) { intro.appendChild(el("p", "pj__p", esc(p))); });

    var acts = el("div", "wp__acts");
    if (w.more) {
      var pk = el("a", "btn btn--ghost", (w.members ? "PDF version" : "Press kit") + " ↗");
      pk.href = w.more; pk.target = "_blank"; pk.rel = "noopener";
      acts.appendChild(pk);
    }
    if (w.status) acts.appendChild(el("p", "work__status", esc(w.status)));
    if (acts.childNodes.length) intro.appendChild(acts);

    top.appendChild(intro);

    /* A real embed rather than a hand-off to a player: someone deciding whether
       to book this should be able to press play where they are. */
    if (w.videoId) {
      top.className = "pj__top pj__top--split";
      var media = el("div", "pj__media");
      media.appendChild(el("p", "eyebrow", "Watch"));
      var box = el("div", "wp__video");
      var f = el("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + w.videoId;
      f.title = w.name + " — video";
      f.loading = "lazy";
      f.allow = "accelerometer; clipboard-write; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      box.appendChild(f);
      media.appendChild(box);
      top.appendChild(media);
    }

    var dates = S.live.dates.filter(function (d) { return d.work === w.id; });

    function liveInto(host) {
      var ul = el("ul", "dates");
      GM.dates(ul, dates, "all");
      host.appendChild(ul);
      var p = el("p", "wp__all");
      var a = el("a", "link", "More performances →");
      a.href = "performances.html";
      p.appendChild(a);
      host.appendChild(p);
      return dates.length;
    }

    /* A project with no video would otherwise leave the right-hand column empty
       and let the paragraph run the whole width. Its dates go there instead —
       real content rather than a stretched line. */
    var hasKit = (w.technical && w.technical.length) || (w.links && w.links.length);
    var liveIsBeside = !w.videoId && dates.length && !hasKit;
    if (liveIsBeside) {
      top.className = "pj__top pj__top--split";
      var side = el("div", "pj__media");
      side.appendChild(el("p", "eyebrow", "Live"));
      liveInto(side);
      top.appendChild(side);
    }
    b.appendChild(top);

    /* Each member in their own words — what the PDF used to be the only place
       for. Three abreast, the way a promoter compares a line-up. */
    if (w.members && w.members.length) {
      var mem = el("div", "pj__part pj__part--rule");
      mem.appendChild(el("p", "eyebrow", "The " + esc(String(w.kind || "group").toLowerCase())));
      var grid = el("div", "pj__members");
      w.members.forEach(function (m) {
        var c = el("div", "mem");
        c.appendChild(el("h3", "mem__name", esc(m.name)));
        if (m.role) c.appendChild(el("p", "mem__role", esc(m.role)));
        if (m.bio) c.appendChild(el("p", "mem__bio", esc(m.bio)));
        grid.appendChild(c);
      });
      mem.appendChild(grid);
      b.appendChild(mem);
    }

    /* Dates, then what the room needs beside where to listen and write — the
       things a venue checks before it replies, in the order the PDF gave them. */
    if (hasKit) {
      /* Dates keep the full width their row layout was drawn for; squeezed
         into a third they broke every title into a column of single words. */
      if (dates.length) {
        var lv = el("div", "pj__part--rule");
        part(lv, "Recent performances", liveInto);
        lv.firstChild.style.marginTop = "0";
        b.appendChild(lv);
      }
      var facts = el("div", "pj__facts pj__part--rule");
      part(facts, "Technical", function (host) {
        if (!(w.technical && w.technical.length)) return 0;
        var dl = el("dl", "pj__kit");
        w.technical.forEach(function (r) {
          dl.appendChild(el("dt", null, esc(r.k)));
          dl.appendChild(el("dd", null, esc(r.v)));
        });
        host.appendChild(dl);
        return 1;
      });
      part(facts, "Listen & contact", function (host) {
        var dl = el("dl", "pj__kit");
        (w.links || []).forEach(function (r) {
          dl.appendChild(el("dt", null, esc(r.k)));
          var dd = el("dd"), a = el("a", null, esc(r.text));
          a.href = r.url; a.target = "_blank"; a.rel = "noopener";
          dd.appendChild(a); dl.appendChild(dd);
        });
        var A = S.artist;
        dl.appendChild(el("dt", null, "Booking"));
        var dd = el("dd");
        dd.appendChild(document.createTextNode(A.name + " — "));
        var m = el("a", null, esc(A.email)); m.href = "mailto:" + A.email; dd.appendChild(m);
        if (A.phone) {
          dd.appendChild(document.createTextNode(" · "));
          var ph = el("a", null, esc(A.phone)); ph.href = "tel:" + A.phone.replace(/[^+\d]/g, "");
          dd.appendChild(ph);
        }
        dl.appendChild(dd);
        host.appendChild(dl);
        return 1;
      });
      facts.className += " pj__facts--" + facts.children.length;
      b.appendChild(facts);
    }

    /* Records and dates abreast. One album on its own was a card in a third of
       a row with the rest of the row empty; next to the dates it isn't. */
    var cols = el("div", "pj__cols");
    part(cols, "Releases", function (host) {
      var rs = S.releases.filter(function (r) { return r.work === w.id; });
      var grid = el("div", "wp__rels");
      rs.forEach(function (r) { grid.appendChild(GM.releaseCard(r)); });
      host.appendChild(grid);
      return rs.length;
    });
    if (!liveIsBeside && !hasKit) part(cols, "Live", liveInto);
    if (cols.children.length === 2) cols.className = "pj__cols pj__cols--split";
    if (cols.children.length) b.appendChild(cols);

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
      if (k) k.textContent = w.tagline || w.kind;
      if (n) {
        n.innerHTML = esc(w.name) +
          (w.nameSub ? ' <span class="wp__sub">' + esc(w.nameSub) + "</span>" : "");
      }
    }

    picked.forEach(function (w) { host.appendChild(block(w)); });
  });
})();
