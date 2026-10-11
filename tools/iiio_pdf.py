"""Build the i!i!o press-kit PDFs, English and German, from one layout.

    python3 tools/iiio_pdf.py

Writes assets/press/iiio-epk.pdf and assets/press/iiio-epk-de.pdf. The English
member bios and lead paragraph are read from assets/js/data.js, so the PDF says
what the i!i!o page says; the German text lives below in DE. Needs Pillow and
reportlab, and node for reading data.js.
"""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance
from reportlab.pdfgen import canvas
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import Color
from reportlab.platypus import Paragraph
from reportlab.pdfbase.pdfmetrics import stringWidth

ROOT = Path(__file__).resolve().parent.parent
W, H = 595.2756, 841.8898
L, R = 52, 543.2756
COLS = [52, 221.7585, 391.5171]
COL_W = 148.4
INK, GREY, RULE = Color(.067, .067, .067), Color(.435, .435, .435), Color(.863, .863, .863)

site = json.loads(subprocess.check_output(
    ["node", "-e", 'global.window={};eval(require("fs").readFileSync(process.argv[1],"utf8"));'
     'process.stdout.write(JSON.stringify(window.SITE))', str(ROOT / "assets/js/data.js")]))
iio = next(w for w in site["works"] if w["id"] == "iio")
A = site["artist"]

PERFS = [("PROGR 369, Bern", "Diploma concert", "May 2026"),
         ("Offy, Bern", "OFFKULTURWOCHE", "April 2026"),
         ("BeJazz, Bern", "Chrut u Rüebe", "March 2026")]

EN = dict(
    tagline="FREE IMPROVISATION TRIO", place="Bern, Switzerland", credit="Photo: Juliette Milone",
    lead=iio["short"],
    members=[(m["name"], m["role"], m["bio"]) for m in iio["members"]],
    titles=["Alla Prima", "Mealworm"],
    h_trio="THE TRIO", h_perf="RECENT PERFORMANCES", h_tech="TECHNICAL", h_contact="LISTEN & CONTACT",
    perfs=PERFS,
    tech="The trio travels with its own mixing board (repurposed as a no-input instrument), patch cables, "
         "limiter, and three microphones with stands. From the venue we ask for PA and monitors suitable "
         "for the room, plus a drum kit (house kit welcome, flexible setup). Set length is flexible, 30–60 minutes.",
    footer="free improvisation trio",
)

