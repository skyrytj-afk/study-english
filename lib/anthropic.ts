import Anthropic from "@anthropic-ai/sdk";

/**
 * 서버 전용 Claude 클라이언트. 절대 클라이언트 컴포넌트에서 import 하지 말 것.
 * 키는 ANTHROPIC_API_KEY 환경변수에서만 읽는다.
 */
export function getAnthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY가 설정되지 않았습니다. .env.local 또는 배포 환경변수에 추가하세요."
    );
  }
  return new Anthropic({ apiKey });
}

/** 사용할 모델. 기본값은 최신 Sonnet. CLAUDE_MODEL로 변경 가능. */
export function getModel(): string {
  return process.env.CLAUDE_MODEL || "claude-sonnet-4-6";
}
