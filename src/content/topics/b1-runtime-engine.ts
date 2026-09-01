import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "JavaScript Engine",
  "whatIsIt": "A JavaScript engine parses source, compiles it (interpreter + JIT), allocates objects on a heap, and runs a call stack. V8 (Chrome/Node), SpiderMonkey (Firefox), and JavaScriptCore (Safari) all implement ECMAScript with different internals. The engine does not include fetch or the DOM; those are attached by the embedder.",
  "whyExists": "Vendors need a fast, memory-safe executor of the spec. Engines compete on speed, memory, and spec completeness so web apps feel native.",
  "mentalModel": "Think compiler + VM: source becomes bytecode, hot functions get optimized machine code, and a garbage collector reclaims unreachable objects.",
  "how": [
    "Parse → AST/bytecode → interpret; hot paths may be JIT-compiled.",
    "Objects live on the heap; activation records live on the stack (plus escaped vars on the heap).",
    "Deoptimization happens when types change and optimized code is no longer valid.",
    "Do not rely on engine-specific timing; write spec-correct code."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Blaming “the V8 bug” for NaN or this-binding mistakes — those are spec rules every engine shares.",
    "variant": "warning"
  },
  "example": "function add(a, b) { return a + b; }\nfor (let i = 0; i < 1e5; i++) add(i, 1); // warms the function\nconsole.log(add(2, 3));\nconsole.log(({}).toString()); // engine intrinsic Object.prototype",
  "exampleCaption": "Engine runs language intrinsics, not DOM",
  "internals": [
    "V8 uses Ignition (interpreter) and TurboFan (optimizing compiler); Sparkplug sits in between.",
    "Hidden classes / shapes let engines index properties like structs when shapes are stable.",
    "Spec abstract ops (GetValue, PutValue) are what engines actually implement."
  ],
  "takeaways": [
    "Parse → AST/bytecode → interpret; hot paths may be JIT-compiled.",
    "Objects live on the heap; activation records live on the stack (plus escaped vars on the heap).",
    "Blaming “the V8 bug” for NaN or this-binding mistakes — those are spec rules every engine shares.",
    "V8 uses Ignition (interpreter) and TurboFan (optimizing compiler); Sparkplug sits in between."
  ],
  "revision": [
    "JavaScript Engine: Think compiler + VM: source becomes bytecode, hot functions get optimized machine code, and a garbage collector reclaims unreachable objects.",
    "Parse → AST/bytecode → interpret; hot paths may be JIT-compiled.",
    "Objects live on the heap; activation records live on the stack (plus escaped vars on the heap).",
    "Deoptimization happens when types change and optimized code is no longer valid.",
    "Trap: Blaming “the V8 bug” for NaN or this-binding mistakes — those are spec rules every engine shares."
  ],
  "flashcards": [
    [
      "JavaScript Engine",
      "A JavaScript engine parses source, compiles it (interpreter + JIT), allocates objects on a heap, and runs a call stack."
    ],
    [
      "Mental model",
      "Think compiler + VM: source becomes bytecode, hot functions get optimized machine code, and a garbage collector reclaims unreachable objects."
    ],
    [
      "Common trap",
      "Blaming “the V8 bug” for NaN or this-binding mistakes — those are spec rules every engine shares."
    ],
    [
      "Parse → AST/bytecode → interpret; hot paths may be JIT-compiled.",
      "Objects live on the heap; activation records live on the stack (plus escaped vars on the heap)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is JavaScript Engine and where does a beginner first see it?",
      "answerHint": "A JavaScript engine parses source, compiles it (interpreter + JIT), allocates objects on a heap, and runs a call stack. V8 (Chrome/Node), SpiderMonkey (Firefox), and JavaScriptCore (Safari) all implement ECMAScript with different internals. The engine does not include fetch or the DOM; those are attached by the embedder."
    },
    {
      "level": "intermediate",
      "question": "Walk through how JavaScript Engine works and name the main pitfall.",
      "answerHint": "Parse → AST/bytecode → interpret; hot paths may be JIT-compiled. Objects live on the heap; activation records live on the stack (plus escaped vars on the heap). Deoptimization happens when types change and optimized code is no longer valid. Do not rely on engine-specific timing; write spec-correct code. Pitfall: Blaming “the V8 bug” for NaN or this-binding mistakes — those are spec rules every engine shares."
    },
    {
      "level": "advanced",
      "question": "How would you explain JavaScript Engine at an interview, including engine/spec details?",
      "answerHint": "V8 uses Ignition (interpreter) and TurboFan (optimizing compiler); Sparkplug sits in between. Hidden classes / shapes let engines index properties like structs when shapes are stable. Spec abstract ops (GetValue, PutValue) are what engines actually implement."
    }
  ],
  "pitfalls": [
    "Blaming “the V8 bug” for NaN or this-binding mistakes — those are spec rules every engine shares.",
    "Do not rely on engine-specific timing; write spec-correct code."
  ],
  "interview": {
    "expectations": [
      "Explain JavaScript Engine without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "V8 uses Ignition (interpreter) and TurboFan (optimizing compiler); Sparkplug sits in between."
    ],
    "commonQuestions": [
      "What is JavaScript Engine?",
      "Why does JavaScript javascript engine behave this way?",
      "What is the classic JavaScript Engine interview trap?"
    ],
    "traps": [
      "Blaming “the V8 bug” for NaN or this-binding mistakes — those are spec rules every engine shares."
    ],
    "misconceptions": [
      "Vendors need a fast, memory-safe executor of the spec. Engines compete on speed, memory, and spec completeness so web apps feel native."
    ],
    "strongSignals": [
      "Separates JavaScript Engine from lookalike APIs and can draw the mental model."
    ]
  }
})
