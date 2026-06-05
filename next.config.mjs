/** @type {import('next').NextConfig} */

// STATIC_EXPORT=true 이면 GitHub Pages용 정적 사이트(out/)로 빌드한다.
// (서버 API 라우트 없이 클라이언트 기능만 — 빌드 전 app/api 를 제거하고 사용)
const isStatic = process.env.STATIC_EXPORT === "true";

const nextConfig = {
  reactStrictMode: true,
  ...(isStatic
    ? {
        output: "export",
        basePath: "/study-english",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