DE = dict(
    tagline="FREIES IMPROVISATIONSTRIO", place="Bern, Schweiz", credit="Foto: Juliette Milone",
    lead="Im Zentrum der Arbeit von i!i!o steht das Interesse, die Grundlagen der Improvisation zu erforschen. "
         "Ein nichtlineares Setup wie unseres führt dazu, dass wir uns ständig in einem Zustand des Erkundens "
         "und Neu-Lernens befinden. Das stellt traditionelle Vorstellungen von Kontrolle und Expertise in Frage. "
         "Und doch erleben wir, dass wir im gemeinsamen Spiel als Gruppe Fortschritte machen. Wir halten diese "
         "alternative Form künstlerischen Wissens für etwas, das es wert ist, erforscht, vor Publikum "
         "präsentiert und in unterschiedlichen Formen dokumentiert zu werden.",
    members=[
        ("Gideok Moon", "Schlagzeug",
         "Schlagzeuger und Improvisator aus Seoul, lebt in Bern und ist in der koreanischen "
         "Free-Improvisationsszene aktiv. Zu seinen Veröffentlichungen zählen das Soloalbum „Alla Prima“ "
         "(2022, Mung Music) und das Duo-Album „Mealworm“ (2025). Absolvierte einen Bachelor of Music "
         "(Postmoderne Musik) an der Kyung Hee University; studiert derzeit für einen Master of Arts in "
         "Musikperformance (Jazz und zeitgenössische Musik) an der HKB Bern."),
        ("Jessie Chen", "Gesang",
         "Sängerin und Klangkünstlerin, die derzeit in Europa lebt und dort ihre künstlerische Praxis "
         "erforscht und weiterentwickelt. In ihrer Arbeit strebt sie danach, formale Grenzen zu überschreiten "
         "und durch die Stimme und den Körper vielfältige Ausdrucksmöglichkeiten zu entdecken. Im Jahr 2024 "
         "zog Jessie nach Europa, um sich auf zeitgenössische Vokalperformance zu konzentrieren. Sie "
         "absolvierte ihr Masterstudium an der Hochschule für Musik Dresden und studiert derzeit im Rahmen "
         "einer künstlerischen Forschung im Bereich Musik in Bern und Freiburg."),
        ("Tobias Rüetschi", "No-Input-Mixing Board",
         "Musiker und Künstler, lebt in Bern und Winterthur. Arbeitet mit No-Input-Mixing und klanglichen "
         "DIY-Techniken, wobei er Rauschen als Material und den kreativen Missbrauch von Technologie als "
         "Methode nutzt. Studierte Bildende Kunst in Zürich; promoviert derzeit im Rahmen einer "
         "künstlerischen Forschung im Bereich Musik in Bern und Freiburg."),
    ],
    titles=[],
    h_trio="DAS TRIO", h_perf="AKTUELLE KONZERTE", h_tech="TECHNIK", h_contact="HÖREN & KONTAKT",
    perfs=[("PROGR 369, Bern", "Diplomkonzert", "Mai 2026"),
           ("Offy, Bern", "OFFKULTURWOCHE", "April 2026"),
           ("BeJazz, Bern", "Chrut u Rüebe", "März 2026")],
    tech="Das Trio bringt sein eigenes Mischpult (als No-Input-Instrument eingesetzt), Patchkabel, einen "
         "Limiter sowie drei Mikrofone mit Stativen mit. Vom Veranstaltungsort benötigen wir eine dem Raum "
         "angemessene PA und Monitore sowie ein Schlagzeug (Hausset willkommen, flexibles Setup). Die "
         "Konzertlänge ist flexibel, 30–60 Minuten.",
    footer="freies Improvisationstrio",
)


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def para(text, size, lead, color=INK, font="Helvetica", titles=()):
    t = esc(text)
    for ti in titles:
        t = t.replace(ti, f"<i>{ti}</i>")
    return Paragraph(t, ParagraphStyle("p", fontName=font, fontSize=size, leading=lead, textColor=color))


def label(c, x, y, text):
    c.setFont("Helvetica-Bold", 7); c.setFillColor(GREY)
    t = c.beginText(x, y); t.setCharSpace(1.3); t.textOut(text); t.setCharSpace(0); c.drawText(t)


def rule(c, y):
    c.setStrokeColor(RULE); c.setLineWidth(.6); c.line(L, y, R, y)


def link(c, x, y, text, font, size, url):
    c.linkURL(url, (x, y - 2.5, x + stringWidth(text, font, size), y + size), relative=0, thickness=0)


def header_image():
    """The trio portrait, shaded on the left only, under the white title."""
    out = ROOT / "_originals" / "iio-trio-pdfhead.jpg"
    im = ImageOps.exif_transpose(Image.open(ROOT / "_originals" / "iio-trio.jpg")).convert("RGB")
    w, h = 2400, round(2400 * 174 / W)
    im = ImageEnhance.Brightness(ImageOps.fit(im, (w, h), Image.LANCZOS, centering=(.5, .55))).enhance(.85)
    shade = ImageOps.invert(Image.linear_gradient("L").rotate(90, expand=True).resize((w, h)))
    shade = shade.point(lambda v: int(max(0, v - 100) / 155 * 190))
    Image.composite(Image.new("RGB", (w, h)), im, shade).save(out, quality=86, optimize=True)
    return str(out)


