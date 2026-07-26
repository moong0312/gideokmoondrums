/* ---------------------------------------------------------------------------
   Gideok Moon — EPK content
   Everything editable lives here. Edit this file, reload, done.
   No build step, no dependencies.
--------------------------------------------------------------------------- */

window.SITE = {

  /* -- Identity ---------------------------------------------------------- */
  artist: {
    name: "Gideok Moon",
    roles: "Drummer · Improviser · Composer",
    base: "Bern — Seoul",
    email: "moonkiduk@gmail.com",
    instagram: "https://www.instagram.com/gideok_moon/",
    youtube: "https://youtube.com/@moonkiduk0312",
    linktree: "https://linktr.ee/jazkideok"
  },

  /* -- Hero -------------------------------------------------------------- */
  /* The photo is the hero. Set videoId to a YouTube id if you ever want a
     muted ambient loop behind it instead; "" keeps the still photo clean. */
  hero: {
    videoId: "",
    image: "assets/img/hero.jpg",
    kicker: "Solo · i!i!o · Life and Sound · EDGE",
    line1: "Music that moves toward",
    line2: "what resists explanation."
  },

  /* -- Statement --------------------------------------------------------- */
  statement: {
    lead: "Gideok Moon is an improviser who begins with the drum.",
    body: [
      "His music moves toward what resists explanation — unpredictable motion, sounds that refuse optimisation, moments that won't disappear. Rooted in jazz, expanded through free improvisation, he works inside familiar forms to expose what they were built to conceal.",
      "Trained in jazz drumming at Kyung Hee University, he became active in Korea's free improvisation scene before relocating to Bern, where he is completing a Master's in Jazz and Contemporary Music at the Hochschule der Künste Bern."
    ],
    facts: [
      ["Based in", "Bern, Switzerland"],
      ["From", "Seoul, South Korea"],
      ["Studying", "MA Jazz & Contemporary Music, HKB"],
      ["Formats", "Solo · duo · trio · quartet"]
    ]
  },

  /* -- Featured track ---------------------------------------------------- */
  /* Clicking this hands off to the bottom player rather than embedding, so
     the music keeps going while the visitor reads the rest of the page. */
  featured: {
    videoId: "3IXsqH7luTc",
    title: "the REAL",
    meta: "Alla Prima · 2022",
    square: true          /* true for cover art, false for a 16:9 video still */
  },

  /* -- Work -------------------------------------------------------------- */
  works: [
    {
      id: "solo",
      name: "ALLOPHONE",
      kind: "Solo",
      image: "assets/img/work-solo.jpg",
      videoId: "HHCQX0VbYiA",
      lineup: ["Gideok Moon — drums, no-input mixing board"],
      text: "An 'allophone' is a single linguistic root taking on different physical sounds depending on its environment. The drum — the most human of instruments — meets a no-input mixing board that generates sound from its own internal loops: identity and roots against an unfamiliar system.",
      status: "In development"
    },
    {
      id: "iio",
      name: "i!i!o",
      kind: "Trio",
      image: "assets/img/work-iio.jpg",
      videoId: "so-H9T3kPa4",
      lineup: [
        "Gideok Moon — drums",
        "Tobias Rüetschi — no-input mixing desk",
        "Jessie Chen — voice"
      ],
      text: "Tobias builds sound from feedback loops rather than external sources. The three improvise into that system — sometimes mirroring what comes back, sometimes resisting it, looking for musical context inside the unpredictability.",
      status: "TEUM (틈) — December 2026"
    },
    {
      id: "life-and-sound",
      name: "Life and Sound",
      kind: "Duo",
      image: "assets/img/work-life-and-sound.jpg",
      videoId: "5WSILESP-bE",
      lineup: [
        "Gideok Moon — drums",
        "Sangbeom Kim — saxophone"
      ],
      text: "A duo re-identifying the trivial and overlooked moments of daily life, moving across textures from subtone to chaos. The live album Mealworm (2025) captures the unfiltered dialogue of their shared presence.",
      status: "Next: Sound of Space (공간의 소리)"
    },
    {
      id: "edge",
      name: "EDGE",
      kind: "Quartet",
      image: "assets/img/work-edge.jpg",
      videoId: "",
      lineup: [
        "Gideok Moon — drums",
        "Lukas Mohl",
        "Nil Flückiger",
        "Mattia Facchini"
      ],
      text: "A Bern-based quartet working the border between written material and open improvisation. Active across the city's venues and festivals — PROGR, Offy, and the HKB Pop-Up Festival.",
      status: "Active — Bern"
    }
  ],

  /* -- Releases ---------------------------------------------------------- */
  /* role: "leader" | "sideman"  ·  link: album.link (all streaming services) */
  releases: [
    {
      title: "Alla Prima",
      year: 2022,
      credited: "Gideok Moon",
      role: "leader",
      label: "Mung Music",
      note: "Solo debut",
      image: "assets/img/release-alla-prima.jpg",
      link: "https://album.link/s/4ZtlVkvjo7WO8gmwPtJ9Ow"
    },
    {
      title: "Mealworm",
      year: 2025,
      credited: "Life and Sound",
      role: "leader",
      label: "",
      note: "Duo, live",
      image: "assets/img/release-mealworm.jpg",
      link: "https://album.link/s/5YguBUjfXNCNwGeVCc6DqB"
    },
    {
      title: "SOund RE;search LAB",
      year: 2024,
      credited: "Yoonhwa Choi Trio",
      role: "sideman",
      label: "",
      note: "",
      image: "assets/img/release-sore-lab.jpg",
      link: "https://album.link/s/1dTUNADWtPSpvqwBkBeUCI"
    },
    {
      title: "The Lake",
      year: 2023,
      credited: "Seongmin Ahn",
      role: "sideman",
      label: "",
      note: "Best Domestic Jazz Albums of 2023 — Yeo In-kyung",
      image: "assets/img/release-the-lake.jpg",
      link: "https://album.link/s/4EZNQM0bwPb2ZSSAjMxk0f"
    },
    {
      title: "Go for Launch",
      year: 2022,
      credited: "Hanseong Kang",
      role: "sideman",
      label: "",
      note: "",
      image: "assets/img/release-go-for-launch.jpg",
      link: "https://album.link/s/2ayrQicFDgSBA66t7Z97TG"
    },
    {
      title: "Kind Warmth",
      year: 2021,
      credited: "Bo-Kyung Seo",
      role: "sideman",
      label: "",
      note: "",
      image: "assets/img/release-kind-warmth.jpg",
      link: "https://album.link/s/1gcMpkQYdiQ16bBubLybmr"
    }
  ],

  /* -- Live -------------------------------------------------------------- */
  live: {
    highlights: [
      { date: "2026-07-03", label: "Jul 3, 2026", project: "Low Current — Night 01", venue: "Cocoon, Berlin", video: "" },
      { date: "2026-05-31", label: "May 31, 2026", project: "EDGE — HKB Pop-Up Festival", venue: "PROGR, Bern", video: "" },
      { date: "2026-05-22", label: "May 22, 2026", project: "i!i!o — Diploma Concert", venue: "PROGR 369, Bern", video: "" },
      { date: "2026-05-06", label: "May 6, 2026", project: "EDGE", venue: "Offy, Bern", video: "" },
      { date: "2026-04-04", label: "Mar 31–Apr 4, 2026", project: "IN WALKED INDIGO", venue: "BernJazzfest — Jazztent, Bern", video: "" },
      { date: "2026-01-18", label: "Jan 18, 2026", project: "Composer's Night — Playtime Festival", venue: "HKB, Bern", video: "https://www.dropbox.com/scl/fi/tv4xyoiz6bceb9ul7co94/Insomnia-2.mov?rlkey=u7el9rsjj6fqotyokmvb6kk7s&st=777xqn37&dl=0" },
      { date: "2025-09-29", label: "Sep 29, 2025", project: "The Music of Alice Coltrane", venue: "HKB, Bern", video: "" },
      { date: "2025-07-11", label: "Jul 11, 2025", project: "Dotolim 213th Concert", venue: "Dotolim, Seoul", video: "https://youtu.be/8yBSWr8nqTk" },
      { date: "2024-11-20", label: "Nov 20–21, 2024", project: "MoIM × LIQUID SOUND", venue: "Oil Tank Culture Park T4, Seoul", video: "https://youtu.be/5WSILESP-bE" },
      { date: "2023-10-01", label: "2023", project: "Jarasum Jazz Festival", venue: "Gapyeong, Korea", video: "" }
    ],
    allUrl: "https://www.gideokmoondrums.com/home/performances",
    venues: "PROGR · BeJazz · Offy · Bern Jazz Festival · Cocoon Berlin · Jarasum Jazz Festival · Dotolim · Club Evans · Korean Cultural Centre Germany"
  },

  /* -- Press quotes ------------------------------------------------------ */
  press: [
    {
      quote: "A standout emerging artist who consistently fulfils his role with an earnest and sincere attitude.",
      source: "Hyunjun Kim",
      detail: "Jazz critic"
    },
    {
      quote: "Profound musicianship and sound that belies his young age.",
      source: "MM Jazz",
      detail: "on The Lake, 2023"
    }
  ],

  /* -- Press materials --------------------------------------------------- */
  bios: [
    {
      id: "short",
      label: "Short",
      words: "45 words",
      text: "Gideok Moon is a drummer, improviser and composer from Seoul, based in Bern. Working solo and in the groups i!i!o, Life and Sound and EDGE, he combines acoustic drums with electronics across jazz and free improvisation. He is completing a Master's at the Hochschule der Künste Bern."
    },
    {
      id: "medium",
      label: "Medium",
      words: "95 words",
      text: "Gideok Moon is an improviser who begins with the drum. His music moves toward what resists explanation — unpredictable motion, sounds that refuse optimisation, moments that won't disappear. A drummer, improviser and composer from Seoul, now based in Bern, he works across solo performance, the duo Life and Sound with saxophonist Sangbeom Kim, the trio i!i!o, and the quartet EDGE. He released his solo debut Alla Prima (2022) on Mung Music and has performed at the Jarasum Jazz Festival and the Bern Jazz Festival. He is completing a Master's in Jazz and Contemporary Music at the Hochschule der Künste Bern."
    },
    {
      id: "long",
      label: "Long",
      words: "190 words",
      text: "Gideok Moon is an improviser who begins with the drum. His music moves toward what resists explanation — unpredictable motion, sounds that refuse optimisation, moments that won't disappear. Rooted in jazz and expanded through free improvisation, he works inside familiar forms to expose what they were built to conceal.\n\nHe is a drummer, improviser and composer from Seoul, South Korea, currently based in Bern, Switzerland. He works across several formats: solo, where he develops an approach combining acoustic drums with electronics; the duo Life and Sound, with saxophonist Sangbeom Kim; the trio i!i!o; and the quartet EDGE.\n\nHe received traditional jazz drumming training at Kyung Hee University and was actively involved with improvisers and communities in Korea's free improvisation scene. He collaborated with saxophonist Sunjae Lee and released his solo debut album, Alla Prima (2022), through Lee's label, Mung Music. His duo album with Life and Sound, Mealworm, followed in 2025. He has performed at the Jarasum Jazz Festival, the Korean Cultural Centre in Germany, and jazz clubs across Korea.\n\nSince relocating to Bern he has remained active in the local improvisation scene, performing with i!i!o and EDGE at PROGR, BeJazz, Offy and the Bern Jazz Festival. He is currently pursuing a Master's degree in Jazz and Contemporary Music at the Hochschule der Künste Bern (HKB)."
    }
  ],

  /* Drop the original files into assets/img/press/ using these filenames. */
  /* Credits are the photographers named in each file's EXIF copyright tag —
     confirm the spelling each one prefers before this goes out to press. */
  photos: [
    { label: "Cymbal, solo set", file: "assets/img/press/gideok-moon-01.jpg", credit: "Seenjoong Keem" },
    { label: "Live at the kit",  file: "assets/img/press/gideok-moon-02.jpg", credit: "Minhyuk Park" }
  ],

  /* -- Bottom player ----------------------------------------------------- */
  player: [
    { title: "the REAL",            project: "Alla Prima",              videoId: "3IXsqH7luTc" },
    { title: "rolls",               project: "Solo — improvisation",    videoId: "HHCQX0VbYiA" },
    { title: "Live at PROGR",       project: "i!i!o",                   videoId: "so-H9T3kPa4" },
    { title: "MoIM × LIQUID SOUND", project: "Life and Sound",          videoId: "5WSILESP-bE" },
    { title: "SOund RE;search LAB", project: "Yoonhwa Choi Trio",       videoId: "NKE673GASb4" },
    { title: "The Lake",            project: "Seongmin Ahn Quartet",    videoId: "J8XbOPTZLJ8" }
  ],

  /* -- Booking ----------------------------------------------------------- */
  booking: {
    line: "Available for concerts, festivals, residencies and recording sessions.",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd7t7UKLzoR0BIB4UnuKrkCJ9_w0IwNXgQ6mKT_0bmkfsAmgw/viewform"
  }
};
