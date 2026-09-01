import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Random Numbers",
  "whatIsIt": "Math.random() returns a number in [0, 1) from a PRNG — not cryptographic. Scale with Math.floor(Math.random() * n) for integers 0..n-1. The distribution of floats is not a perfect discrete uniform after scaling. Use crypto.getRandomValues for tokens.",
  "whyExists": "Games and UI jitter needed a cheap random. Crypto randomness is a separate, slower API on purpose.",
  "mentalModel": "A spinner that lands in [0, 1). Multiply and floor to pick an index. Do not use it for passwords.",
  "how": [
    "Integer in [min, max]: floor(random() * (max-min+1)) + min.",
    "Never Math.random() for session tokens.",
    "Do not call random() once and reuse for ‘shuffle’ incorrectly — Fisher–Yates needs a fresh draw per step.",
    "Tests: inject a stub; do not assert exact random values."
  ],
  "callout": {
    "title": "Watch for",
    "text": "floor(random() * n) + 1 is 1..n, but using round() biases the ends.",
    "variant": "warning"
  },
  "example": "function randInt(min, max) {\n  return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nfunction shuffle(arr) {\n  const a = arr.slice();\n  for (let i = a.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [a[i], a[j]] = [a[j], a[i]];\n  }\n  return a;\n}\nconsole.log(randInt(1, 6), shuffle([1, 2, 3, 4]));\n",
  "exampleCaption": "Uniform int helper and Fisher–Yates shuffle",
  "internals": [
    "The spec only requires an implementation-defined approximation of uniform in [0,1).",
    "Engines use xorshift/xoshiro-like PRNGs seeded per context.",
    "Web Crypto is specified separately; Math.random is not required to be CSPRNG."
  ],
  "takeaways": [
    "Integer in [min, max]: floor(random() * (max-min+1)) + min.",
    "Never Math.random() for session tokens.",
    "floor(random() * n) + 1 is 1..n, but using round() biases the ends.",
    "The spec only requires an implementation-defined approximation of uniform in [0,1)."
  ],
  "revision": [
    "Random Numbers: A spinner that lands in [0, 1). Multiply and floor to pick an index. Do not use it for passwords.",
    "Integer in [min, max]: floor(random() * (max-min+1)) + min.",
    "Never Math.random() for session tokens.",
    "Do not call random() once and reuse for ‘shuffle’ incorrectly — Fisher–Yates needs a fresh draw per step.",
    "Trap: floor(random() * n) + 1 is 1..n, but using round() biases the ends."
  ],
  "flashcards": [
    [
      "Random Numbers",
      "Math.random() returns a number in [0, 1) from a PRNG — not cryptographic."
    ],
    [
      "Mental model",
      "A spinner that lands in [0, 1). Multiply and floor to pick an index. Do not use it for passwords."
    ],
    [
      "Common trap",
      "floor(random() * n) + 1 is 1..n, but using round() biases the ends."
    ],
    [
      "Integer in [min, max]: floor(random() * (max-min+1)) + min.",
      "Never Math.random() for session tokens."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Random Numbers and where does a beginner first see it?",
      "answerHint": "Math.random() returns a number in [0, 1) from a PRNG — not cryptographic. Scale with Math.floor(Math.random() * n) for integers 0..n-1. The distribution of floats is not a perfect discrete uniform after scaling. Use crypto.getRandomValues for tokens."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Random Numbers works and name the main pitfall.",
      "answerHint": "Integer in [min, max]: floor(random() * (max-min+1)) + min. Never Math.random() for session tokens. Do not call random() once and reuse for ‘shuffle’ incorrectly — Fisher–Yates needs a fresh draw per step. Tests: inject a stub; do not assert exact random values. Pitfall: floor(random() * n) + 1 is 1..n, but using round() biases the ends."
    },
    {
      "level": "advanced",
      "question": "How would you explain Random Numbers at an interview, including engine/spec details?",
      "answerHint": "The spec only requires an implementation-defined approximation of uniform in [0,1). Engines use xorshift/xoshiro-like PRNGs seeded per context. Web Crypto is specified separately; Math.random is not required to be CSPRNG."
    }
  ],
  "pitfalls": [
    "floor(random() * n) + 1 is 1..n, but using round() biases the ends.",
    "Tests: inject a stub; do not assert exact random values."
  ],
  "interview": {
    "expectations": [
      "Explain Random Numbers without mixing it up with a nearby B1.8 — Numbers & Math topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The spec only requires an implementation-defined approximation of uniform in [0,1)."
    ],
    "commonQuestions": [
      "What is Random Numbers?",
      "Why does JavaScript random numbers behave this way?",
      "What is the classic Random Numbers interview trap?"
    ],
    "traps": [
      "floor(random() * n) + 1 is 1..n, but using round() biases the ends."
    ],
    "misconceptions": [
      "Games and UI jitter needed a cheap random. Crypto randomness is a separate, slower API on purpose."
    ],
    "strongSignals": [
      "Separates Random Numbers from lookalike APIs and can draw the mental model."
    ]
  }
})
