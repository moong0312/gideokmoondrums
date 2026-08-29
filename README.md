# Gideok Moon — EPK

One-page electronic press kit. Static HTML, CSS and JavaScript — no build step, no
dependencies, no framework. Open `index.html` and it works.

```
index.html              front page — markup + section order
performances.html       full performance archive
assets/css/style.css    all styling
assets/js/data.js       ← all content lives here
assets/js/app.js        front-page rendering + audio player
assets/js/performances.js  archive page
assets/js/live.js       the live-date row, shared by both pages
assets/js/theme.js      light/dark toggle button
assets/img/             album covers, work images, hero
assets/img/press/       downloadable press photos
serve.js                local preview server
```

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
| `home` | `true` shows it on the front page. Keep it to about eight — see below. |

`performances.html` renders every entry, grouped by year, with a “Video only” filter.
The front page shows the `home: true` ones and links across to the full archive.

Pick the `home` eight as **three most recent + three that have video + the marquee
festivals**: the recent ones show the project is active, the video ones give a booker
something to actually watch (on the front page a row with `video` becomes a link
straight to it), and the big festival names carry weight even with no footage — the
three rarely overlap. Vary the project across the eight rather than running the same
group three times.

### Adding a release

Add to `releases`. `role` is `"leader"` or `"sideman"` — that decides which group it
lands in. Cover art goes in `assets/img/` at 640×640 or larger.

## Photos

Photos are referenced by filename. Drop the files in and they appear; leave a filename
missing and the layout falls back to a dark gradient rather than breaking.

| Put the file at | Shows up as | Status |
| --- | --- | --- |
| `assets/img/press/gideok-moon-02.jpg` | hero photo (bounded, not full-bleed) | in |
| `assets/img/press/gideok-moon-01.jpg` | press download 1 | in |
| `assets/img/press/gideok-moon-02.jpg` | press download 2 | in |
| `assets/img/work-solo.jpg` | Ieum (이음) card | falls back to video still |
| `assets/img/work-iio.jpg` | i!i!o card | falls back to video still |
| `assets/img/work-life-and-sound.jpg` | Life and Sound card | falls back to video still |
| `assets/img/work-edge.svg` | EDGE card | in — designed placeholder, no band photo yet |

Work cards are 4:3; a card with neither photo nor `videoId` shows a dark gradient.
EDGE currently uses a designed SVG placeholder (bold glitch-styled "EDGE" wordmark)
instead — swap in a real band photo at the same path/aspect ratio whenever one exists.
Press photos are served as direct downloads, so whatever is in `press/` is exactly what
press receives — keep them large. Set `credit` on each entry in `data.js` and the
credit line renders under the label.

Album covers are already in `assets/img/release-*.jpg`.

Full-resolution originals live in `_originals/`, which is gitignored — regenerate the
web sizes from there rather than re-compressing what's already in `assets/`.

## Booking form

The booking section is a form, not a `mailto:` — the address appears nowhere in the
HTML, the JS, or `data.js`, so scrapers have nothing to pick up. Note that `data.js`
is served to the browser like any other file, so **never put the address back in it**.

The site is static, so it can't send mail itself; the form POSTs to a form service
that holds the destination address and forwards each message on. Set it up once:

1. Get an access key from <https://web3forms.com> — enter the address you want
   enquiries to land in and they email a key back. No account, no password.
2. Paste it into `booking.formKey` in `data.js`.

Until that key is set the form is left out of the page entirely and the `formUrl`
button (a hosted Google Form) shows in its place, so there's always a way to reach
you. With the key set, the form submits in place — no redirect off the page — and a
hidden `botcheck` field catches the simplest spam bots.

One trade-off worth knowing: whichever service you use, enquiries pass through it
before reaching your inbox. That's the cost of having no backend. Swapping to a
different provider (Formspree and friends work the same way) means changing the
endpoint URL in `wireBookingForm` in `app.js` and the key in `data.js`.

## Design

Paper base, one restrained accent (a muted sage green), quiet Fraunces serif for
headings with italic carrying emphasis instead of bold caps — reference point is
colinvallon.com: no image runs edge-to-edge, buttons are thin-bordered text, nothing
shouts. Space Mono for small functional labels (dates, tags), Inter for body copy.
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
