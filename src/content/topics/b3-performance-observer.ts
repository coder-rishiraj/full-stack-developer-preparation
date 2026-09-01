import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Performance Observer",
  "whatIsIt": "PerformanceObserver streams PerformanceEntry records: paint, largest-contentful-paint, layout-shift, longtask, resource, navigation, measure. Use buffered: true to see entries that happened before you subscribed. This is the measurement Web API, not the JS profiler in DevTools. Disconnect when the page component dies.",
  "whyExists": "Core Web Vitals and resource timing needed a standard, privacy-aware way to observe performance events from script.",
  "mentalModel": "A subscribe button on the browser’s stopwatch log. You get typed entries (LCP, CLS, longtask) as they are recorded.",
  "how": [
    "new PerformanceObserver(cb).observe({ type: 'largest-contentful-paint', buffered: true }).",
    "entry.entryType and startTime/duration.",
    "Observe longtask to find main-thread blocks.",
    "Do not log PII from resource URLs carelessly.",
    "performance.mark still creates measure-able marks."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Observing without buffered: true and missing the LCP that already happened at startup.",
    "variant": "warning"
  },
  "example": "const po = new PerformanceObserver((list) => {\n  for (const e of list.getEntries()) console.log(e.entryType, e.name, e.duration);\n});\npo.observe({ type: 'measure', buffered: true });\nperformance.mark('a');\nperformance.mark('b');\nperformance.measure('ab', 'a', 'b');\npo.disconnect();\n",
  "exampleCaption": "Observe User Timing measures including buffered",
  "internals": [
    "Performance Timeline spec; some entry types require origin-trial or limited availability.",
    "longtask entries are coarse for privacy (attribution is limited).",
    "Dropped entries if the observer is too slow — check."
  ],
  "takeaways": [
    "new PerformanceObserver(cb).observe({ type: 'largest-contentful-paint', buffered: true }).",
    "entry.entryType and startTime/duration.",
    "Observing without buffered: true and missing the LCP that already happened at startup.",
    "Performance Timeline spec; some entry types require origin-trial or limited availability."
  ],
  "revision": [
    "Performance Observer: A subscribe button on the browser’s stopwatch log. You get typed entries (LCP, CLS, longtask) as they are recorded.",
    "new PerformanceObserver(cb).observe({ type: 'largest-contentful-paint', buffered: true }).",
    "entry.entryType and startTime/duration.",
    "Observe longtask to find main-thread blocks.",
    "Trap: Observing without buffered: true and missing the LCP that already happened at startup."
  ],
  "flashcards": [
    [
      "Performance Observer",
      "PerformanceObserver streams PerformanceEntry records: paint, largest-contentful-paint, layout-shift, longtask, resource, navigation, measure."
    ],
    [
      "Mental model",
      "A subscribe button on the browser’s stopwatch log. You get typed entries (LCP, CLS, longtask) as they are recorded."
    ],
    [
      "Common trap",
      "Observing without buffered: true and missing the LCP that already happened at startup."
    ],
    [
      "new PerformanceObserver(cb).observe({ type: 'largest-contentful-paint', buffered",
      "entry.entryType and startTime/duration."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Performance Observer and where does a beginner first see it?",
      "answerHint": "PerformanceObserver streams PerformanceEntry records: paint, largest-contentful-paint, layout-shift, longtask, resource, navigation, measure. Use buffered: true to see entries that happened before you subscribed. This is the measurement Web API, not the JS profiler in DevTools. Disconnect when the page component dies."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Performance Observer works and name the main pitfall.",
      "answerHint": "new PerformanceObserver(cb).observe({ type: 'largest-contentful-paint', buffered: true }). entry.entryType and startTime/duration. Observe longtask to find main-thread blocks. Do not log PII from resource URLs carelessly. performance.mark still creates measure-able marks. Pitfall: Observing without buffered: true and missing the LCP that already happened at startup."
    },
    {
      "level": "advanced",
      "question": "How would you explain Performance Observer at an interview, including engine/spec details?",
      "answerHint": "Performance Timeline spec; some entry types require origin-trial or limited availability. longtask entries are coarse for privacy (attribution is limited). Dropped entries if the observer is too slow — check."
    }
  ],
  "pitfalls": [
    "Observing without buffered: true and missing the LCP that already happened at startup.",
    "performance.mark still creates measure-able marks."
  ],
  "interview": {
    "expectations": [
      "Explain Performance Observer without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Performance Timeline spec; some entry types require origin-trial or limited availability."
    ],
    "commonQuestions": [
      "What is Performance Observer?",
      "Why does JavaScript performance observer behave this way?",
      "What is the classic Performance Observer interview trap?"
    ],
    "traps": [
      "Observing without buffered: true and missing the LCP that already happened at startup."
    ],
    "misconceptions": [
      "Core Web Vitals and resource timing needed a standard, privacy-aware way to observe performance events from script."
    ],
    "strongSignals": [
      "Separates Performance Observer from lookalike APIs and can draw the mental model."
    ]
  }
})
