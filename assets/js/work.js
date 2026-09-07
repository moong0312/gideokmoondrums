/* ===========================================================================
   Gideok Moon — project page
   One renderer behind every project page. Each page carries its own <head>
   so a link to it previews as that project rather than as the whole site,
   and names its project with data-work on <body>; everything below the nav
   is built from that project's entry in data.js.
   =========================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (t, c, h) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (h != null) n.innerHTML = h;
    return n;
  };
  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  var id = document.body.getAttribute("data-work");
  var w  = null;
  for (var i = 0; i < S.works.length; i++) {
    if (S.works[i].id === id) { w = S.works[i]; break; }
  }
  if (!w) return;

  /* A section with nothing to show is removed rather than left as an empty
     heading — a project with no album yet should read as complete, not broken. */
  function fill(secId, hostId, build) {
    var sec = $("#" + secId);
    if (!sec) return;
    var n = build($("#" + hostId));
    if (!n) sec.remove(); else sec.hidden = false;
  }

  /* ------------------------------------------------------------------ head -- */
  document.title = w.name + " — Gideok Moon";
  $("#wKind").textContent = w.kind;
  $("#wName").innerHTML = esc(w.name) +
    (w.nameSub ? ' <span class="wp__sub">' + esc(w.nameSub) + "</span>" : "");
  if (w.text) $("#wLead").textContent = w.text; else $("#wLead").remove();

  var lu = $("#wLineup");
  (w.lineup || []).forEach(function (m) { lu.appendChild(el("li", null, esc(m))); });

  /* Press kit first — it is the thing a promoter actually came for. */
  var acts = $("#wActs");
  if (w.more) {
    var pk = el("a", "btn btn--ghost", "Press kit ↗");
    pk.href = w.more; pk.target = "_blank"; pk.rel = "noopener";
    acts.appendChild(pk);
  }
  var bk = el("a", "btn btn--ghost", "Booking");
  bk.href = "index.html#booking";
  acts.appendChild(bk);

  if (w.status) acts.appendChild(el("p", "work__status", esc(w.status)));

  /* ----------------------------------------------------------------- about -- */
  fill("wAboutSec", "wAbout", function (host) {
    var ps = (w.about || []).filter(function (p) { return p && p.trim(); });
    ps.forEach(function (p) { host.appendChild(el("p", null, esc(p))); });
    return ps.length;
  });

  /* ----------------------------------------------------------------- video -- */
  /* A real embed rather than a hand-off to the bottom player: someone deciding
     whether to book this project should be able to press play where they are. */
  fill("wVideoSec", "wVideo", function (host) {
    if (!w.videoId) return 0;
    var f = el("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + w.videoId;
    f.title = w.name + " — video";
    f.loading = "lazy";
    f.allow = "accelerometer; clipboard-write; encrypted-media; picture-in-picture";
    f.allowFullscreen = true;
    host.appendChild(f);
    return 1;
  });

  /* -------------------------------------------------------------- releases -- */
  fill("wRelSec", "wRels", function (host) {
    var rs = S.releases.filter(function (r) { return r.work === w.id; });
    rs.forEach(function (r) {
      var a = el("a", "release");
      a.href = r.link || "#"; a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("aria-label", r.title + " — listen");
      var art = el("div", "release__art");
      var img = el("div", "release__img");
      img.style.backgroundImage = 'url("' + r.image + '")';
      art.appendChild(img);
      art.appendChild(el("span", "release__go", "Listen ↗"));
      a.appendChild(art);
      a.appendChild(el("h3", "release__title", esc(r.title)));
      a.appendChild(el("p", "release__by", esc(r.credited)));
      a.appendChild(el("p", "release__meta",
        esc(r.year + (r.label ? " · " + r.label : ""))));
      if (r.note) a.appendChild(el("p", "release__note", esc(r.note)));
      host.appendChild(a);
    });
    return rs.length;
  });

  /* ------------------------------------------------------------------ live -- */
  fill("wLiveSec", "wDates", function (host) {
    var ds = S.live.dates.filter(function (d) { return d.work === w.id; });
    window.liveByYear(ds).forEach(function (grp) {
      grp[1].forEach(function (d) { host.appendChild(window.liveRow(d, "all")); });
    });
    return ds.length;
  });

  /* ----------------------------------------------------------------- other -- */
  /* The other projects, so a promoter who followed one link can see the rest
     without being sent back to the front page to hunt for them. */
  var others = $("#wOthers");
  S.works.forEach(function (o) {
    if (o.id === w.id) return;
    var a = el("a", "wp__other");
    a.href = o.page;
    a.appendChild(el("span", "wp__other-n",
      esc(o.name) + (o.nameSub ? " " + esc(o.nameSub) : "")));
    a.appendChild(el("span", "wp__other-k", esc(o.kind)));
    others.appendChild(a);
  });

  var yr = $("#yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
