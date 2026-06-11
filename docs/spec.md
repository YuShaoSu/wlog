# 旅程頁面 — Design Spec v1

> 給後續實作（Claude Code 或其他 frontend agent）的設計規範。
> 搭配參考實作：`kinosaki-prototype.html`

---

## 1. 概念

這是一個記錄旅遊的網頁作品系列，但不是傳統 blog／vlog。每一趟旅行做成一個獨立的網頁，可以放入照片、影片、聲音，並透過 web 原生的互動（自動播放、滾動觸發、聲音層）達成 mp4 影片做不到、紙本雜誌也做不到的編輯語言。

風格參考：長谷川昭雄主編的 **Cahlumn** 雜誌。重點不是模仿其視覺，而是繼承其態度——**字小、留白多、影像為主、文字輔助、整體克制**。這個品味要求所有設計與互動決定都服從「安靜」這個基準。

第一版的範圍是**單一趟旅行的頁面**。網站層級的容器（首頁、索引、品牌身份）暫不處理，等累積幾趟之後再決定。

---

## 2. 設計原則

寫進這份 spec 的所有規則，最終都服從以下五條原則。當實作遇到本 spec 未涵蓋的灰色地帶，以下原則為判斷依據。

1. **Motion is editorial, not decorative.** 動態存在的理由是它服務內容（讓畫面像呼吸、讓場景切換、讓細節被注意到），不是因為「網頁可以動」。預設狀態是靜止；只有刻意的時刻才動。

2. **Text serves the image, never the other way around.** 文字是邊註，協助觀者理解或定錨情緒。標題不大、caption 不長、引用句很少。圖永遠比文字大、比文字先被注意到。

3. **Density is a tool, not a default.** 主節奏是慢、一次一個畫面。偶爾出現的密集區塊（grid、pair）本身就在說「這段是熱鬧的／是物件清單」，不需要文字解釋。但這種重音要省著用，否則不再是重音。

4. **The page should feel like one voice.** 字體、色彩、留白比例、互動模式，整個作品系列共用一套規則。每一趟旅行的差異來自素材本身，不來自重新設計版面。

5. **Restraint over expression.** 任何時候面對「要不要加一個效果／一個元素／一個段落」，預設答案是「不」。少即是多。

---

## 3. 視覺 Tokens

### 3.1 色彩

完全克制的雙色系統，沒有強調色。

```css
--paper:     #efeee9;  /* 背景，比 AI 常見的暖米色更冷一點，接近日本編輯刊物紙感 */
--ink:       #14110f;  /* 主要文字，非純黑，帶有微暖 */
--ink-mid:   #75706a;  /* 次要文字（caption、meta、icon） */
--ink-light: #b8b2ab;  /* 極少用，僅用於非常微弱的分隔或佔位 */
```

不引入第三色、強調色或品牌色。如果未來某趟旅行真的需要色彩來說話，由該趟旅行的素材（照片本身）負責。

### 3.2 字體

**主字**：Noto Serif TC（思源明體的開源 web 字型版本）。
**英／數**：Noto Serif TC 內含拉丁字符，沿用，不引入第二套西文字體。
**Fallback**：`"Songti TC", "Source Han Serif", serif`

```css
--serif: "Noto Serif TC", "Songti TC", "Source Han Serif", serif;
```

**字重**：僅使用 200、300、400、500。**不使用 600 以上的粗體**。粗明體會立刻破壞克制感。

**字級層級**：

| 用途              | 字級                       | 字重 | letter-spacing |
| ----------------- | -------------------------- | ---- | -------------- |
| Caption / Meta    | `0.78rem`                  | 300  | `0.05em`       |
| Body (預留)       | `0.95rem`                  | 300  | normal         |
| Transition text   | `1rem`                     | 300  | `0.4–0.5em`    |
| Pullquote         | `clamp(1.05, 1.5vw, 1.35)` | 300  | `0.02em`       |
| Title (end)       | `clamp(1.1, 1.4vw, 1.3)`   | 400  | `0.5em`        |
| Romaji / 日期 meta | `0.7rem`                   | 300  | `0.3em`        |

