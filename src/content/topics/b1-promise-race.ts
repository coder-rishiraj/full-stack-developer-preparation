import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Promise.race",
  "whatIsIt": "Promise.race(iterable) settles with the first input that settles, whether fulfill or reject. Empty race is forever pending. Use for timeouts: race(work, rejectAfter(ms)). The losers keep running. First-to-settle, not first-to-fulfill (that is any).",
  "whyExists": "Timeouts and ‘whoever answers first’ need a winner-take-all join.",
  "mentalModel": "A sprint: first across the line, gold or injury, ends the race promise. Others still run off-track.",
  "how": [
    "Timeout helper: reject after ms, race with work.",
    "AbortController to actually stop fetch.",
    "Empty array: hang — guard it.",
    "Do not race for ‘first success’ — use any."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Timeout ‘wins’ but the slow request still hits the server — race is not cancel.",
    "variant": "warning"
  },
  "example": "const slow = new Promise((r) => setTimeout(() => r('slow'), 30));\nconst fast = Promise.resolve('fast');\nconsole.log(await Promise.race([slow, fast]));\nconst timeout = new Promise((_, j) => setTimeout(() => j(new Error('t')), 0));\ntry { await Promise.race([slow, timeout]); } catch (e) { console.log(e.message); }\n",
  "exampleCaption": "race first fulfill vs timeout reject",
  "internals": [
    "Each then tries to resolve/reject the same result capability; first job wins.",
    "Empty iterator: no then attached, forever pending.",
    "Already-settled inputs win on the next microtask in iteration order."
  ],
  "takeaways": [
    "Timeout helper: reject after ms, race with work.",
    "AbortController to actually stop fetch.",
    "Timeout ‘wins’ but the slow request still hits the server — race is not cancel.",
    "Each then tries to resolve/reject the same result capability; first job wins."
  ],
  "revision": [
    "Promise.race: A sprint: first across the line, gold or injury, ends the race promise. Others still run off-track.",
    "Timeout helper: reject after ms, race with work.",
    "AbortController to actually stop fetch.",
    "Empty array: hang — guard it.",
    "Trap: Timeout ‘wins’ but the slow request still hits the server — race is not cancel."
  ],
  "flashcards": [
    [
      "Promise.race",
      "Promise.race(iterable) settles with the first input that settles, whether fulfill or reject."
    ],
    [
      "Mental model",
      "A sprint: first across the line, gold or injury, ends the race promise. Others still run off-track."
    ],
    [
      "Common trap",
      "Timeout ‘wins’ but the slow request still hits the server — race is not cancel."
    ],
    [
      "Timeout helper: reject after ms, race with work.",
      "AbortController to actually stop fetch."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Promise.race and where does a beginner first see it?",
      "answerHint": "Promise.race(iterable) settles with the first input that settles, whether fulfill or reject. Empty race is forever pending. Use for timeouts: race(work, rejectAfter(ms)). The losers keep running. First-to-settle, not first-to-fulfill (that is any)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Promise.race works and name the main pitfall.",
      "answerHint": "Timeout helper: reject after ms, race with work. AbortController to actually stop fetch. Empty array: hang — guard it. Do not race for ‘first success’ — use any. Pitfall: Timeout ‘wins’ but the slow request still hits the server — race is not cancel."
    },
    {
      "level": "advanced",
      "question": "How would you explain Promise.race at an interview, including engine/spec details?",
      "answerHint": "Each then tries to resolve/reject the same result capability; first job wins. Empty iterator: no then attached, forever pending. Already-settled inputs win on the next microtask in iteration order."
    }
  ],
  "pitfalls": [
    "Timeout ‘wins’ but the slow request still hits the server — race is not cancel.",
    "Do not race for ‘first success’ — use any."
  ],
  "interview": {
    "expectations": [
      "Explain Promise.race without mixing it up with a nearby B1.29 — Promises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Each then tries to resolve/reject the same result capability; first job wins."
    ],
    "commonQuestions": [
      "What is Promise.race?",
      "Why does JavaScript promise.race behave this way?",
      "What is the classic Promise.race interview trap?"
    ],
    "traps": [
      "Timeout ‘wins’ but the slow request still hits the server — race is not cancel."
    ],
    "misconceptions": [
      "Timeouts and ‘whoever answers first’ need a winner-take-all join."
    ],
    "strongSignals": [
      "Separates Promise.race from lookalike APIs and can draw the mental model."
    ]
  }
})
