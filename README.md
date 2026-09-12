# Gideok Moon — EPK

Electronic press kit. Static HTML, CSS and JavaScript — no build step, no
dependencies, no framework. Open `index.html` and it works.

Each project has its own page so it can be sent to a promoter on its own, without
handing over the whole site. The front page is a photograph and a short biography;
everything else lives behind the nav.

```
index.html              the photograph beside the two sentences. Nothing else
solo.html               long biography · the Ieum project · records as leader
iio.html                ┐ one project each
life-and-sound.html     ┘
projects.html           the other groups (EDGE, and whatever comes next)
albums.html             full discography + the bottom player
performances.html       full performance archive
epk.html                listen/watch links · press quotes · bios · photos · contact

assets/css/style.css    all styling
assets/js/data.js       ← all content lives here
assets/js/ui.js         helpers + the parts more than one page uses
assets/js/home.js       front page
assets/js/solo.js       solo page
assets/js/work.js       project pages (iio, life-and-sound, projects)
assets/js/albums.js     discography
assets/js/epk.js        press kit
assets/js/performances.js  archive
assets/js/player.js     the bottom player — albums page only
assets/js/live.js       the live-date row, shared by every page that lists dates
assets/img/bg/          the per-page background photographs
assets/img/             album covers, hero and release art
assets/img/press/       downloadable press photos
assets/press/           press-kit PDFs
serve.js                local preview server
```

Everything except the fixed player sits inside `.shell`, a centred column capped at
980px, so on a wide monitor the eye has one place to sit. The shell keeps `--paper`, so
every rule written against the page background still holds. Behind it is a photograph —
see **Backgrounds** below.

980px is measured, not guessed: tony-buck.com runs its card at 980px inside a 1600px
window, 61% of the width. Wider than that and the photograph is a stripe down each
side, which reads as a layout that failed rather than a margin that was chosen.

Type runs small on purpose — 15px body, 1.62 leading, headings a step down from where
they started. tony-buck.com sets body at 13px/21px and mariaportugal.com at 12px; the
point of the scale is that a whole project fits in one view instead of three.

One scale, the front page included. Its title is `.sec__h`, the same class every other
page titles with, and its bio runs at body size — nothing on the front page has a size
of its own, so there is nothing to keep in sync.

Every page but the front one opens on a letterbox photograph under the nav, at 3:1,
with a small chip captioning it — set per page in `banners` in `data.js`, keyed by
file name. Give it an `image`, or a `videoId` to use that video's own thumbnail so a
project page opens on the group actually playing. All seven have a photograph of their
own in `assets/img/head/`, named for the page and cut to 3:1 so nothing depends on
where the CSS decides to crop. The press photographs are no longer doubling as banners,
which is what used to make two pages open on the same picture.

Two filename conventions save the phone from files it has no use for, and both are
optional — `setBg` walks its list and keeps the first that loads, so a photograph
without a twin simply falls through to the full one:

| suffix | what it is | used by |
| --- | --- | --- |
| `@sm` | the same 3:1 frame at 980px | the banner, below 760px wide |
| `@thumb` | 304×232 | the press-photo list on the EPK page |

Only make the twin a file actually needs — press photographs want `@thumb` and no
`@sm`, head photographs the reverse.

Quality before weight on both the head and the ground: q93 with no chroma subsampling
for a head at 1960px, no blur on a background at 2000px. An earlier pass squeezed these
under a 190KB cap, which cost enough sharpness to see. A page now carries roughly
0.6–0.9MB of photography, and that is the right trade for a site whose whole argument
is what the pictures look like. Crops are centred at 0.5 except More projects, which
sits at 0.68 so the instruments spread across the floor land inside the 3:1 band
instead of below it.

`@thumb` matters more than it sounds: the EPK page was pulling four full-resolution
press photographs — nine megabytes — to draw four 76px thumbnails, on the one page
most likely to be opened on an institution's network. The **Download** links still
point at the full files, which is the whole reason those are kept large.

Every page is built from the same shell: the nav and the footer are identical
across all eight, and `ui.js` renders the
footer contact and marks the current nav link on each one. Keep them in step when
adding a page — copy an existing one rather than writing a new head by hand.

