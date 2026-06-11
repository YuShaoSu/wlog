/**
 * 內容資料模型 — docs/spec.md §8
 * 每趟旅行一份 Trip JSON，blocks 依線性順序排列。
 * 所有 `src` 為可選：素材未就緒時元件以色塊佔位顯示。
 */

export type LayeredPosition =
  | 'lower-left'
  | 'lower-right'
  | 'upper-left'
  | 'upper-right'
  | 'bleed-bottom';

export type Block =
  | { type: 'image-full';       src?: string; alt?: string; caption?: string }
  | { type: 'image-contained';  src?: string; alt?: string; caption?: string; variant?: 'opening' | 'standard' }
  | { type: 'image-pair';       src?: [string?, string?]; alt?: [string?, string?]; caption?: string }
  | { type: 'image-grid';       src?: (string | undefined)[]; count?: number; alt?: string[]; caption?: string }
  | { type: 'image-layered';    bg?: string; fg?: string; alt?: string; caption?: string; position?: LayeredPosition }
  | { type: 'loop-silent';      src?: string; alt?: string; caption?: string }
  | { type: 'video-featured';   src?: string; poster?: string; caption?: string }
  | { type: 'pullquote';        text: string }
  | { type: 'transition-text';  text: string }
  | { type: 'transition-still'; src?: string; alt?: string }
  | { type: 'transition-blank'; height?: string }
  | { type: 'title-end';        title: string; romaji: string; date: string };

export interface Trip {
  slug: string;
  title: string;
  romaji: string;
  date: string;
  ambient_audio?: string;
  blocks: Block[];
}
