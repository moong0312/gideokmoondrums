# Gideok Moon — EPK

Electronic press kit. Static HTML, CSS and JavaScript — no build step, no
dependencies, no framework. Open `index.html` and it works.

Each project has its own page so it can be sent to a promoter on its own, without
handing over the whole site. The front page is a photograph and a short biography;
everything else lives behind the nav.

```
index.html              the photograph, then two sentences. Nothing else
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
assets/js/theme.js      light/dark toggle button
assets/img/             album covers, hero and release art
assets/img/press/       downloadable press photos
assets/press/           press-kit PDFs
serve.js                local preview server
```

Everything except the fixed player sits inside `.shell`, a centred column capped at
1160px on its own `--ground`, so on a wide monitor the eye has one place to sit. The
shell keeps `--paper`, so every rule written against the page background still holds.

Type runs small on purpose — 14px body, 1.62 leading, headings a step down from where
they started. tony-buck.com sets body at 13px/21px and mariaportugal.com at 12px; the
point of the scale is that a whole project fits in one view instead of three.

Every page but the front one opens on a letterbox photograph under the nav, at 3:1,
with a small chip captioning it — set per page in `banners` in `data.js`, keyed by
file name. Give it an `image`, or a `videoId` to use that video's own thumbnail so a
project page opens on the group actually playing. There are only four press photos,
so a couple currently repeat; adding photographs is the fix, the code needs nothing.

Every page is built from the same shell: the theme script, the background drawing,
the nav and the footer are identical across all eight, and `ui.js` renders the
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
so anything in it can be read and scraped. That is the deliberate trade for being
directly reachable. If it ever becomes a problem, the fix is a form posting to a
service that holds the address (Web3Forms, Formspree and friends all work this way),
which is what this site did before.

## Design

Paper base, one restrained accent (a muted sage green), quiet Fraunces serif for
headings with italic carrying emphasis instead of bold caps — reference point is
colinvallon.com: buttons are thin-bordered text, nothing shouts. Images stay bounded
with one deliberate exception: the front-page photograph runs edge to edge, because
there it is the whole introduction. Space Mono for small functional labels (dates, tags), Inter for body copy.
Mobile-first, with a persistent bottom player that follows the theme like everything
else (on `--paper-3`, the elevated-surface tone, so it still reads as a raised bar).

Light and dark share every rule in `style.css` — only the custom properties change,
between `:root` and `:root[data-theme="dark"]`. First-time visitors get whatever their
system prefers (`prefers-color-scheme`), falling back to dark if that can't be read.
The toggle in the nav (`theme.js`) flips `data-theme` on `<html>` and remembers the
choice in `localStorage`. A small blocking script in each page's `<head>` applies it
before first paint, so there's no flash of the wrong theme. To
change the accent, edit `--accent` in both blocks in `style.css`.

## Deploying

Any static host. For GitHub Pages: push to GitHub, then Settings → Pages → deploy from
the `main` branch, root folder. To keep the current domain, point the
`gideokmoondrums.com` DNS at the host and add a `CNAME` file containing the domain.
