"use client";

import { useEffect, useRef } from "react";

/** 녹음 blob을 디코드해 간단한 파형을 그린다. 실패 시 아무것도 표시하지 않는다. */
export default function Waveform({ blob, color }: { blob: Blob | null; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!blob) return;
    let cancelled = false;

    (async () => {
      try {
        const arrayBuf = await blob.arrayBuffer();
        const Ctx =
          (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const cw = (canvas.width = canvas.offsetWidth * 2);
        const ch = (canvas.height = canvas.offsetHeight * 2);
        const g = canvas.getContext("2d");
        if (!g) return;

        const data = audioBuf.getChannelData(0);
        const bars = 64;
        const step = Math.floor(data.length / bars) || 1;
        g.clearRect(0, 0, cw, ch);
        g.fillStyle = color;
        const barW = cw / bars;
        for (let i = 0; i < bars; i++) {
          let peak = 0;
          for (let j = 0; j < step; j++) {
            const v = Math.abs(data[i * step + j] || 0);
            if (v > peak) peak = v;
          }
          const h = Math.max(2, peak * ch * 0.9);
          g.fillRect(i * barW + barW * 0.2, (ch - h) / 2, barW * 0.6, h);
        }
        ctx.close();
      } catch {
        // 디코드 실패는 조용히 무시 (파형은 보조 기능)
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [blob, color]);

  if (!blob) return null;
  return <canvas ref={canvasRef} className="h-10 w-full" />;
}
