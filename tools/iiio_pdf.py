"""Build the i!i!o press-kit PDFs, English, German and Korean, from one layout.

    python3 tools/iiio_pdf.py

Writes assets/press/iiio-epk.pdf, -de.pdf and -ko.pdf. The English
member bios and lead paragraph are read from assets/js/data.js, so the PDF says
what the i!i!o page says; the German and Korean text lives below in DE and KO. Needs Pillow and
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

# Helvetica has no Hangul, so the Korean kit sets in IBM Plex Sans KR (OFL,
# tools/fonts). Its Latin is a grotesque too, so names and URLs sit close to the
# other two versions. The "i!i!o" title stays Helvetica in all three.
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
for _w in ("Regular", "Bold"):
    pdfmetrics.registerFont(TTFont(f"PlexKR-{_w}", str(ROOT / f"tools/fonts/IBMPlexSansKR-{_w}.ttf")))
REG, BOLD = "Helvetica", "Helvetica-Bold"
TRACK = 1   # letter-spacing factor for labels and the tagline
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


KO = dict(
    fonts=("PlexKR-Regular", "PlexKR-Bold"), track=0.35,
    tagline="자유즉흥 트리오", place="스위스 베른", credit="사진: Juliette Milone",
    lead="i!i!o의 작업에서 중심에 있는 것은 즉흥연주의 근본을 탐구하는 일입니다. 우리처럼 비선형적인 "
         "셋업에서는 끊임없이 탐색하고 다시 배우는 상태에 놓이게 됩니다. 이는 통제와 전문성에 대한 전통적인 "
         "관념에 질문을 던집니다. 그럼에도 우리는 함께 연주하며 그룹으로서 어떤 식으로든 나아가고 있음을 "
         "느낍니다. 우리는 이러한 대안적인 형태의 예술적 지식이 탐구하고, 관객에게 보여주고, 다양한 형식으로 "
         "기록할 가치가 있다고 생각합니다.",
    members=[
        ("Gideok Moon", "드럼",
         "서울 출신의 드러머이자 즉흥연주자. 베른을 기반으로 활동하며 한국 자유즉흥 씬에서도 활동하고 있다. "
         "솔로 앨범 《Alla\u00a0Prima》(2022, Mung Music)와 듀오 앨범 《Mealworm》(2025)을 발표했다. "
         "경희대학교에서 음악학사(포스트모던음악)를 마쳤고, 현재 베른 예술대학 HKB에서 음악 퍼포먼스 "
         "석사(재즈·현대음악) 과정을 밟고 있다."),
        ("Jessie Chen", "보컬",
         "보컬리스트이자 사운드 아티스트. 현재 유럽에 머물며 자신의 예술적 실천을 연구하고 확장하고 있다. "
         "형식의 경계를 넘어 목소리와 몸을 통해 다양한 표현의 가능성을 찾는다. 2024년 현대 보컬 "
         "퍼포먼스에 집중하기 위해 유럽으로 옮겨왔다. 드레스덴 음악대학에서 석사과정을 마쳤고, 현재 베른과 "
         "프라이부르크에서 음악 분야 예술연구 박사과정을 밟고 있다."),
        ("Tobias Rüetschi", "노인풋 믹싱 보드",
         "베른과 빈터투어를 기반으로 활동하는 음악가이자 아티스트. 노인풋 믹싱과 DIY 사운드 기법을 다루며, "
         "노이즈를 재료로, 기술의 창의적 오용을 방법으로 삼는다. 취리히에서 순수미술을 공부했고, 현재 베른과 "
         "프라이부르크에서 음악 분야 예술연구 박사과정을 밟고 있다."),
    ],
    titles=[],
    h_trio="트리오", h_perf="최근 공연", h_tech="기술 사항", h_contact="듣기 · 연락처",
    perfs=[("PROGR 369, Bern", "졸업 연주회", "2026년 5월"),
           ("Offy, Bern", "OFFKULTURWOCHE", "2026년 4월"),
           ("BeJazz, Bern", "Chrut u Rüebe", "2026년 3월")],
    tech="트리오는 노인풋 악기로 쓰는 믹싱 보드, 패치 케이블, 리미터, 스탠드를 포함한 마이크 3대를 직접 "
         "가져갑니다. 공연장에는 공간에 맞는 PA와 모니터, 드럼 세트(하우스 키트 가능, 셋업 유연)를 요청합니다. "
         "공연 시간은 30–60분으로 조정할 수 있습니다.",
    footer="자유즉흥 트리오",
)


def ds(c, x, y, text, font, size):
    """drawString that falls back to Helvetica for any character the current
    font lacks — IBM Plex Sans KR has no ü, and the names need it."""
    if font.startswith("Helvetica"):
        c.setFont(font, size); c.drawString(x, y, text); return
    have = pdfmetrics.getFont(font).face.charToGlyph
    alt = "Helvetica-Bold" if font.endswith("Bold") else "Helvetica"
    run, rf = "", None
    for ch in text + "\0":
        f = font if (ch == "\0" or ord(ch) in have) else alt
        if (f != rf or ch == "\0") and run:
            c.setFont(rf, size); c.drawString(x, y, run); x += stringWidth(run, rf, size); run = ""
        if ch != "\0":
            run += ch; rf = f


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def para(text, size, lead, color=INK, font=None, titles=()):
    t = esc(text)
    for ti in titles:
        t = t.replace(ti, f"<i>{ti}</i>")
    return Paragraph(t, ParagraphStyle("p", fontName=font or REG, fontSize=size, leading=lead, textColor=color))


def label(c, x, y, text):
    c.setFont(BOLD, 7); c.setFillColor(GREY)
    t = c.beginText(x, y); t.setCharSpace(TRACK * 1.3); t.textOut(text); t.setCharSpace(0); c.drawText(t)


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
    global REG, BOLD, TRACK
    REG, BOLD = T.get("fonts", ("Helvetica", "Helvetica-Bold"))
    TRACK = T.get("track", 1)
    bsz, blead, lsz, llead = sz
    c = canvas.Canvas(str(path), pagesize=(W, H))
    c.setTitle("i!i!o — " + T["tagline"].title()); c.setAuthor("i!i!o")

    c.setFillColor(Color(1, 1, 1)); c.rect(0, 0, W, H, stroke=0, fill=1)

    # header
    c.drawImage(head, 0, H - 174, W, 174)
    c.setFillColor(Color(1, 1, 1)); c.setFont("Helvetica-Bold", 53); c.drawString(L, 731.89, "i!i!o")
    c.setFont(REG, 9.5)
    t = c.beginText(55, 707.89); t.setCharSpace(TRACK * 1.9); t.textOut(T["tagline"]); t.setCharSpace(0); c.drawText(t)
    c.setFillColor(Color(.725, .725, .725)); c.drawString(55, 692.89, T["place"])
    c.setFont(REG, 6.5); c.setFillColor(Color(.55, .55, .55))
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
        c.setFillColor(INK); ds(c, x, y - 46.6, name, BOLD, 10.6)
        c.setFillColor(GREY); ds(c, x, y - 59.6, role, REG, 8.6)
        b = para(bio, bsz, blead, titles=T["titles"])
        _, bh = b.wrap(COL_W, 600)
        b.drawOn(c, x, y - 69.8 - bh)
        bottom = min(bottom, y - 69.8 - bh)

    y = bottom - 24
    label(c, L, y, T["h_perf"]); rule(c, y - 14)
    for x, (venue, what, when) in zip(COLS, T["perfs"]):
        c.setFillColor(INK); ds(c, x, y - 34, venue, BOLD, 9.2)
        c.setFillColor(GREY); ds(c, x, y - 46.5, f"{what} · {when}", REG, 8.3)
    y -= 64
    rule(c, y)

    y -= 20
    label(c, L, y, T["h_tech"]); label(c, COLS[2], y, T["h_contact"])
    tp = para(T["tech"], 8.8, 13)
    _, th = tp.wrap(COLS[2] - L - 22, 200)
    tp.drawOn(c, L, y - 16 - th)

    cy = y - 24.8
    c.setFont(REG, 8.8); c.setFillColor(INK)
    for k, (text, url) in ((T.get("k_audio", "Audio"), ("youtube.com/@tttober", "https://www.youtube.com/@tttober")),
                           ("Instagram", ("@iiiio.trio", "https://www.instagram.com/iiiio.trio/"))):
        c.setFont(REG, 8.8); c.drawString(COLS[2], cy, k + "  ")
        x = COLS[2] + stringWidth(k + "  ", REG, 8.8)
        c.setFont(BOLD, 8.8); c.drawString(x, cy, text)
        link(c, x, cy, text, BOLD, 8.8, url)
        cy -= 13
    cy -= 6
    c.setFont(REG, 8.8); c.drawString(COLS[2], cy, A["name"]); cy -= 13
    c.setFont(BOLD, 8.8)
    c.drawString(COLS[2], cy, A["email"]); link(c, COLS[2], cy, A["email"], BOLD, 8.8, "mailto:" + A["email"]); cy -= 13
    c.drawString(COLS[2], cy, "gideokmoon.com"); link(c, COLS[2], cy, "gideokmoon.com", BOLD, 8.8, "https://gideokmoon.com")
    assert cy > 82, f"{path.name}: contact runs into the footer ({cy:.1f})"

    # footer
    rule(c, 72)
    c.setFont(REG, 7.5); c.setFillColor(GREY)
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
    build(KO, ROOT / "assets/press/iiio-epk-ko.pdf", head)
