/**
 * AI 기능(단어 뜻·피드백·대화) 사용 가능 여부.
 * GitHub Pages 같은 정적 배포에서는 서버 라우트가 없으므로
 * 빌드 시 NEXT_PUBLIC_AI_ENABLED=false 로 꺼서 UI를 비활성화한다.
 * Vercel 등 서버가 있는 배포에서는 기본값(true).
 */
export const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED !== "false";