**行高**：所有正文 `1.75`；pullquote `1.9`。

**字距規則**：CJK 文字一旦放大或要凸顯，靠 letter-spacing 而非字級或字重。letter-spacing 在 0.3em 以上時要記得 `margin-left` 補正置中（letter-spacing 會推擠文字右移）。

### 3.3 間距與留白

```css
--margin: clamp(1.5rem, 8vw, 6rem);  /* 通用水平 margin */
```

垂直間距規則：

- 區塊與區塊之間的 `padding-block`：`14vh` 為基準，慢區塊可拉到 `18vh`，pullquote 可拉到 `22vh`。
- 重要時刻使用 `90vh+ min-height` 讓區塊獨占視窗（transition-text、transition-still、image-full）。
- 開頭的 opening 區塊 `padding-top: 20vh`，給足喘息再開始。
- 結尾 title-end 上下 `25vh+`，最後再加 `endspace: 25vh`，避免讀者滾完突然撞底。

---

## 4. 區塊詞彙（Block Vocabulary）

這是這個作品系列的「樂高積木」。每一趟旅行都是由這些積木以線性順序組合而成。實作時這份清單即元件庫。

### 4.1 內容區塊

#### `image-full`
- **用途**：滿版單張照片，佔據整個視窗高度。電影感的關鍵單位。
- **使用時機**：establishing shot、視覺重音、情緒高點。
- **規格**：寬度 `100%`，高度 `88vh`（桌機）／`70vh`（手機）；`object-fit: cover`。
- **可選**：底部小字 caption（極節制使用）。

#### `image-contained`
- **用途**：留邊單張照片，編輯感較強，閱讀感較親密。
- **使用時機**：細節照、開頭的 detail-first 切入、有 caption 的圖。
- **規格**：`max-width: 1100px`，置中，水平 `--margin` 留白。長寬比視素材決定（3:2 預設，直幅 3:4 也常用）。
- **caption**：圖正下方，左對齊。

#### `image-pair`
- **用途**：兩張並置，產生對比、節奏、或暗示因果。
- **使用時機**：前後、內外、玄関／階段這類成對關係。
- **規格**：兩欄 grid，`gap: clamp(1rem, 3vw, 2.5rem)`。手機自動疊成上下。
- **caption**：跨欄置中，或省略。

#### `image-grid`
- **用途**：密集瞬間。打斷主節奏，暗示「這段是物件清單／印象集合」。
- **使用時機**：一趟旅行最多 1–2 次。物件、細節、人物群像。
- **規格**：`3 × N` 網格（手機 `2 × N`），方形比例。
- **caption**：grid 上方，左對齊，作為這群圖的標題式短語。

#### `image-layered`
- **用途**：背景圖＋前景圖的層疊構圖。背景設定場景／氛圍，前景是具體焦點。創造紙本雜誌經典的「對話式」構圖。
- **使用時機**：一趟旅行最多 1–2 次。適合「外與內」「遠與近」「整體與局部」這類成對關係，比 `image-pair` 更有空間感。
- **規格**：
  - 容器寬度 `max-width: 1400px`，`aspect-ratio: 3/2`。
  - 背景圖：絕對定位 `inset: 0`，填滿容器。
  - 前景圖：絕對定位，預設 `left: 8%; bottom: 8%`，寬度 `32%`，`aspect-ratio: 3/4`。
- **位置變體**（透過 `position` 欄位指定）：
  - `lower-left`（預設）
  - `lower-right`
  - `upper-left`
  - `upper-right`
  - `bleed-bottom`（前景圖向下超出背景邊界，編輯感更強，用更少）
