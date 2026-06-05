import type { Lesson } from "./types";

/**
 * 학습용 오리지널 샘플 레슨 (저작권 문제 없음).
 * audioUrl이 null이므로 브라우저 내장 음성(TTS)으로 재생된다.
 * start/end는 실제 오디오를 붙일 때를 대비한 예상 타임코드이며,
 * TTS 모드에서는 문장을 순서대로 읽어준다.
 */
export const sampleLessons: Lesson[] = [
  {
    id: "daily-morning",
    title: "A Simple Morning Routine",
    level: "A2",
    topic: "daily",
    audioUrl: null,
    segments: [
      { id: "s1", start: 0, end: 4, en: "I usually wake up at seven in the morning.", ko: "저는 보통 아침 7시에 일어나요." },
      { id: "s2", start: 4, end: 8, en: "First, I drink a glass of water and open the window.", ko: "먼저 물 한 잔을 마시고 창문을 열어요." },
      { id: "s3", start: 8, end: 13, en: "Then I make breakfast, usually eggs and toast.", ko: "그런 다음 아침을 만드는데, 보통 계란과 토스트예요." },
      { id: "s4", start: 13, end: 18, en: "While I eat, I check the news on my phone.", ko: "먹는 동안 휴대폰으로 뉴스를 확인해요." },
      { id: "s5", start: 18, end: 23, en: "After breakfast, I brush my teeth and get dressed.", ko: "아침을 먹은 뒤 이를 닦고 옷을 입어요." },
      { id: "s6", start: 23, end: 28, en: "I leave home at eight and walk to the station.", ko: "8시에 집을 나서서 역까지 걸어가요." },
      { id: "s7", start: 28, end: 33, en: "A simple routine helps me feel calm and ready.", ko: "단순한 루틴은 제가 차분하고 준비된 기분이 들게 해줘요." },
    ],
  },
  {
    id: "investing-index-fund",
    title: "What Is an Index Fund?",
    level: "B1",
    topic: "investing",
    audioUrl: null,
    segments: [
      { id: "s1", start: 0, end: 5, en: "An index fund is a simple way to invest in the stock market.", ko: "인덱스 펀드는 주식 시장에 투자하는 간단한 방법이에요." },
      { id: "s2", start: 5, end: 11, en: "Instead of choosing single stocks, you buy a small piece of many companies.", ko: "개별 주식을 고르는 대신, 여러 회사의 작은 조각을 사는 거예요." },
      { id: "s3", start: 11, end: 17, en: "For example, one fund might follow the five hundred largest companies.", ko: "예를 들어, 어떤 펀드는 가장 큰 500개 회사를 따라가기도 해요." },
      { id: "s4", start: 17, end: 23, en: "Because the risk is spread out, it is usually safer than one stock.", ko: "위험이 분산되기 때문에, 보통 한 종목보다 더 안전해요." },
      { id: "s5", start: 23, end: 29, en: "The fees are often low, so you keep more of your money over time.", ko: "수수료가 보통 낮아서, 시간이 지날수록 돈을 더 많이 지킬 수 있어요." },
      { id: "s6", start: 29, end: 35, en: "Many experts suggest index funds for long-term, patient investors.", ko: "많은 전문가들이 장기적이고 인내심 있는 투자자에게 인덱스 펀드를 추천해요." },
      { id: "s7", start: 35, end: 40, en: "Remember, all investing has risk, so learn before you start.", ko: "모든 투자에는 위험이 있으니, 시작하기 전에 배우는 걸 잊지 마세요." },
    ],
  },
  {
    id: "fitness-start-exercise",
    title: "Starting to Exercise",
    level: "A2",
    topic: "fitness",
    audioUrl: null,
    segments: [
      { id: "s1", start: 0, end: 4, en: "Many people want to exercise, but starting is hard.", ko: "많은 사람이 운동하고 싶어 하지만, 시작하는 게 어려워요." },
      { id: "s2", start: 4, end: 9, en: "The secret is to begin small and stay consistent.", ko: "비결은 작게 시작하고 꾸준히 하는 거예요." },
      { id: "s3", start: 9, end: 14, en: "You can start with a ten-minute walk every day.", ko: "매일 10분 걷기로 시작할 수 있어요." },
      { id: "s4", start: 14, end: 19, en: "When that feels easy, add a few simple stretches.", ko: "그게 쉬워지면, 간단한 스트레칭을 몇 개 추가하세요." },
      { id: "s5", start: 19, end: 24, en: "Do not compare yourself to other people at the gym.", ko: "헬스장에서 다른 사람과 자신을 비교하지 마세요." },
      { id: "s6", start: 24, end: 29, en: "Small steps every day are better than one hard day.", ko: "매일의 작은 발걸음이 하루의 힘든 운동보다 나아요." },
      { id: "s7", start: 29, end: 34, en: "Be kind to your body, and progress will come.", ko: "몸을 아껴주면, 발전은 따라올 거예요." },
    ],
  },
];
