import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Common Memory Leaks",
  "whatIsIt": "Common JS leaks: detached DOM still in a closure, forgotten setInterval, global caches, EventEmitter without off, Map keyed by objects you also keep, console logs holding objects in DevTools, detached listeners with old handlers. Not a leak: memory that grows then flats under GC of short-lived objects.",
  "whyExists": "SPAs run for days. A listener per navigation without teardown is a classic leak graph in heap snapshots.",
  "mentalModel": "A balloon tied to a forgotten fence post (global, listener list, timer table). GC cannot cut that string.",
  "how": [
    "Cleanup in the same place you subscribe (useEffect return).",
    "clearInterval / removeEventListener with the same function identity.",
    "Bound caches (LRU).",
    "Take heap snapshots: detached HTMLDivElement is a clue."
  ],
  "callout": {
    "title": "Watch for",
    "text": "removeEventListener('click', () => this.fn()) cannot remove — new arrow every time.",
    "variant": "warning"
  },
  "example": "const leaks = [];\nfunction mount() {\n  const huge = new Array(10000).fill(0);\n  const on = () => huge.length;\n  leaks.push(on);\n  return () => {\n    const i = leaks.indexOf(on);\n    if (i >= 0) leaks.splice(i, 1);\n  };\n}\nconst off = mount();\noff();\nconsole.log(leaks.length);\n",
  "exampleCaption": "Register and unregister a callback that closed over a big array",
  "internals": [
    "Host listener lists are strong roots.",
    "Timer tables hold the callback closure.",
    "DevTools retainers panel shows the path from GC root."
  ],
  "takeaways": [
    "Cleanup in the same place you subscribe (useEffect return).",
    "clearInterval / removeEventListener with the same function identity.",
    "removeEventListener('click', () => this.fn()) cannot remove — new arrow every time.",
    "Host listener lists are strong roots."
  ],
  "revision": [
    "Common Memory Leaks: A balloon tied to a forgotten fence post (global, listener list, timer table). GC cannot cut that string.",
    "Cleanup in the same place you subscribe (useEffect return).",
    "clearInterval / removeEventListener with the same function identity.",
    "Bound caches (LRU).",
    "Trap: removeEventListener('click', () => this.fn()) cannot remove — new arrow every time."
  ],
  "flashcards": [
    [
      "Common Memory Leaks",
      "Common JS leaks: detached DOM still in a closure, forgotten setInterval, global caches, EventEmitter without off, Map keyed by objects you also keep, console logs holding objects in DevTools, detached listeners with old handlers."
    ],
    [
      "Mental model",
      "A balloon tied to a forgotten fence post (global, listener list, timer table). GC cannot cut that string."
    ],
    [
      "Common trap",
      "removeEventListener('click', () => this.fn()) cannot remove — new arrow every time."
    ],
    [
      "Cleanup in the same place you subscribe (useEffect return).",
      "clearInterval / removeEventListener with the same function identity."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Common Memory Leaks and where does a beginner first see it?",
      "answerHint": "Common JS leaks: detached DOM still in a closure, forgotten setInterval, global caches, EventEmitter without off, Map keyed by objects you also keep, console logs holding objects in DevTools, detached listeners with old handlers. Not a leak: memory that grows then flats under GC of short-lived objects."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Common Memory Leaks works and name the main pitfall.",
      "answerHint": "Cleanup in the same place you subscribe (useEffect return). clearInterval / removeEventListener with the same function identity. Bound caches (LRU). Take heap snapshots: detached HTMLDivElement is a clue. Pitfall: removeEventListener('click', () => this.fn()) cannot remove — new arrow every time."
    },
    {
      "level": "advanced",
      "question": "How would you explain Common Memory Leaks at an interview, including engine/spec details?",
      "answerHint": "Host listener lists are strong roots. Timer tables hold the callback closure. DevTools retainers panel shows the path from GC root."
    }
  ],
  "pitfalls": [
    "removeEventListener('click', () => this.fn()) cannot remove — new arrow every time.",
    "Take heap snapshots: detached HTMLDivElement is a clue."
  ],
  "interview": {
    "expectations": [
      "Explain Common Memory Leaks without mixing it up with a nearby B1.39 — Memory Management & Garbage Collection topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Host listener lists are strong roots."
    ],
    "commonQuestions": [
      "What is Common Memory Leaks?",
      "Why does JavaScript common memory leaks behave this way?",
      "What is the classic Common Memory Leaks interview trap?"
    ],
    "traps": [
      "removeEventListener('click', () => this.fn()) cannot remove — new arrow every time."
    ],
    "misconceptions": [
      "SPAs run for days. A listener per navigation without teardown is a classic leak graph in heap snapshots."
    ],
    "strongSignals": [
      "Separates Common Memory Leaks from lookalike APIs and can draw the mental model."
    ]
  }
})
