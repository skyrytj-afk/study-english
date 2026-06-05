"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/types";
import type { useLessonPlayer } from "@/lib/useLessonPlayer";
import { useRecorder } from "@/lib/useRecorder";
import Waveform from "./Waveform";

type Player = ReturnType<typeof useLessonPlayer>;

export default function ShadowingPanel({
  lesson,
  player,
}: {
  lesson: Lesson;
  player: Player;
}) {
  const [index, setIndex] = useState(0);
  const recorder = useRecorder();
  const seg = lesson.segments[index];

  // 문장을 바꾸면 이전 녹음은 초기화
  useEffect(() => {
    recorder.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const go = (delta: number) => {
    const next = Math.min(lesson.segments.length - 1, Math.max(0, index + delta));
    setIndex(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        한 문장씩 따라 말하기. 원음을 듣고, 녹음한 뒤 나란히 비교해 보세요.
      </p>

      {/* 문장 네비게이션 */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40 dark:border-slate-600"
        >
          ← 이전
        </button>
        <span className="text-sm text-slate-500">
          {index + 1} / {lesson.segments.length}
        </span>
        <button
          onClick={() => go(1)}
          disabled={index === lesson.segments.length - 1}
          className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40 dark:border-slate-600"
        >
          다음 →
        </button>
      </div>

      {/* 현재 문장 */}
      <div className="rounded-2xl border border-brand-300 bg-brand-50 p-4 dark:border-brand-600 dark:bg-brand-900/30">
        <p className="text-lg leading-relaxed">{seg.en}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{seg.ko}</p>
      </div>

      {/* 원음 / 녹음 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-sm font-semibold">원음</p>
          <button
            onClick={() => player.playOnce(index)}
            className="w-full rounded-lg bg-brand-600 px-3 py-2 text-white"
          >
            🔊 원음 듣기
          </button>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-sm font-semibold">내 녹음</p>
          {!recorder.recording ? (
            <button
              onClick={recorder.start}
              className="w-full rounded-lg bg-rose-500 px-3 py-2 text-white"
            >
              ● 녹음 시작
            </button>
          ) : (
            <button
              onClick={recorder.stop}
              className="w-full animate-pulse rounded-lg bg-rose-600 px-3 py-2 text-white"
            >
              ■ 녹음 중지
            </button>
          )}
        </div>
      </div>

      {recorder.error && (
        <p className="text-sm text-rose-500">{recorder.error}</p>
      )}

      {/* 비교 */}
      {recorder.blobUrl && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold">나란히 비교</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => player.playOnce(index)}
              className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600"
            >
              🔊 원음
            </button>
            <span className="text-slate-400">vs</span>
            <audio src={recorder.blobUrl} controls className="h-10 flex-1" />
          </div>
          <Waveform blob={recorder.blob} color="#3479f6" />
          <button
            onClick={recorder.reset}
            className="text-xs text-slate-400 underline"
          >
            다시 녹음
          </button>
        </div>
      )}
    </div>
  );
}
