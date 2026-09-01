import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Race Conditions & Stale Requests",
  "whatIsIt": "A stale request is an older async result arriving after a newer one and overwriting UI/state. Causes: no abort, no generation counter, overlapping fetches for the same widget. Fix: increment a request id, ignore mismatches; or abort the previous; or disable concurrency.",
  "whyExists": "Users type fast; networks reorder. Last-write-wins without identity is wrong when last-to-finish is not last-started.",
  "mentalModel": "Two letters in the mail. The slow old letter must not replace the new address you already showed.",
  "how": [
    "AbortController per latest request.",
    "let seq=0; const my=++seq; after await if (my!==seq) return.",
    "Disable the input until done if that matches UX.",
    "Do not only sort by completion time."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Showing whichever fetch finishes last — that can be the old query.",
    "variant": "warning"
  },
  "example": "let seq = 0;\nasync function search(q, api) {\n  const my = ++seq;\n  const data = await api(q);\n  if (my !== seq) return 'stale';\n  return data;\n}\nconst api = (q) => new Promise((r) => setTimeout(() => r(q), q === 'old' ? 20 : 0));\nconst a = search('old', api);\nconst b = search('new', api);\nconsole.log(await a, await b);\n",
  "exampleCaption": "Sequence numbers dropping a slow stale result",
  "internals": [
    "Network completion order is not start order.",
    "Abort + ignore is belt and suspenders.",
    "React Strict Mode double-invoke makes this bug more visible."
  ],
  "takeaways": [
    "AbortController per latest request.",
    "let seq=0; const my=++seq; after await if (my!==seq) return.",
    "Showing whichever fetch finishes last — that can be the old query.",
    "Network completion order is not start order."
  ],
  "revision": [
    "Race Conditions & Stale Requests: Two letters in the mail. The slow old letter must not replace the new address you already showed.",
    "AbortController per latest request.",
    "let seq=0; const my=++seq; after await if (my!==seq) return.",
    "Disable the input until done if that matches UX.",
    "Trap: Showing whichever fetch finishes last — that can be the old query."
  ],
  "flashcards": [
    [
      "Race Conditions & Stale Requests",
      "A stale request is an older async result arriving after a newer one and overwriting UI/state."
    ],
    [
      "Mental model",
      "Two letters in the mail. The slow old letter must not replace the new address you already showed."
    ],
    [
      "Common trap",
      "Showing whichever fetch finishes last — that can be the old query."
    ],
    [
      "AbortController per latest request.",
      "let seq=0; const my=++seq; after await if (my!==seq) return."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Race Conditions & Stale Requests and where does a beginner first see it?",
      "answerHint": "A stale request is an older async result arriving after a newer one and overwriting UI/state. Causes: no abort, no generation counter, overlapping fetches for the same widget. Fix: increment a request id, ignore mismatches; or abort the previous; or disable concurrency."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Race Conditions & Stale Requests works and name the main pitfall.",
      "answerHint": "AbortController per latest request. let seq=0; const my=++seq; after await if (my!==seq) return. Disable the input until done if that matches UX. Do not only sort by completion time. Pitfall: Showing whichever fetch finishes last — that can be the old query."
    },
    {
      "level": "advanced",
      "question": "How would you explain Race Conditions & Stale Requests at an interview, including engine/spec details?",
      "answerHint": "Network completion order is not start order. Abort + ignore is belt and suspenders. React Strict Mode double-invoke makes this bug more visible."
    }
  ],
  "pitfalls": [
    "Showing whichever fetch finishes last — that can be the old query.",
    "Do not only sort by completion time."
  ],
  "interview": {
    "expectations": [
      "Explain Race Conditions & Stale Requests without mixing it up with a nearby B1.31 — Async Cancellation & Coordination topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Network completion order is not start order."
    ],
    "commonQuestions": [
      "What is Race Conditions & Stale Requests?",
      "Why does JavaScript race conditions & stale requests behave this way?",
      "What is the classic Race Conditions & Stale Requests interview trap?"
    ],
    "traps": [
      "Showing whichever fetch finishes last — that can be the old query."
    ],
    "misconceptions": [
      "Users type fast; networks reorder. Last-write-wins without identity is wrong when last-to-finish is not last-started."
    ],
    "strongSignals": [
      "Separates Race Conditions & Stale Requests from lookalike APIs and can draw the mental model."
    ]
  }
})
