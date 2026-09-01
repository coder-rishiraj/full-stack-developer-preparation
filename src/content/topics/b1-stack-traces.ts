import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Reading Stack Traces",
  "whatIsIt": "Error.stack is a host-formatted string of frames (V8: Error\\n    at fn (file:line:col)). It is not fully standardized historically. PrepareStackTrace can customize in Node. Source maps rewrite file/line. async traces in DevTools include awaited callers. Never parse stack strings for control flow in production if you can avoid it.",
  "whyExists": "Humans and log aggregators need a breadcrumb of calls. Hosts format it for their DevTools.",
  "mentalModel": "A printed receipt of plates at the moment of throw (or Error() construction in V8).",
  "how": [
    "Log e.stack (or e, which often includes it).",
    "Use source maps in production carefully (privacy vs debug).",
    "Do not match English stack text — V8 vs Firefox formats differ.",
    "throw new Error('msg') captures the stack at new Error."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Creating the Error in a helper and throwing later still shows the helper as the top frame unless you use captureStackTrace tricks.",
    "variant": "warning"
  },
  "example": "function deep() {\n  const e = new Error('trace');\n  return e.stack;\n}\nfunction mid() { return deep(); }\nconsole.log(mid());\n",
  "exampleCaption": "Stack captured at new Error(), not at throw",
  "internals": [
    "V8 captures stack at Error constructor by default.",
    "HTML browsers also fill stack; format is implementation-defined.",
    "error.cause chains another error without replacing stack."
  ],
  "takeaways": [
    "Log e.stack (or e, which often includes it).",
    "Use source maps in production carefully (privacy vs debug).",
    "Creating the Error in a helper and throwing later still shows the helper as the top frame unless you use captureStackTrace tricks.",
    "V8 captures stack at Error constructor by default."
  ],
  "revision": [
    "Reading Stack Traces: A printed receipt of plates at the moment of throw (or Error() construction in V8).",
    "Log e.stack (or e, which often includes it).",
    "Use source maps in production carefully (privacy vs debug).",
    "Do not match English stack text — V8 vs Firefox formats differ.",
    "Trap: Creating the Error in a helper and throwing later still shows the helper as the top frame unless you use captureStackTrace tricks."
  ],
  "flashcards": [
    [
      "Reading Stack Traces",
      "Error.stack is a host-formatted string of frames (V8: Error\\n    at fn (file:line:col))."
    ],
    [
      "Mental model",
      "A printed receipt of plates at the moment of throw (or Error() construction in V8)."
    ],
    [
      "Common trap",
      "Creating the Error in a helper and throwing later still shows the helper as the top frame unless you use captureStackTrace tricks."
    ],
    [
      "Log e.stack (or e, which often includes it).",
      "Use source maps in production carefully (privacy vs debug)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Reading Stack Traces and where does a beginner first see it?",
      "answerHint": "Error.stack is a host-formatted string of frames (V8: Error\\n    at fn (file:line:col)). It is not fully standardized historically. PrepareStackTrace can customize in Node. Source maps rewrite file/line. async traces in DevTools include awaited callers. Never parse stack strings for control flow in production if you can avoid it."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Reading Stack Traces works and name the main pitfall.",
      "answerHint": "Log e.stack (or e, which often includes it). Use source maps in production carefully (privacy vs debug). Do not match English stack text — V8 vs Firefox formats differ. throw new Error('msg') captures the stack at new Error. Pitfall: Creating the Error in a helper and throwing later still shows the helper as the top frame unless you use captureStackTrace tricks."
    },
    {
      "level": "advanced",
      "question": "How would you explain Reading Stack Traces at an interview, including engine/spec details?",
      "answerHint": "V8 captures stack at Error constructor by default. HTML browsers also fill stack; format is implementation-defined. error.cause chains another error without replacing stack."
    }
  ],
  "pitfalls": [
    "Creating the Error in a helper and throwing later still shows the helper as the top frame unless you use captureStackTrace tricks.",
    "throw new Error('msg') captures the stack at new Error."
  ],
  "interview": {
    "expectations": [
      "Explain Reading Stack Traces without mixing it up with a nearby B1.24 — Call Stack topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "V8 captures stack at Error constructor by default."
    ],
    "commonQuestions": [
      "What is Reading Stack Traces?",
      "Why does JavaScript reading stack traces behave this way?",
      "What is the classic Reading Stack Traces interview trap?"
    ],
    "traps": [
      "Creating the Error in a helper and throwing later still shows the helper as the top frame unless you use captureStackTrace tricks."
    ],
    "misconceptions": [
      "Humans and log aggregators need a breadcrumb of calls. Hosts format it for their DevTools."
    ],
    "strongSignals": [
      "Separates Reading Stack Traces from lookalike APIs and can draw the mental model."
    ]
  }
})