- **caption**：可選。放在前景圖右側或下方的負空間，極短（< 20 字）。
- **重要原則**：兩張圖**都是平等的編輯影像**，不對背景做模糊、降飽和、暗化等處理。差異來自構圖與內容本身，不來自視覺效果。前景圖**不加陰影**，直接平貼於背景上（紙本印刷感）。

#### `loop-silent`
- **用途**：會動的照片。靠 Ken Burns 緩慢縮放／平移讓畫面有呼吸感。
- **規格**：高度 `90vh`，`overflow: hidden`。
- **動畫**：`scale(1.0)` → `scale(1.08)` + 微小 translate，`32s ease-in-out infinite alternate`。
- **聲音**：永遠靜音。即便使用者開啟聲音層，這個區塊不發聲。
- **caption**：可選，疊在畫面左下，`mix-blend-mode: difference` 確保任何底圖都可讀。
- **降級**：`prefers-reduced-motion: reduce` 時關閉動畫，變成靜止圖。

#### `video-featured`
- **用途**：有聲影片，是「請停下來看」的時刻。
- **使用時機**：一趟最多 1–2 次。
- **規格**：滿版或 contained 皆可。**預設不自動播放**，使用者點擊或滾入視窗中央後播放。
- **聲音**：播放時可短暫蓋過 ambient sound layer，結束後恢復。
- **降級**：素材未就緒時 fallback 為 image-full + 「play」icon 暗示。

### 4.2 文字區塊

#### `caption`
- **用途**：小字邊註。
- **規格**：`0.78rem`，`color: --ink-mid`，`letter-spacing: 0.05em`，`font-weight: 300`。
- **位置**：永遠依附在某個圖區塊下方或內部，不獨立成段。

#### `pullquote`
- **用途**：被強調的短句。
- **使用時機**：一趟旅行**最多 2 次，建議 1 次**。
- **規格**：置中，最大寬度 `32ch`，上下 `22vh` 留白。
- **內容規則**：短，最好一行半以內。原文（中／日／英）皆可，依素材語境決定。

### 4.3 轉場區塊（無形章節）

這三個是 vlog 剪輯詞彙的網頁版，用來在無形章節之間切換。

#### `transition-text`
- **用途**：整頁一行短文字，標記情緒／時間／地點切換。
- **規格**：`min-height: 90vh`，置中。文字 `1rem`、`letter-spacing: 0.4–0.5em`。
- **內容慣例**：極短。一個漢字（「朝」「夜」）、一個時段、一個地名都好。

#### `transition-still`
- **用途**：整頁一張照片，**沒有任何 caption**。純畫面的呼吸。
- **規格**：`height: 100vh`，`object-fit: cover`。
- **使用時機**：場景／情緒切換之間的空鏡。

#### `transition-blank`
- **用途**：純色頁面，沒有任何內容。最極端的呼吸。
- **規格**：`height: 60–80vh`，`background: var(--paper)`。
- **使用時機**：非常少。重大情緒轉折之間（例如從熱鬧的市場切到安靜的清晨）。一趟旅行最多 1 次。

### 4.4 結構區塊

#### `title-end`
- **用途**：標題在這裡出現。整個作品唯一的標題位置（**不放開頭**）。
- **規格**：置中，上下 `25vh+` 留白。
- **結構**：
  - Romaji／英文小字（`0.7rem`）
  - 中／日文主標題（`1.1–1.3rem`，`letter-spacing: 0.5em`）
  - 日期 meta（`0.7rem`，下方 `2rem` 距）

### 4.5 全站元件

#### `sound-toggle`
- **位置**：`position: fixed`，`bottom: 1.5rem; right: 1.5rem`。
- **規格**：20×20 px 容器，內含 14×14 px SVG 揚聲器 icon。
- **狀態**：預設關閉（揚聲器加叉）。點擊切換到開啟（揚聲器加聲波）。
- **顏色**：`--ink-mid`，hover 轉 `--ink`。無底色、無邊框。

---

