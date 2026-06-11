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
prototype/kinosaki-prototype.html 參考實作（純 HTML/CSS/JS，以色塊代替照片）
```

## 快速預覽

prototype 是單一 HTML 檔，直接用瀏覽器開啟即可：

```sh
open prototype/kinosaki-prototype.html
# 或起一個本地 server
npx serve prototype
```

## 下一步（依 spec 第 9 節）

- 技術選型：推薦 **Astro**（build-time 影像最佳化）
- 託管：Cloudflare Pages（主站）＋ Cloudflare Stream / R2（影片）
- 內容模型：每趟旅行一份 trip JSON（schema 見 `docs/spec.md` 第 8 節）

詳細規格請見 [`docs/spec.md`](docs/spec.md)。
