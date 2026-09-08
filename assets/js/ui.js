/* ===========================================================================
   Gideok Moon — shared pieces
   The site is several pages now, and most of them are built from the same
   handful of parts. Those live here, on window.GM, so a page script is only
   the part that is actually particular to that page.
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

  /* maxresdefault is missing on plenty of uploads (Shorts especially), so
     always keep hqdefault behind it. */
  var ytThumb = function (id) {
    return id ? ["https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg",
                 "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"] : [];
  };

  /* Apply a background image only once it actually loads, so a missing file
     falls back to the next source, and finally to the CSS gradient. */
  function setBg(node, sources) {
    if (!node) return;
    var list = [].concat(sources || []).filter(Boolean);
    (function attempt(i) {
      if (i >= list.length) return;
      var probe = new Image();
      probe.onload = function () {
        node.style.backgroundImage = 'url("' + list[i] + '")';
        node.classList.add("has-img");
      };
      probe.onerror = function () { attempt(i + 1); };
      probe.src = list[i];
    })(0);
  }

  /* ------------------------------------------------------------- releases -- */
  /* Two things you can do with a record: hear a track from it, or go and stream
     it. They used to be one link, with the hearing split off into a separate
     block above that repeated the first album. Both live on the cover now. */
  function releaseCard(r) {
    var card = el("div", "release rv");

    var art = el("div", "release__art");
    var a = el("a", "release__link");
    a.href = r.link || "#";
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", r.title + " — listen");
    var img = el("div", "release__img");
    a.appendChild(img);
    a.appendChild(el("span", "release__go", "Listen ↗"));
    setBg(img, [r.image]);
    art.appendChild(a);

    if (r.videoId && window.Player) {
      var play = el("button", "release__play");
      play.type = "button";
      play.setAttribute("aria-label", "Play " + (r.track || r.title));
      play.appendChild(el("span", "pico pico--play"));
      play.addEventListener("click", function (e) {
        e.preventDefault();
        window.Player.playById(r.videoId, r.track || r.title, r.credited);
      });
      art.appendChild(play);
    }

    card.appendChild(art);
    card.appendChild(el("h4", "release__title", esc(r.title)));
    card.appendChild(el("p", "release__by", esc(r.credited)));
    card.appendChild(el("p", "release__meta",
      esc(r.year + (r.label ? " · " + r.label : "")) +
      (r.role ? ' <span class="release__role">' + esc(r.role) + "</span>" : "")));
    if (r.note) card.appendChild(el("p", "release__note", esc(r.note)));
    return card;
  }

  /* ------------------------------------------------------------------ live -- */
  function dates(host, list, mode) {
    if (!host) return 0;
    window.liveByYear(list).forEach(function (grp) {
      grp[1].forEach(function (d) { host.appendChild(window.liveRow(d, mode || "all")); });
    });
    return list.length;
  }

  /* ------------------------------------------------------------------ bios -- */
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }

  function bios(host) {
    if (!host) return;
    S.bios.forEach(function (b) {
      var card = el("div", "bio rv");
      var top = el("div", "bio__top");
      top.appendChild(el("div", "bio__lab",
        "<strong>" + esc(b.label) + "</strong><span>" + esc(b.words) + "</span>"));

      var btn = el("button", "copy", "Copy");
      btn.type = "button";
      btn.addEventListener("click", function () {
        var done = function () {
          btn.textContent = "Copied";
          btn.classList.add("is-done");
          setTimeout(function () {
            btn.textContent = "Copy";
            btn.classList.remove("is-done");
          }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(b.text).then(done, function () { fallbackCopy(b.text, done); });
        } else { fallbackCopy(b.text, done); }
      });
      top.appendChild(btn);
      card.appendChild(top);

      var body = el("div", "bio__text");
      b.text.split("\n\n").forEach(function (p) { body.appendChild(el("p", null, esc(p))); });
      card.appendChild(body);

      host.appendChild(card);
    });
  }

  /* ---------------------------------------------------------------- photos -- */
  function photos(host) {
    if (!host) return;
    S.photos.forEach(function (p) {
      var li = el("li");
      var a = el("a", "photo");
      a.href = p.file;
      a.setAttribute("download", "");

      var t = el("span", "photo__thumb");
      setBg(t, [p.file]);
      a.appendChild(t);

      a.appendChild(el("span", "photo__b",
        "<strong>" + esc(p.label) + "</strong><span>" +
        esc(p.credit ? "Photo: " + p.credit : "JPG") + "</span>"));
      a.appendChild(el("span", "photo__dl", "Download"));

      li.appendChild(a);
      host.appendChild(li);
    });
  }

  /* ---------------------------------------------------------------- quotes -- */
  function quotes(host) {
    if (!host) return;
    S.press.forEach(function (q) {
      var b = el("blockquote", "quote rv");
      b.appendChild(el("p", "quote__t", "“" + esc(q.quote) + "”"));
      b.appendChild(el("p", "quote__by",
        esc(q.source) + (q.detail ? " <span>— " + esc(q.detail) + "</span>" : "")));
      host.appendChild(b);
    });
  }

  /* --------------------------------------------------------------- contact -- */
  /* Address and phone are printed rather than hidden behind a form, so both are
     real links: a promoter on a phone taps to call, on a desktop clicks to mail. */
  function contact(host) {
    if (!host) return;
    var a = S.artist;
    [["Email", a.email, "mailto:" + a.email],
     ["Phone", a.phone, "tel:" + String(a.phone || "").replace(/[^+\d]/g, "")]]
      .forEach(function (row) {
        if (!row[1]) return;
        var d = el("div", "cx__row");
        d.appendChild(el("span", "cx__k mono", esc(row[0])));
        var link = el("a", "cx__v");
        link.href = row[2];
        link.textContent = row[1];
        d.appendChild(link);
        host.appendChild(d);
      });
  }

  function social(host) {
    if (!host) return;
    var a = S.artist;
    [["Instagram", a.instagram], ["YouTube", a.youtube], ["All links", a.linktree]]
      .forEach(function (pair) {
        if (!pair[1]) return;
        var li = el("li");
        var link = el("a", null, esc(pair[0]) + " ↗");
        link.href = pair[1]; link.target = "_blank"; link.rel = "noopener";
        li.appendChild(link);
        host.appendChild(li);
      });
  }

  /* ----------------------------------------------------------------- chrome -- */
  function wireNav() {
    var nav = $("#nav");
    if (!nav || nav.classList.contains("is-stuck")) return;
    var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 40); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function wireReveal() {
    var items = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* The letterbox photograph under the nav. Every page opens on a picture
     rather than on a heading — a promoter who followed a link should see the
     playing before they read about it. The chip captions it. */
  function banner() {
    var host = $("#banner");
    if (!host) return;
    var b = (S.banners || {})[here()];
    if (!b) { host.remove(); return; }

    var img = el("div", "banner__img");
    img.setAttribute("role", "img");
    img.setAttribute("aria-label", b.label || "Gideok Moon");
    setBg(img, [b.image].concat(ytThumb(b.videoId)));
    if (b.label) img.appendChild(el("span", "banner__chip", esc(b.label)));
    host.appendChild(img);
  }

  function here() {
    return location.pathname.split("/").pop() || "index.html";
  }

  /* Marks the nav link for the page being viewed, so a visitor who arrived on a
     project link can see where they are in the site. */
  function markNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".nav__links a");
    for (var i = 0; i < links.length; i++) {
      if ((links[i].getAttribute("href") || "").split("#")[0] === here) {
        links[i].classList.add("is-here");
      }
    }
  }

  function year() {
    var y = $("#yr");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* Footer contact is on every page, so there is never a dead end. */
  function footer() {
    contact($("#footContact"));
    year();
  }

  function boot(fn) {
    var run = function () {
      banner();
      fn();
      wireNav();
      wireReveal();
      markNav();
      footer();
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else { run(); }
  }

  window.GM = {
    S: S, $: $, el: el, esc: esc, ytThumb: ytThumb, setBg: setBg,
    releaseCard: releaseCard, dates: dates, bios: bios, photos: photos,
    quotes: quotes, contact: contact, social: social,
    wireNav: wireNav, wireReveal: wireReveal, year: year, boot: boot
  };
})();
