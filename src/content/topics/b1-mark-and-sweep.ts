import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Mark-and-Sweep / Generational GC",
  "whatIsIt": "Mark-and-sweep: mark every object reachable from roots, then sweep unmarked. Generational: most objects die young, so collect young space more often (copying/scavenge). Compaction reduces fragmentation. Incremental marking avoids long pauses. This is engine lore for interviews, not something you invoke.",
  "whyExists": "Reference counting cannot collect cycles easily. Mark-and-sweep plus generations is the industry default for JS.",
  "mentalModel": "Paint every house you can walk to from city hall. Demolish unpainted houses. The new suburb is walked more often than downtown.",
  "how": [
    "Interview: explain mark vs sweep vs generations.",
    "Do not claim JS uses only refcounting (it does not as the main GC).",
    "Leaks = extra roots, not ‘sweep forgot.’",
    "Finalizers run after sweep, asynchronously."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Saying ‘JS has no GC pauses’ — it does; they are just short on modern engines.",
    "variant": "warning"
  },
  "example": "function demo() {\n  const young = { n: 1 };\n  return young.n;\n}\nconsole.log(demo());\nconst old = { keep: true };\nconsole.log(old.keep);\n",
  "exampleCaption": "young dies with the frame; old lives while referenced",
  "internals": [
    "Tri-color marking (white/grey/black) for incremental GC.",
    "Write barriers when mutator runs during marking.",
    "Copying young GC moves objects and updates pointers."
  ],
  "takeaways": [
    "Interview: explain mark vs sweep vs generations.",
    "Do not claim JS uses only refcounting (it does not as the main GC).",
    "Saying ‘JS has no GC pauses’ — it does; they are just short on modern engines.",
    "Tri-color marking (white/grey/black) for incremental GC."
  ],
  "revision": [
    "Mark-and-Sweep / Generational GC: Paint every house you can walk to from city hall. Demolish unpainted houses. The new suburb is walked more often than downtown.",
    "Interview: explain mark vs sweep vs generations.",
    "Do not claim JS uses only refcounting (it does not as the main GC).",
    "Leaks = extra roots, not ‘sweep forgot.’",
    "Trap: Saying ‘JS has no GC pauses’ — it does; they are just short on modern engines."
  ],
  "flashcards": [
    [
      "Mark-and-Sweep / Generational GC",
      "Mark-and-sweep: mark every object reachable from roots, then sweep unmarked."
    ],
    [
      "Mental model",
      "Paint every house you can walk to from city hall. Demolish unpainted houses. The new suburb is walked more often than downtown."
    ],
    [
      "Common trap",
      "Saying ‘JS has no GC pauses’ — it does; they are just short on modern engines."
    ],
    [
      "Interview: explain mark vs sweep vs generations.",
      "Do not claim JS uses only refcounting (it does not as the main GC)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Mark-and-Sweep / Generational GC and where does a beginner first see it?",
      "answerHint": "Mark-and-sweep: mark every object reachable from roots, then sweep unmarked. Generational: most objects die young, so collect young space more often (copying/scavenge). Compaction reduces fragmentation. Incremental marking avoids long pauses. This is engine lore for interviews, not something you invoke."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Mark-and-Sweep / Generational GC works and name the main pitfall.",
      "answerHint": "Interview: explain mark vs sweep vs generations. Do not claim JS uses only refcounting (it does not as the main GC). Leaks = extra roots, not ‘sweep forgot.’ Finalizers run after sweep, asynchronously. Pitfall: Saying ‘JS has no GC pauses’ — it does; they are just short on modern engines."
    },
    {
      "level": "advanced",
      "question": "How would you explain Mark-and-Sweep / Generational GC at an interview, including engine/spec details?",
      "answerHint": "Tri-color marking (white/grey/black) for incremental GC. Write barriers when mutator runs during marking. Copying young GC moves objects and updates pointers."
    }
  ],
  "pitfalls": [
    "Saying ‘JS has no GC pauses’ — it does; they are just short on modern engines.",
    "Finalizers run after sweep, asynchronously."
  ],
  "interview": {
    "expectations": [
      "Explain Mark-and-Sweep / Generational GC without mixing it up with a nearby B1.39 — Memory Management & Garbage Collection topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Tri-color marking (white/grey/black) for incremental GC."
    ],
    "commonQuestions": [
      "What is Mark-and-Sweep / Generational GC?",
      "Why does JavaScript mark-and-sweep / generational gc behave this way?",
      "What is the classic Mark-and-Sweep / Generational GC interview trap?"
    ],
    "traps": [
      "Saying ‘JS has no GC pauses’ — it does; they are just short on modern engines."
    ],
    "misconceptions": [
      "Reference counting cannot collect cycles easily. Mark-and-sweep plus generations is the industry default for JS."
    ],
    "strongSignals": [
      "Separates Mark-and-Sweep / Generational GC from lookalike APIs and can draw the mental model."
    ]
  }
})
