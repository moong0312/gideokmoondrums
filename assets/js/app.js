/* ===========================================================================
   Gideok Moon — EPK
   Renders everything from data.js. Vanilla JS, no build step.
   =========================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var $  = function (s, r) { return (r || document).querySelector(s); };
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

  /* ---------------------------------------------------------------- hero -- */
  function renderHero() {
    var h = S.hero, a = S.artist;
    $("#heroKicker").textContent = h.kicker;
    $("#heroL1").textContent = h.line1;
    $("#heroL2").textContent = h.line2;
    $("#heroRoles").textContent = a.roles;
    $("#heroBase").textContent = a.base;
    setBg($("#heroStill"), [h.image]);
  }

  /* ----------------------------------------------------------- statement -- */
  function renderStatement() {
    var st = S.statement;
    $("#stLead").textContent = st.lead;
    var body = $("#stBody");
    st.body.forEach(function (p) { body.appendChild(el("p", null, esc(p))); });

    var facts = $("#stFacts");
    st.facts.forEach(function (row) {
      var d = el("div");
      d.appendChild(el("dt", null, esc(row[0])));
      d.appendChild(el("dd", null, esc(row[1])));
      facts.appendChild(d);
    });
  }

  /* --------------------------------------------------- inline video boxes -- */
  /* Click a box → swap the still for an autoplaying iframe. */
  function buildYtBox(box, videoId, poster) {
    if (!videoId) { box.remove(); return; }
    box.dataset.video = videoId;
    var thumb = el("div", "ytbox__thumb");
    var play  = el("div", "ytbox__play", "<i></i>");
    box.appendChild(thumb);
    box.appendChild(play);
    setBg(thumb, [poster].concat(ytThumb(videoId)));

    box.setAttribute("role", "button");
    box.setAttribute("tabindex", "0");
    box.setAttribute("aria-label", "Play video");

    function go() {
      if (box.dataset.live === "1") return;
      box.dataset.live = "1";
      if (window.Player) window.Player.pause();
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + videoId +
              "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      f.title = "Video";
      box.innerHTML = "";
      box.appendChild(f);
    }
    box.addEventListener("click", go);
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  }

  /* The featured item is a track, not a clip: send it to the bottom player so
     it keeps playing while the visitor scrolls on. */
  function renderFeatured() {
    var f = S.featured;
    $("#ftTitle").textContent = f.title;
    $("#ftMeta").textContent = f.meta;

    var box = $("#featuredVideo");
    if (!f.videoId) { box.remove(); return; }
    if (f.square) box.closest(".feature").classList.add("feature--square");

    var thumb = el("div", "ytbox__thumb");
    box.appendChild(thumb);
    box.appendChild(el("div", "ytbox__play", "<i></i>"));
    setBg(thumb, [f.image].concat(ytThumb(f.videoId)));

    box.setAttribute("role", "button");
    box.setAttribute("tabindex", "0");
    box.setAttribute("aria-label", "Play " + f.title);

    var go = function () { Player.playById(f.videoId, f.title, f.meta); };
    box.addEventListener("click", go);
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  }

  /* ---------------------------------------------------------------- work -- */
  function renderWork() {
    var host = $("#works");
    S.works.forEach(function (w, i) {
      var card = el("article", "work rv");
      card.id = "work-" + w.id;

      var media = el("div", "work__media");
      media.appendChild(el("span", "work__num", "0" + (i + 1)));
      var img = el("div", "work__img");
      media.appendChild(img);
      setBg(img, [w.image].concat(ytThumb(w.videoId)));

      if (w.videoId) {
        media.style.cursor = "pointer";
        media.setAttribute("role", "button");
        media.setAttribute("tabindex", "0");
        media.setAttribute("aria-label", "Play " + w.name);
        var open = function () { window.Player.playById(w.videoId, w.name, w.kind); };
        media.addEventListener("click", open);
        media.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
        });
      }

      var body = el("div", "work__body");
      var head = el("div", "work__head");
      head.appendChild(el("h3", "work__name",
        esc(w.name) + (w.nameSub ? ' <span class="work__sub">' + esc(w.nameSub) + "</span>" : "")));
      head.appendChild(el("span", "work__kind", esc(w.kind)));
      body.appendChild(head);

      var lu = el("ul", "work__lineup");
      w.lineup.forEach(function (m) { lu.appendChild(el("li", null, esc(m))); });
      body.appendChild(lu);

      if (w.text) body.appendChild(el("p", "work__text", esc(w.text)));
      if (w.status) body.appendChild(el("p", "work__status", esc(w.status)));

      card.appendChild(media);
      card.appendChild(body);
      host.appendChild(card);
    });
  }

  /* ------------------------------------------------------------ releases -- */
  function releaseCard(r) {
    var a = el("a", "release rv");
    a.href = r.link || "#";
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", r.title + " — listen");

    var art = el("div", "release__art");
    var img = el("div", "release__img");
    art.appendChild(img);
    art.appendChild(el("span", "release__go", "Listen ↗"));
    setBg(img, [r.image]);

    a.appendChild(art);
    a.appendChild(el("h4", "release__title", esc(r.title)));
    a.appendChild(el("p", "release__by", esc(r.credited)));
    a.appendChild(el("p", "release__meta", esc(r.year + (r.label ? " · " + r.label : ""))));
    if (r.note) a.appendChild(el("p", "release__note", esc(r.note)));
    return a;
  }

  function renderReleases() {
    var lead = $("#relLeader"), side = $("#relSideman");
    S.releases.forEach(function (r) {
      (r.role === "leader" ? lead : side).appendChild(releaseCard(r));
    });
  }

  /* ---------------------------------------------------------------- live -- */
  function renderLive() {
    var host = $("#dates");
    var picked = S.live.dates.filter(function (d) { return d.home; });
    window.liveByYear(picked).forEach(function (grp) {
      grp[1].forEach(function (d) { host.appendChild(window.liveRow(d, "home")); });
    });

    var all = $("#allDates");
    all.href = S.live.allUrl;
    all.textContent = "All " + S.live.dates.length + " performances →";
    $("#venues").textContent = S.live.venues;
  }

  /* --------------------------------------------------------------- press -- */
  function renderPress() {
    var host = $("#quotes");
    S.press.forEach(function (q) {
      var b = el("blockquote", "quote rv");
      b.appendChild(el("p", "quote__t", "“" + esc(q.quote) + "”"));
      b.appendChild(el("p", "quote__by",
        esc(q.source) + (q.detail ? " <span>— " + esc(q.detail) + "</span>" : "")));
      host.appendChild(b);
    });
  }

  /* ------------------------------------------------------ press materials -- */
  function renderKit() {
    var host = $("#bios");
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
          setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("is-done"); }, 1800);
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

    var ph = $("#photos");
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
      ph.appendChild(li);
    });
  }

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

  /* ------------------------------------------------------------- booking -- */
  function renderBooking() {
    var a = S.artist, b = S.booking;
    $("#bkLine").textContent = b.line;
    var m = $("#bkMail");
    m.href = "mailto:" + a.email;
    m.textContent = a.email;

    var f = $("#bkForm");
    if (b.formUrl) { f.href = b.formUrl; } else { f.remove(); }

    var s = $("#social");
    [["Instagram", a.instagram], ["YouTube", a.youtube], ["All links", a.linktree]]
      .forEach(function (pair) {
        if (!pair[1]) return;
        var li = el("li");
        var link = el("a", null, esc(pair[0]) + " ↗");
        link.href = pair[1]; link.target = "_blank"; link.rel = "noopener";
        li.appendChild(link);
        s.appendChild(li);
      });

    $("#yr").textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------- bottom player -- */
  var Player = window.Player = {
    yt: null, ready: false, list: S.player.slice(), i: 0,
    pending: null, timer: null, open: false, loaded: false,

    node: function () { return $("#player"); },

    mount: function () {
      if (this.yt || !window.YT || !window.YT.Player) return;
      var self = this;
      this.yt = new YT.Player("pMount", {
        height: "100%", width: "100%",
        videoId: this.list[0] ? this.list[0].videoId : "",
        playerVars: {
          controls: 0, rel: 0, modestbranding: 1, playsinline: 1,
          iv_load_policy: 3, fs: 0
        },
        events: {
          onReady: function () {
            self.ready = true;
            if (self.pending) { var p = self.pending; self.pending = null; self._load(p); }
          },
          onStateChange: function (e) {
            var playing = e.data === YT.PlayerState.PLAYING;
            self.setIcon(playing);
            if (e.data === YT.PlayerState.ENDED) self.next();
          }
        }
      });
    },

    setIcon: function (playing) {
      var ico = $("#pPlay .pico");
      ico.className = "pico " + (playing ? "pico--pause" : "pico--play");
      $("#pPlay").setAttribute("aria-label", playing ? "Pause" : "Play");
      var hb = $("#heroPlay");
      if (hb) {
        hb.classList.toggle("btn--playing", !!playing);
        $("#heroPlayLabel").textContent = playing ? "Playing" : "Play with sound";
      }
    },

    show: function () {
      if (this.open) return;
      this.open = true;
      var n = this.node();
      n.hidden = false;
      /* rAF alone can be throttled in a backgrounded view, so back it up. */
      var apply = function () {
        n.classList.add("is-open");
        document.documentElement.style.setProperty("--player-h", n.offsetHeight + "px");
      };
      requestAnimationFrame(apply);
      setTimeout(apply, 60);
    },

    _load: function (track) {
      $("#pTitle").textContent = track.title;
      $("#pProj").textContent = track.project || "";
      this.yt.loadVideoById(track.videoId);
      this.yt.unMute();
      this.yt.setVolume(100);
      this.loaded = true;
      this.startTicker();
    },

    play: function (index) {
      this.show();
      if (typeof index === "number") this.i = index;
      var track = this.list[this.i];
      if (!track) return;
      if (!this.ready) { this.pending = track; this.mount(); return; }
      this._load(track);
    },

    playById: function (videoId, title, project) {
      var found = -1;
      this.list.forEach(function (t, k) { if (t.videoId === videoId) found = k; });
      if (found === -1) {
        this.list.push({ videoId: videoId, title: title || "Video", project: project || "" });
        found = this.list.length - 1;
      }
      this.play(found);
    },

    /* Before the first track is loaded, "toggle" has to mean "start track 1" —
       otherwise the cued video plays with no title and still muted. */
    toggle: function () {
      if (!this.ready || !this.loaded) { this.play(); return; }
      var st = this.yt.getPlayerState();
      if (st === YT.PlayerState.PLAYING) this.yt.pauseVideo();
      else { this.show(); this.yt.playVideo(); }
    },

    pause: function () { if (this.ready) this.yt.pauseVideo(); },
    next: function () { this.play((this.i + 1) % this.list.length); },
    prev: function () { this.play((this.i - 1 + this.list.length) % this.list.length); },

    close: function () {
      this.pause();
      this.open = false;
      var n = this.node();
      n.classList.remove("is-open", "is-showing");
      $("#pShow").setAttribute("aria-pressed", "false");
      document.documentElement.style.setProperty("--player-h", "0px");
      setTimeout(function () { n.hidden = true; }, 450);
    },

    startTicker: function () {
      var self = this;
      clearInterval(this.timer);
      this.timer = setInterval(function () {
        if (!self.ready || !self.yt.getDuration) return;
        var d = self.yt.getDuration(), t = self.yt.getCurrentTime();
        if (!d) return;
        var pct = Math.min(100, (t / d) * 100);
        $("#pFill").style.width = pct + "%";
        $("#pSeek").setAttribute("aria-valuenow", Math.round(pct));
        $("#pTime").textContent = fmt(t);
      }, 300);
    }
  };

  function fmt(s) {
    s = Math.max(0, Math.floor(s || 0));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function wirePlayer() {
    $("#pPlay").addEventListener("click", function () { Player.toggle(); });
    $("#pNext").addEventListener("click", function () { Player.next(); });
    $("#pPrev").addEventListener("click", function () { Player.prev(); });
    $("#pClose").addEventListener("click", function () { Player.close(); });

    $("#pShow").addEventListener("click", function () {
      var n = Player.node();
      var on = n.classList.toggle("is-showing");
      this.setAttribute("aria-pressed", on ? "true" : "false");
      setTimeout(function () {
        document.documentElement.style.setProperty("--player-h", n.offsetHeight + "px");
      }, 420);
    });

    $("#pSeek").addEventListener("click", function (e) {
      if (!Player.ready) return;
      var r = this.getBoundingClientRect();
      var pct = (e.clientX - r.left) / r.width;
      var d = Player.yt.getDuration();
      if (d) Player.yt.seekTo(d * pct, true);
    });

    $("#heroPlay").addEventListener("click", function () { Player.toggle(); });
  }

  /* ------------------------------------------------------------ hero loop -- */
  var HeroBg = {
    yt: null,
    mount: function () {
      if (this.yt || !S.hero.videoId || !window.YT || !window.YT.Player) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.innerWidth < 700) return;   /* save data on phones */
      var host = $("#heroVideo");
      this.yt = new YT.Player("heroVideo", {
        videoId: S.hero.videoId,
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, loop: 1, playlist: S.hero.videoId,
          rel: 0, modestbranding: 1, playsinline: 1, disablekb: 1,
          iv_load_policy: 3, fs: 0
        },
        events: {
          onReady: function (e) { e.target.mute(); e.target.playVideo(); },
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.PLAYING) host.classList.add("is-on");
          }
        }
      });
    }
  };

  window.onYouTubeIframeAPIReady = function () {
    HeroBg.mount();
    Player.mount();
  };

  function loadYT() {
    var s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------------- misc -- */
  function wireNav() {
    var nav = $("#nav");
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

  /* ---------------------------------------------------------------- boot -- */
  function init() {
    renderHero();
    renderStatement();
    renderFeatured();
    renderWork();
    renderReleases();
    renderLive();
    renderPress();
    renderKit();
    renderBooking();
    wirePlayer();
    wireNav();
    wireReveal();
    loadYT();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
