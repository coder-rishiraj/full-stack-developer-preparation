import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Stack Frames",
  "whatIsIt": "A stack frame (execution context) holds the current function, instruction pointer, locals/environments, and this. DevTools shows it in the Call Stack pane. Minified code needs source maps to make frames readable. Async stack traces stitch frames across jobs in DevTools, but the engine stack was empty between.",
  "whyExists": "Debugging is ‘which plate am I on and what locals are on it?’ Frames are that view.",
  "mentalModel": "One plate: function name, line, local bindings. The pile of plates is the stack.",
  "how": [
    "Click frames in DevTools to see locals.",
    "Named functions make frames nicer than anonymous.",
    "Blackbox library frames to see your code.",
    "Remember async frames may be synthesized by DevTools."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Anonymous arrows all look the same in traces — name them or assign to consts for inferred names.",
    "variant": "warning"
  },
  "example": "function alpha(n) {\n  const x = n + 1;\n  return beta(x);\n}\nfunction beta(n) {\n  debugger;\n  return n * 2;\n}\nconsole.log(alpha(3));\n",
  "exampleCaption": "Two frames: alpha waiting on beta",
  "internals": [
    "The spec frame is an execution context; VMs have native frames too.",
    "Error.captureStackTrace (V8) snapshots frames.",
    "Tail calls would reuse frames; they are mostly unimplemented."
  ],
  "takeaways": [
    "Click frames in DevTools to see locals.",
    "Named functions make frames nicer than anonymous.",
    "Anonymous arrows all look the same in traces — name them or assign to consts for inferred names.",
    "The spec frame is an execution context; VMs have native frames too."
  ],
  "revision": [
    "Stack Frames: One plate: function name, line, local bindings. The pile of plates is the stack.",
    "Click frames in DevTools to see locals.",
    "Named functions make frames nicer than anonymous.",
    "Blackbox library frames to see your code.",
    "Trap: Anonymous arrows all look the same in traces — name them or assign to consts for inferred names."
  ],
  "flashcards": [
    [
      "Stack Frames",
      "A stack frame (execution context) holds the current function, instruction pointer, locals/environments, and this."
    ],
    [
      "Mental model",
      "One plate: function name, line, local bindings. The pile of plates is the stack."
    ],
    [
      "Common trap",
      "Anonymous arrows all look the same in traces — name them or assign to consts for inferred names."
    ],
    [
      "Click frames in DevTools to see locals.",
      "Named functions make frames nicer than anonymous."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Stack Frames and where does a beginner first see it?",
      "answerHint": "A stack frame (execution context) holds the current function, instruction pointer, locals/environments, and this. DevTools shows it in the Call Stack pane. Minified code needs source maps to make frames readable. Async stack traces stitch frames across jobs in DevTools, but the engine stack was empty between."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Stack Frames works and name the main pitfall.",
      "answerHint": "Click frames in DevTools to see locals. Named functions make frames nicer than anonymous. Blackbox library frames to see your code. Remember async frames may be synthesized by DevTools. Pitfall: Anonymous arrows all look the same in traces — name them or assign to consts for inferred names."
    },
    {
      "level": "advanced",
      "question": "How would you explain Stack Frames at an interview, including engine/spec details?",
      "answerHint": "The spec frame is an execution context; VMs have native frames too. Error.captureStackTrace (V8) snapshots frames. Tail calls would reuse frames; they are mostly unimplemented."
    }
  ],
  "pitfalls": [
    "Anonymous arrows all look the same in traces — name them or assign to consts for inferred names.",
    "Remember async frames may be synthesized by DevTools."
  ],
  "interview": {
    "expectations": [
      "Explain Stack Frames without mixing it up with a nearby B1.24 — Call Stack topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The spec frame is an execution context; VMs have native frames too."
    ],
    "commonQuestions": [
      "What is Stack Frames?",
      "Why does JavaScript stack frames behave this way?",
      "What is the classic Stack Frames interview trap?"
    ],
    "traps": [
      "Anonymous arrows all look the same in traces — name them or assign to consts for inferred names."
    ],
    "misconceptions": [
      "Debugging is ‘which plate am I on and what locals are on it?’ Frames are that view."
    ],
    "strongSignals": [
      "Separates Stack Frames from lookalike APIs and can draw the mental model."
    ]
  }
})
