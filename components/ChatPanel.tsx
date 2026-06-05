"use client";

import { useState } from "react";
import type { ChatMessage, Topic } from "@/lib/types";

const TOPIC_LABEL: Record<Topic, string> = {
  daily: "daily life",
  investing: "investing and money",
  tech: "technology",
  fitness: "fitness and health",
};

export default function ChatPanel({ topic }: { topic: Topic }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    const content = input.trim();
    if (!content || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: TOPIC_LABEL[topic], messages: next }),
      });

      // 에러는 JSON, 성공은 텍스트 스트림
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "요청 실패");
      }
      if (!res.body) throw new Error("응답 본문이 없습니다.");

      // 빈 assistant 메시지를 추가하고 토큰을 이어붙인다.
      setMessages([...next, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        주제(<span className="font-medium">{TOPIC_LABEL[topic]}</span>)로 AI와 가볍게
        영어 대화를 나눠 보세요. 짧고 쉬운 문장으로 대답해도 괜찮아요.
      </p>

      <div className="min-h-[120px] space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400">
            아래에 영어로 한마디 적어 보세요. 예: “Hi! Can we talk about my day?”
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-brand-600 text-white"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <p className="text-sm text-slate-400">…</p>}
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="영어로 입력…"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-900"
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          보내기
        </button>
      </div>
    </div>
  );
}
