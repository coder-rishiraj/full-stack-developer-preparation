import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Bitwise Operators",
  "whatIsIt": "& | ^ ~ << >> >>> convert operands with ToInt32 (>>> uses ToUint32 for the number). They are 32-bit, not full IEEE doubles, so they truncate. JS has no native unsigned 64-bit bitwise on number. bigint has arbitrary-width bitwise ops without 32-bit wrap.",
  "whyExists": "JS needed bit flags and hash mixing for web graphics and protocols, and reused Java’s 32-bit signed model.",
  "mentalModel": "Chop to a 32-bit int, do C-like bits, convert back to a number. High bits of doubles vanish.",
  "how": [
    "Use >>> 0 to get an unsigned 32-bit view.",
    "Do not use | 0 as a secret ToInt32 in readable code without a comment.",
    "Prefer bigint when you need more than 32 bits.",
    "Mask shifts with 31 because shift counts are modulo 32."
  ],
  "callout": {
    "title": "Watch for",
    "text": "1 << 32 is 1, not 0 — shift count is mod 32, so 32 ≡ 0.",
    "variant": "warning"
  },
  "example": "console.log((5 & 3).toString(2), (5 | 3).toString(2), (5 ^ 3).toString(2));\nconsole.log((1 << 31) | 0, (1 << 32), (1 << 33));\nconsole.log((-1 >>> 0).toString(16));\nconsole.log((9n & 3n) === 1n);\n",
  "exampleCaption": "32-bit masking, shifts, unsigned >>>",
  "internals": [
    "NumberBitwiseOp: ToInt32 both, apply op, convert back to Number.",
    "Signed right shift >> copies the sign bit; >>> fills zeros.",
    "bigint bitwise is two’s complement of arbitrary precision; ~1n is -2n."
  ],
  "takeaways": [
    "Use >>> 0 to get an unsigned 32-bit view.",
    "Do not use | 0 as a secret ToInt32 in readable code without a comment.",
    "1 << 32 is 1, not 0 — shift count is mod 32, so 32 ≡ 0.",
    "NumberBitwiseOp: ToInt32 both, apply op, convert back to Number."
  ],
  "revision": [
    "Bitwise Operators: Chop to a 32-bit int, do C-like bits, convert back to a number. High bits of doubles vanish.",
    "Use >>> 0 to get an unsigned 32-bit view.",
    "Do not use | 0 as a secret ToInt32 in readable code without a comment.",
    "Prefer bigint when you need more than 32 bits.",
    "Trap: 1 << 32 is 1, not 0 — shift count is mod 32, so 32 ≡ 0."
  ],
  "flashcards": [
    [
      "Bitwise Operators",
      "& | ^ ~ << >> >>> convert operands with ToInt32 (>>> uses ToUint32 for the number)."
    ],
    [
      "Mental model",
      "Chop to a 32-bit int, do C-like bits, convert back to a number. High bits of doubles vanish."
    ],
    [
      "Common trap",
      "1 << 32 is 1, not 0 — shift count is mod 32, so 32 ≡ 0."
    ],
    [
      "Use >>> 0 to get an unsigned 32-bit view.",
      "Do not use | 0 as a secret ToInt32 in readable code without a comment."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Bitwise Operators and where does a beginner first see it?",
      "answerHint": "& | ^ ~ << >> >>> convert operands with ToInt32 (>>> uses ToUint32 for the number). They are 32-bit, not full IEEE doubles, so they truncate. JS has no native unsigned 64-bit bitwise on number. bigint has arbitrary-width bitwise ops without 32-bit wrap."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Bitwise Operators works and name the main pitfall.",
      "answerHint": "Use >>> 0 to get an unsigned 32-bit view. Do not use | 0 as a secret ToInt32 in readable code without a comment. Prefer bigint when you need more than 32 bits. Mask shifts with 31 because shift counts are modulo 32. Pitfall: 1 << 32 is 1, not 0 — shift count is mod 32, so 32 ≡ 0."
    },
    {
      "level": "advanced",
      "question": "How would you explain Bitwise Operators at an interview, including engine/spec details?",
      "answerHint": "NumberBitwiseOp: ToInt32 both, apply op, convert back to Number. Signed right shift >> copies the sign bit; >>> fills zeros. bigint bitwise is two’s complement of arbitrary precision; ~1n is -2n."
    }
  ],
  "pitfalls": [
    "1 << 32 is 1, not 0 — shift count is mod 32, so 32 ≡ 0.",
    "Mask shifts with 31 because shift counts are modulo 32."
  ],
  "interview": {
    "expectations": [
      "Explain Bitwise Operators without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "NumberBitwiseOp: ToInt32 both, apply op, convert back to Number."
    ],
    "commonQuestions": [
      "What is Bitwise Operators?",
      "Why does JavaScript bitwise operators behave this way?",
      "What is the classic Bitwise Operators interview trap?"
    ],
    "traps": [
      "1 << 32 is 1, not 0 — shift count is mod 32, so 32 ≡ 0."
    ],
    "misconceptions": [
      "JS needed bit flags and hash mixing for web graphics and protocols, and reused Java’s 32-bit signed model."
    ],
    "strongSignals": [
      "Separates Bitwise Operators from lookalike APIs and can draw the mental model."
    ]
  }
})
