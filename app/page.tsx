"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Lesson } from "@/lib/types";
import { sampleLessons } from "@/lib/lessons";
import {
  computeStreak,
  loadCustomLessons,
  loadProgress,
  recordStudy,
  saveCustomLessons,
  type Progress,
} from "@/lib/storage";
import ProgressHeader from "@/components/ProgressHeader";
import LessonUpload from "@/components/LessonUpload";
import LearnView from "@/components/LearnView";

const emptyProgress: Progress = { studyDays: [], totalSeconds: 0, lastStudyDate: null };

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [customLessons, setCustomLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [dark, setDark] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(sampleLessons[0].id);

  // 초기 로드 (localStorage)
  useEffect(() => {
    setCustomLessons(loadCustomLessons());
    setProgress(loadProgress());
    const savedDark = window.localStorage.getItem("se.dark") === "1";
    setDark(savedDark);
    setMounted(true);
  }, []);

  // 다크 모드 반영
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("se.dark", dark ? "1" : "0");
  }, [dark, mounted]);

  const lessons = useMemo(
    () => [...sampleLessons, ...customLessons],
    [customLessons]
  );
  const selected = lessons.find((l) => l.id === selectedId) ?? lessons[0];

  const onStudy = useCallback((seconds: number) => {
    setProgress(recordStudy(seconds));
  }, []);

  const addLesson = useCallback((lesson: Lesson) => {
    setCustomLessons((prev) => {
      const next = [...prev, lesson];
      saveCustomLessons(next);
      return next;
    });
    setSelectedId(lesson.id);
  }, []);

  const streak = computeStreak(progress);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-5 px-4 py-5">
      <header className="space-y-3">
        <h1 className="text-xl font-bold">🎧 영어 듣기·말하기 연습</h1>
        <ProgressHeader
          streak={streak}
          totalSeconds={progress.totalSeconds}
          dark={dark}
          setDark={setDark}
        />
      </header>

      {/* 레슨 선택 */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-500">레슨</h2>
          <LessonUpload onAdd={addLesson} />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {lessons.map((l) => {
            const active = l.id === selected.id;
            return (
              <button
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={`min-w-[160px] shrink-0 rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/30"
                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <p className="text-sm font-semibold leading-snug">{l.title}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {l.level} · {l.topic}
                  {l.audioUrl ? " · 오디오" : " · 음성합성"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 학습 화면 */}
      <section className="flex-1">
        <LearnView key={selected.id} lesson={selected} onStudy={onStudy} />
      </section>

      <footer className="pt-2 text-center text-xs text-slate-400">
        진행 데이터는 이 브라우저에만 저장됩니다 · 점수보다 꾸준함이 중요해요 💪
      </footer>
    </main>
  );
}
