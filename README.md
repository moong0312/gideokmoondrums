# Gideok Moon — EPK

One-page electronic press kit. Static HTML, CSS and JavaScript — no build step, no
dependencies, no framework. Open `index.html` and it works.

```
index.html              markup + section order
assets/css/style.css    all styling
assets/js/data.js       ← all content lives here
assets/js/app.js        rendering + audio player
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

Add an entry at the top of `live.highlights`:

```js
{ date: "2026-09-12", label: "Sep 12, 2026", project: "EDGE",
  venue: "Offy, Bern", video: "" }
```

`label` is what's displayed, `date` is only for your own sorting. Set `video` to a URL
to make the row a link with a “Video ↗” tag.

### Adding a release

Add to `releases`. `role` is `"leader"` or `"sideman"` — that decides which group it
lands in. Cover art goes in `assets/img/` at 640×640 or larger.

## Photos

Photos are referenced by filename. Drop the files in and they appear; leave a filename
missing and the layout falls back to a dark gradient rather than breaking.

| Put the file at | Shows up as | Status |
| --- | --- | --- |
| `assets/img/hero.jpg` | full-bleed hero background (~2400px wide, landscape) | in |
| `assets/img/press/gideok-moon-01.jpg` | press download 1 | in |
| `assets/img/press/gideok-moon-02.jpg` | press download 2 | in |
| `assets/img/work-solo.jpg` | Ieum (이음) card | falls back to video still |
| `assets/img/work-iio.jpg` | i!i!o card | falls back to video still |
| `assets/img/work-life-and-sound.jpg` | Life and Sound card | falls back to video still |
| `assets/img/work-edge.jpg` | EDGE card | **gradient — no photo or video yet** |

Work cards are 4:3; a card with neither photo nor `videoId` shows a dark gradient.
Press photos are served as direct downloads, so whatever is in `press/` is exactly what
press receives — keep them large. Set `credit` on each entry in `data.js` and the
credit line renders under the label.

Album covers are already in `assets/img/release-*.jpg`.

Full-resolution originals live in `_originals/`, which is gitignored — regenerate the
web sizes from there rather than re-compressing what's already in `assets/`.

## Design

Near-black `#0a0b0a` base, one green accent `#63b078` used sparingly, photography in
full colour against it. Type is Instrument Serif for display and Inter for everything
else, left-aligned throughout. Mobile-first, with a persistent bottom player.

To change the accent, edit `--green` in `style.css`.

## Deploying

Any static host. For GitHub Pages: push to GitHub, then Settings → Pages → deploy from
the `main` branch, root folder. To keep the current domain, point the
`gideokmoondrums.com` DNS at the host and add a `CNAME` file containing the domain.
