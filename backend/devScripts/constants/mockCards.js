export const mockCards = [
  {
    context: "Park\u200B chatter — quick exchange",
    front: "Who\u00A0is at the park?",
    back: "공원에\n누가 있어요?",
    explanation: `1. **이\u200B봐**
       - **이보다** – base verb for “look at this”
       - **이봐** – shortened imperative, like “hey”`,
    mirror: false,
    tags: ["location", "zero-width", "beginner"]
  },
  {
    context: "Urgent whisper with EM SPACE",
    front: "LOOK\u2003OUT!",
    back: "조심해!",
    explanation: `<!-- invisible comment -->
    1. **그림자의**
       - **그림자** (<em>shadow</em>)
       - <strong>의</strong> – possessive (‘s)`,
    mirror: true,
    tags: ["⚠️", "html"]
  },
  {
    context: "Polite greeting (two-line)",
    front: "Good morning,\nma'am.",
    back: "안녕하\u200B세요.",
    explanation: `1. ### **어디에?**
       - **어디** – “where”
       - **에** – location particle
       ---
       > ⚠️ Mixing heading & HR inside list`,
    mirror: false,
    tags: ["greeting"]
  },
  {
    // context intentionally omitted (tests optional)
    front: "Where’s the restroom? 🚻",
    back: "화장실이 어디예요? 🚾",
    explanation: `1. **무슨**
       - **무\n슨** – line-break jammed in
       - ***무슨*?** – extra * tokens`,
    mirror: true,
    tags: []
  },
  {
    context: "Soft-hyphen demo",
    front: "sub\u00ADway directions",
    back: "지하철 안내",
    explanation: `1. **봐라**
       - \`\`\`
         console.log(\`이봐\`);
         \`\`\`
       - triple back-ticks inside list`,
    mirror: false,
    tags: ["code", "soft-hyphen"]
  },
  {
    context: "Hidden RTL mark sneaks in",
    front: "Next, please.",
    back: "다음분\u200F, 들어오세요.",
    explanation: `| 단어 | 품사 | 의미 |
    |------|------|------|
    | **차** | noun | tea / car (context) |`,
    mirror: true,
    tags: ["table", "rtl"]
  },
  {
    context: "<b>Literal HTML tag name</b>",
    front: "Click <here>",
    back: "여기를 클릭하세요",
    explanation: `1. **책의**‎[^rtl] ← hidden RTL mark
       - **책** – book
       - **의** – ’s
       
       [^rtl]: Footnote flex`,
    mirror: false,
    tags: ["html", "footnote"]
  },
  {
    context: "Mid-string emoji",
    front: "Let's grab tacos 🌮 tonight",
    back: "오늘 밤 🌮 먹을래?",
    explanation: `![alt text](x "title") <img src="x" onerror="alert('xss')" />`,
    mirror: true,
    tags: ["emoji", "🌮"]
  },
  {
    context: "Zalgo + NBSP combo",
    front: "H̵̐̀e̷͔͝l̵̹̾l̸̻͗o̶̖͘\u00A0there",
    back: "안\u200B녕? (ZWSP hidden)",
    explanation: `1. **공\u00AD원** – soft-hyphen sneaky
       - **공원&nbsp;에** – NBSP before particle`,
    mirror: false,
    tags: ["zalgo"]
  },
  {
    context: "Markdown inside quotes",
    front: "“Did you see that?” **Wow!**",
    back: "“봤어?” **대박!**",
    explanation: `1. **Z͑͝ȃ͑l̑g̘̳ơ̼** &#x1F47B;
       - Haunting your renderer 👻`,
    mirror: true,
    tags: ["quote", "👻", "edge-case"]
  },
    {
    context: "Ordering coffee",
    front: "I’d like a cup of coffee, please.",
    back: "커피 한 잔 주세요.",
    explanation: "- **커피** coffee\n- **한 잔** one cup\n- **주세요** please give",
    mirror: false,
    tags: ["ordering", "coffee"]
  },
  {
    context: "Casual greeting",
    front: "Hi! How are you?",
    back: "안녕! 잘 지내?",
    explanation: "- **안녕** hi/bye\n- **잘 지내?** doing well?",
    mirror: true,
    tags: ["greeting", "casual"]
  },
  {
    context: "Polite greeting",
    front: "Good evening.",
    back: "안녕하세요.",
    explanation: "- **안녕하세요** polite hello (any time)",
    mirror: false,
    tags: ["greeting", "polite"]
  },
  {
    context: "Introducing yourself",
    front: "My name is Jonathan.",
    back: "저는 조너선입니다.",
    explanation: "- **저는** I (humble)\n- **…입니다** am/is (formal)",
    mirror: false,
    tags: ["intro"]
  },
  {
    context: "Thank you",
    front: "Thank you very much.",
    back: "정말 감사합니다.",
    explanation: "- **정말** really\n- **감사합니다** thank you (formal)",
    mirror: true,
    tags: ["thanks"]
  },
  {
    context: "Apologising",
    front: "I’m sorry.",
    back: "죄송합니다.",
    explanation: "- **죄송합니다** I am sorry (formal)",
    mirror: false,
    tags: ["apology"]
  },
  {
    context: "Asking price",
    front: "How much is this?",
    back: "이거 얼마예요?",
    explanation: "- **이거** this thing\n- **얼마예요?** how much?",
    mirror: true,
    tags: ["shopping"]
  },
  {
    context: "Counting people",
    front: "Two people, please.",
    back: "두 명이요.",
    explanation: "- **두** two\n- **명** counter for people\n- **…이요** please/that’s it",
    mirror: false,
    tags: ["restaurant", "counting"]
  },
  {
    context: "Requesting help",
    front: "Excuse me, could you help me?",
    back: "실례합니다, 도와주실 수 있나요?",
    explanation: "- **실례합니다** excuse me\n- **도와주실 수 있나요?** could you help?",
    mirror: false,
    tags: ["help"]
  },
  {
    context: "Directions",
    front: "Where is the subway station?",
    back: "지하철역이 어디예요?",
    explanation: "- **지하철역** subway station\n- **어디예요?** where is it?",
    mirror: true,
    tags: ["directions"]
  },
  {
    context: "Ordering food",
    front: "Please give me bibimbap.",
    back: "비빔밥 주세요.",
    explanation: "- **비빔밥** bibimbap\n- **주세요** please give",
    mirror: false,
    tags: ["ordering", "food"]
  },
  {
    context: "Telling time",
    front: "It is three o’clock.",
    back: "세 시입니다.",
    explanation: "- **세 시** three o’clock\n- **…입니다** is (formal)",
    mirror: false,
    tags: ["time"]
  },
  {
    context: "Weather",
    front: "It’s cold today.",
    back: "오늘은 추워요.",
    explanation: "- **오늘은** today (topic)\n- **추워요** is cold",
    mirror: true,
    tags: ["weather"]
  },
  {
    context: "Making plans",
    front: "Shall we go to the park tomorrow?",
    back: "내일 공원에 갈까요?",
    explanation: "- **내일** tomorrow\n- **공원** park\n- **갈까요?** shall we go?",
    mirror: false,
    tags: ["plans"]
  },
  {
    context: "Expressing likes",
    front: "I like Korean food.",
    back: "한국 음식을 좋아해요.",
    explanation: "- **한국 음식** Korean food\n- **좋아해요** like",
    mirror: false,
    tags: ["preferences", "food"]
  },
  {
    context: "Checking understanding",
    front: "Do you understand?",
    back: "이해했어요?",
    explanation: "- **이해했어요?** did you understand?",
    mirror: true,
    tags: ["classroom"]
  },
  {
    context: "Finding a bathroom",
    front: "Where is the bathroom?",
    back: "화장실이 어디예요?",
    explanation: "- **화장실** bathroom\n- **어디예요?** where is it?",
    mirror: false,
    tags: ["directions", "bathroom"]
  },
  {
    context: "Paying the bill",
    front: "Please give me the bill.",
    back: "계산서 주세요.",
    explanation: "- **계산서** bill/check\n- **주세요** please give",
    mirror: false,
    tags: ["restaurant"]
  },
  {
    context: "Taking pictures",
    front: "Could you take a picture of us?",
    back: "사진 좀 찍어 주실 수 있나요?",
    explanation: "- **사진** photo\n- **찍어 주실 수 있나요?** could you take (for me)?",
    mirror: true,
    tags: ["travel"]
  },
  {
    context: "Saying goodbye",
    front: "See you tomorrow!",
    back: "내일 봐!",
    explanation: "- **내일** tomorrow\n- **봐!** see (imperative, informal)",
    mirror: false,
    tags: ["farewell", "casual"]
  },
    {
    context: "Morning routine",
    front: "I wake up at seven.",
    back: "저는 일곱 시에 일어나요.",
    explanation: "- **일곱 시** seven o’clock\n- **일어나요** wake up (polite)",
    mirror: false,
    tags: ["daily", "time"]
  },
  {
    context: "Breakfast choice",
    front: "I usually eat toast for breakfast.",
    back: "저는 보통 아침에 토스트를 먹어요.",
    explanation: "- **보통** usually\n- **아침** breakfast\n- **토스트를 먹어요** eat toast",
    mirror: true,
    tags: ["food", "daily"]
  },
  {
    context: "Work commute",
    front: "I take the bus to work.",
    back: "저는 버스를 타고 출근해요.",
    explanation: "- **버스** bus\n- **타고** by taking\n- **출근해요** go to work",
    mirror: false,
    tags: ["transport"]
  },
  {
    context: "Requesting clarification",
    front: "Could you repeat that, please?",
    back: "다시 말씀해 주시겠어요?",
    explanation: "- **다시** again\n- **말씀해 주시겠어요?** could you say (honorific)",
    mirror: true,
    tags: ["classroom", "polite"]
  },
  {
    context: "Lunch order",
    front: "I’ll have a vegetarian bibimbap.",
    back: "채식 비빔밥 주세요.",
    explanation: "- **채식** vegetarian\n- **비빔밥** bibimbap\n- **주세요** please give",
    mirror: false,
    tags: ["food", "ordering"]
  },
  {
    context: "Afternoon activity",
    front: "I read a book in the afternoon.",
    back: "오후에 책을 읽어요.",
    explanation: "- **오후** afternoon\n- **책을 읽어요** read a book",
    mirror: false,
    tags: ["hobby", "daily"]
  },
  {
    context: "Asking permission",
    front: "May I sit here?",
    back: "여기 앉아도 될까요?",
    explanation: "- **앉아도 될까요?** may I sit?",
    mirror: true,
    tags: ["polite"]
  },
  {
    context: "Giving location",
    front: "The library is next to the bank.",
    back: "도서관은 은행 옆에 있어요.",
    explanation: "- **도서관** library\n- **은행 옆** next to the bank",
    mirror: false,
    tags: ["directions"]
  },
  {
    context: "Expressing preference",
    front: "I prefer tea over coffee.",
    back: "저는 커피보다 차를 더 좋아해요.",
    explanation: "- **…보다** than\n- **더 좋아해요** like more",
    mirror: true,
    tags: ["preferences", "food"]
  },
  {
    context: "Making an appointment",
    front: "Can we meet at three?",
    back: "세 시에 만날 수 있을까요?",
    explanation: "- **세 시** three o’clock\n- **만날 수 있을까요?** can we meet?",
    mirror: false,
    tags: ["plans", "time"]
  },
  {
    context: "Buying tickets",
    front: "Two tickets to Seoul, please.",
    back: "서울행 표 두 장 주세요.",
    explanation: "- **서울행 표** ticket(s) to Seoul\n- **두 장** two tickets",
    mirror: false,
    tags: ["travel", "ordering"]
  },
  {
    context: "Weekend plan",
    front: "I’m going hiking this weekend.",
    back: "이번 주말에 등산 갈 거예요.",
    explanation: "- **이번 주말** this weekend\n- **등산** hiking\n- **갈 거예요** will go",
    mirror: true,
    tags: ["plans", "hobby"]
  },
  {
    context: "Compliment",
    front: "Your Korean is very good!",
    back: "한국어 정말 잘하시네요!",
    explanation: "- **정말** really\n- **잘하시네요** you speak well (honorific)",
    mirror: false,
    tags: ["compliment", "language"]
  },
  {
    context: "Asking for Wi-Fi",
    front: "Do you have Wi-Fi here?",
    back: "여기 와이파이 있어요?",
    explanation: "- **와이파이** Wi-Fi\n- **있어요?** is there/does it exist?",
    mirror: true,
    tags: ["travel", "tech"]
  },
  {
    context: "Health check",
    front: "I have a headache.",
    back: "머리가 아파요.",
    explanation: "- **머리** head\n- **아파요** hurts",
    mirror: false,
    tags: ["health"]
  },
  {
    context: "Asking distance",
    front: "Is it far from here?",
    back: "여기서 멀어요?",
    explanation: "- **멀어요?** is it far?",
    mirror: true,
    tags: ["directions"]
  },
  {
    context: "Making suggestion",
    front: "Let’s watch a movie tonight.",
    back: "오늘 밤 영화 볼까요?",
    explanation: "- **영화** movie\n- **볼까요?** shall we watch?",
    mirror: false,
    tags: ["plans", "hobby"]
  },
  {
    context: "Checking availability",
    front: "Do you have this in a larger size?",
    back: "더 큰 사이즈 있어요?",
    explanation: "- **더 큰** larger\n- **사이즈** size\n- **있어요?** do you have?",
    mirror: true,
    tags: ["shopping"]
  },
  {
    context: "Sharing opinion",
    front: "I think it’s interesting.",
    back: "흥미로운 것 같아요.",
    explanation: "- **흥미롭다** to be interesting\n- **…것 같아요** I think/it seems",
    mirror: false,
    tags: ["conversation"]
  },
  {
    context: "Saying goodbye",
    front: "Take care!",
    back: "잘 가요!",
    explanation: "- **잘 가요** go well/bye (polite)",
    mirror: false,
    tags: ["farewell"]
  }
];
