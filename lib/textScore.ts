/** 발음/정확도 채점 유틸 — 음성 인식 결과를 목표 문장과 비교한다. */

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export interface PronunciationScore {
  /** 0~100 정확도. */
  score: number;
  /** 목표 단어 중 인식되지 않은(놓친) 단어들. */
  missed: string[];
  /** 목표 단어 수. */
  total: number;
  /** 맞은 단어 수. */
  matched: number;
}

/**
 * 목표 문장(target)과 사용자가 말한 내용(spoken)을 비교해 단어 단위 정확도를 낸다.
 * 순서를 고려한 그리디 매칭: spoken에서 목표 단어를 순서대로 찾는다.
 */
export function scorePronunciation(target: string, spoken: string): PronunciationScore {
  const targetWords = tokenize(target);
  const spokenWords = tokenize(spoken);

  const missed: string[] = [];
  let matched = 0;
  let cursor = 0;

  for (const word of targetWords) {
    const idx = spokenWords.indexOf(word, cursor);
    if (idx !== -1) {
      matched += 1;
      cursor = idx + 1;
    } else if (spokenWords.includes(word)) {
      // 순서는 어긋났지만 어딘가 말하긴 함 — 부분 인정
      matched += 1;
    } else {
      missed.push(word);
    }
  }

  const total = targetWords.length || 1;
  const score = Math.round((matched / total) * 100);
  return { score, missed, total, matched };
}

/** 점수에 따른 격려 라벨 (점수 자체보다 격려가 목적). */
export function scoreLabel(score: number): string {
  if (score >= 90) return "훌륭해요! 거의 완벽해요 🎉";
  if (score >= 70) return "좋아요! 잘 따라 했어요 👍";
  if (score >= 50) return "괜찮아요. 조금만 더 또박또박! 💪";
  return "시도한 것 자체가 멋져요. 다시 한 번 해볼까요? 🌱";
}
