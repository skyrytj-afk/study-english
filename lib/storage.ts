"use client";

import type { Lesson } from "./types";

const PROGRESS_KEY = "se.progress.v1";
const CUSTOM_LESSONS_KEY = "se.customLessons.v1";

export interface Progress {
  /** 학습한 날짜들 (YYYY-MM-DD). */
  studyDays: string[];
  /** 누적 학습 시간(초). */
  totalSeconds: number;
  /** 마지막 학습 날짜. */
  lastStudyDate: string | null;
}

const emptyProgress: Progress = {
  studyDays: [],
  totalSeconds: 0,
  lastStudyDate: null,
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return emptyProgress;
    return { ...emptyProgress, ...(JSON.parse(raw) as Progress) };
  } catch {
    return emptyProgress;
  }
}

function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

/** 오늘을 학습일로 기록하고, 학습 시간을 누적한다. */
export function recordStudy(seconds: number): Progress {
  const p = loadProgress();
  const today = todayStr();
  if (!p.studyDays.includes(today)) p.studyDays.push(today);
  p.totalSeconds += Math.max(0, Math.round(seconds));
  p.lastStudyDate = today;
  saveProgress(p);
  return p;
}

/** 연속 학습일(streak) 계산: 오늘 또는 어제부터 거꾸로 이어진 날 수. */
export function computeStreak(p: Progress): number {
  if (p.studyDays.length === 0) return 0;
  const set = new Set(p.studyDays);
  const cursor = new Date();
  // 오늘 학습 안 했으면 어제부터 센다.
  if (!set.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function loadCustomLessons(): Lesson[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_LESSONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Lesson[];
  } catch {
    return [];
  }
}

export function saveCustomLessons(lessons: Lesson[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(lessons));
}
