import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechStatus = "idle" | "playing" | "paused";

interface UseSpeechOptions {
  /** 낭독할 문장들 (영어). */
  sentences: string[];
  /** 재생 속도 (0.5 ~ 1.5 등). */
  rate: number;
  /** 영어 음성 이름 (선택). */
  voiceName?: string;
}

interface UseSpeech {
  status: SpeechStatus;
  /** 지금 읽고 있는 문장의 인덱스 (-1이면 없음). */
  currentIndex: number;
  /** 사용 가능한 영어 음성 목록. */
  voices: SpeechSynthesisVoice[];
  supported: boolean;
  play: (fromIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

/**
 * Web Speech API(SpeechSynthesis)를 문장 단위로 낭독하도록 감싼 훅.
 * 한 문장이 끝나면 자동으로 다음 문장으로 넘어가며 currentIndex를 갱신한다.
 */
export function useSpeech({ sentences, rate, voiceName }: UseSpeechOptions): UseSpeech {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // 최신 값을 콜백 안에서 참조하기 위한 ref들.
  const sentencesRef = useRef(sentences);
  const rateRef = useRef(rate);
  const voiceNameRef = useRef(voiceName);
  // 정지(stop)로 인한 onend인지, 자연 종료인지 구분하기 위한 플래그.
  const stoppedRef = useRef(false);

  sentencesRef.current = sentences;
  rateRef.current = rate;
  voiceNameRef.current = voiceName;

  // 사용 가능한 영어 음성 목록 로드 (비동기로 채워질 수 있음).
  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      setVoices(all.filter((v) => v.lang.toLowerCase().startsWith("en")));
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  const speakFrom = useCallback(
    (index: number) => {
      if (!supported) return;
      const list = sentencesRef.current;
      if (index < 0 || index >= list.length) {
        setStatus("idle");
        setCurrentIndex(-1);
        return;
      }

      setCurrentIndex(index);

      const utter = new SpeechSynthesisUtterance(list[index]);
      utter.lang = "en-US";
      utter.rate = rateRef.current;

      const chosen = window.speechSynthesis
        .getVoices()
        .find((v) => v.name === voiceNameRef.current);
      if (chosen) utter.voice = chosen;

      utter.onend = () => {
        if (stoppedRef.current) return; // stop()으로 끝난 경우 진행 멈춤
        speakFrom(index + 1);
      };

      stoppedRef.current = false;
      window.speechSynthesis.speak(utter);
      setStatus("playing");
    },
    [supported]
  );

  const play = useCallback(
    (fromIndex = 0) => {
      if (!supported) return;
      stoppedRef.current = true;
      window.speechSynthesis.cancel();
      // cancel 직후 바로 speak하면 일부 브라우저에서 무시되어 약간의 지연을 둔다.
      setTimeout(() => speakFrom(fromIndex), 50);
    },
    [supported, speakFrom]
  );

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setStatus("playing");
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
    setStatus("idle");
    setCurrentIndex(-1);
  }, [supported]);

  // 언마운트 시 정리.
  useEffect(() => {
    return () => {
      if (supported) {
        stoppedRef.current = true;
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  return { status, currentIndex, voices, supported, play, pause, resume, stop };
}
