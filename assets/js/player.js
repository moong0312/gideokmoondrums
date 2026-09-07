/* ===========================================================================
   Gideok Moon — bottom player
   Lives with the albums page: that is the one place where hearing a record
   while reading the rest of the list is the point. Everywhere else a video
   is embedded where it belongs instead.
   =========================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var $ = window.GM.$;

  function fmt(s) {
    s = Math.max(0, Math.floor(s || 0));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

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
      if (!ico) return;
      ico.className = "pico " + (playing ? "pico--pause" : "pico--play");
      $("#pPlay").setAttribute("aria-label", playing ? "Pause" : "Play");
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

  window.wirePlayer = function () {
    if (!$("#player")) return;
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

    window.onYouTubeIframeAPIReady = function () { Player.mount(); };
    var s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  };
})();
