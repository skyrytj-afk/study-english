"use client";

import { useEffect, useRef, useState } from "react";
import type { Lesson } from "@/lib/types";
import { useLessonPlayer } from "@/lib/useLessonPlayer";
import ListeningPanel from "./ListeningPanel";
import ShadowingPanel from "./ShadowingPanel";
import RetellPanel from "./RetellPanel";
import ChatPanel from "./ChatPanel";

type Tab = "listen" | "shadow" | "retell" | "chat";

const TABS: { id: Tab; label: string }[] = [
  { id: "listen", label: "듣기" },
  { id: "shadow", label: "섀도잉" },
  { id: "retell", label: "재말하기" },
  { id: "chat", label: "대화" },
];

export default function LearnView({
  lesson,
  onStudy,
}: {
  lesson: Lesson;
  onStudy: (seconds: number) => void;
}) {
  const [tab, setTab] = useState<Tab>("listen");
  const [rate, setRate] = useState(1);
  const [voiceName, setVoiceName] = useState<string | undefined>(undefined);
  const [showEn, setShowEn] = useState(true);
  const [showKo, setShowKo] = useState(true);

  const player = useLessonPlayer(lesson, { rate, voiceName });

  // 레슨이 바뀌면 재생 정지하고 듣기 탭으로
  useEffect(() => {
    player.stop();
    setTab("listen");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  // 학습 시간 누적 (재생 중일 때 10초 단위로 기록)
  const accRef = useRef(0);
  const playing = player.status === "playing";
  useEffect(() => {
    const id = setInterval(() => {
      if (playing) {
        accRef.current += 1;
        if (accRef.current >= 10) {
          onStudy(accRef.current);
          accRef.current = 0;
        }
      }
    }, 1000);
    return () => {
      if (accRef.current > 0) {
        onStudy(accRef.current);
        accRef.current = 0;
      }
      clearInterval(id);
    };
  }, [playing, onStudy]);

  return (
    <div className="space-y-4">
      {/* 탭 */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-white text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-300"
                : "text-slate-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "listen" && (
        <ListeningPanel
          lesson={lesson}
          player={player}
          rate={rate}
          setRate={setRate}
          showEn={showEn}
          setShowEn={setShowEn}
          showKo={showKo}
          setShowKo={setShowKo}
          voiceName={voiceName}
          setVoiceName={setVoiceName}
        />
      )}
      {tab === "shadow" && <ShadowingPanel lesson={lesson} player={player} />}
      {tab === "retell" && <RetellPanel lesson={lesson} />}
      {tab === "chat" && <ChatPanel topic={lesson.topic} />}
    </div>
  );
}
