import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropic, getModel } from "@/lib/anthropic";
import { FEEDBACK_SYSTEM, buildFeedbackUserPrompt } from "@/lib/prompts";
import type { Feedback } from "@/lib/types";

export const runtime = "nodejs";

/** 응답 텍스트에서 첫 번째 JSON 객체를 안전하게 추출한다. */
function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("JSON을 찾을 수 없습니다.");
  }
  return JSON.parse(text.slice(start, end + 1));
}

function normalize(raw: any): Feedback {
  return {
    strengths: Array.isArray(raw?.strengths) ? raw.strengths.map(String) : [],
    improvements: Array.isArray(raw?.improvements)
      ? raw.improvements
          .filter((x: any) => x && (x.point || x.example))
          .map((x: any) => ({ point: String(x.point ?? ""), example: String(x.example ?? "") }))
      : [],
    naturalAlternatives: Array.isArray(raw?.naturalAlternatives)
      ? raw.naturalAlternatives
          .filter((x: any) => x && (x.instead || x.better))
          .map((x: any) => ({ instead: String(x.instead ?? ""), better: String(x.better ?? "") }))
      : [],
    encouragement: String(raw?.encouragement ?? "잘하고 있어요! 계속 도전해 봐요."),
  };
}

export async function POST(req: Request) {
  let body: { original?: string; userText?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const original = (body.original ?? "").trim();
  const userText = (body.userText ?? "").trim();
  if (!userText) {
    return NextResponse.json({ error: "발화 내용이 비어 있습니다." }, { status: 400 });
  }

  try {
    const client = getAnthropic();
    const response = await client.messages.create({
      model: getModel(),
      max_tokens: 2048,
      system: FEEDBACK_SYSTEM,
      messages: [{ role: "user", content: buildFeedbackUserPrompt(original, userText) }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const feedback = normalize(extractJson(text));
    return NextResponse.json({ feedback });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
