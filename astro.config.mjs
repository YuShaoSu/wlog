import { defineConfig } from 'astro/config';

export default defineConfig({
  // 靜態輸出，部署到 Cloudflare Pages（見 docs/spec.md 9.7）
  output: 'static',
});
