import { useMemo, useState } from "react";
import { stories } from "./data/stories";
import { useSpeech } from "./hooks/useSpeech";

export default function App() {
  const [storyId, setStoryId] = useState(stories[0].id);
  const [rate, setRate] = useState(1);
  const [showEn, setShowEn] = useState(true);
  const [showKo, setShowKo] = useState(true);
  const [voiceName, setVoiceName] = useState<string | undefined>(undefined);

  const story = useMemo(
    () => stories.find((s) => s.id === storyId)!,
    [storyId]
  );

  const englishLines = useMemo(
    () => story.sentences.map((s) => s.en),
    [story]
  );

  const { status, currentIndex, voices, supported, play, pause, resume, stop } =
    useSpeech({ sentences: englishLines, rate, voiceName });

  const handleStoryChange = (id: string) => {
    stop();
    setStoryId(id);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📖 영어 리딩</h1>
        <select
          className="story-select"
          value={storyId}
          onChange={(e) => handleStoryChange(e.target.value)}
        >
          {stories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} · {s.level}
            </option>
          ))}
        </select>
      </header>

      {!supported && (
        <p className="warning">
          이 브라우저는 음성 읽기(Web Speech API)를 지원하지 않습니다. Chrome,
          Edge, Safari 최신 버전을 사용해 주세요.
        </p>
      )}

      <main className="reader">
        {story.sentences.map((sentence, i) => {
          const isActive = i === currentIndex;
          return (
            <div
              key={i}
              className={`sentence ${isActive ? "active" : ""}`}
              onClick={() => play(i)}
              title="클릭하면 이 문장부터 읽어요"
            >
              {showEn && <p className="line-en">{sentence.en}</p>}
              {showKo && <p className="line-ko">{sentence.ko}</p>}
              {!showEn && !showKo && (
                <p className="line-hidden">· · · (자막이 모두 꺼져 있어요) · · ·</p>
              )}
            </div>
          );
        })}
      </main>

      <footer className="controls">
        <div className="control-row">
          <div className="playback">
            {status !== "playing" ? (
              <button
                className="btn primary"
                onClick={() =>
                  status === "paused" ? resume() : play(0)
                }
                disabled={!supported}
              >
                {status === "paused" ? "▶︎ 계속" : "▶︎ 재생"}
              </button>
            ) : (
              <button className="btn" onClick={pause}>
                ⏸ 일시정지
              </button>
            )}
            <button className="btn" onClick={stop} disabled={!supported}>
              ⏹ 정지
            </button>
          </div>

          <div className="subtitle-toggles">
            <button
              className={`toggle ${showEn ? "on" : ""}`}
              onClick={() => setShowEn((v) => !v)}
            >
              영어 자막 {showEn ? "ON" : "OFF"}
            </button>
            <button
              className={`toggle ${showKo ? "on" : ""}`}
              onClick={() => setShowKo((v) => !v)}
            >
              한글 자막 {showKo ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        <div className="control-row">
          <label className="speed">
            <span>속도</span>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <span className="speed-value">{rate.toFixed(1)}x</span>
          </label>

          {voices.length > 0 && (
            <label className="voice">
              <span>성우</span>
              <select
                value={voiceName ?? ""}
                onChange={(e) =>
                  setVoiceName(e.target.value || undefined)
                }
              >
                <option value="">기본 음성</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <p className="hint">
          속도는 재생 중에 바꾸면 다음 문장부터 적용돼요. 문장을 클릭하면 그
          문장부터 다시 읽습니다.
        </p>
      </footer>
    </div>
  );
}
