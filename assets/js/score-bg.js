/* ===========================================================================
   Gideok Moon — animated graphic-score background

   Staff lines that drift and buckle, with marks scattered across them, like a
   Cardew/Braxton-style graphic score being read in real time. Canvas rather
   than CSS so the lines can actually deform.

   Cheap on purpose: one rAF loop, DPR capped at 2, pauses when the tab is
   hidden or the element scrolls out of view, and does nothing at all if the
   visitor asked for reduced motion.
   =========================================================================== */
(function () {
  "use strict";

  var cv = document.getElementById("scoreBg");
  if (!cv) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = cv.getContext("2d");

  var INK    = "20,18,14";
  var TINTS  = ["31,92,61", "184,132,42", "122,40,32", "138,155,114", "70,82,90"];

  var w = 0, h = 0, dpr = 1;
  var lines = [], marks = [];
  var t = 0, raf = null, running = false;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function build() {
    var count = w < 700 ? 7 : 11;
    lines = [];
    for (var i = 0; i < count; i++) {
      lines.push({
        y:     (i + 0.5) / count,
        amp:   rand(8, 34),          /* how far it buckles */
        len:   rand(0.4, 1.0),       /* how much of the width it spans */
        x0:    rand(-0.1, 0.35),
        speed: rand(0.08, 0.26),
        phase: rand(0, Math.PI * 2),
        wob:   rand(1.2, 3.4),       /* waves across its length */
        tint:  Math.random() < 0.45 ? TINTS[(Math.random() * TINTS.length) | 0] : INK,
        alpha: rand(0.05, 0.16),
        wt:    rand(0.6, 1.9)
      });
    }

    var mc = w < 700 ? 16 : 34;
    marks = [];
    for (var j = 0; j < mc; j++) {
      marks.push({
        x:     Math.random(),
        y:     Math.random(),
        r:     rand(1.5, 5),
        kind:  Math.random() < 0.62 ? "dot" : "tick",
        speed: rand(0.05, 0.2),
        phase: rand(0, Math.PI * 2),
        rise:  rand(10, 46),
        tint:  TINTS[(Math.random() * TINTS.length) | 0],
        alpha: rand(0.14, 0.4),
        rot:   rand(-0.6, 0.6)
      });
    }
  }

  /* Measure the box, not the bitmap. If this runs before the hero has its
     final height the bitmap ends up tiny and CSS stretches the hairlines
     into fat bands, so a ResizeObserver re-runs it whenever the box settles. */
  function size() {
    var r = cv.getBoundingClientRect();
    /* Fall back through parent then viewport: a 0 here (measured too early,
       or an embedded viewer that reports a collapsed body) would otherwise
       leave a 1px bitmap stretched into fat bands. */
    var de = document.documentElement;
    var nw = Math.round(r.width)  || (cv.parentElement && cv.parentElement.offsetWidth)  || de.clientWidth  || window.innerWidth  || 1200;
    var nh = Math.round(r.height) || (cv.parentElement && cv.parentElement.offsetHeight) || Math.round((de.clientHeight || window.innerHeight || 800) * 0.85);
    if (nw === w && nh === h) return false;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = nw; h = nh;
    cv.width  = Math.max(1, Math.round(w * dpr));
    cv.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    return true;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    /* staff lines */
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i];
      var y0 = L.y * h;
      var xa = L.x0 * w;
      var xb = xa + L.len * w;

      ctx.beginPath();
      ctx.lineWidth = L.wt;
      ctx.strokeStyle = "rgba(" + L.tint + "," + L.alpha + ")";

      var steps = 46;
      for (var s = 0; s <= steps; s++) {
        var p = s / steps;
        var x = xa + (xb - xa) * p;
        /* two offset sines so the curve never looks like a clean wave */
        var y = y0
              + Math.sin(p * Math.PI * L.wob + t * L.speed + L.phase) * L.amp
              + Math.sin(p * Math.PI * L.wob * 2.3 + t * L.speed * 0.6) * L.amp * 0.3;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    /* marks scattered over the staves */
    for (var j = 0; j < marks.length; j++) {
      var M = marks[j];
      var mx = M.x * w + Math.sin(t * M.speed + M.phase) * 22;
      var my = M.y * h + Math.cos(t * M.speed * 0.8 + M.phase) * M.rise;

      ctx.fillStyle   = "rgba(" + M.tint + "," + M.alpha + ")";
      ctx.strokeStyle = "rgba(" + M.tint + "," + M.alpha + ")";

      if (M.kind === "dot") {
        ctx.beginPath();
        ctx.arc(mx, my, M.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(M.rot + Math.sin(t * M.speed * 0.5) * 0.25);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, -M.r * 2.6);
        ctx.lineTo(0,  M.r * 2.6);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function tick() {
    t += 0.006;
    draw();
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running || reduce) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  size();
  draw();                      /* one static frame, so reduced-motion still sees it */
  if (!reduce) start();

  var rt = null;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (size()) draw(); }, 180);
  }, { passive: true });

  if ("ResizeObserver" in window) {
    new ResizeObserver(function () { if (size()) draw(); }).observe(cv);
  }
  window.addEventListener("load", function () { if (size()) draw(); });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  /* stop burning frames once the hero has scrolled away */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0 }).observe(cv);
  }
})();
