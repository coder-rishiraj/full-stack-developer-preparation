import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "V8 Architecture Conceptually",
  "whatIsIt": "V8 (Chrome/Node) uses Ignition (interpreter), compiling to bytecode, then optimizing compilers (Sparkplug, Maglev, TurboFan depending on version) for hot code. Orinoco GC. Hidden classes and inline caches are core. Node adds libuv around V8. You do not program V8 directly in app code.",
  "whyExists": "Chrome needed a fast engine; Node reused it. Architecture explanations help performance interviews stay honest.",
  "mentalModel": "A pipeline of compilers with a GC next door, wrapped by a host. Bytecode first, machine code if you earn it.",
  "how": [
    "Measure with DevTools/Node profiler, do not guess tiers.",
    "Stable shapes, predictable types.",
    "Avoid with/eval in hot paths.",
    "Read V8 blogs for current tier names — they change."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Citing ‘Crankshaft’ in 2026 interviews — that pipeline is long gone.",
    "variant": "warning"
  },
  "example": "class T { constructor(a, b) { this.a = a; this.b = b; } }\nfunction sum(o) { return o.a + o.b; }\nlet t = 0;\nfor (let i = 0; i < 1e4; i++) t += sum(new T(i, 1));\nconsole.log(t);\n",
  "exampleCaption": "Monomorphic hidden class in a tight loop",
  "internals": [
    "Maps (hidden classes) + IC (inline caches) at load/call sites.",
    "On-heap vs off-heap (pointer compression) details evolve.",
    "TurboFan uses Sea of Nodes IR for optimizations."
  ],
  "takeaways": [
    "Measure with DevTools/Node profiler, do not guess tiers.",
    "Stable shapes, predictable types.",
    "Citing ‘Crankshaft’ in 2026 interviews — that pipeline is long gone.",
    "Maps (hidden classes) + IC (inline caches) at load/call sites."
  ],
  "revision": [
    "V8 Architecture Conceptually: A pipeline of compilers with a GC next door, wrapped by a host. Bytecode first, machine code if you earn it.",
    "Measure with DevTools/Node profiler, do not guess tiers.",
    "Stable shapes, predictable types.",
    "Avoid with/eval in hot paths.",
    "Trap: Citing ‘Crankshaft’ in 2026 interviews — that pipeline is long gone."
  ],
  "flashcards": [
    [
      "V8 Architecture Conceptually",
      "V8 (Chrome/Node) uses Ignition (interpreter), compiling to bytecode, then optimizing compilers (Sparkplug, Maglev, TurboFan depending on version) for hot code."
    ],
    [
      "Mental model",
      "A pipeline of compilers with a GC next door, wrapped by a host. Bytecode first, machine code if you earn it."
    ],
    [
      "Common trap",
      "Citing ‘Crankshaft’ in 2026 interviews — that pipeline is long gone."
    ],
    [
      "Measure with DevTools/Node profiler, do not guess tiers.",
      "Stable shapes, predictable types."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is V8 Architecture Conceptually and where does a beginner first see it?",
      "answerHint": "V8 (Chrome/Node) uses Ignition (interpreter), compiling to bytecode, then optimizing compilers (Sparkplug, Maglev, TurboFan depending on version) for hot code. Orinoco GC. Hidden classes and inline caches are core. Node adds libuv around V8. You do not program V8 directly in app code."
    },
    {
      "level": "intermediate",
      "question": "Walk through how V8 Architecture Conceptually works and name the main pitfall.",
      "answerHint": "Measure with DevTools/Node profiler, do not guess tiers. Stable shapes, predictable types. Avoid with/eval in hot paths. Read V8 blogs for current tier names — they change. Pitfall: Citing ‘Crankshaft’ in 2026 interviews — that pipeline is long gone."
    },
    {
      "level": "advanced",
      "question": "How would you explain V8 Architecture Conceptually at an interview, including engine/spec details?",
      "answerHint": "Maps (hidden classes) + IC (inline caches) at load/call sites. On-heap vs off-heap (pointer compression) details evolve. TurboFan uses Sea of Nodes IR for optimizations."
    }
  ],
  "pitfalls": [
    "Citing ‘Crankshaft’ in 2026 interviews — that pipeline is long gone.",
    "Read V8 blogs for current tier names — they change."
  ],
  "interview": {
    "expectations": [
      "Explain V8 Architecture Conceptually without mixing it up with a nearby B1.25 — JavaScript Runtime & Engine topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Maps (hidden classes) + IC (inline caches) at load/call sites."
    ],
    "commonQuestions": [
      "What is V8 Architecture Conceptually?",
      "Why does JavaScript v8 architecture conceptually behave this way?",
      "What is the classic V8 Architecture Conceptually interview trap?"
    ],
    "traps": [
      "Citing ‘Crankshaft’ in 2026 interviews — that pipeline is long gone."
    ],
    "misconceptions": [
      "Chrome needed a fast engine; Node reused it. Architecture explanations help performance interviews stay honest."
    ],
    "strongSignals": [
      "Separates V8 Architecture Conceptually from lookalike APIs and can draw the mental model."
    ]
  }
})
