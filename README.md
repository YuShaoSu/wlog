# 旅程頁面 — Travel Journey Pages

一個記錄旅遊的網頁作品系列。每一趟旅行做成一個獨立的網頁，透過 web 原生的互動（滾動觸發、自動播放、聲音層）達成影片與紙本雜誌都做不到的編輯語言。

風格參考長谷川昭雄主編的 **Cahlumn** 雜誌——**字小、留白多、影像為主、文字輔助、整體克制**。

## 設計原則

1. **Motion is editorial, not decorative.** 預設靜止，只有刻意的時刻才動。
2. **Text serves the image, never the other way around.**
3. **Density is a tool, not a default.**
4. **The page should feel like one voice.**
5. **Restraint over expression.** 預設答案是「不」。

## Repo 結構

```
docs/spec.md                      設計規範 v1（視覺 tokens、區塊詞彙、動態詞彙、資料模型、部署建議）
prototype/kinosaki-prototype.html 原始參考實作（純 HTML/CSS/JS，以色塊代替照片）
src/
  styles/global.css               視覺 tokens、base、scroll reveal、reduced-motion
  types.ts                        Trip / Block 資料模型（spec §8）
  components/                     區塊詞彙元件庫（spec §4，一個區塊一個元件）
  layouts/TripLayout.astro        旅程頁共用外框（字體、reveal script、sound toggle）
  data/trips/*.json               每趟旅行一份 JSON
  pages/index.astro               Prototype：城崎旅程（由 JSON + 元件渲染）
  pages/blocks.astro              設計系統目錄頁（逐一展示所有區塊與變體）
```

## 開發

```sh
npm install
npm run dev       # http://localhost:4321 （/ 旅程 prototype，/blocks 元件目錄）
npm run build     # 靜態輸出到 dist/
```

## 新增一趟旅行

在 `src/data/trips/` 新增一份 JSON（schema 見 `src/types.ts` 與 `docs/spec.md` §8），
再加一個對應的 page 引用 `BlockRenderer` 即可。素材未就緒的區塊省略 `src`，會以色塊佔位顯示。

## 部署（依 spec §9.7）

- 託管：Cloudflare Pages（主站）＋ Cloudflare Stream / R2（影片）
- 真實素材導入後，`Media.astro` 將改用 `astro:assets` 做 build-time 影像最佳化

詳細規格請見 [`docs/spec.md`](docs/spec.md)。
