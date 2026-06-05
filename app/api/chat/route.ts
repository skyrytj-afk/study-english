import { NextResponse } from "next/server";
import { getAnthropic, getModel } from "@/lib/anthropic";
import { buildChatSystem } from "@/lib/prompts";
import type { ChatMessage } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { topic?: string; messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const topic = (body.topic ?? "daily life").toString();
  const history = Array.isArray(body.messages) ? body.messages : [];
  const messages = history
    .filter((m) => (m.role === "user" || m.role === "assistant") && m.content?.trim())
    .map((m) => ({ role: m.role, content: m.content }));

  if (messages.length === 0 || messages[0].role !== "user") {
    return NextResponse.json(
      { error: "대화는 사용자 메시지로 시작해야 합니다." },
      { status: 400 }
    );
  }

  let client;
  try {
    client = getAnthropic();
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // 토큰을 실시간으로 흘려보내는 텍스트 스트림 응답.
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const ms = client.messages.stream({
          model: getModel(),
          max_tokens: 600,
          system: buildChatSystem(topic),
          messages,
        });
        ms.on("text", (delta: string) => {
          controller.enqueue(encoder.encode(delta));
        });
        await ms.finalMessage();
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "스트리밍 오류";
        controller.enqueue(encoder.encode(`\n[오류] ${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
