import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Promise.allSettled",
  "whatIsIt": "Promise.allSettled waits for every input to settle and fulfills with {status:'fulfilled', value} or {status:'rejected', reason} per index. It does not reject (unless creating the list throws). Use it for ‘run all, then report.’ Empty → [].",
  "whyExists": "Dashboards and batch jobs need all outcomes, not fail-fast. allSettled is that report card.",
  "mentalModel": "Wait for every student to finish the test, then publish every score and every absence.",
  "how": [
    "allSettled then filter status.",
    "Do not confuse with all — allSettled never fail-fasts.",
    "Still does not cancel anything.",
    "TypeScript: discriminated union on status."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Checking r.value without checking status — rejected entries have reason, not value.",
    "variant": "warning"
  },
  "example": "const r = await Promise.allSettled([\n  Promise.resolve(1),\n  Promise.reject(new Error('no')),\n]);\nconsole.log(r.map((x) => x.status));\nconsole.log(r[0].value, r[1].reason.message);\n",
  "exampleCaption": "fulfilled and rejected entries side by side",
  "internals": [
    "Always fulfills the outer promise (for valid iterables).",
    "Same indexing as all.",
    "Added in ES2020; polyfills exist."
  ],
  "takeaways": [
    "allSettled then filter status.",
    "Do not confuse with all — allSettled never fail-fasts.",
    "Checking r.value without checking status — rejected entries have reason, not value.",
    "Always fulfills the outer promise (for valid iterables)."
  ],
  "revision": [
    "Promise.allSettled: Wait for every student to finish the test, then publish every score and every absence.",
    "allSettled then filter status.",
    "Do not confuse with all — allSettled never fail-fasts.",
    "Still does not cancel anything.",
    "Trap: Checking r.value without checking status — rejected entries have reason, not value."
  ],
  "flashcards": [
    [
      "Promise.allSettled",
      "Promise.allSettled waits for every input to settle and fulfills with {status:'fulfilled', value} or {status:'rejected', reason} per index."
    ],
    [
      "Mental model",
      "Wait for every student to finish the test, then publish every score and every absence."
    ],
    [
      "Common trap",
      "Checking r.value without checking status — rejected entries have reason, not value."
    ],
    [
      "allSettled then filter status.",
      "Do not confuse with all — allSettled never fail-fasts."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Promise.allSettled and where does a beginner first see it?",
      "answerHint": "Promise.allSettled waits for every input to settle and fulfills with {status:'fulfilled', value} or {status:'rejected', reason} per index. It does not reject (unless creating the list throws). Use it for ‘run all, then report.’ Empty → []."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Promise.allSettled works and name the main pitfall.",
      "answerHint": "allSettled then filter status. Do not confuse with all — allSettled never fail-fasts. Still does not cancel anything. TypeScript: discriminated union on status. Pitfall: Checking r.value without checking status — rejected entries have reason, not value."
    },
    {
      "level": "advanced",
      "question": "How would you explain Promise.allSettled at an interview, including engine/spec details?",
      "answerHint": "Always fulfills the outer promise (for valid iterables). Same indexing as all. Added in ES2020; polyfills exist."
    }
  ],
  "pitfalls": [
    "Checking r.value without checking status — rejected entries have reason, not value.",
    "TypeScript: discriminated union on status."
  ],
  "interview": {
    "expectations": [
      "Explain Promise.allSettled without mixing it up with a nearby B1.29 — Promises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Always fulfills the outer promise (for valid iterables)."
    ],
    "commonQuestions": [
      "What is Promise.allSettled?",
      "Why does JavaScript promise.allsettled behave this way?",
      "What is the classic Promise.allSettled interview trap?"
    ],
    "traps": [
      "Checking r.value without checking status — rejected entries have reason, not value."
    ],
    "misconceptions": [
      "Dashboards and batch jobs need all outcomes, not fail-fast. allSettled is that report card."
    ],
    "strongSignals": [
      "Separates Promise.allSettled from lookalike APIs and can draw the mental model."
    ]
  }
})
