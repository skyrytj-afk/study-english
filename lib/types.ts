export type Level = "A2" | "B1";
export type Topic = "investing" | "tech" | "fitness" | "daily";

export interface Segment {
  id: string;
  /** 시작 시간(초). 실제 오디오가 있을 때 자막 싱크에 사용. */
  start: number;
  /** 끝 시간(초). */
  end: number;
  /** 영어 자막. */
  en: string;
  /** 한국어 번역. */
  ko: string;
}

export interface Lesson {
  id: string;
  title: string;
  level: Level;
  topic: Topic;
  /**
   * 오디오 파일 URL. null이면 브라우저 내장 음성(TTS)으로 대체 재생한다.
   * 업로드한 레슨은 브라우저가 만든 object URL이 들어간다.
   */
  audioUrl: string | null;
  segments: Segment[];
}

/** /api/feedback 응답: 격려 중심 피드백. */
export interface Feedback {
  /** 잘한 점 (한국어 설명). */
  strengths: string[];
  /** 고칠 점 — 문법·표현·자연스러움 (한국어 설명 + 영어 예문). */
  improvements: {
    point: string;
    example: string;
  }[];
  /** 더 자연스러운 표현 제안. */
  naturalAlternatives: {
    instead: string;
    better: string;
  }[];
  /** 따뜻한 격려 한마디 (한국어). */
  encouragement: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
