import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Timeouts / Retries / Deduplication",
  "whatIsIt": "Timeouts: race work against a timer (and abort). Retries: loop on failure with backoff (linear/exponential + jitter). Deduplication: share one in-flight promise for the same key so five clicks are one request. Combine: retry only idempotent GETs; do not retry POSTs blindly.",
  "whyExists": "Networks fail and users double-click. These three patterns make I/O robust without melting the server.",
  "mentalModel": "Stop waiting (timeout), try again (retry), and don’t send twins (dedupe). Abort is how timeout becomes real cancel.",
  "how": [
    "Timeout + AbortSignal on fetch.",
    "Exponential backoff with jitter.",
    "Map<key, Promise> for inflight dedupe; delete in finally.",
    "Cap retry count; don’t retry 4xx except 429 with Retry-After."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Retrying a non-idempotent POST creating duplicate orders.",
    "variant": "warning"
  },
  "example": "const inflight = new Map();\nfunction dedupe(key, fn) {\n  if (inflight.has(key)) return inflight.get(key);\n  const p = fn().finally(() => inflight.delete(key));\n  inflight.set(key, p);\n  return p;\n}\nconst p1 = dedupe('u', () => Promise.resolve(1));\nconst p2 = dedupe('u', () => Promise.resolve(2));\nconsole.log(p1 === p2, await p1);\n",
  "exampleCaption": "In-flight promise deduplication by key",
  "internals": [
    "Dedupe relies on Promise identity sharing.",
    "finally removes the cache even on reject so the next call retries.",
    "Timeouts are just another reject reason — distinguish AbortError."
  ],
  "takeaways": [
    "Timeout + AbortSignal on fetch.",
    "Exponential backoff with jitter.",
    "Retrying a non-idempotent POST creating duplicate orders.",
    "Dedupe relies on Promise identity sharing."
  ],
  "revision": [
    "Timeouts / Retries / Deduplication: Stop waiting (timeout), try again (retry), and don’t send twins (dedupe). Abort is how timeout becomes real cancel.",
    "Timeout + AbortSignal on fetch.",
    "Exponential backoff with jitter.",
    "Map<key, Promise> for inflight dedupe; delete in finally.",
    "Trap: Retrying a non-idempotent POST creating duplicate orders."
  ],
  "flashcards": [
    [
      "Timeouts / Retries / Deduplication",
      "Timeouts: race work against a timer (and abort)."
    ],
    [
      "Mental model",
      "Stop waiting (timeout), try again (retry), and don’t send twins (dedupe). Abort is how timeout becomes real cancel."
    ],
    [
      "Common trap",
      "Retrying a non-idempotent POST creating duplicate orders."
    ],
    [
      "Timeout + AbortSignal on fetch.",
      "Exponential backoff with jitter."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Timeouts / Retries / Deduplication and where does a beginner first see it?",
      "answerHint": "Timeouts: race work against a timer (and abort). Retries: loop on failure with backoff (linear/exponential + jitter). Deduplication: share one in-flight promise for the same key so five clicks are one request. Combine: retry only idempotent GETs; do not retry POSTs blindly."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Timeouts / Retries / Deduplication works and name the main pitfall.",
      "answerHint": "Timeout + AbortSignal on fetch. Exponential backoff with jitter. Map<key, Promise> for inflight dedupe; delete in finally. Cap retry count; don’t retry 4xx except 429 with Retry-After. Pitfall: Retrying a non-idempotent POST creating duplicate orders."
    },
    {
      "level": "advanced",
      "question": "How would you explain Timeouts / Retries / Deduplication at an interview, including engine/spec details?",
      "answerHint": "Dedupe relies on Promise identity sharing. finally removes the cache even on reject so the next call retries. Timeouts are just another reject reason — distinguish AbortError."
    }
  ],
  "pitfalls": [
    "Retrying a non-idempotent POST creating duplicate orders.",
    "Cap retry count; don’t retry 4xx except 429 with Retry-After."
  ],
  "interview": {
    "expectations": [
      "Explain Timeouts / Retries / Deduplication without mixing it up with a nearby B1.31 — Async Cancellation & Coordination topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Dedupe relies on Promise identity sharing."
    ],
    "commonQuestions": [
      "What is Timeouts / Retries / Deduplication?",
      "Why does JavaScript timeouts / retries / deduplication behave this way?",
      "What is the classic Timeouts / Retries / Deduplication interview trap?"
    ],
    "traps": [
      "Retrying a non-idempotent POST creating duplicate orders."
    ],
    "misconceptions": [
      "Networks fail and users double-click. These three patterns make I/O robust without melting the server."
    ],
    "strongSignals": [
      "Separates Timeouts / Retries / Deduplication from lookalike APIs and can draw the mental model."
    ]
  }
})
