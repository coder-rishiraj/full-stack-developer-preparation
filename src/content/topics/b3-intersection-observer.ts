import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Intersection Observer",
  "whatIsIt": "IntersectionObserver asynchronously reports when a target’s visibility vs a root (viewport or element) crosses thresholds. Callback receives entries with intersectionRatio, boundingClientRect, isIntersecting. Use for lazy images, infinite scroll, ad viewability. It is not a poll of getBoundingClientRect on scroll (cheaper).",
  "whyExists": "Scroll listeners + layout reads caused jank. The browser can compute intersections off the critical path and batch callbacks.",
  "mentalModel": "A lookout that pings you when a box enters or leaves a window (the root), not on every pixel of scroll.",
  "how": [
    "new IntersectionObserver(cb, { root, rootMargin, threshold }).",
    "observer.observe(el); disconnect on unmount.",
    "threshold: 0, 0.25, 1 or an array.",
    "Do not assume callback order equals DOM order.",
    "root: null means viewport."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Keeping the observer without disconnect after removing nodes — callbacks and references can leak.",
    "variant": "warning"
  },
  "example": "const io = new IntersectionObserver((entries) => {\n  for (const e of entries) console.log(e.isIntersecting, e.intersectionRatio);\n}, { threshold: 0.25 });\nconst el = document.createElement('div');\ndocument.body?.append(el);\nio.observe(el);\nio.disconnect();\nel.remove();\n",
  "exampleCaption": "Observe an element at 25% visibility, then disconnect",
  "internals": [
    "HTML spec: IntersectionObserver, queued as a microtask-ish delivery (specified as a task).",
    "rootMargin can grow/shrink the root box like CSS margin.",
    "Cross-origin iframes have restrictions on root."
  ],
  "takeaways": [
    "new IntersectionObserver(cb, { root, rootMargin, threshold }).",
    "observer.observe(el); disconnect on unmount.",
    "Keeping the observer without disconnect after removing nodes — callbacks and references can leak.",
    "HTML spec: IntersectionObserver, queued as a microtask-ish delivery (specified as a task)."
  ],
  "revision": [
    "Intersection Observer: A lookout that pings you when a box enters or leaves a window (the root), not on every pixel of scroll.",
    "new IntersectionObserver(cb, { root, rootMargin, threshold }).",
    "observer.observe(el); disconnect on unmount.",
    "threshold: 0, 0.25, 1 or an array.",
    "Trap: Keeping the observer without disconnect after removing nodes — callbacks and references can leak."
  ],
  "flashcards": [
    [
      "Intersection Observer",
      "IntersectionObserver asynchronously reports when a target’s visibility vs a root (viewport or element) crosses thresholds."
    ],
    [
      "Mental model",
      "A lookout that pings you when a box enters or leaves a window (the root), not on every pixel of scroll."
    ],
    [
      "Common trap",
      "Keeping the observer without disconnect after removing nodes — callbacks and references can leak."
    ],
    [
      "new IntersectionObserver(cb, { root, rootMargin, threshold }).",
      "observer.observe(el); disconnect on unmount."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Intersection Observer and where does a beginner first see it?",
      "answerHint": "IntersectionObserver asynchronously reports when a target’s visibility vs a root (viewport or element) crosses thresholds. Callback receives entries with intersectionRatio, boundingClientRect, isIntersecting. Use for lazy images, infinite scroll, ad viewability. It is not a poll of getBoundingClientRect on scroll (cheaper)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Intersection Observer works and name the main pitfall.",
      "answerHint": "new IntersectionObserver(cb, { root, rootMargin, threshold }). observer.observe(el); disconnect on unmount. threshold: 0, 0.25, 1 or an array. Do not assume callback order equals DOM order. root: null means viewport. Pitfall: Keeping the observer without disconnect after removing nodes — callbacks and references can leak."
    },
    {
      "level": "advanced",
      "question": "How would you explain Intersection Observer at an interview, including engine/spec details?",
      "answerHint": "HTML spec: IntersectionObserver, queued as a microtask-ish delivery (specified as a task). rootMargin can grow/shrink the root box like CSS margin. Cross-origin iframes have restrictions on root."
    }
  ],
  "pitfalls": [
    "Keeping the observer without disconnect after removing nodes — callbacks and references can leak.",
    "root: null means viewport."
  ],
  "interview": {
    "expectations": [
      "Explain Intersection Observer without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HTML spec: IntersectionObserver, queued as a microtask-ish delivery (specified as a task)."
    ],
    "commonQuestions": [
      "What is Intersection Observer?",
      "Why does JavaScript intersection observer behave this way?",
      "What is the classic Intersection Observer interview trap?"
    ],
    "traps": [
      "Keeping the observer without disconnect after removing nodes — callbacks and references can leak."
    ],
    "misconceptions": [
      "Scroll listeners + layout reads caused jank. The browser can compute intersections off the critical path and batch callbacks."
    ],
    "strongSignals": [
      "Separates Intersection Observer from lookalike APIs and can draw the mental model."
    ]
  }
})
