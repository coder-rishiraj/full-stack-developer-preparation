import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement retry / sleep / concurrency limiter",
  "whatIsIt": "sleep(ms) is new Promise(r => setTimeout(r, ms)). retry(fn, {times, delay, backoff}) loops await fn(), on throw await sleep, multiply delay. Concurrency limiter: queue + active count as in the limiter topic. Implement from scratch with promises, not libraries. AbortSignal can break the loop.",
  "whyExists": "Network robustness is a practical async interview: sleep is the primitive, retry and pooling compose it.",
  "mentalModel": "sleep = timer wrapped in a promise. retry = for-loop with catch and wait. limiter = nightclub door from before.",
  "how": [
    "sleep: Promise + setTimeout; clear on abort.",
    "retry: for i in 1..n try return await fn() catch store; await sleep(delay); delay*=2.",
    "Do not retry if signal.aborted.",
    "limiter finally decrements active.",
    "Jitter: delay * (0.5 + Math.random()/2)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "retry(fn) where fn is not a function that returns a new promise each time — reusing a rejected promise never succeeds.",
    "variant": "warning"
  },
  "example": "const sleep = (ms) => new Promise((r) => setTimeout(r, ms));\nasync function retry(fn, times = 3, delay = 5) {\n  let last;\n  for (let i = 0; i < times; i++) {\n    try { return await fn(); } catch (e) { last = e; await sleep(delay); }\n  }\n  throw last;\n}\nlet n = 0;\nconsole.log(await retry(async () => { if (++n < 2) throw new Error('x'); return n; }));\nawait sleep(1);\nconsole.log('slept');\n",
  "exampleCaption": "sleep helper and retry until success",
  "internals": [
    "A rejected promise is settled forever; retry must call fn again.",
    "setTimeout ids should be cleared if you abort sleep.",
    "Backoff without cap can sleep for minutes — cap delay."
  ],
  "takeaways": [
    "sleep: Promise + setTimeout; clear on abort.",
    "retry: for i in 1..n try return await fn() catch store; await sleep(delay); delay*=2.",
    "retry(fn) where fn is not a function that returns a new promise each time — reusing a rejected promise never succeeds.",
    "A rejected promise is settled forever; retry must call fn again."
  ],
  "revision": [
    "Implement retry / sleep / concurrency limiter: sleep = timer wrapped in a promise. retry = for-loop with catch and wait. limiter = nightclub door from before.",
    "sleep: Promise + setTimeout; clear on abort.",
    "retry: for i in 1..n try return await fn() catch store; await sleep(delay); delay*=2.",
    "Do not retry if signal.aborted.",
    "Trap: retry(fn) where fn is not a function that returns a new promise each time — reusing a rejected promise never succeeds."
  ],
  "flashcards": [
    [
      "Implement retry / sleep / concurrency limiter",
      "sleep(ms) is new Promise(r => setTimeout(r, ms))."
    ],
    [
      "Mental model",
      "sleep = timer wrapped in a promise. retry = for-loop with catch and wait. limiter = nightclub door from before."
    ],
    [
      "Common trap",
      "retry(fn) where fn is not a function that returns a new promise each time — reusing a rejected promise never succeeds."
    ],
    [
      "sleep: Promise + setTimeout; clear on abort.",
      "retry: for i in 1..n try return await fn() catch store; await sleep(delay); delay*=2."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement retry / sleep / concurrency limiter and where does a beginner first see it?",
      "answerHint": "sleep(ms) is new Promise(r => setTimeout(r, ms)). retry(fn, {times, delay, backoff}) loops await fn(), on throw await sleep, multiply delay. Concurrency limiter: queue + active count as in the limiter topic. Implement from scratch with promises, not libraries. AbortSignal can break the loop."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement retry / sleep / concurrency limiter works and name the main pitfall.",
      "answerHint": "sleep: Promise + setTimeout; clear on abort. retry: for i in 1..n try return await fn() catch store; await sleep(delay); delay*=2. Do not retry if signal.aborted. limiter finally decrements active. Jitter: delay * (0.5 + Math.random()/2). Pitfall: retry(fn) where fn is not a function that returns a new promise each time — reusing a rejected promise never succeeds."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement retry / sleep / concurrency limiter at an interview, including engine/spec details?",
      "answerHint": "A rejected promise is settled forever; retry must call fn again. setTimeout ids should be cleared if you abort sleep. Backoff without cap can sleep for minutes — cap delay."
    }
  ],
  "pitfalls": [
    "retry(fn) where fn is not a function that returns a new promise each time — reusing a rejected promise never succeeds.",
    "Jitter: delay * (0.5 + Math.random()/2)."
  ],
  "interview": {
    "expectations": [
      "Explain Implement retry / sleep / concurrency limiter without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "A rejected promise is settled forever; retry must call fn again."
    ],
    "commonQuestions": [
      "What is Implement retry / sleep / concurrency limiter?",
      "Why does JavaScript implement retry / sleep / concurrency limiter behave this way?",
      "What is the classic Implement retry / sleep / concurrency limiter interview trap?"
    ],
    "traps": [
      "retry(fn) where fn is not a function that returns a new promise each time — reusing a rejected promise never succeeds."
    ],
    "misconceptions": [
      "Network robustness is a practical async interview: sleep is the primitive, retry and pooling compose it."
    ],
    "strongSignals": [
      "Separates Implement retry / sleep / concurrency limiter from lookalike APIs and can draw the mental model."
    ]
  }
})
