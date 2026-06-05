import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropic, getModel } from "@/lib/anthropic";

export const runtime = "nodejs";

function extractJson(text: string): any {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("형식 오류");
  return JSON.parse(text.slice(start, end + 1));
}

export async function POST(req: Request) {
  let body: { word?: string; sentence?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const word = (body.word ?? "").trim();
  const sentence = (body.sentence ?? "").trim();
  if (!word) {
    return NextResponse.json({ error: "단어가 비어 있습니다." }, { status: 400 });
  }

  try {
    const client = getAnthropic();
    const response = await client.messages.create({
      model: getModel(),
      max_tokens: 400,
      system:
        "당신은 한국인 영어 학습자를 돕는 사전입니다. 주어진 영어 단어를 문맥에 맞게 설명합니다. " +
        '반드시 아래 JSON으로만 응답하세요. 다른 텍스트는 금지합니다. ' +
        '{ "meaning": "이 문맥에서의 한국어 뜻(간단히)", "example": "그 단어를 쓴 쉬운 영어 예문 한 개" }',
      messages: [
        {
          role: "user",
          content: `단어: "${word}"\n문맥 문장: "${sentence}"\n이 문맥에서 단어의 뜻과 쉬운 예문을 JSON으로 주세요.`,
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const raw = extractJson(text);
    return NextResponse.json({
      meaning: String(raw.meaning ?? "").trim() || "뜻을 찾지 못했어요.",
      example: String(raw.example ?? "").trim(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
