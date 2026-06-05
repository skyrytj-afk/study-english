import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "영어 듣기·말하기 연습",
  description:
    "이해 가능한 입력 → 섀도잉 → 재말하기(AI 피드백) 흐름으로 영어 듣기와 말하기를 차분하게 연습하는 앱.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
