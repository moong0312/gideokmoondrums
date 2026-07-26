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
missing and the layout falls back to a duotone gradient rather than breaking.

| Put the file at | Shows up as |
| --- | --- |
| `assets/img/hero.jpg` | full-bleed hero background (use ~2000px wide, landscape) |
| `assets/img/work-solo.jpg` | ALLOPHONE card |
| `assets/img/work-iio.jpg` | i!i!o card |
| `assets/img/work-life-and-sound.jpg` | Life and Sound card |
| `assets/img/work-edge.jpg` | EDGE card |
| `assets/img/press/gideok-moon-01.jpg` | press download 1 |
| `assets/img/press/gideok-moon-02.jpg` | press download 2 |
| `assets/img/press/gideok-moon-03.jpg` | press download 3 |

Work cards are 4:3. Press photos should be the **full-resolution originals** — they are
served as direct downloads, so whatever you put there is what press receives. Add a
photographer to the `credit` field in `data.js` and the credit line renders with it.

Album covers are already in `assets/img/release-*.jpg`.

## Design

Near-black `#0a0b0a` base, one green accent `#63b078` used sparingly, photography
pushed through a black-to-green duotone SVG filter that clears to full colour on hover.
Type is Instrument Serif for display and Inter for everything else, left-aligned
throughout. Mobile-first, with a persistent bottom player.

To change the accent, edit `--green` in `style.css`. To change the duotone, edit the
`feFuncR/G/B` table values in the `<filter id="duotone">` block in `index.html` — the
second number in each pair is the highlight colour.

## Deploying

Any static host. For GitHub Pages: push to GitHub, then Settings → Pages → deploy from
the `main` branch, root folder. To keep the current domain, point the
`gideokmoondrums.com` DNS at the host and add a `CNAME` file containing the domain.
