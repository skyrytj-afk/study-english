"use client";

export interface WordMeaning {
  meaning: string;
  example: string;
}

const CACHE_KEY = "se.wordCache.v1";
const memory = new Map<string, WordMeaning>();
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (raw) {
      const obj = JSON.parse(raw) as Record<string, WordMeaning>;
      for (const [k, v] of Object.entries(obj)) memory.set(k, v);
    }
  } catch {
    /* ignore */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  const obj: Record<string, WordMeaning> = {};
  memory.forEach((v, k) => (obj[k] = v));
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
}

/** 영어 단어 정규화 (캐시 키). */
export function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9']/g, "");
}

/** 단어 뜻 조회 (localStorage 캐시 → 없으면 API). */
export async function lookupWord(word: string, sentence: string): Promise<WordMeaning> {
  load();
  const key = normalizeWord(word);
  const cached = memory.get(key);
  if (cached) return cached;

  const res = await fetch("/api/word", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word: key, sentence }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "조회 실패");

  const result: WordMeaning = { meaning: data.meaning, example: data.example };
  memory.set(key, result);
  persist();
  return result;
}
