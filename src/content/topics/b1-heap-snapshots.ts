import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Heap Snapshots",
  "whatIsIt": "A heap snapshot is a dump of objects, sizes, and retainers. Compare snapshots to see what grew. Look for Detached DOM, increasing (string) counts, and unexpected retainer paths (Window → listener → closure → node). Allocation instrumentation records who allocated. Snapshots are large; take them after GC.",
  "whyExists": "‘I think it leaks’ is not a diagnosis. Snapshots show the retaining path.",
  "mentalModel": "A census of the warehouse plus ‘who is holding this box?’ arrows. Compare two censuses to see new boxes.",
  "how": [
    "Reproduce, take snapshot, repeat action, snapshot again, compare.",
    "Filter Detached.",
    "Read retainer path from the leak suspect to Window.",
    "Ignore noise from DevTools itself when possible."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Comparing snapshots with DevTools console holding the old object — you are the retainer.",
    "variant": "warning"
  },
  "example": "function leaky() {\n  const el = { tag: 'div', listeners: [] };\n  el.listeners.push(() => el);\n  return el;\n}\nconst held = leaky();\nconsole.log(held.tag, held.listeners.length);\n",
  "exampleCaption": "A toy cycle DOM-like node ↔ listener (still rooted by held)",
  "internals": [
    "Snapshots walk the heap via debugger protocol.",
    "Shallow vs retained size: retained is ‘if I drop this, how much dies.’",
    "Dominator trees summarize retainers."
  ],
  "takeaways": [
    "Reproduce, take snapshot, repeat action, snapshot again, compare.",
    "Filter Detached.",
    "Comparing snapshots with DevTools console holding the old object — you are the retainer.",
    "Snapshots walk the heap via debugger protocol."
  ],
  "revision": [
    "Heap Snapshots: A census of the warehouse plus ‘who is holding this box?’ arrows. Compare two censuses to see new boxes.",
    "Reproduce, take snapshot, repeat action, snapshot again, compare.",
    "Filter Detached.",
    "Read retainer path from the leak suspect to Window.",
    "Trap: Comparing snapshots with DevTools console holding the old object — you are the retainer."
  ],
  "flashcards": [
    [
      "Heap Snapshots",
      "A heap snapshot is a dump of objects, sizes, and retainers."
    ],
    [
      "Mental model",
      "A census of the warehouse plus ‘who is holding this box?’ arrows. Compare two censuses to see new boxes."
    ],
    [
      "Common trap",
      "Comparing snapshots with DevTools console holding the old object — you are the retainer."
    ],
    [
      "Reproduce, take snapshot, repeat action, snapshot again, compare.",
      "Filter Detached."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Heap Snapshots and where does a beginner first see it?",
      "answerHint": "A heap snapshot is a dump of objects, sizes, and retainers. Compare snapshots to see what grew. Look for Detached DOM, increasing (string) counts, and unexpected retainer paths (Window → listener → closure → node). Allocation instrumentation records who allocated. Snapshots are large; take them after GC."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Heap Snapshots works and name the main pitfall.",
      "answerHint": "Reproduce, take snapshot, repeat action, snapshot again, compare. Filter Detached. Read retainer path from the leak suspect to Window. Ignore noise from DevTools itself when possible. Pitfall: Comparing snapshots with DevTools console holding the old object — you are the retainer."
    },
    {
      "level": "advanced",
      "question": "How would you explain Heap Snapshots at an interview, including engine/spec details?",
      "answerHint": "Snapshots walk the heap via debugger protocol. Shallow vs retained size: retained is ‘if I drop this, how much dies.’ Dominator trees summarize retainers."
    }
  ],
  "pitfalls": [
    "Comparing snapshots with DevTools console holding the old object — you are the retainer.",
    "Ignore noise from DevTools itself when possible."
  ],
  "interview": {
    "expectations": [
      "Explain Heap Snapshots without mixing it up with a nearby B1.39 — Memory Management & Garbage Collection topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Snapshots walk the heap via debugger protocol."
    ],
    "commonQuestions": [
      "What is Heap Snapshots?",
      "Why does JavaScript heap snapshots behave this way?",
      "What is the classic Heap Snapshots interview trap?"
    ],
    "traps": [
      "Comparing snapshots with DevTools console holding the old object — you are the retainer."
    ],
    "misconceptions": [
      "‘I think it leaks’ is not a diagnosis. Snapshots show the retaining path."
    ],
    "strongSignals": [
      "Separates Heap Snapshots from lookalike APIs and can draw the mental model."
    ]
  }
})
