import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Performance & Memory Profiling Basics",
  "whatIsIt": "Performance profiler: CPU flame charts of JS + rendering. Memory: heap snapshots, allocation timelines, leak detection (growing detached nodes). Performance marks/measures (User Timing API) instrument your code. Profile production-like builds; React Dev Mode lies. Long tasks (>50ms) are a Core Web Vital concern.",
  "whyExists": "‘It feels slow’ needs evidence: CPU, layout, network, or leaks. Guessing wastes weeks.",
  "mentalModel": "A stopwatch (performance) and a warehouse inventory (memory). Flame charts are stacks over time.",
  "how": [
    "Record while reproducing the jank.",
    "Look for yellow (JS) vs purple (layout) in some UIs.",
    "Take two heap snapshots and compare.",
    "performance.mark / measure around suspects."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Profiling with DevTools open and React Strict Mode double-rendering — numbers are not production.",
    "variant": "warning"
  },
  "example": "performance.mark('start');\nlet s = 0;\nfor (let i = 0; i < 1e6; i++) s += i;\nperformance.mark('end');\nperformance.measure('sum', 'start', 'end');\nconsole.log(s, performance.getEntriesByName('sum')[0]?.duration);\n",
  "exampleCaption": "User Timing marks around a CPU loop",
  "internals": [
    "User Timing is a Web API on performance.",
    "Sampling profilers interrupt the engine; they miss very short functions sometimes.",
    "Heap snapshots walk GC roots and retainers."
  ],
  "takeaways": [
    "Record while reproducing the jank.",
    "Look for yellow (JS) vs purple (layout) in some UIs.",
    "Profiling with DevTools open and React Strict Mode double-rendering — numbers are not production.",
    "User Timing is a Web API on performance."
  ],
  "revision": [
    "Performance & Memory Profiling Basics: A stopwatch (performance) and a warehouse inventory (memory). Flame charts are stacks over time.",
    "Record while reproducing the jank.",
    "Look for yellow (JS) vs purple (layout) in some UIs.",
    "Take two heap snapshots and compare.",
    "Trap: Profiling with DevTools open and React Strict Mode double-rendering — numbers are not production."
  ],
  "flashcards": [
    [
      "Performance & Memory Profiling Basics",
      "Performance profiler: CPU flame charts of JS + rendering."
    ],
    [
      "Mental model",
      "A stopwatch (performance) and a warehouse inventory (memory). Flame charts are stacks over time."
    ],
    [
      "Common trap",
      "Profiling with DevTools open and React Strict Mode double-rendering — numbers are not production."
    ],
    [
      "Record while reproducing the jank.",
      "Look for yellow (JS) vs purple (layout) in some UIs."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Performance & Memory Profiling Basics and where does a beginner first see it?",
      "answerHint": "Performance profiler: CPU flame charts of JS + rendering. Memory: heap snapshots, allocation timelines, leak detection (growing detached nodes). Performance marks/measures (User Timing API) instrument your code. Profile production-like builds; React Dev Mode lies. Long tasks (>50ms) are a Core Web Vital concern."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Performance & Memory Profiling Basics works and name the main pitfall.",
      "answerHint": "Record while reproducing the jank. Look for yellow (JS) vs purple (layout) in some UIs. Take two heap snapshots and compare. performance.mark / measure around suspects. Pitfall: Profiling with DevTools open and React Strict Mode double-rendering — numbers are not production."
    },
    {
      "level": "advanced",
      "question": "How would you explain Performance & Memory Profiling Basics at an interview, including engine/spec details?",
      "answerHint": "User Timing is a Web API on performance. Sampling profilers interrupt the engine; they miss very short functions sometimes. Heap snapshots walk GC roots and retainers."
    }
  ],
  "pitfalls": [
    "Profiling with DevTools open and React Strict Mode double-rendering — numbers are not production.",
    "performance.mark / measure around suspects."
  ],
  "interview": {
    "expectations": [
      "Explain Performance & Memory Profiling Basics without mixing it up with a nearby B1.33 — Debugging topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "User Timing is a Web API on performance."
    ],
    "commonQuestions": [
      "What is Performance & Memory Profiling Basics?",
      "Why does JavaScript performance & memory profiling basics behave this way?",
      "What is the classic Performance & Memory Profiling Basics interview trap?"
    ],
    "traps": [
      "Profiling with DevTools open and React Strict Mode double-rendering — numbers are not production."
    ],
    "misconceptions": [
      "‘It feels slow’ needs evidence: CPU, layout, network, or leaks. Guessing wastes weeks."
    ],
    "strongSignals": [
      "Separates Performance & Memory Profiling Basics from lookalike APIs and can draw the mental model."
    ]
  }
})