## 5. 動態詞彙（Motion Vocabulary）

### 5.1 允許的動態

- **scroll reveal**：所有區塊進入視窗時，`opacity: 0 → 1` + `translateY(20px → 0)`，`transition: 1.6s ease`。閾值 `0.12`。觀者越往下滾，內容越溫和地浮現。
- **Ken Burns**：僅限 `loop-silent` 區塊。32 秒一個來回，scale 1.0 → 1.08，translate < 2%。
- **smooth scroll**：`scroll-behavior: smooth`，搭配錨點時生效。
- **hover micro-interaction**：僅限 `sound-toggle` 顏色變化，`transition: 0.3s ease`。
- **sound fade**：背景音切換或暫停時 `0.5–1s` 漸入漸出，不硬切。

### 5.2 禁止的動態

- **parallax**：背景與前景分離移動。太「網頁感」。
- **dramatic reveals**：scale + opacity 同時放大、文字爆炸進場、粒子特效。
- **autoplay video with sound**：自動播放有聲影片。
- **scroll-jacking**：搶走使用者滾動控制權的固定滾動劇情（例如強制每滾一格才跳一段）。
- **bouncy / elastic easing**：彈跳、橡皮筋。所有 easing 用 `ease` 或 `ease-in-out`，曲線溫和。
- **持續循環動畫**（spinner、pulse、bounce）：除了 Ken Burns 以外，任何「永遠在動」的元素都禁止。

### 5.3 reduced-motion 行為

`@media (prefers-reduced-motion: reduce)` 時：
- 關閉 scroll reveal（內容直接顯示）
- 關閉 Ken Burns
- 關閉 `scroll-behavior: smooth`

---

## 6. 頁面結構慣例

每一趟旅行的線性頁面遵守以下結構慣例。順序可調整，但角色不變。

### 6.1 開頭

第一個區塊**幾乎一定是 `image-contained`，且是一張細節照**（手、物件、近景、局部），加一行小字 caption。**不放標題、不放 logo、不放導覽**。

理由：從細節切入比 hero shot 電影感更強，也建立了「這個作品相信讀者」的態度。

### 6.2 主體

開頭之後，按照敘事節奏自由組合區塊。建議節奏：

- 主節奏：`image-full` / `image-contained` / `image-pair` / `loop-silent` 交替，每 3–5 個區塊穿插一次 `transition-text` 或 `transition-still`。
- 偶爾出現 `image-grid` 作為密集重音（一趟 1–2 次）。
- `pullquote` 在情緒高點放一次，最多兩次。
- `video-featured` 在「請停下來看」的時刻放一次，最多兩次。
- `transition-blank` 全趟最多一次，用在最大情緒轉折處。

### 6.3 結尾

`title-end` 區塊作為結束。讀者讀到這裡才知道完整標題，是一個「啊，這就是這趟啊」的收束時刻。

`title-end` 之後接 `endspace`（`25vh` 空白），讓滾動有自然的結束感，而不是撞底。

---

## 7. 聲音

### 7.1 預設狀態

進站**完全靜音**。讀者不會被聲音突襲。

### 7.2 啟動方式

右下角 `sound-toggle` 是唯一啟動點。圖示語意明確（靜音 vs 有聲）。沒有其他自動觸發。

### 7.3 一趟一首

一趟旅行配一首背景音樂或環境音混音。**跨區塊不中斷、不重播**。讀者滾動時音樂繼續、不會因為換段而從頭開始。

### 7.4 區塊與聲音的互動

- `loop-silent`：永遠靜音。
- `video-featured` 播放時：背景音淡出（`0.5s`），影片結束後淡入恢復。
- `ambient-sound`（保留區塊類型）：未來若某個段落想綁定特定環境聲（火車、雨聲），可作為短暫的疊加，滾入啟動、滾出淡出。第一版可不實作。

### 7.5 音量

