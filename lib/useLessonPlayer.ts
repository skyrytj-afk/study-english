"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lesson } from "./types";

export type PlayerStatus = "idle" | "playing" | "paused";
export type RepeatMode = "none" | "sentence" | "ab";

interface Options {
  rate: number;
  voiceName?: string;
}

interface PlayIntent {
  index: number;
  /** continuous: 끝까지 이어 재생 / once: 해당 문장만 한 번. */
  mode: "continuous" | "once";
}

/**
 * 레슨을 실제 오디오(타임코드 싱크) 또는 브라우저 내장 음성(TTS)으로 재생한다.
 * 두 모드 모두 현재 문장 인덱스, 문장 반복, A-B 반복을 지원한다.
 */
export function useLessonPlayer(lesson: Lesson, opts: Options) {
  const isTts = !lesson.audioUrl;
  const ttsSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [abStart, setAbStart] = useState<number | null>(null);
  const [abEnd, setAbEnd] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intentRef = useRef<PlayIntent | null>(null);
  const stoppedRef = useRef(false);

  // 최신 옵션/상태를 콜백에서 참조하기 위한 ref.
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const repeatRef = useRef(repeatMode);
  repeatRef.current = repeatMode;
  const abRef = useRef({ start: abStart, end: abEnd });
  abRef.current = { start: abStart, end: abEnd };

  const segments = lesson.segments;

  // --- 영어 음성 목록 (TTS 모드) ---
  useEffect(() => {
    if (!isTts || !ttsSupported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      setVoices(all.filter((v) => v.lang.toLowerCase().startsWith("en")));
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isTts, ttsSupported]);

  // --- 오디오 엘리먼트 준비 (오디오 모드) ---
  useEffect(() => {
    if (isTts || !lesson.audioUrl) return;
    const audio = new Audio(lesson.audioUrl);
    audio.preload = "auto";
    audioRef.current = audio;

    const onTime = () => {
      const t = audio.currentTime;
      const ab = abRef.current;
      const intent = intentRef.current;

      // A-B 반복
      if (
        repeatRef.current === "ab" &&
        ab.start != null &&
        ab.end != null &&
        t >= segments[ab.end].end
      ) {
        audio.currentTime = segments[ab.start].start;
        return;
      }
      // 문장 반복
      if (repeatRef.current === "sentence" && intent) {
        const seg = segments[intent.index];
        if (seg && t >= seg.end) {
          audio.currentTime = seg.start;
          return;
        }
      }
      // once 모드: 해당 문장 끝나면 정지
      if (intent?.mode === "once") {
        const seg = segments[intent.index];
        if (seg && t >= seg.end) {
          audio.pause();
          setStatus("paused");
          return;
        }
      }
      // 현재 문장 인덱스 갱신
      const idx = segments.findIndex((s) => t >= s.start && t < s.end);
      if (idx !== -1) setCurrentIndex(idx);
    };
    const onEnded = () => {
      setStatus("idle");
      setCurrentIndex(-1);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTts, lesson.audioUrl]);

  // 레슨 바뀌면 초기화
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      if (ttsSupported) window.speechSynthesis.cancel();
    };
  }, [ttsSupported]);

  // --- TTS 재생 엔진 ---
  const speakFrom = useCallback(
    (index: number, mode: "continuous" | "once") => {
      if (!ttsSupported) return;
      if (index < 0 || index >= segments.length) {
        setStatus("idle");
        setCurrentIndex(-1);
        return;
      }
      intentRef.current = { index, mode };
      setCurrentIndex(index);

      const utter = new SpeechSynthesisUtterance(segments[index].en);
      utter.lang = "en-US";
      utter.rate = optsRef.current.rate;
      const chosen = window.speechSynthesis
        .getVoices()
        .find((v) => v.name === optsRef.current.voiceName);
      if (chosen) utter.voice = chosen;

      utter.onend = () => {
        if (stoppedRef.current) return;
        if (mode === "once") {
          if (repeatRef.current === "sentence") {
            speakFrom(index, "once");
          } else {
            setStatus("paused");
          }
          return;
        }
        // continuous
        if (repeatRef.current === "sentence") {
          speakFrom(index, "continuous");
          return;
        }
        const ab = abRef.current;
        if (repeatRef.current === "ab" && ab.start != null && ab.end != null) {
          const next = index >= ab.end ? ab.start : index + 1;
          speakFrom(next, "continuous");
          return;
        }
        speakFrom(index + 1, "continuous");
      };

      stoppedRef.current = false;
      window.speechSynthesis.speak(utter);
      setStatus("playing");
    },
    [ttsSupported, segments]
  );

  // --- 공통 컨트롤 ---
  const play = useCallback(
    (from = 0) => {
      if (isTts) {
        stoppedRef.current = true;
        window.speechSynthesis.cancel();
        setTimeout(() => speakFrom(from, "continuous"), 50);
      } else {
        const audio = audioRef.current;
        if (!audio) return;
        intentRef.current = { index: from, mode: "continuous" };
        audio.currentTime = segments[from]?.start ?? 0;
        audio.playbackRate = optsRef.current.rate;
        void audio.play();
        setStatus("playing");
      }
    },
    [isTts, speakFrom, segments]
  );

  const playOnce = useCallback(
    (index: number) => {
      if (isTts) {
        stoppedRef.current = true;
        window.speechSynthesis.cancel();
        setTimeout(() => speakFrom(index, "once"), 50);
      } else {
        const audio = audioRef.current;
        if (!audio) return;
        intentRef.current = { index, mode: "once" };
        setCurrentIndex(index);
        audio.currentTime = segments[index]?.start ?? 0;
        audio.playbackRate = optsRef.current.rate;
        void audio.play();
        setStatus("playing");
      }
    },
    [isTts, speakFrom, segments]
  );

  const pause = useCallback(() => {
    if (isTts) {
      window.speechSynthesis.pause();
    } else {
      audioRef.current?.pause();
    }
    setStatus("paused");
  }, [isTts]);

  const resume = useCallback(() => {
    if (isTts) {
      window.speechSynthesis.resume();
    } else {
      const audio = audioRef.current;
      if (audio) {
        audio.playbackRate = optsRef.current.rate;
        void audio.play();
      }
    }
    setStatus("playing");
  }, [isTts]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    intentRef.current = null;
    if (isTts) {
      window.speechSynthesis.cancel();
    } else {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
    setStatus("idle");
    setCurrentIndex(-1);
  }, [isTts]);

  // 오디오 모드에서 재생 속도 즉시 반영
  useEffect(() => {
    if (!isTts && audioRef.current) {
      audioRef.current.playbackRate = opts.rate;
    }
  }, [isTts, opts.rate]);

  const clearAb = useCallback(() => {
    setAbStart(null);
    setAbEnd(null);
    if (repeatMode === "ab") setRepeatMode("none");
  }, [repeatMode]);

  return {
    isTts,
    ttsSupported,
    status,
    currentIndex,
    voices,
    repeatMode,
    setRepeatMode,
    abStart,
    abEnd,
    setAbStart,
    setAbEnd,
    clearAb,
    play,
    playOnce,
    pause,
    resume,
    stop,
  };
}
