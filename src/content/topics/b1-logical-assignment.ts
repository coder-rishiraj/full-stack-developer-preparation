import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Logical Assignment (&&= ||= ??=)",
  "whatIsIt": "&&= ||= ??= assign only when the left’s test fails/succeeds: x ||= y assigns if x is falsy; x &&= y if x is truthy; x ??= y if x is nullish. If they skip, setters/getters on the left may not run for the write. They evaluate the left once.",
  "whyExists": "People wrote x = x || y constantly. Logical assignment makes in-place defaults a single operator without double lookup.",
  "mentalModel": "Check the box; only then replace what is in the box. ??= is the nullish version of that.",
  "how": [
    "obj.settings ??= {} to lazily create.",
    "Prefer ??= over ||= so 0 is kept.",
    "Remember skipped assignment means no setter call.",
    "Do not use ||= on numbers that can be 0."
  ],
  "callout": {
    "title": "Watch for",
    "text": "o.count ||= 1 bumps a stored 0 to 1, resetting real data.",
    "variant": "warning"
  },
  "example": "const o = { n: 0, s: '', x: null };\no.n ||= 5;\no.s ||= 'hi';\no.x ??= 9;\no.y ??= 1;\nconsole.log(o);\nlet a = 1;\na &&= 2;\nconsole.log(a);\n",
  "exampleCaption": "||= vs ??= vs &&= on an object",
  "internals": [
    "Specified to use the same short-circuit rules as || && ?? then PutValue if needed.",
    "Left-hand reference is resolved once (important for proxies/getters).",
    "If short-circuit skips, the assignment expression’s value is still the left’s value."
  ],
  "takeaways": [
    "obj.settings ??= {} to lazily create.",
    "Prefer ??= over ||= so 0 is kept.",
    "o.count ||= 1 bumps a stored 0 to 1, resetting real data.",
    "Specified to use the same short-circuit rules as || && ?? then PutValue if needed."
  ],
  "revision": [
    "Logical Assignment (&&= ||= ??=): Check the box; only then replace what is in the box. ??= is the nullish version of that.",
    "obj.settings ??= {} to lazily create.",
    "Prefer ??= over ||= so 0 is kept.",
    "Remember skipped assignment means no setter call.",
    "Trap: o.count ||= 1 bumps a stored 0 to 1, resetting real data."
  ],
  "flashcards": [
    [
      "Logical Assignment (&&= ||= ??=)",
      "&&= ||= ??= assign only when the left’s test fails/succeeds: x ||= y assigns if x is falsy; x &&= y if x is truthy; x ??= y if x is nullish."
    ],
    [
      "Mental model",
      "Check the box; only then replace what is in the box. ??= is the nullish version of that."
    ],
    [
      "Common trap",
      "o.count ||= 1 bumps a stored 0 to 1, resetting real data."
    ],
    [
      "obj.settings ??= {} to lazily create.",
      "Prefer ??= over ||= so 0 is kept."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Logical Assignment (&&= ||= ??=) and where does a beginner first see it?",
      "answerHint": "&&= ||= ??= assign only when the left’s test fails/succeeds: x ||= y assigns if x is falsy; x &&= y if x is truthy; x ??= y if x is nullish. If they skip, setters/getters on the left may not run for the write. They evaluate the left once."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Logical Assignment (&&= ||= ??=) works and name the main pitfall.",
      "answerHint": "obj.settings ??= {} to lazily create. Prefer ??= over ||= so 0 is kept. Remember skipped assignment means no setter call. Do not use ||= on numbers that can be 0. Pitfall: o.count ||= 1 bumps a stored 0 to 1, resetting real data."
    },
    {
      "level": "advanced",
      "question": "How would you explain Logical Assignment (&&= ||= ??=) at an interview, including engine/spec details?",
      "answerHint": "Specified to use the same short-circuit rules as || && ?? then PutValue if needed. Left-hand reference is resolved once (important for proxies/getters). If short-circuit skips, the assignment expression’s value is still the left’s value."
    }
  ],
  "pitfalls": [
    "o.count ||= 1 bumps a stored 0 to 1, resetting real data.",
    "Do not use ||= on numbers that can be 0."
  ],
  "interview": {
    "expectations": [
      "Explain Logical Assignment (&&= ||= ??=) without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Specified to use the same short-circuit rules as || && ?? then PutValue if needed."
    ],
    "commonQuestions": [
      "What is Logical Assignment (&&= ||= ??=)?",
      "Why does JavaScript logical assignment (&&= ||= ??=) behave this way?",
      "What is the classic Logical Assignment (&&= ||= ??=) interview trap?"
    ],
    "traps": [
      "o.count ||= 1 bumps a stored 0 to 1, resetting real data."
    ],
    "misconceptions": [
      "People wrote x = x || y constantly. Logical assignment makes in-place defaults a single operator without double lookup."
    ],
    "strongSignals": [
      "Separates Logical Assignment (&&= ||= ??=) from lookalike APIs and can draw the mental model."
    ]
  }
})