背景音預設音量約 `0.4–0.5`（不刺耳），不需要使用者額外調整。`video-featured` 的音量 `1.0`。

---

## 8. 內容資料模型

每一趟旅行用一個結構化資料描述。建議格式為 JSON 或 markdown frontmatter，由後續實作決定。

### 8.1 Trip Schema

```typescript
interface Trip {
  slug: string;              // url 用，例：'kinosaki-2024-01'
  title: string;             // 主標，例：'城崎、一月'
  romaji: string;            // 英文或羅馬字副標，例：'Kinosaki Onsen'
  date: string;              // 顯示用日期，例：'2024 / 01'
  ambient_audio?: string;    // 背景音檔路徑，可選
  blocks: Block[];           // 線性順序的區塊陣列
}
```

### 8.2 Block Schema

```typescript
type Block =
  | { type: 'image-full';      src: string; caption?: string }
  | { type: 'image-contained'; src: string; caption?: string; variant?: 'opening' | 'standard' }
  | { type: 'image-pair';      src: [string, string]; caption?: string }
  | { type: 'image-grid';      src: string[]; caption?: string }     // 3, 6, 9 張
  | { type: 'image-layered';   bg: string; fg: string; caption?: string;
                               position?: 'lower-left' | 'lower-right' | 'upper-left' | 'upper-right' | 'bleed-bottom' }
  | { type: 'loop-silent';     src: string; caption?: string }       // 圖或短影片皆可
  | { type: 'video-featured';  src: string; poster?: string; caption?: string }
  | { type: 'pullquote';       text: string }
  | { type: 'transition-text'; text: string }
  | { type: 'transition-still'; src: string }
  | { type: 'transition-blank'; height?: string }
  | { type: 'title-end';       title: string; romaji: string; date: string };
```

### 8.3 範例

```json
{
  "slug": "kinosaki-2024-01",
  "title": "城崎、一月",
  "romaji": "Kinosaki Onsen",
  "date": "2024 / 01",
  "ambient_audio": "/audio/kinosaki.mp3",
  "blocks": [
    { "type": "image-contained", "src": "/img/k01.jpg", "caption": "雨從昨晚就沒停", "variant": "opening" },
    { "type": "transition-text", "text": "朝" },
    { "type": "image-full", "src": "/img/k02.jpg" },
    { "type": "image-pair", "src": ["/img/k03a.jpg", "/img/k03b.jpg"], "caption": "玄関 ／ 階段" },
    { "type": "image-contained", "src": "/img/k04.jpg", "caption": "走到外湯，徒歩五分" },
    { "type": "loop-silent", "src": "/img/k05.jpg", "caption": "湯気" },
    { "type": "image-grid", "src": ["/img/k06.jpg", "..."], "caption": "房間裡的東西" },
    { "type": "image-layered", "bg": "/img/k06b-bg.jpg", "fg": "/img/k06b-fg.jpg", "caption": "窓越しの庭", "position": "lower-left" },
    { "type": "transition-still", "src": "/img/k07.jpg" },
    { "type": "transition-text", "text": "夕暮れ" },
    { "type": "image-full", "src": "/img/k08.jpg" },
    { "type": "pullquote", "text": "湯から上がると、知らない街がすこし、自分のものになっている。" },
    { "type": "image-contained", "src": "/img/k09.jpg" },
    { "type": "title-end", "title": "城崎、一月", "romaji": "Kinosaki Onsen", "date": "2024 / 01" }
  ]
}
```

---

## 9. 實作備註

### 9.1 技術建議

**推薦：Astro**。理由是它在 build 階段內建影像最佳化（自動產生 WebP/AVIF 多尺寸版本、srcset、lazy loading），這對媒體重的網站影響很大——詳見 9.7。

其他可行選項：

- **Eleventy**：純靜態站，更輕量但需自行處理影像最佳化（可搭配 sharp / `@11ty/eleventy-img`）。
- **純 HTML / CSS / JS**：第一版完全可接受（參考實作即是此方式）。累積到三、四趟之後再考慮遷移。
- **Next.js**：可，但對這個靜態內容性質有點 over-engineering。

