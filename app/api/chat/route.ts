import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
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
  if (history.length === 0) {
    return NextResponse.json({ error: "메시지가 비어 있습니다." }, { status: 400 });
  }

  // 역할/내용 정제 후 SDK 형식으로 변환.
  const messages = history
    .filter((m) => (m.role === "user" || m.role === "assistant") && m.content?.trim())
    .map((m) => ({ role: m.role, content: m.content }));

  if (messages.length === 0 || messages[0].role !== "user") {
    return NextResponse.json({ error: "대화는 사용자 메시지로 시작해야 합니다." }, { status: 400 });
  }

  try {
    const client = getAnthropic();
    const response = await client.messages.create({
      model: getModel(),
      max_tokens: 600,
      system: buildChatSystem(topic),
      messages,
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
