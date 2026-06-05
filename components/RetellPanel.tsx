"use client";

import { useState } from "react";
import type { Feedback, Lesson } from "@/lib/types";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { AI_ENABLED } from "@/lib/config";

export default function RetellPanel({ lesson }: { lesson: Lesson }) {
  const stt = useSpeechRecognition();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // STT 결과를 텍스트에 반영 (편집 가능)
  const displayText = stt.listening ? stt.transcript : text;

  const original = lesson.segments.map((s) => s.en).join(" ");

  const toggleMic = () => {
    if (stt.listening) {
      stt.stop();
      setText(stt.transcript);
    } else {
      stt.start();
    }
  };

  const submit = async () => {
    const userText = (stt.listening ? stt.transcript : text).trim();
    if (!userText) {
      setError("먼저 들은 내용을 말하거나 입력해 주세요.");
      return;
    }
    if (stt.listening) stt.stop();
    setError(null);
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original, userText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "요청 실패");
      setFeedback(data.feedback as Feedback);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        레슨을 들은 뒤, 기억나는 내용을 영어로 말하거나 적어 보세요. 완벽하지 않아도
        괜찮아요 — AI가 격려와 함께 도와줍니다.
      </p>

      {!AI_ENABLED && (
        <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          이 무료 버전에서는 AI 피드백이 비활성화돼 있어요. 말하기·쓰기 연습은 그대로
          할 수 있습니다. (AI 피드백은 서버 배포 + API 키 필요)
        </p>
      )}

      <div className="space-y-2">
        <textarea
          value={displayText}
          onChange={(e) => setText(e.target.value)}
          readOnly={stt.listening}
          rows={4}
          placeholder="예: This lesson is about... / 이 레슨은 ~에 관한 내용이에요"
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-900"
        />
        <div className="flex items-center gap-2">
          {stt.supported && (
            <button
              onClick={toggleMic}
              className={`rounded-lg px-3 py-2 text-white ${
                stt.listening ? "animate-pulse bg-rose-600" : "bg-rose-500"
              }`}
            >
              {stt.listening ? "■ 말하기 중지" : "🎤 말하기"}
            </button>
          )}
          {AI_ENABLED && (
            <button
              onClick={submit}
              disabled={loading}
              className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "피드백 받는 중…" : "AI 피드백 받기"}
            </button>
          )}
          {(text || stt.transcript) && (
            <button
              onClick={() => {
                setText("");
                stt.reset();
                setFeedback(null);
              }}
              className="text-xs text-slate-400 underline"
            >
              지우기
            </button>
          )}
        </div>
        {!stt.supported && (
          <p className="text-xs text-slate-400">
            이 브라우저는 음성 인식을 지원하지 않아요. 텍스트로 입력해 주세요. (Chrome
            권장)
          </p>
        )}
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      {feedback && <FeedbackCard feedback={feedback} />}
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      {feedback.strengths.length > 0 && (
        <section>
          <h3 className="mb-1 font-semibold text-emerald-600">👍 잘한 점</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {feedback.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {feedback.improvements.length > 0 && (
        <section>
          <h3 className="mb-1 font-semibold text-brand-600">✏️ 이렇게 하면 더 좋아요</h3>
          <ul className="space-y-2 text-sm">
            {feedback.improvements.map((it, i) => (
              <li key={i} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <p>{it.point}</p>
                {it.example && (
                  <p className="mt-1 text-slate-500">
                    예: <span className="italic">{it.example}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {feedback.naturalAlternatives.length > 0 && (
        <section>
          <h3 className="mb-1 font-semibold text-violet-600">✨ 더 자연스러운 표현</h3>
          <ul className="space-y-1 text-sm">
            {feedback.naturalAlternatives.map((a, i) => (
              <li key={i}>
                <span className="text-slate-400 line-through">{a.instead}</span>
                {" → "}
                <span className="font-medium">{a.better}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
        💛 {feedback.encouragement}
      </p>
    </div>
  );
}
