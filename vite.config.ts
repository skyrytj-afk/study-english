import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages는 https://<user>.github.io/<repo>/ 하위 경로로 서비스되므로
// 프로덕션 빌드에서는 base를 레포 이름으로 맞춘다.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/study-english/" : "/",
  plugins: [react()],
});
