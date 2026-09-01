import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "JavaScript Engine",
  "whatIsIt": "A JS engine parses source, compiles (interpreter + JIT), allocates a heap, runs the stack, and garbage-collects. V8, SpiderMonkey, JavaScriptCore, LibJS are engines. They implement ECMA-262 plus embedding hooks. Performance folklore (hidden classes) is engine-specific; correctness is spec.",
  "whyExists": "Browsers and Node needed a fast, spec-compliant executor. Competing engines keep each other honest.",
  "mentalModel": "Parser → bytecode → maybe optimized machine code; heap of objects; GC. Your source is not executed as text line-by-line forever.",
  "how": [
    "Write spec-correct code first.",
    "Keep object shapes stable for JIT friendliness.",
    "Avoid megamorphic call sites in hot loops if profiling says so.",
    "Do not micro-optimize for V8 only without measuring."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Deleting properties or adding them out of order in a hot constructor makes shapes megamorphic and can slow code.",
    "variant": "warning"
  },
  "example": "function Point(x, y) { this.x = x; this.y = y; }\nconst pts = [];\nfor (let i = 0; i < 1000; i++) pts.push(new Point(i, i));\nconsole.log(pts[0].x + pts[999].y);\n",
  "exampleCaption": "Stable object shape in a hot constructor",
  "internals": [
    "V8 Ignition bytecode, Sparkplug, Maglev, TurboFan as tiers.",
    "Hidden classes / maps / shapes describe property layout.",
    "Spec abstract operations are the source of truth for behavior."
  ],
  "takeaways": [
    "Write spec-correct code first.",
    "Keep object shapes stable for JIT friendliness.",
    "Deleting properties or adding them out of order in a hot constructor makes shapes megamorphic and can slow code.",
    "V8 Ignition bytecode, Sparkplug, Maglev, TurboFan as tiers."
  ],
  "revision": [
    "JavaScript Engine: Parser → bytecode → maybe optimized machine code; heap of objects; GC. Your source is not executed as text line-by-line forever.",
    "Write spec-correct code first.",
    "Keep object shapes stable for JIT friendliness.",
    "Avoid megamorphic call sites in hot loops if profiling says so.",
    "Trap: Deleting properties or adding them out of order in a hot constructor makes shapes megamorphic and can slow code."
  ],
  "flashcards": [
    [
      "JavaScript Engine",
      "A JS engine parses source, compiles (interpreter + JIT), allocates a heap, runs the stack, and garbage-collects."
    ],
    [
      "Mental model",
      "Parser → bytecode → maybe optimized machine code; heap of objects; GC. Your source is not executed as text line-by-line forever."
    ],
    [
      "Common trap",
      "Deleting properties or adding them out of order in a hot constructor makes shapes megamorphic and can slow code."
    ],
    [
      "Write spec-correct code first.",
      "Keep object shapes stable for JIT friendliness."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is JavaScript Engine and where does a beginner first see it?",
      "answerHint": "A JS engine parses source, compiles (interpreter + JIT), allocates a heap, runs the stack, and garbage-collects. V8, SpiderMonkey, JavaScriptCore, LibJS are engines. They implement ECMA-262 plus embedding hooks. Performance folklore (hidden classes) is engine-specific; correctness is spec."
    },
    {
      "level": "intermediate",
      "question": "Walk through how JavaScript Engine works and name the main pitfall.",
      "answerHint": "Write spec-correct code first. Keep object shapes stable for JIT friendliness. Avoid megamorphic call sites in hot loops if profiling says so. Do not micro-optimize for V8 only without measuring. Pitfall: Deleting properties or adding them out of order in a hot constructor makes shapes megamorphic and can slow code."
    },
    {
      "level": "advanced",
      "question": "How would you explain JavaScript Engine at an interview, including engine/spec details?",
      "answerHint": "V8 Ignition bytecode, Sparkplug, Maglev, TurboFan as tiers. Hidden classes / maps / shapes describe property layout. Spec abstract operations are the source of truth for behavior."
    }
  ],
  "pitfalls": [
    "Deleting properties or adding them out of order in a hot constructor makes shapes megamorphic and can slow code.",
    "Do not micro-optimize for V8 only without measuring."
  ],
  "interview": {
    "expectations": [
      "Explain JavaScript Engine without mixing it up with a nearby B1.25 — JavaScript Runtime & Engine topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "V8 Ignition bytecode, Sparkplug, Maglev, TurboFan as tiers."
    ],
    "commonQuestions": [
      "What is JavaScript Engine?",
      "Why does JavaScript javascript engine behave this way?",
      "What is the classic JavaScript Engine interview trap?"
    ],
    "traps": [
      "Deleting properties or adding them out of order in a hot constructor makes shapes megamorphic and can slow code."
    ],
    "misconceptions": [
      "Browsers and Node needed a fast, spec-compliant executor. Competing engines keep each other honest."
    ],
    "strongSignals": [
      "Separates JavaScript Engine from lookalike APIs and can draw the mental model."
    ]
  }
})
