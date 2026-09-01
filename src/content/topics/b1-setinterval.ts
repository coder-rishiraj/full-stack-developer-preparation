import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "setInterval / clearInterval",
  "whatIsIt": "setInterval(fn, ms) queues fn repeatedly. If fn takes longer than ms, browsers may skip or delay (you can get overlap or catch-up depending on host). Always clearInterval. For animation, prefer requestAnimationFrame. Drift happens; it is not a metronome.",
  "whyExists": "Polling and repeating ticks needed a one-liner. It is a blunt instrument compared to chaining setTimeout after work finishes.",
  "mentalModel": "A repeating alarm. If you are still working when it rings again, the next ring still queues — you can pile up (implementation-dependent).",
  "how": [
    "clearInterval in the same scope that started it.",
    "Prefer recursive setTimeout when each run should wait for completion.",
    "Do not setInterval(async fn) without guarding re-entry.",
    "rAF for visual frames."
  ],
  "callout": {
    "title": "Watch for",
    "text": "async interval callbacks can overlap if each await lasts longer than ms — use a lock or chained timeout.",
    "variant": "warning"
  },
  "example": "let n = 0;\nconst id = setInterval(() => {\n  n += 1;\n  console.log('tick', n);\n  if (n >= 3) clearInterval(id);\n}, 10);\n",
  "exampleCaption": "setInterval with self-clear after 3 ticks",
  "internals": [
    "HTML: if the previous callback is still running, additional timestamps may be coalesced in some browsers.",
    "Still a repeating task source.",
    "clearInterval and clearTimeout are often interchangeable on ids in browsers."
  ],
  "takeaways": [
    "clearInterval in the same scope that started it.",
    "Prefer recursive setTimeout when each run should wait for completion.",
    "async interval callbacks can overlap if each await lasts longer than ms — use a lock or chained timeout.",
    "HTML: if the previous callback is still running, additional timestamps may be coalesced in some browsers."
  ],
  "revision": [
    "setInterval / clearInterval: A repeating alarm. If you are still working when it rings again, the next ring still queues — you can pile up (implementation-dependent).",
    "clearInterval in the same scope that started it.",
    "Prefer recursive setTimeout when each run should wait for completion.",
    "Do not setInterval(async fn) without guarding re-entry.",
    "Trap: async interval callbacks can overlap if each await lasts longer than ms — use a lock or chained timeout."
  ],
  "flashcards": [
    [
      "setInterval / clearInterval",
      "setInterval(fn, ms) queues fn repeatedly."
    ],
    [
      "Mental model",
      "A repeating alarm. If you are still working when it rings again, the next ring still queues — you can pile up (implementation-dependent)."
    ],
    [
      "Common trap",
      "async interval callbacks can overlap if each await lasts longer than ms — use a lock or chained timeout."
    ],
    [
      "clearInterval in the same scope that started it.",
      "Prefer recursive setTimeout when each run should wait for completion."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is setInterval / clearInterval and where does a beginner first see it?",
      "answerHint": "setInterval(fn, ms) queues fn repeatedly. If fn takes longer than ms, browsers may skip or delay (you can get overlap or catch-up depending on host). Always clearInterval. For animation, prefer requestAnimationFrame. Drift happens; it is not a metronome."
    },
    {
      "level": "intermediate",
      "question": "Walk through how setInterval / clearInterval works and name the main pitfall.",
      "answerHint": "clearInterval in the same scope that started it. Prefer recursive setTimeout when each run should wait for completion. Do not setInterval(async fn) without guarding re-entry. rAF for visual frames. Pitfall: async interval callbacks can overlap if each await lasts longer than ms — use a lock or chained timeout."
    },
    {
      "level": "advanced",
      "question": "How would you explain setInterval / clearInterval at an interview, including engine/spec details?",
      "answerHint": "HTML: if the previous callback is still running, additional timestamps may be coalesced in some browsers. Still a repeating task source. clearInterval and clearTimeout are often interchangeable on ids in browsers."
    }
  ],
  "pitfalls": [
    "async interval callbacks can overlap if each await lasts longer than ms — use a lock or chained timeout.",
    "rAF for visual frames."
  ],
  "interview": {
    "expectations": [
      "Explain setInterval / clearInterval without mixing it up with a nearby B1.27 — Timers & Scheduling topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HTML: if the previous callback is still running, additional timestamps may be coalesced in some browsers."
    ],
    "commonQuestions": [
      "What is setInterval / clearInterval?",
      "Why does JavaScript setinterval / clearinterval behave this way?",
      "What is the classic setInterval / clearInterval interview trap?"
    ],
    "traps": [
      "async interval callbacks can overlap if each await lasts longer than ms — use a lock or chained timeout."
    ],
    "misconceptions": [
      "Polling and repeating ticks needed a one-liner. It is a blunt instrument compared to chaining setTimeout after work finishes."
    ],
    "strongSignals": [
      "Separates setInterval / clearInterval from lookalike APIs and can draw the mental model."
    ]
  }
})
