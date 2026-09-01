import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "bigint",
  "whatIsIt": "bigint is an arbitrary-precision integer primitive written with `n` (`10n`). It cannot mix with number in arithmetic (`1n + 1` throws TypeError). It has no Infinity/NaN; division truncates toward zero. JSON.stringify throws on bigint unless you define a replacer.",
  "whyExists": "Safe integers max out at 2^53-1, which is too small for some IDs, cryptography, and financial integer math. bigint extends integers without changing number’s float behavior.",
  "mentalModel": "An unlimited integer tape. It never becomes a float, and it refuses to silently mix with doubles.",
  "how": [
    "Suffix `n` or `BigInt(string)` for construction.",
    "Convert explicitly: `Number(1n)` (may lose precision) or `BigInt(1)`.",
    "Use for IDs that arrive as strings from APIs if they exceed 2^53.",
    "Do not JSON.stringify raw bigints."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`9007199254740993` without `n` is already rounded as a number before you notice — the extra integer never existed.",
    "variant": "warning"
  },
  "example": "const id = 9007199254740993n;\nconsole.log(id + 1n);\ntry { console.log(id + 1); } catch (e) { console.log(e.name); }\nconsole.log(5n / 2n);\nconsole.log(0n === 0);",
  "exampleCaption": "bigint arithmetic, no mixed ops, truncated division",
  "internals": [
    "typeof bigint is \"bigint\".",
    "Relational comparison can coerce number/bigint; === never does.",
    "Bitwise ops work on bigint with arbitrary width, not ToInt32."
  ],
  "takeaways": [
    "Suffix `n` or `BigInt(string)` for construction.",
    "Convert explicitly: `Number(1n)` (may lose precision) or `BigInt(1)`.",
    "`9007199254740993` without `n` is already rounded as a number before you notice — the extra integer never existed.",
    "typeof bigint is \"bigint\"."
  ],
  "revision": [
    "bigint: An unlimited integer tape. It never becomes a float, and it refuses to silently mix with doubles.",
    "Suffix `n` or `BigInt(string)` for construction.",
    "Convert explicitly: `Number(1n)` (may lose precision) or `BigInt(1)`.",
    "Use for IDs that arrive as strings from APIs if they exceed 2^53.",
    "Trap: `9007199254740993` without `n` is already rounded as a number before you notice — the extra integer never existed."
  ],
  "flashcards": [
    [
      "bigint",
      "bigint is an arbitrary-precision integer primitive written with `n` (`10n`)."
    ],
    [
      "Mental model",
      "An unlimited integer tape. It never becomes a float, and it refuses to silently mix with doubles."
    ],
    [
      "Common trap",
      "`9007199254740993` without `n` is already rounded as a number before you notice — the extra integer never existed."
    ],
    [
      "Suffix `n` or `BigInt(string)` for construction.",
      "Convert explicitly: `Number(1n)` (may lose precision) or `BigInt(1)`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is bigint and where does a beginner first see it?",
      "answerHint": "bigint is an arbitrary-precision integer primitive written with `n` (`10n`). It cannot mix with number in arithmetic (`1n + 1` throws TypeError). It has no Infinity/NaN; division truncates toward zero. JSON.stringify throws on bigint unless you define a replacer."
    },
    {
      "level": "intermediate",
      "question": "Walk through how bigint works and name the main pitfall.",
      "answerHint": "Suffix `n` or `BigInt(string)` for construction. Convert explicitly: `Number(1n)` (may lose precision) or `BigInt(1)`. Use for IDs that arrive as strings from APIs if they exceed 2^53. Do not JSON.stringify raw bigints. Pitfall: `9007199254740993` without `n` is already rounded as a number before you notice — the extra integer never existed."
    },
    {
      "level": "advanced",
      "question": "How would you explain bigint at an interview, including engine/spec details?",
      "answerHint": "typeof bigint is \"bigint\". Relational comparison can coerce number/bigint; === never does. Bitwise ops work on bigint with arbitrary width, not ToInt32."
    }
  ],
  "pitfalls": [
    "`9007199254740993` without `n` is already rounded as a number before you notice — the extra integer never existed.",
    "Do not JSON.stringify raw bigints."
  ],
  "interview": {
    "expectations": [
      "Explain bigint without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "typeof bigint is \"bigint\"."
    ],
    "commonQuestions": [
      "What is bigint?",
      "Why does JavaScript bigint behave this way?",
      "What is the classic bigint interview trap?"
    ],
    "traps": [
      "`9007199254740993` without `n` is already rounded as a number before you notice — the extra integer never existed."
    ],
    "misconceptions": [
      "Safe integers max out at 2^53-1, which is too small for some IDs, cryptography, and financial integer math. bigint extends integers without changing number’s float behavior."
    ],
    "strongSignals": [
      "Separates bigint from lookalike APIs and can draw the mental model."
    ]
  }
})