## Running it locally

```bash
node serve.js
```

Then open <http://localhost:4173>. Any static server works; `serve.js` just avoids a
dependency. Opening `index.html` directly with `file://` also works, apart from the
photo **Download** links, which browsers block on that protocol.

## Editing content

Everything editable is in **`assets/js/data.js`** — bios, releases, live dates, press
quotes, links, the player tracklist. Edit, save, reload. No rebuild.

The two sentences the front page opens with are the `INTRO` at the top of that file,
and the short press bio is the same text, so they are written once and used twice.
Editing `INTRO` changes both. Bio word counts are counted at render, not written down.

### Adding a live date

Every performance is one entry in `live.dates` — there is no second list to keep in
sync. Add it anywhere in the array; both pages sort by `date` themselves.

```js
{ date: "2026-09-12", label: "Sep 12, 2026", project: "EDGE",
  venue: "Offy, Bern", players: "Lukas Mohl, Nil Flückiger, Mattia Facchini",
  video: "", info: "", home: true }
```

| Field | |
| --- | --- |
| `date` | sorting and year grouping only, `YYYY-MM-DD`. For a run of nights, use the first. |
| `label` | what actually gets printed — `"Mar 31 – Apr 4, 2026"`, `"2023"`, anything. |
| `project` | the headline. |
| `venue` | second line. |
| `players` | who else was on stage. Archive page only. Optional. |
| `video` | a URL adds a “Video ↗” link. Optional. |
| `info` | a second link — festival page, event listing. Archive page only. Optional. |
| `home` | **currently unused** — see below. |
| `work` | ties the date to a project in `works`, which is how project pages collect their own history. |

`performances.html` renders every entry, grouped by year, with a “Video only” filter.
A project page shows the dates whose `work` matches it.

`home` marked a curated eight for the old one-page front page — three most recent,
three with video, plus the marquee festivals. The front page is now a photograph and
a short bio, so nothing reads the flag. It is left on those eight entries because the
selection is worth keeping if a “selected performances” block ever wants a home; delete
it if not.

### Project pages

Each project in `works` has a page so it can be sent to a promoter on its own — the
link is about that project, not the whole site.

`iio.html`, `life-and-sound.html` and `projects.html` share `work.js`. A page lists
the projects it shows in `data-works` on `<body>`; adding `data-head="page"` means the
page is about that one project and its `<h1>` is the project's name, so the block does
not repeat the heading. Without it the `<h1>` is whatever the file says and every
project gets its own heading — which is what More projects needs, and how a second
group is added there: `data-works="edge,newband"`.

`solo.html` is its own script (`solo.js`) because it leads with the biography before
the project.

The `og:` tags are per-file on purpose — they are what a mail client or chat app shows
in the link preview, so they must name the project rather than the site. Point
`og:image` at that project's own video thumbnail
(`https://i.ytimg.com/vi/<id>/maxresdefault.jpg`) where there is one.

A part with nothing in it is dropped rather than left as an empty heading, so a
project with no album or no video yet still reads as finished. Live dates and
releases attach themselves with a `work` key matching the project's `id`:

```js
{ date: "2026-05-06", label: "May 6, 2026", project: "EDGE",
  venue: "Offy, Bern", work: "edge", ... }
```

`about` is the long text, one string per paragraph, and starts empty — the project
pages currently show only the short `text` blurb until it is filled in.

### Adding a release

Add to `releases`. `role` is `"leader"` or `"sideman"` — that decides which group it
lands in. Cover art goes in `assets/img/` at 640×640 or larger.

## Photos

Photos are referenced by filename. Drop the files in and they appear; leave a filename
missing and the layout falls back to a dark gradient rather than breaking.

| Put the file at | Shows up as | Status |
| --- | --- | --- |
| `assets/img/press/gideok-moon-03.jpg` | front-page photograph | in |
| `assets/img/press/gideok-moon-01.jpg` … `-04.jpg` | press downloads on the EPK page | in |

