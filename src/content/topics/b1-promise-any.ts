import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Promise.any",
  "whatIsIt": "Promise.any fulfills with the first fulfillment. If all reject, it rejects with AggregateError (errors array). Empty any rejects with AggregateError immediately. It ignores rejections until all have failed. Still no cancel of slower successes.",
  "whyExists": "Mirrors / CDNs: first successful response wins; failures should not fail-fast like race.",
  "mentalModel": "First rose that blooms. If the whole garden dies, you get a bouquet of errors (AggregateError).",
  "how": [
    "any([primary, mirror]) for redundant I/O.",
    "Inspect err.errors in the catch.",
    "Empty array rejects — not pending.",
    "Not the same as race (race can reject first)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using race instead of any: a fast rejection kills you even if a slower success would have saved the page.",
    "variant": "warning"
  },
  "example": "try {\n  const v = await Promise.any([\n    Promise.reject(new Error('a')),\n    Promise.resolve('ok'),\n  ]);\n  console.log(v);\n} catch (e) { console.log(e); }\ntry {\n  await Promise.any([Promise.reject(new Error('x'))]);\n} catch (e) { console.log(e.name, e.errors[0].message); }\n",
  "exampleCaption": "First fulfillment wins; all reject → AggregateError",
  "internals": [
    "PerformPromiseAny counts remaining rejections.",
    "AggregateError is an Error with an errors list.",
    "Fulfill short-circuits the result; other promises continue."
  ],
  "takeaways": [
    "any([primary, mirror]) for redundant I/O.",
    "Inspect err.errors in the catch.",
    "Using race instead of any: a fast rejection kills you even if a slower success would have saved the page.",
    "PerformPromiseAny counts remaining rejections."
  ],
  "revision": [
    "Promise.any: First rose that blooms. If the whole garden dies, you get a bouquet of errors (AggregateError).",
    "any([primary, mirror]) for redundant I/O.",
    "Inspect err.errors in the catch.",
    "Empty array rejects — not pending.",
    "Trap: Using race instead of any: a fast rejection kills you even if a slower success would have saved the page."
  ],
  "flashcards": [
    [
      "Promise.any",
      "Promise.any fulfills with the first fulfillment."
    ],
    [
      "Mental model",
      "First rose that blooms. If the whole garden dies, you get a bouquet of errors (AggregateError)."
    ],
    [
      "Common trap",
      "Using race instead of any: a fast rejection kills you even if a slower success would have saved the page."
    ],
    [
      "any([primary, mirror]) for redundant I/O.",
      "Inspect err.errors in the catch."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Promise.any and where does a beginner first see it?",
      "answerHint": "Promise.any fulfills with the first fulfillment. If all reject, it rejects with AggregateError (errors array). Empty any rejects with AggregateError immediately. It ignores rejections until all have failed. Still no cancel of slower successes."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Promise.any works and name the main pitfall.",
      "answerHint": "any([primary, mirror]) for redundant I/O. Inspect err.errors in the catch. Empty array rejects — not pending. Not the same as race (race can reject first). Pitfall: Using race instead of any: a fast rejection kills you even if a slower success would have saved the page."
    },
    {
      "level": "advanced",
      "question": "How would you explain Promise.any at an interview, including engine/spec details?",
      "answerHint": "PerformPromiseAny counts remaining rejections. AggregateError is an Error with an errors list. Fulfill short-circuits the result; other promises continue."
    }
  ],
  "pitfalls": [
    "Using race instead of any: a fast rejection kills you even if a slower success would have saved the page.",
    "Not the same as race (race can reject first)."
  ],
  "interview": {
    "expectations": [
      "Explain Promise.any without mixing it up with a nearby B1.29 — Promises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "PerformPromiseAny counts remaining rejections."
    ],
    "commonQuestions": [
      "What is Promise.any?",
      "Why does JavaScript promise.any behave this way?",
      "What is the classic Promise.any interview trap?"
    ],
    "traps": [
      "Using race instead of any: a fast rejection kills you even if a slower success would have saved the page."
    ],
    "misconceptions": [
      "Mirrors / CDNs: first successful response wins; failures should not fail-fast like race."
    ],
    "strongSignals": [
      "Separates Promise.any from lookalike APIs and can draw the mental model."
    ]
  }
})
