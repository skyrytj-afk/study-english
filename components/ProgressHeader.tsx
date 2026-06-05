"use client";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}분`;
  const h = Math.floor(m / 60);
  return `${h}시간 ${m % 60}분`;
}

export default function ProgressHeader({
  streak,
  totalSeconds,
  dark,
  setDark,
}: {
  streak: number;
  totalSeconds: number;
  dark: boolean;
  setDark: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
        🔥 {streak}일 연속
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        ⏱ {formatTime(totalSeconds)}
      </div>
      <button
        onClick={() => setDark(!dark)}
        aria-label="다크 모드 전환"
        className="ml-auto rounded-full border border-slate-300 px-2.5 py-1.5 text-sm dark:border-slate-600"
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
