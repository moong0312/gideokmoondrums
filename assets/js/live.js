/* ===========================================================================
   Gideok Moon — shared live-date row
   Used by the front page (index.html) and the full archive
   (performances.html) so both render the same markup from the same data.
   =========================================================================== */
(function () {
  "use strict";

  function el(t, c, h) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (h != null) n.innerHTML = h;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function ext(a, href) {
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    return a;
  }

  /* mode "home": the whole row is one link to the video, no personnel.
     mode "all":  a plain row with personnel and separate Video / Info tags,
                  because a row can carry both and anchors can't nest. */
  window.liveRow = function (d, mode) {
    var all = mode === "all";
    var li  = el("li", "date rv");
    var box = (!all && d.video) ? ext(el("a", "date__in"), d.video) : el("div", "date__in");

    box.appendChild(el("span", "date__when", esc(d.label)));

    var mid = el("div", "date__mid");
    mid.appendChild(el("p", "date__what", esc(d.project)));
    mid.appendChild(el("p", "date__where", esc(d.venue)));
    if (all && d.players) {
      mid.appendChild(el("p", "date__with", "with " + esc(d.players)));
    }
    box.appendChild(mid);

    if (all) {
      var tags = el("span", "date__tags");
      if (d.video) tags.appendChild(ext(el("a", "date__tag date__tag--vid", "Video ↗"), d.video));
      if (d.info)  tags.appendChild(ext(el("a", "date__tag", "Info ↗"), d.info));
      if (tags.childNodes.length) box.appendChild(tags);
    } else if (d.video) {
      box.appendChild(el("span", "date__vid", "Video ↗"));
    }

    li.appendChild(box);
    return li;
  };

  /* Newest first, then split into [year, dates] pairs in that same order. */
  window.liveByYear = function (dates) {
    var sorted = dates.slice().sort(function (a, b) {
      return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });
    var groups = [], seen = {};
    sorted.forEach(function (d) {
      var y = String(d.date).slice(0, 4);
      if (!seen[y]) { seen[y] = []; groups.push([y, seen[y]]); }
      seen[y].push(d);
    });
    return groups;
  };
})();
