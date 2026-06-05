export interface Sentence {
  en: string;
  ko: string;
}

export interface Story {
  id: string;
  title: string;
  level: "초급" | "중급" | "고급";
  sentences: Sentence[];
}

/**
 * 학습용 오리지널 텍스트입니다.
 * 마법사 소년 이야기의 "평범한 거리에서 시작되는 도입부" 분위기를
 * 저작권 있는 원문을 쓰지 않고 쉬운 영어로 새로 작성했습니다.
 */
export const stories: Story[] = [
  {
    id: "ordinary-street",
    title: "The Ordinary Street (평범한 거리)",
    level: "초급",
    sentences: [
      {
        en: "On a quiet street, there was a small grey house with a green door.",
        ko: "조용한 거리에, 초록색 문이 달린 작은 회색 집이 있었어요.",
      },
      {
        en: "The family who lived there was very normal, and they liked it that way.",
        ko: "그곳에 사는 가족은 아주 평범했고, 그들은 그런 점을 좋아했어요.",
      },
      {
        en: "The father went to work every morning at exactly eight o'clock.",
        ko: "아버지는 매일 아침 정확히 8시에 일하러 갔어요.",
      },
      {
        en: "The mother watered her flowers and watched the neighbors through the window.",
        ko: "어머니는 꽃에 물을 주고 창문으로 이웃들을 지켜봤어요.",
      },
      {
        en: "They did not like strange things, and they did not like surprises.",
        ko: "그들은 이상한 일을 좋아하지 않았고, 놀라운 일도 좋아하지 않았어요.",
      },
      {
        en: "But on this particular morning, something very strange was about to happen.",
        ko: "하지만 바로 이날 아침, 아주 이상한 일이 막 일어나려 하고 있었어요.",
      },
      {
        en: "A large grey cat was sitting on the garden wall, as still as a stone.",
        ko: "커다란 회색 고양이가 정원 담장 위에 돌처럼 가만히 앉아 있었어요.",
      },
      {
        en: "It had been there since dawn, and it seemed to be reading the street sign.",
        ko: "그 고양이는 새벽부터 거기 있었고, 거리 표지판을 읽고 있는 것처럼 보였어요.",
      },
      {
        en: "The father noticed the cat, but he told himself that cats cannot read.",
        ko: "아버지는 그 고양이를 알아챘지만, 고양이는 글을 읽을 수 없다고 스스로에게 말했어요.",
      },
      {
        en: "Later that day, he saw people in long, colorful cloaks whispering in the city.",
        ko: "그날 늦게, 그는 길고 화려한 망토를 입은 사람들이 도시에서 속삭이는 것을 보았어요.",
      },
      {
        en: "They looked excited, and they kept saying a young boy's name.",
        ko: "그들은 들떠 보였고, 어떤 어린 소년의 이름을 계속 말하고 있었어요.",
      },
      {
        en: "The father hurried home, hoping that his quiet life would stay the same.",
        ko: "아버지는 자신의 조용한 삶이 그대로이기를 바라며 서둘러 집으로 갔어요.",
      },
      {
        en: "But far away, important people had already made a plan for that very night.",
        ko: "하지만 멀리서, 중요한 사람들은 바로 그날 밤을 위한 계획을 이미 세워 두었어요.",
      },
      {
        en: "A new story was beginning, and the ordinary street would never be ordinary again.",
        ko: "새로운 이야기가 시작되고 있었고, 그 평범한 거리는 다시는 평범하지 않게 될 것이었어요.",
      },
    ],
  },
  {
    id: "my-morning",
    title: "My Morning (나의 아침)",
    level: "초급",
    sentences: [
      {
        en: "I wake up early when the sun comes through my window.",
        ko: "해가 창문으로 들어올 때 나는 일찍 일어나요.",
      },
      {
        en: "First, I drink a glass of water and stretch my arms.",
        ko: "먼저, 나는 물 한 잔을 마시고 팔을 쭉 펴요.",
      },
      {
        en: "Then I make a cup of coffee and read for a few minutes.",
        ko: "그런 다음 커피 한 잔을 만들고 몇 분 동안 책을 읽어요.",
      },
      {
        en: "My favorite time of the day is this quiet morning.",
        ko: "하루 중 내가 가장 좋아하는 시간은 이 조용한 아침이에요.",
      },
      {
        en: "After breakfast, I am ready to start my work with a smile.",
        ko: "아침을 먹고 나면, 나는 미소를 지으며 일을 시작할 준비가 돼요.",
      },
    ],
  },
];