def render(T, path, head, sz):
    bsz, blead, lsz, llead = sz
    c = canvas.Canvas(str(path), pagesize=(W, H))
    c.setTitle("i!i!o — " + T["tagline"].title()); c.setAuthor("i!i!o")

    c.setFillColor(Color(1, 1, 1)); c.rect(0, 0, W, H, stroke=0, fill=1)

    # header
    c.drawImage(head, 0, H - 174, W, 174)
    c.setFillColor(Color(1, 1, 1)); c.setFont("Helvetica-Bold", 53); c.drawString(L, 731.89, "i!i!o")
    c.setFont("Helvetica", 9.5)
    t = c.beginText(55, 707.89); t.setCharSpace(1.9); t.textOut(T["tagline"]); t.setCharSpace(0); c.drawText(t)
    c.setFillColor(Color(.725, .725, .725)); c.drawString(55, 692.89, T["place"])
    c.setFont("Helvetica", 6.5); c.setFillColor(Color(.55, .55, .55))
    c.drawRightString(R, 658.5, T["credit"])

    # Everything below the header flows top-down from the text above it, so a
    # longer bio (German runs to sixteen lines) pushes the rest down rather
    # than overprinting it. The assert at the end catches a page that no longer
    # fits above the footer.
    p = para(T["lead"], lsz, llead)
    _, ph = p.wrap(470, 400)
    y = 667.9 - 22 - ph
    p.drawOn(c, L, y)

    y -= 30
    label(c, L, y, T["h_trio"]); rule(c, y - 16)
    bottom = y
    for x, (name, role, bio) in zip(COLS, T["members"]):
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 10.6); c.drawString(x, y - 46.6, name)
        c.setFillColor(GREY); c.setFont("Helvetica", 8.6); c.drawString(x, y - 59.6, role)
        b = para(bio, bsz, blead, titles=T["titles"])
        _, bh = b.wrap(COL_W, 600)
        b.drawOn(c, x, y - 69.8 - bh)
        bottom = min(bottom, y - 69.8 - bh)

    y = bottom - 24
    label(c, L, y, T["h_perf"]); rule(c, y - 14)
    for x, (venue, what, when) in zip(COLS, T["perfs"]):
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 9.2); c.drawString(x, y - 34, venue)
        c.setFillColor(GREY); c.setFont("Helvetica", 8.3); c.drawString(x, y - 46.5, f"{what} · {when}")
    y -= 64
    rule(c, y)

    y -= 20
    label(c, L, y, T["h_tech"]); label(c, COLS[2], y, T["h_contact"])
    tp = para(T["tech"], 8.8, 13)
    _, th = tp.wrap(COLS[2] - L - 22, 200)
    tp.drawOn(c, L, y - 16 - th)

    cy = y - 24.8
    c.setFont("Helvetica", 8.8); c.setFillColor(INK)
    for k, (text, url) in (("Audio", ("youtube.com/@tttober", "https://www.youtube.com/@tttober")),
                           ("Instagram", ("@iiiio.trio", "https://www.instagram.com/iiiio.trio/"))):
        c.setFont("Helvetica", 8.8); c.drawString(COLS[2], cy, k + "  ")
        x = COLS[2] + stringWidth(k + "  ", "Helvetica", 8.8)
        c.setFont("Helvetica-Bold", 8.8); c.drawString(x, cy, text)
        link(c, x, cy, text, "Helvetica-Bold", 8.8, url)
        cy -= 13
    cy -= 6
    c.setFont("Helvetica", 8.8); c.drawString(COLS[2], cy, A["name"]); cy -= 13
    c.setFont("Helvetica-Bold", 8.8)
    c.drawString(COLS[2], cy, A["email"]); link(c, COLS[2], cy, A["email"], "Helvetica-Bold", 8.8, "mailto:" + A["email"]); cy -= 13
    c.drawString(COLS[2], cy, "gideokmoon.com"); link(c, COLS[2], cy, "gideokmoon.com", "Helvetica-Bold", 8.8, "https://gideokmoon.com")
    assert cy > 82, f"{path.name}: contact runs into the footer ({cy:.1f})"

    # footer
    rule(c, 72)
    c.setFont("Helvetica", 7.5); c.setFillColor(GREY)
    t = c.beginText(L, 58); t.setCharSpace(.5)
    t.textOut("  ·  ".join(["i!i!o", T["footer"], T["place"], A["email"], "gideokmoon.com"])); t.setCharSpace(0); c.drawText(t)
    c.showPage(); c.save()
    print(f"{path.relative_to(ROOT)}  text {lsz}/{bsz}pt  contact ends {cy:.0f}")


# Largest first. German runs longer, so it may step down a size to keep the
# whole kit on one page; English stays at the original sizes.
SIZES = [(8.5, 12.4, 11.4, 16.6), (8.2, 11.8, 11, 16), (8, 11.4, 10.6, 15.4), (7.8, 11, 10.4, 14.8)]


def build(T, path, head):
    for sz in SIZES:
        try:
            return render(T, path, head, sz)
        except AssertionError:
            continue
    raise SystemExit(f"{path.name}: does not fit on one page even at the smallest size")


if __name__ == "__main__":
    head = header_image()
    build(EN, ROOT / "assets/press/iiio-epk.pdf", head)
    build(DE, ROOT / "assets/press/iiio-epk-de.pdf", head)
