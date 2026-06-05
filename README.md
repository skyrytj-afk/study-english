# 🎧 영어 듣기·말하기 연습 (Study English)

A2–B1 수준 한국인 학습자를 위한 영어 **듣기·말하기 연습 웹앱**입니다.
**이해 가능한 입력 → 섀도잉 → 재말하기(AI 피드백)** 흐름을 한 화면에서 돌릴 수 있습니다.

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- 진행 데이터(연속일·학습시간·내 레슨)는 **localStorage**에 저장
- AI 피드백/대화는 **Next.js Route Handler(서버)** 에서 Claude API 호출
  → API 키는 `ANTHROPIC_API_KEY` 환경변수만 사용, **프런트엔드에 노출되지 않음**

## ✨ 기능

### 1) 듣기
- 문장 단위 자막 + 재생 위치 하이라이트
- **자막 독립 토글**: 영어 ON/OFF · 한국어 ON/OFF (4가지 상태)
- 재생 속도 **0.75x / 0.85x / 1.0x**, **현재 문장 반복**, **A‑B 반복**
- 권장 흐름 안내: ① 자막 끄고 듣기 → ② 영어 자막 → ③ 한국어로 확인
- 오디오 파일이 없는 레슨은 **브라우저 내장 음성(TTS)** 으로 자동 재생

### 2) 섀도잉
- 문장 선택 → 원음 재생 → **마이크 녹음(MediaRecorder)**
- 원음과 내 녹음을 나란히 재생·비교, **파형** 표시
- 한 문장씩 이동하며 반복 연습

### 3) 재말하기 + AI 피드백
- 들은 내용을 **음성(Web Speech API, en‑US)** 또는 텍스트로 재말하기/요약
- 서버가 Claude로 **격려 중심 피드백** 생성
  → 잘한 점 / 고칠 점(영어 예문) / 더 자연스러운 표현 / 따뜻한 격려 (한국어 설명)

### 4) 대화 (선택)
- 레슨 주제로 AI와 짧고 쉬운 영어 자유 대화

### 진행/습관
- 연속 학습일(streak), 누적 학습 시간 표시 (점수보다 꾸준함 강조)
- 모바일 우선 반응형 · 다크 모드 지원

### 내 레슨 추가
- 오디오 파일 + `start/end/en/ko` 형식의 자막 JSON을 업로드해 직접 레슨 추가

## 🚀 로컬 실행

```bash
npm install
cp .env.example .env.local   # 그리고 ANTHROPIC_API_KEY 채우기
npm run dev                  # http://localhost:3000
```

> AI 피드백·대화 기능은 `ANTHROPIC_API_KEY`가 있어야 동작합니다.
> 키 없이도 듣기·섀도잉 등 나머지 기능은 사용할 수 있습니다.
> 음성 기능(TTS·음성인식·녹음)은 Chrome·Edge·Safari 최신 버전에서 가장 잘 동작합니다.

## 🔑 환경변수

`.env.local` (로컬) 또는 배포 플랫폼의 환경변수에 설정합니다.

| 변수 | 필수 | 설명 |
|------|------|------|
| `ANTHROPIC_API_KEY` | ✅ | Claude API 키. [console.anthropic.com](https://console.anthropic.com)에서 발급. **서버 전용** |
| `CLAUDE_MODEL` | ❌ | 사용할 모델. 기본값 `claude-sonnet-4-6` |

## ▲ Vercel 배포

1. 이 저장소를 GitHub에 푸시합니다.
2. [vercel.com](https://vercel.com)에서 **New Project → 이 저장소 Import** (Next.js 자동 인식).
3. **Settings → Environment Variables** 에 `ANTHROPIC_API_KEY` 추가 (필요 시 `CLAUDE_MODEL`).
4. **Deploy**. 빌드 후 발급되는 `https://<프로젝트>.vercel.app` 주소로 모바일·PC에서 바로 접속.

CLI로 배포하려면:

```bash
npm i -g vercel
vercel            # 최초 1회 프로젝트 연결
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

## 🗂 폴더 구조

```
app/
├─ layout.tsx           루트 레이아웃
├─ page.tsx             홈 (레슨 선택 + 진행 + 학습 화면)
├─ globals.css          Tailwind 글로벌 스타일
└─ api/
   ├─ feedback/route.ts 재말하기 AI 피드백
   └─ chat/route.ts     자유 대화
components/
├─ LearnView.tsx        듣기/섀도잉/재말하기/대화 탭 컨테이너
├─ ListeningPanel.tsx   듣기 (자막 토글·속도·반복)
├─ ShadowingPanel.tsx   섀도잉 (녹음·비교·파형)
├─ RetellPanel.tsx      재말하기 + 피드백 카드
├─ ChatPanel.tsx        자유 대화
├─ LessonUpload.tsx     내 레슨 추가
├─ ProgressHeader.tsx   연속일·학습시간·다크모드
└─ Waveform.tsx         녹음 파형
lib/
├─ types.ts             Lesson/Segment/Feedback 등 타입
├─ lessons.ts           샘플 레슨 (오리지널, 저작권 무관)
├─ storage.ts           localStorage 진행·레슨 저장
├─ useLessonPlayer.ts   오디오/TTS 통합 재생 훅
├─ useRecorder.ts       마이크 녹음 훅
├─ useSpeechRecognition.ts  음성 인식 훅
├─ anthropic.ts         서버 전용 Claude 클라이언트
└─ prompts.ts           피드백·대화 시스템 프롬프트
```

## 📝 콘텐츠 안내

샘플 레슨은 저작권 문제가 없도록 **학습용으로 새로 작성한 오리지널 텍스트**입니다.
문장별 영어/한국어가 매칭되어 자막 싱크가 정확합니다.
`lib/lessons.ts`에 같은 형식으로 레슨을 추가할 수 있습니다.

## 보안 메모

- `ANTHROPIC_API_KEY`는 Route Handler(서버)에서만 읽으며 클라이언트 번들에 포함되지 않습니다.
- 현재 Next 14.2.35(보안 패치 버전) 사용. 일부 잔여 advisory는 이 앱이 쓰지 않는 기능(Image Optimization API, i18n 미들웨어)에 해당하며 Next 16에서 해소됩니다.