### 9.2 圖片處理

- **格式**：優先使用 WebP（廣泛支援）或 AVIF（更小檔案，較新瀏覽器）。原始 JPEG 可保留為 fallback。
- **build-time 處理**：透過 Astro 內建的 `<Image>` / `<Picture>` 元件，或 sharp / squoosh，在建構時自動產生多尺寸與多格式版本。**不要在 repo 裡放原始 4K JPEG 然後直接用 `<img>` 引用**。
- **尺寸**：主圖長邊 1600–2400px，提供 2x 給高解析螢幕（透過 srcset）。
- **品質**：WebP `quality: 80`，AVIF `quality: 65` 起跳，視覺與檔案大小取捨。
- **lazy loading**：非首屏圖片加 `loading="lazy"`。
- **CLS 防範**：所有圖片容器使用 `aspect-ratio` 或固定尺寸，避免載入時版面跳動。

### 9.3 影片處理

- **重要**：影片**不要**和靜態站放在同一個 CDN（特別是 Cloudflare Pages 的條款明確禁止影片串流）。詳見 9.7 的影片託管選項。
- **`loop-silent` 用**：短於 8 秒，無聲 MP4 或 WebM，`<video autoplay loop muted playsinline>`。檔案 < 2 MB 為佳。
- **可選降級**：素材未就緒時可用 Ken Burns 靜圖替代，視素材決定。
- **`video-featured` 用**：5–30 秒，有聲，`preload="metadata"`，**不 autoplay**。提供 `poster` 屬性（poster 圖跟著靜態站一起壓縮、最佳化）。

### 9.4 RWD

- **桌機優先**（≥ 1024px）：所有規格以此為主。
- **手機**（< 720px）：
  - `image-pair` 變成上下單欄。
  - `image-grid` 從 3 欄變 2 欄。
  - `image-full` 高度降到 `70vh`。
  - `loop-silent` 高度降到 `70vh`。
- 平板區間（720–1024px）暫不特別處理，待累積使用後再調。

### 9.5 性能

- LCP 目標 < 2.5s（首屏的 image-contained 是關鍵）。
- 字體用 `font-display: swap`。
- IntersectionObserver 用 `threshold: 0.12`，閾值不要太高否則 reveal 太晚。
- 一頁實際 DOM 應該很輕（10–20 個 section），不需要虛擬化。

### 9.6 可達性（Accessibility）

- 所有圖片需要 `alt`（即使空字串也要寫上）。
- `sound-toggle` 需要 `aria-label`。
- 確保 `prefers-reduced-motion: reduce` 時的降級行為（已寫進 motion vocabulary）。
- 確保鍵盤可達——`sound-toggle` 是 `<button>` 即可，不需特別處理。

### 9.7 部署與託管

媒體重的網站如果用錯架構，每月帳單可以從 0 元跳到三位數美金。以下是建議的部署 stack，目標是「免費或極低成本下，承受得起持續累積的旅行內容與不可預測的流量峰值」。

#### 推薦 stack

| 元件      | 服務                         | 月費       | 角色                                  |
| --------- | ---------------------------- | ---------- | ------------------------------------- |
| 主站託管  | Cloudflare Pages             | $0         | HTML / CSS / JS / 壓縮過的圖片        |
| 建構工具  | Astro                        | $0         | Build-time 影像最佳化、SSG            |
| 影片託管  | Cloudflare Stream 或 Vimeo Pro | $5–12       | 影片儲存與串流                        |
| 音訊      | Cloudflare Pages（靜態檔案）  | $0         | 一首 3–5 MB 的環境音樂直接放 repo    |

**最低月費 $0，加上影片服務後 $5–12**。

#### 為什麼是 Cloudflare Pages

