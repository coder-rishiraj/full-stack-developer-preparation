import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Breakpoints & Stepping",
  "whatIsIt": "A breakpoint pauses the engine at a statement. Step over/into/out walk calls. Conditional breakpoints pause when an expression is true. Logpoints log without pausing. debugger; is an inline breakpoint. DOM/XHR/event breakpoints pause on host events. Paused JS blocks that tab’s loop.",
  "whyExists": "Logs are slow to iterate. Pausing lets you inspect all locals at the failure line.",
  "mentalModel": "A freeze-frame. Step over = next line in this function; into = enter the call; out = finish this function.",
  "how": [
    "Click the line gutter in Sources.",
    "Conditional: i === 10.",
    "Never leave debugger; in production bundles.",
    "Blackbox node_modules to skip library steps."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A forgotten debugger; in a loop makes the page unusable when DevTools is open.",
    "variant": "warning"
  },
  "example": "function sum(a, b) {\n  debugger;\n  return a + b;\n}\nconsole.log(sum(2, 3));\nfor (let i = 0; i < 3; i++) {\n  if (i === 2) debugger;\n}\n",
  "exampleCaption": "debugger statement as a breakpoint",
  "internals": [
    "debugger statement is specified; hosts may no-op if no debugger attached.",
    "Breakpoints are engine debug API, not JS-visible (except debugger).",
    "Stepping still respects run-to-completion of the current micro-operation."
  ],
  "takeaways": [
    "Click the line gutter in Sources.",
    "Conditional: i === 10.",
    "A forgotten debugger; in a loop makes the page unusable when DevTools is open.",
    "debugger statement is specified; hosts may no-op if no debugger attached."
  ],
  "revision": [
    "Breakpoints & Stepping: A freeze-frame. Step over = next line in this function; into = enter the call; out = finish this function.",
    "Click the line gutter in Sources.",
    "Conditional: i === 10.",
    "Never leave debugger; in production bundles.",
    "Trap: A forgotten debugger; in a loop makes the page unusable when DevTools is open."
  ],
  "flashcards": [
    [
      "Breakpoints & Stepping",
      "A breakpoint pauses the engine at a statement."
    ],
    [
      "Mental model",
      "A freeze-frame. Step over = next line in this function; into = enter the call; out = finish this function."
    ],
    [
      "Common trap",
      "A forgotten debugger; in a loop makes the page unusable when DevTools is open."
    ],
    [
      "Click the line gutter in Sources.",
      "Conditional: i === 10."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Breakpoints & Stepping and where does a beginner first see it?",
      "answerHint": "A breakpoint pauses the engine at a statement. Step over/into/out walk calls. Conditional breakpoints pause when an expression is true. Logpoints log without pausing. debugger; is an inline breakpoint. DOM/XHR/event breakpoints pause on host events. Paused JS blocks that tab’s loop."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Breakpoints & Stepping works and name the main pitfall.",
      "answerHint": "Click the line gutter in Sources. Conditional: i === 10. Never leave debugger; in production bundles. Blackbox node_modules to skip library steps. Pitfall: A forgotten debugger; in a loop makes the page unusable when DevTools is open."
    },
    {
      "level": "advanced",
      "question": "How would you explain Breakpoints & Stepping at an interview, including engine/spec details?",
      "answerHint": "debugger statement is specified; hosts may no-op if no debugger attached. Breakpoints are engine debug API, not JS-visible (except debugger). Stepping still respects run-to-completion of the current micro-operation."
    }
  ],
  "pitfalls": [
    "A forgotten debugger; in a loop makes the page unusable when DevTools is open.",
    "Blackbox node_modules to skip library steps."
  ],
  "interview": {
    "expectations": [
      "Explain Breakpoints & Stepping without mixing it up with a nearby B1.33 — Debugging topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "debugger statement is specified; hosts may no-op if no debugger attached."
    ],
    "commonQuestions": [
      "What is Breakpoints & Stepping?",
      "Why does JavaScript breakpoints & stepping behave this way?",
      "What is the classic Breakpoints & Stepping interview trap?"
    ],
    "traps": [
      "A forgotten debugger; in a loop makes the page unusable when DevTools is open."
    ],
    "misconceptions": [
      "Logs are slow to iterate. Pausing lets you inspect all locals at the failure line."
    ],
    "strongSignals": [
      "Separates Breakpoints & Stepping from lookalike APIs and can draw the mental model."
    ]
  }
})
