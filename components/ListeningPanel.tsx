"use client";

import type { Lesson } from "@/lib/types";
import type { useLessonPlayer } from "@/lib/useLessonPlayer";

type Player = ReturnType<typeof useLessonPlayer>;

interface Props {
  lesson: Lesson;
  player: Player;
  rate: number;
  setRate: (r: number) => void;
  showEn: boolean;
  setShowEn: (v: boolean) => void;
  showKo: boolean;
  setShowKo: (v: boolean) => void;
  voiceName?: string;
  setVoiceName: (v: string | undefined) => void;
}

const SPEEDS = [0.75, 0.85, 1.0];

export default function ListeningPanel({
  lesson,
  player,
  rate,
  setRate,
  showEn,
  setShowEn,
  showKo,
  setShowKo,
  voiceName,
  setVoiceName,
}: Props) {
  const { currentIndex, status, repeatMode, abStart, abEnd } = player;

  return (
    <div className="space-y-4">
      {/* 권장 흐름 안내 */}
      <div className="rounded-xl bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
        <span className="font-semibold">권장 흐름</span> · ① 자막 끄고 듣기 → ② 영어
        자막으로 확인 → ③ 한국어로 의미 확인
      </div>

      {player.isTts && (
        <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          이 레슨은 오디오 파일이 없어 브라우저 내장 음성으로 읽어줍니다. (Chrome·Edge·Safari 권장)
        </p>
      )}

      {/* 자막 토글 */}
      <div className="flex gap-2">
        <Toggle on={showEn} onClick={() => setShowEn(!showEn)} label={`영어 자막 ${showEn ? "ON" : "OFF"}`} />
        <Toggle on={showKo} onClick={() => setShowKo(!showKo)} label={`한국어 자막 ${showKo ? "ON" : "OFF"}`} />
      </div>

      {/* 문장 리스트 */}
      <div className="space-y-2">
        {lesson.segments.map((seg, i) => {
          const active = i === currentIndex;
          const inAb =
            abStart != null && abEnd != null && i >= abStart && i <= abEnd;
          return (
            <button
              key={seg.id}
              onClick={() => player.play(i)}
              className={`block w-full rounded-xl border p-3 text-left transition ${
                active
                  ? "border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/30"
                  : "border-slate-200 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900"
              } ${inAb ? "ring-1 ring-brand-300" : ""}`}
            >
              {showEn && <p className="text-base leading-relaxed">{seg.en}</p>}
              {showKo && (
                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {seg.ko}
                </p>
              )}
              {!showEn && !showKo && (
                <p className="text-center text-sm italic text-slate-400">
                  · · · 자막 꺼짐 — 소리에 집중하세요 · · ·
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* 컨트롤 바 */}
      <div className="sticky bottom-3 space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <div className="flex items-center gap-2">
          {status !== "playing" ? (
            <button
              onClick={() => (status === "paused" ? player.resume() : player.play(0))}
              className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white"
            >
              {status === "paused" ? "▶︎ 계속" : "▶︎ 재생"}
            </button>
          ) : (
            <button
              onClick={player.pause}
              className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600"
            >
              ⏸ 일시정지
            </button>
          )}
          <button
            onClick={player.stop}
            className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600"
          >
            ⏹ 정지
          </button>
          <div className="ml-auto flex gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setRate(s)}
                className={`rounded-lg px-2.5 py-1.5 text-sm ${
                  Math.abs(rate - s) < 0.001
                    ? "bg-brand-600 text-white"
                    : "border border-slate-300 dark:border-slate-600"
                }`}
              >
                {s.toFixed(2)}x
              </button>
            ))}
          </div>
        </div>

        {/* 반복 */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500">반복:</span>
          <button
            onClick={() => player.setRepeatMode(repeatMode === "sentence" ? "none" : "sentence")}
            className={`rounded-lg px-2.5 py-1.5 ${
              repeatMode === "sentence"
                ? "bg-brand-600 text-white"
                : "border border-slate-300 dark:border-slate-600"
            }`}
          >
            🔁 현재 문장
          </button>
          <button
            onClick={() => player.setAbStart(currentIndex >= 0 ? currentIndex : 0)}
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 dark:border-slate-600"
          >
            A 지정{abStart != null ? ` (${abStart + 1})` : ""}
          </button>
          <button
            onClick={() => player.setAbEnd(currentIndex >= 0 ? currentIndex : lesson.segments.length - 1)}
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 dark:border-slate-600"
          >
            B 지정{abEnd != null ? ` (${abEnd + 1})` : ""}
          </button>
          <button
            onClick={() => player.setRepeatMode(repeatMode === "ab" ? "none" : "ab")}
            disabled={abStart == null || abEnd == null}
            className={`rounded-lg px-2.5 py-1.5 disabled:opacity-40 ${
              repeatMode === "ab"
                ? "bg-brand-600 text-white"
                : "border border-slate-300 dark:border-slate-600"
            }`}
          >
            A-B 반복
          </button>
          {(abStart != null || abEnd != null) && (
            <button onClick={player.clearAb} className="text-xs text-slate-400 underline">
              해제
            </button>
          )}
        </div>

        {/* 음성 선택 (TTS 모드) */}
        {player.isTts && player.voices.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">성우</span>
            <select
              value={voiceName ?? ""}
              onChange={(e) => setVoiceName(e.target.value || undefined)}
              className="max-w-[220px] rounded-lg border border-slate-300 bg-transparent px-2 py-1 dark:border-slate-600"
            >
              <option value="">기본 음성</option>
              {player.voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        on
          ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300"
          : "border border-slate-300 text-slate-500 dark:border-slate-600"
      }`}
    >
      {label}
    </button>
  );
}