Vercel 和 Netlify 的免費方案是每月 ~100 GB 頻寬上限——個人作品集夠用，但媒體重的網站很容易撞牆。

Cloudflare Pages 的免費方案**無頻寬上限**、無信用卡、允許商業使用、永不過期。這不是行銷話術——頻寬不是 Cloudflare 的成本中心（他們靠 DNS、安全、企業服務賺錢），CDN 流量對他們是邊際零成本。

對於「靜態 HTML + 壓縮過的照片 + 音訊」這種網站結構，這個方案實質上等於免費吃到飽。

#### 為什麼影片要分開

Cloudflare 的標準 CDN 條款**明確禁止**影片串流與大檔案分發。所以雖然 Pages 無頻寬上限，影片不能放上去。三個選項：

1. **Cloudflare Stream**（推薦）：約 $5/月可存 1000 分鐘影片並提供 adaptive streaming。與 Pages 整合最順、技術門檻最低。
2. **Vimeo Pro**：約 $7–12/月。播放器乾淨、可隱藏品牌、編輯感強。流量完全由 Vimeo 扛。適合不想自己處理影片技術的人。
3. **Cloudflare R2**：10 GB 免費儲存、egress 永遠免費（這是關鍵）。需自己處理播放邏輯（HTML `<video>` 直接指向 R2 URL 即可，但若要 adaptive bitrate 就要額外工）。最自由但最需技術介入。

第一版若影片少（< 10 個短片）、預算為零，可考慮 R2。內容累積後再評估升級到 Stream 或 Vimeo。

#### 應避免的做法

- 把未壓縮的 4K 原始檔直接 commit 到 repo。
- 把影片放在 Cloudflare Pages 上（違反條款）。
- 用 Vercel / Netlify 託管媒體重的網站，期望免費方案撐得住流量增長。
- 在 `<img>` 標籤直接引用 8 MB 的 JPEG 而不經 build 處理。

#### 部署流程

理想流程：

1. 內容（trip JSON + 原始素材）放在 Git repo 或 CMS。
2. push to main → Cloudflare Pages 觸發 build。
3. Astro 在 build 階段：壓縮圖片、產生 WebP/AVIF 多尺寸、計算 hash 寫進檔名（cache busting）。
4. 部署到全球 330+ CDN 節點。
5. 影片素材另外上傳到 Stream / Vimeo / R2，URL 寫進 trip JSON。

新增一趟旅行 = 新增一份 JSON + 一個資料夾的圖 + 影片連結，然後 git push。其他全部自動。

---

## 10. 參考實作

`kinosaki-prototype.html` 是本 spec 的視覺參考實作。它示範了以下事項，可直接讀其原始碼對照：

- 所有區塊類型（HTML 中以 `<!-- BLOCK: xxx -->` 註解標示）
- 視覺 tokens 的實際 CSS 變數定義
- Ken Burns 動畫實作
- Scroll reveal 的 IntersectionObserver 寫法
- Sound toggle 的 SVG icon 與狀態切換
- RWD 的 breakpoint 處理
- reduced-motion 降級

**重要**：prototype 使用色塊代替照片以避免外部圖片載入問題。實際實作時請替換為真實素材，並依照各區塊的 `aspect-ratio` 與 `object-fit: cover` 規則處理。

---

## 11. 未涵蓋（待 v2）

以下事項本 spec 刻意不處理，等第一趟實際做完累積經驗再決定：

- 多趟旅行之間的索引／首頁／導覽
- 整站品牌身份（logo、編號系統）
- 跨頁面的閱讀進度／回訪狀態
- 社群分享 metadata（OG image 等）
- 多語言版本
- `ambient-sound` 區塊（段落綁定的環境聲）
- 互動式區塊（明信片翻面、polaroid 揭露等戲劇性元件）

第一個原則仍然成立：**Restraint over expression**。先讓 v1 跑通，看到實際素材後再決定 v2 要加什麼。
