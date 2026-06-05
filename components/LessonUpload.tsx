"use client";

import { useState } from "react";
import type { Lesson, Level, Segment, Topic } from "@/lib/types";

const SAMPLE = `[
  { "start": 0, "end": 4, "en": "Hello and welcome.", "ko": "안녕하세요, 환영합니다." },
  { "start": 4, "end": 9, "en": "Today we talk about coffee.", "ko": "오늘은 커피에 대해 이야기해요." }
]`;

export default function LessonUpload({ onAdd }: { onAdd: (lesson: Lesson) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<Level>("A2");
  const [topic, setTopic] = useState<Topic>("daily");
  const [file, setFile] = useState<File | null>(null);
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    if (!title.trim()) {
      setError("제목을 입력하세요.");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      setError("자막 JSON 형식이 올바르지 않습니다.");
      return;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      setError("자막 JSON은 비어 있지 않은 배열이어야 합니다.");
      return;
    }
    const segments: Segment[] = [];
    for (let i = 0; i < parsed.length; i++) {
      const s = parsed[i] as any;
      if (typeof s?.en !== "string") {
        setError(`${i + 1}번째 항목에 영어 자막(en)이 없습니다.`);
        return;
      }
      segments.push({
        id: `u${i}`,
        start: Number(s.start) || 0,
        end: Number(s.end) || 0,
        en: String(s.en),
        ko: String(s.ko ?? ""),
      });
    }

    const audioUrl = file ? URL.createObjectURL(file) : null;
    const lesson: Lesson = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      level,
      topic,
      audioUrl,
      segments,
    };
    onAdd(lesson);
    // 초기화
    setTitle("");
    setFile(null);
    setJson("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 dark:border-slate-600"
      >
        ＋ 내 레슨 추가
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">내 레슨 추가</h3>
        <button onClick={() => setOpen(false)} className="text-sm text-slate-400">
          닫기
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-600"
      />

      <div className="flex gap-2">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as Level)}
          className="rounded-lg border border-slate-300 bg-transparent px-2 py-2 dark:border-slate-600"
        >
          <option value="A2">A2</option>
          <option value="B1">B1</option>
        </select>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value as Topic)}
          className="rounded-lg border border-slate-300 bg-transparent px-2 py-2 dark:border-slate-600"
        >
          <option value="daily">daily</option>
          <option value="investing">investing</option>
          <option value="tech">tech</option>
          <option value="fitness">fitness</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-slate-500">오디오 파일 (선택 — 없으면 음성 합성)</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-slate-500">자막 JSON (start/end/en/ko 배열)</label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={6}
          placeholder={SAMPLE}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-transparent p-2 font-mono text-xs dark:border-slate-600"
        />
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <button
        onClick={submit}
        className="w-full rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white"
      >
        추가하기
      </button>
    </div>
  );
}
