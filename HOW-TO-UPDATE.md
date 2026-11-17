# 사이트 직접 업데이트하기

gideokmoon.com을 혼자 고치는 방법입니다. 거의 모든 글과 일정은 **파일 하나**,
`assets/js/data.js`에 있습니다. 이 파일만 고치면 사이트 전체에 반영됩니다.

---

## 고치는 두 가지 방법

### A. GitHub 웹에서 — 설치 필요 없음 (추천)

1. https://github.com/moong0312/gideokmoondrums/blob/main/assets/js/data.js 열기
2. 오른쪽 위 **연필 아이콘**(Edit this file)
3. 고치기 — ⌘F로 찾고 싶은 글자를 검색하면 빨리 찾습니다
4. 오른쪽 위 **Commit changes…** → 메모 한 줄("Add Mar 12 concert") → **Commit changes**
5. 1~2분 기다린 뒤 사이트에서 **⌘⇧R**(강력 새로고침)

### B. 맥에서 직접

1. VS Code나 텍스트 편집기로 `~/Documents/Claude/Website/assets/js/data.js` 열고 수정·저장
2. 터미널에 아래 한 줄 (메모 부분만 바꿔서):

```bash
cd ~/Documents/Claude/Website && node --check assets/js/data.js && git commit -am "Add Mar 12 concert" && git push
```

`node --check`가 오류를 찾으면 거기서 멈추고 올리지 않습니다. 사이트가 깨질 일이 없습니다.

---

## ⚠️ 이것만 조심하세요

`data.js`에 문법 오류가 하나라도 있으면 **사이트 전체가 빈 화면**이 됩니다.

1. **값은 전부 큰따옴표로** — `venue: "PROGR, Bern"`
2. **항목 사이에 쉼표** — `venue: "…",` 다음 줄 `players: "…"`
3. **블록 사이에 쉼표** — `{ … },` 다음 블록 `{ … }`
4. **값 안에 큰따옴표를 쓸 때는** `\"` — `"Vol. 1: \"Again, Being\""`

### 사이트가 비었을 때 되돌리기

GitHub에서 `data.js` → 오른쪽 위 **History** → 깨지기 직전 버전 클릭 → **…** → **View file** →
내용 전체 복사 → 다시 편집 화면에 붙여넣고 Commit. 또는 Claude에게 "data.js 깨졌어"라고 하면 됩니다.

---

## 자주 하는 일

### 1. 공연 추가 — `live.dates`

`dates: [` 바로 아래에 블록을 하나 붙여넣습니다. 순서는 상관없습니다 — 사이트가 날짜순으로 정렬하고,
다가올 공연에는 **Upcoming** 표시를 자동으로 붙이고, 첫 화면 **NEXT**에도 자동으로 올립니다.

```js
      { date: "2027-03-12", label: "Mar 12, 2027", project: "i!i!o", work: "iio",
        venue: "Dampfzentrale, Bern",
        players: "Tobias Rüetschi, Jessie Chen",
        info: "https://…" },
```

| 칸 | 필수 | 내용 |
|---|---|---|
| `date` | ✅ | `"YYYY-MM-DD"`. 정렬용. 며칠짜리 공연은 첫날 |
| `label` | ✅ | 화면에 보이는 날짜. `"Mar 12, 2027"`, `"Mar 31 – Apr 4, 2027"` |
| `project` | ✅ | 제목 |
| `venue` | ✅ | 장소, 도시 |
| `players` | | 함께한 사람 ("with"는 자동) |
| `video` | | 영상 링크 → VIDEO ↗ 버튼 |
| `info` | | 공연장·티켓 링크 → INFO ↗ 버튼 |
| `work` | | 프로젝트 페이지에도 띄우려면: `"solo"` `"iio"` `"life-and-sound"` `"edge"` |

공연 취소·변경: 그 블록을 찾아 고치거나, 블록 전체(`{`부터 `},`까지)를 지웁니다.

### 2. 앨범 추가 — `releases`

```js
    {
      title: "New Album",
      year: 2027,
      credited: "i!i!o",
      role: "leader",                 // 리더면 "leader", 참여면 "sideman"
      label: "",
      note: "",
      image: "assets/img/release-new-album.jpg",
      link: "https://album.link/…"     // 또는 Bandcamp 주소
    },
```

커버 이미지는 정사각 640×640 이상으로 `assets/img/`에 넣습니다.
GitHub 웹: 그 폴더에서 **Add file → Upload files**.

### 3. 바이오 고치기 — 파일 맨 위

| 바꿀 것 | 고칠 곳 |
|---|---|
| 첫 화면 두 문장 = Short 바이오 | `INTRO` |
| Medium 바이오 (~100단어, 지원서용) | `BIO_MEDIUM` |
| Long 바이오의 뒤쪽 문단 | `BIO_LONG` |

`INTRO`를 고치면 첫 화면·Short·Long 첫 문단이 함께 바뀝니다.

### 4. 프로젝트 소개·영상 — `works`

각 프로젝트는 `id: "solo"`, `id: "iio"` 같은 블록입니다.

- 소개글: `text`
- 대표 영상: `videoId` — YouTube 주소 `https://youtu.be/XXXXXXXXXXX`의 마지막 11글자
- 편성: `lineup`
- ieum 아래 소그룹 영상: `subs` — `{ title: "Pure Data", videoId: "…" }` 한 줄씩

### 5. 연락처·소셜 — `artist`

`email`, `phone`, `instagram`, `youtube`. 사이트 모든 페이지 푸터에 같이 반영됩니다.

---

## 혼자 하기 어려운 것 (Claude에게)

- **i!i!o PDF 프레스킷** — 스크립트로 만듭니다(`python3 tools/iiio_pdf.py`)
- **사진 바꾸기** — 크기·크롭·용량을 맞춰야 해서
- **디자인·레이아웃 변경**

자세한 구조 설명은 `README.md`에 있습니다.
