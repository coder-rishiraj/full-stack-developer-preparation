import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Watch / Scope / Call Stack",
  "whatIsIt": "While paused, Scope shows locals, closure, this, and globals. Watch evaluates expressions in that frame. Call stack switches frames to see other locals. Closure section proves which environment you captured. Edit-and-continue is limited; do not rely on it.",
  "whyExists": "The whole point of a breakpoint is inspecting environments — the same environments the spec talks about.",
  "mentalModel": "A live view of the current execution context and its [[Environment]] chain.",
  "how": [
    "Select an outer frame to see its locals.",
    "Watch this.n or a closed-over count.",
    "If a variable is ‘unavailable’, you are in a TDZ or optimized-out.",
    "Pretty-print to make scopes match source."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Optimized-out variables: the JIT did not keep a name; debug builds / disable optimizations to see them.",
    "variant": "warning"
  },
  "example": "function outer(x) {\n  const hidden = x * 2;\n  return function inner(y) {\n    debugger;\n    return hidden + y;\n  };\n}\nconsole.log(outer(3)(4));\n",
  "exampleCaption": "Pause in inner to inspect closure hidden",
  "internals": [
    "Debugger maps V8 scope info to environment records.",
    "Optimized frames may omit unused bindings.",
    "this in the scope pane is the same ThisValue as the spec."
  ],
  "takeaways": [
    "Select an outer frame to see its locals.",
    "Watch this.n or a closed-over count.",
    "Optimized-out variables: the JIT did not keep a name; debug builds / disable optimizations to see them.",
    "Debugger maps V8 scope info to environment records."
  ],
  "revision": [
    "Watch / Scope / Call Stack: A live view of the current execution context and its [[Environment]] chain.",
    "Select an outer frame to see its locals.",
    "Watch this.n or a closed-over count.",
    "If a variable is ‘unavailable’, you are in a TDZ or optimized-out.",
    "Trap: Optimized-out variables: the JIT did not keep a name; debug builds / disable optimizations to see them."
  ],
  "flashcards": [
    [
      "Watch / Scope / Call Stack",
      "While paused, Scope shows locals, closure, this, and globals."
    ],
    [
      "Mental model",
      "A live view of the current execution context and its [[Environment]] chain."
    ],
    [
      "Common trap",
      "Optimized-out variables: the JIT did not keep a name; debug builds / disable optimizations to see them."
    ],
    [
      "Select an outer frame to see its locals.",
      "Watch this.n or a closed-over count."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Watch / Scope / Call Stack and where does a beginner first see it?",
      "answerHint": "While paused, Scope shows locals, closure, this, and globals. Watch evaluates expressions in that frame. Call stack switches frames to see other locals. Closure section proves which environment you captured. Edit-and-continue is limited; do not rely on it."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Watch / Scope / Call Stack works and name the main pitfall.",
      "answerHint": "Select an outer frame to see its locals. Watch this.n or a closed-over count. If a variable is ‘unavailable’, you are in a TDZ or optimized-out. Pretty-print to make scopes match source. Pitfall: Optimized-out variables: the JIT did not keep a name; debug builds / disable optimizations to see them."
    },
    {
      "level": "advanced",
      "question": "How would you explain Watch / Scope / Call Stack at an interview, including engine/spec details?",
      "answerHint": "Debugger maps V8 scope info to environment records. Optimized frames may omit unused bindings. this in the scope pane is the same ThisValue as the spec."
    }
  ],
  "pitfalls": [
    "Optimized-out variables: the JIT did not keep a name; debug builds / disable optimizations to see them.",
    "Pretty-print to make scopes match source."
  ],
  "interview": {
    "expectations": [
      "Explain Watch / Scope / Call Stack without mixing it up with a nearby B1.33 — Debugging topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Debugger maps V8 scope info to environment records."
    ],
    "commonQuestions": [
      "What is Watch / Scope / Call Stack?",
      "Why does JavaScript watch / scope / call stack behave this way?",
      "What is the classic Watch / Scope / Call Stack interview trap?"
    ],
    "traps": [
      "Optimized-out variables: the JIT did not keep a name; debug builds / disable optimizations to see them."
    ],
    "misconceptions": [
      "The whole point of a breakpoint is inspecting environments — the same environments the spec talks about."
    ],
    "strongSignals": [
      "Separates Watch / Scope / Call Stack from lookalike APIs and can draw the mental model."
    ]
  }
})
