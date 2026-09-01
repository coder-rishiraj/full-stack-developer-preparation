import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Reachability & Roots",
  "whatIsIt": "An object is live if a path of references exists from a root: execution contexts on the stack, the global object, host handles (DOM), and currently running functions’ environments. Closures extend reachability after the stack pops. WeakMap keys are not strong from the map side. Cycles are collectable if no root path exists.",
  "whyExists": "GC is reachability, not ‘I stopped using this variable’s name in source.’ Alias and listener lists keep things alive.",
  "mentalModel": "A subway map of arrows. If you can ride from a root to the object, it lives. Cycles without a root are a closed loop in an abandoned station — collectable.",
  "how": [
    "Draw who points at the suspected leak.",
    "Listeners, timers, and globals are sneaky roots.",
    "WeakMap for metadata.",
    "Cycles of two objects are fine if nothing else points at them."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Thinking cycles always leak — mark-and-sweep handles cycles; listener roots do not.",
    "variant": "warning"
  },
  "example": "const a = { n: 1 };\nconst b = { n: 2 };\na.b = b; b.a = a;\nconsole.log(a.b.a.n);\nlet root = a;\nroot = null;\nconsole.log('cycle unrooted; GC may collect both');\n",
  "exampleCaption": "A cycle is collectable once unrooted",
  "internals": [
    "GC roots defined by the embedding (handles) + spec stack/global.",
    "Mark-and-sweep marks from roots; cycles without marks die.",
    "WeakRef / WeakMap are not strong retainers of keys."
  ],
  "takeaways": [
    "Draw who points at the suspected leak.",
    "Listeners, timers, and globals are sneaky roots.",
    "Thinking cycles always leak — mark-and-sweep handles cycles; listener roots do not.",
    "GC roots defined by the embedding (handles) + spec stack/global."
  ],
  "revision": [
    "Reachability & Roots: A subway map of arrows. If you can ride from a root to the object, it lives. Cycles without a root are a closed loop in an abandoned station — collectable.",
    "Draw who points at the suspected leak.",
    "Listeners, timers, and globals are sneaky roots.",
    "WeakMap for metadata.",
    "Trap: Thinking cycles always leak — mark-and-sweep handles cycles; listener roots do not."
  ],
  "flashcards": [
    [
      "Reachability & Roots",
      "An object is live if a path of references exists from a root: execution contexts on the stack, the global object, host handles (DOM), and currently running functions’ environments."
    ],
    [
      "Mental model",
      "A subway map of arrows. If you can ride from a root to the object, it lives. Cycles without a root are a closed loop in an abandoned station — collectable."
    ],
    [
      "Common trap",
      "Thinking cycles always leak — mark-and-sweep handles cycles; listener roots do not."
    ],
    [
      "Draw who points at the suspected leak.",
      "Listeners, timers, and globals are sneaky roots."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Reachability & Roots and where does a beginner first see it?",
      "answerHint": "An object is live if a path of references exists from a root: execution contexts on the stack, the global object, host handles (DOM), and currently running functions’ environments. Closures extend reachability after the stack pops. WeakMap keys are not strong from the map side. Cycles are collectable if no root path exists."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Reachability & Roots works and name the main pitfall.",
      "answerHint": "Draw who points at the suspected leak. Listeners, timers, and globals are sneaky roots. WeakMap for metadata. Cycles of two objects are fine if nothing else points at them. Pitfall: Thinking cycles always leak — mark-and-sweep handles cycles; listener roots do not."
    },
    {
      "level": "advanced",
      "question": "How would you explain Reachability & Roots at an interview, including engine/spec details?",
      "answerHint": "GC roots defined by the embedding (handles) + spec stack/global. Mark-and-sweep marks from roots; cycles without marks die. WeakRef / WeakMap are not strong retainers of keys."
    }
  ],
  "pitfalls": [
    "Thinking cycles always leak — mark-and-sweep handles cycles; listener roots do not.",
    "Cycles of two objects are fine if nothing else points at them."
  ],
  "interview": {
    "expectations": [
      "Explain Reachability & Roots without mixing it up with a nearby B1.39 — Memory Management & Garbage Collection topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "GC roots defined by the embedding (handles) + spec stack/global."
    ],
    "commonQuestions": [
      "What is Reachability & Roots?",
      "Why does JavaScript reachability & roots behave this way?",
      "What is the classic Reachability & Roots interview trap?"
    ],
    "traps": [
      "Thinking cycles always leak — mark-and-sweep handles cycles; listener roots do not."
    ],
    "misconceptions": [
      "GC is reachability, not ‘I stopped using this variable’s name in source.’ Alias and listener lists keep things alive."
    ],
    "strongSignals": [
      "Separates Reachability & Roots from lookalike APIs and can draw the mental model."
    ]
  }
})