The `image` on each entry in `works` is no longer drawn anywhere — project pages
embed the video instead — so those `work-*.jpg` paths are only a note of what to
shoot. Press photos are served as direct downloads, so whatever is in `press/` is exactly what
press receives — keep them large. Set `credit` on each entry in `data.js` and the
credit line renders under the label.

Album covers are already in `assets/img/release-*.jpg`.

Full-resolution originals live in `_originals/`, which is gitignored — regenerate the
web sizes from there rather than re-compressing what's already in `assets/`.

## The EPK page

It leads with **Listen & watch** — every project video and every album as a plain
streaming link, opening in a new tab. Funding panels read an application with
YouTube open beside it, and institutional networks block file downloads, so the
sound has to be one click and never an attachment. The photo **Download** links
below are the deliberate exception: press needs the actual file.

Both columns build themselves from `works` and `releases`, so adding a video or a
record puts it there without touching the page.

## Contact

Contact is the `email` and `phone` in `artist` — printed on the EPK page and in the
footer of every page, both as live links, so a promoter can write or call without a
form in between.

Both are therefore public: `data.js` is served to the browser like any other file,
so anything in it can be read and scraped. The address is deliberately not a personal
one — `gideok@gideokmoon.com` is an iCloud+ custom-domain address on the site's own
domain, so if scraping ever becomes a problem it can be retired and replaced without
touching anything else. Catch-all is off on purpose: the domain is printed on every
page, and a catch-all on a published domain collects every dictionary-attack address
a spammer tries.

## Design

Paper base, one restrained accent (a muted sage green), quiet Fraunces serif for
headings with italic carrying emphasis instead of bold caps — reference point is
colinvallon.com: buttons are thin-bordered text, nothing shouts. Images stay bounded
with one deliberate exception: the front-page photograph runs edge to edge, because
there it is the whole introduction. Space Mono for small functional labels (dates, tags), Inter for body copy.
Mobile-first, with a persistent bottom player on `--paper-3`, the elevated-surface
tone, so it still reads as a raised bar.

The palette is light only, and there is no toggle. A photograph cannot be inverted:
a dark mode would have to dim the picture until it stopped being the picture, so the
site commits to one set of custom properties in `:root`. To change the accent, edit
`--accent` there.

## Backgrounds

Each page sits on one of Gideok's own photographs, named on `<body data-bg="...">` and
resolved by a rule per name in `style.css`. Two fixed layers do the work: `body::before`
is the picture, `body::after` is `--bg-veil`, a wash of paper over it. Without the veil
a photograph argues with every line of type on the card above it.

| page | photograph | | page | photograph |
| --- | --- | --- | --- | --- |
| index | `sunset` | | projects | `brick` |
| solo | `dusk` | | albums | `lake` |
| iio | `concrete` | | performances | `poplars` |
| life-and-sound | `forest` | | epk | `valley` |

Only the margins beside the shell are ever visible, so what matters is what sits at the
left and right edges of the frame, not the middle — a photograph that is pale sky at both
edges reads as no background at all. Each is cropped 16:9, capped near 180KB, and has a
half-width `@sm` twin the phone loads instead. Originals live in `_originals/background/`,
which is gitignored; regenerate the web sizes from there.

A `url()` inside a custom property resolves against the stylesheet that declares it, so
these paths are root-absolute (`/assets/...`) — a relative one breaks the moment the value
is set from anywhere else.

## Deploying

Any static host. For GitHub Pages: push to GitHub, then Settings → Pages → deploy from
the `main` branch, root folder. The domain lives in the `CNAME` file; its DNS points
four A records at GitHub's apex addresses and `www` at `moong0312.github.io`.

The site answers on two domains. `gideokmoon.com` is the real one — it is what `CNAME`
holds, what the `og:` tags name, and what GitHub issues the certificate for.
`gideokmoondrums.com` came first and still has links pointing at it, so it sits on
Cloudflare with a 301 rule that carries the path across. GitHub Pages serves one
domain per site, which is why that redirect lives at the DNS layer rather than here.

Mail is separate from all of this. `gideokmoon.com` also carries iCloud+ MX, SPF and
DKIM records, so **changing web host means changing the A records only** — leave the
MX, the two `@` TXT records and the `sig1._domainkey` CNAME alone or the mail stops.
