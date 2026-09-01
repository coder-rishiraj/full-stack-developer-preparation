import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Heap",
  "whatIsIt": "The heap is where objects, closures’ environments, and large data live. The stack holds frames and primitives-in-progress. ‘Heap snapshot’ in DevTools shows objects that GC has not collected. Leaks are reachability from roots (window, closures, DOM), not ‘the heap is broken.’",
  "whyExists": "Dynamic objects cannot all live on a stack that pops. A garbage-collected heap is the storage for identity and closures.",
  "mentalModel": "Stack = short-term plates. Heap = warehouse of objects with reference arrows. GC sweeps unreferenced warehouse aisles.",
  "how": [
    "Objects, arrays, functions live on the heap.",
    "Closed-over lets live in heap environment records.",
    "Take heap snapshots to find detached DOM + listeners.",
    "Large TypedArrays are heap (or backing store) too."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Setting a global to a huge object ‘temporarily’ and forgetting — it stays until you null the global.",
    "variant": "warning"
  },
  "example": "function make() {\n  const bulky = new Array(1000).fill(0);\n  return () => bulky.length;\n}\nconst fn = make();\nconsole.log(fn());\n",
  "exampleCaption": "Closed-over array lives on the heap with the function",
  "internals": [
    "GC roots: stack, globals, handles from the host (DOM).",
    "V8 young/old generation heap spaces.",
    "Environment records are heap objects when escaped."
  ],
  "takeaways": [
    "Objects, arrays, functions live on the heap.",
    "Closed-over lets live in heap environment records.",
    "Setting a global to a huge object ‘temporarily’ and forgetting — it stays until you null the global.",
    "GC roots: stack, globals, handles from the host (DOM)."
  ],
  "revision": [
    "Heap: Stack = short-term plates. Heap = warehouse of objects with reference arrows. GC sweeps unreferenced warehouse aisles.",
    "Objects, arrays, functions live on the heap.",
    "Closed-over lets live in heap environment records.",
    "Take heap snapshots to find detached DOM + listeners.",
    "Trap: Setting a global to a huge object ‘temporarily’ and forgetting — it stays until you null the global."
  ],
  "flashcards": [
    [
      "Heap",
      "The heap is where objects, closures’ environments, and large data live."
    ],
    [
      "Mental model",
      "Stack = short-term plates. Heap = warehouse of objects with reference arrows. GC sweeps unreferenced warehouse aisles."
    ],
    [
      "Common trap",
      "Setting a global to a huge object ‘temporarily’ and forgetting — it stays until you null the global."
    ],
    [
      "Objects, arrays, functions live on the heap.",
      "Closed-over lets live in heap environment records."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Heap and where does a beginner first see it?",
      "answerHint": "The heap is where objects, closures’ environments, and large data live. The stack holds frames and primitives-in-progress. ‘Heap snapshot’ in DevTools shows objects that GC has not collected. Leaks are reachability from roots (window, closures, DOM), not ‘the heap is broken.’"
    },
    {
      "level": "intermediate",
      "question": "Walk through how Heap works and name the main pitfall.",
      "answerHint": "Objects, arrays, functions live on the heap. Closed-over lets live in heap environment records. Take heap snapshots to find detached DOM + listeners. Large TypedArrays are heap (or backing store) too. Pitfall: Setting a global to a huge object ‘temporarily’ and forgetting — it stays until you null the global."
    },
    {
      "level": "advanced",
      "question": "How would you explain Heap at an interview, including engine/spec details?",
      "answerHint": "GC roots: stack, globals, handles from the host (DOM). V8 young/old generation heap spaces. Environment records are heap objects when escaped."
    }
  ],
  "pitfalls": [
    "Setting a global to a huge object ‘temporarily’ and forgetting — it stays until you null the global.",
    "Large TypedArrays are heap (or backing store) too."
  ],
  "interview": {
    "expectations": [
      "Explain Heap without mixing it up with a nearby B1.25 — JavaScript Runtime & Engine topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "GC roots: stack, globals, handles from the host (DOM)."
    ],
    "commonQuestions": [
      "What is Heap?",
      "Why does JavaScript heap behave this way?",
      "What is the classic Heap interview trap?"
    ],
    "traps": [
      "Setting a global to a huge object ‘temporarily’ and forgetting — it stays until you null the global."
    ],
    "misconceptions": [
      "Dynamic objects cannot all live on a stack that pops. A garbage-collected heap is the storage for identity and closures."
    ],
    "strongSignals": [
      "Separates Heap from lookalike APIs and can draw the mental model."
    ]
  }
})
