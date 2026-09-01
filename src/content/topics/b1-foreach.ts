import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "forEach",
  "whatIsIt": "forEach calls a function for each present index, ignoring the callback’s return value (you cannot break). It skips holes. It is not await-aware: async callbacks will fire in parallel without waiting. Prefer for...of when you need break or await.",
  "whyExists": "A clearer ‘I want side effects per item’ than map. People still abuse map for side effects.",
  "mentalModel": "A fire-and-forget walk. Returns undefined. No break ticket.",
  "how": [
    "Use forEach for logging/DOM side effects on dense arrays.",
    "Use for...of to break or await.",
    "Do not return from forEach thinking it breaks the loop — it only returns from the callback.",
    "Exceptions still abort the walk."
  ],
  "callout": {
    "title": "Watch for",
    "text": "await inside forEach callback does not pause the loop — the loop still finishes synchronously.",
    "variant": "warning"
  },
  "example": "const a = [1, , 3];\nconst seen = [];\na.forEach((n, i) => seen.push([i, n]));\nconsole.log(seen);\n[1, 2, 3].forEach((n) => { if (n === 2) return; console.log(n); });\n",
  "exampleCaption": "forEach skips holes; return is not break",
  "internals": [
    "callbackfn is called with thisArg if provided.",
    "Return value of callback is ignored.",
    "Length is captured up front; later pushes may not be visited (implementation of the spec’s loop uses initial length)."
  ],
  "takeaways": [
    "Use forEach for logging/DOM side effects on dense arrays.",
    "Use for...of to break or await.",
    "await inside forEach callback does not pause the loop — the loop still finishes synchronously.",
    "callbackfn is called with thisArg if provided."
  ],
  "revision": [
    "forEach: A fire-and-forget walk. Returns undefined. No break ticket.",
    "Use forEach for logging/DOM side effects on dense arrays.",
    "Use for...of to break or await.",
    "Do not return from forEach thinking it breaks the loop — it only returns from the callback.",
    "Trap: await inside forEach callback does not pause the loop — the loop still finishes synchronously."
  ],
  "flashcards": [
    [
      "forEach",
      "forEach calls a function for each present index, ignoring the callback’s return value (you cannot break)."
    ],
    [
      "Mental model",
      "A fire-and-forget walk. Returns undefined. No break ticket."
    ],
    [
      "Common trap",
      "await inside forEach callback does not pause the loop — the loop still finishes synchronously."
    ],
    [
      "Use forEach for logging/DOM side effects on dense arrays.",
      "Use for...of to break or await."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is forEach and where does a beginner first see it?",
      "answerHint": "forEach calls a function for each present index, ignoring the callback’s return value (you cannot break). It skips holes. It is not await-aware: async callbacks will fire in parallel without waiting. Prefer for...of when you need break or await."
    },
    {
      "level": "intermediate",
      "question": "Walk through how forEach works and name the main pitfall.",
      "answerHint": "Use forEach for logging/DOM side effects on dense arrays. Use for...of to break or await. Do not return from forEach thinking it breaks the loop — it only returns from the callback. Exceptions still abort the walk. Pitfall: await inside forEach callback does not pause the loop — the loop still finishes synchronously."
    },
    {
      "level": "advanced",
      "question": "How would you explain forEach at an interview, including engine/spec details?",
      "answerHint": "callbackfn is called with thisArg if provided. Return value of callback is ignored. Length is captured up front; later pushes may not be visited (implementation of the spec’s loop uses initial length)."
    }
  ],
  "pitfalls": [
    "await inside forEach callback does not pause the loop — the loop still finishes synchronously.",
    "Exceptions still abort the walk."
  ],
  "interview": {
    "expectations": [
      "Explain forEach without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "callbackfn is called with thisArg if provided."
    ],
    "commonQuestions": [
      "What is forEach?",
      "Why does JavaScript foreach behave this way?",
      "What is the classic forEach interview trap?"
    ],
    "traps": [
      "await inside forEach callback does not pause the loop — the loop still finishes synchronously."
    ],
    "misconceptions": [
      "A clearer ‘I want side effects per item’ than map. People still abuse map for side effects."
    ],
    "strongSignals": [
      "Separates forEach from lookalike APIs and can draw the mental model."
    ]
  }
})
