import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Basic Debugging",
  "whatIsIt": "Basic debugging is a loop: reproduce, inspect values, form a hypothesis, change one thing. Tools: console, debugger statement, breakpoints, reading stack traces, and binary-searching with logs. Guessing without inspecting is slower than watching the call stack once.",
  "whyExists": "JS fails at runtime more than at compile time. You need a way to see actual types and async order, not just source.",
  "mentalModel": "The program is a movie; a breakpoint pauses a frame so you can look at props (variables) and the set (call stack).",
  "how": [
    "Write a failing reproduction first (smallest script or test).",
    "Log types (`typeof`, `Array.isArray`) when values look “impossible.”",
    "Use `debugger` or a breakpoint on the line you think is wrong.",
    "Read the stack from the throw site upward — the top frame is usually the clue."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Fixing the first log you see without checking it is stale or from a different function of the same name.",
    "variant": "warning"
  },
  "example": "function area(w, h) {\n  debugger; // pause here in DevTools\n  if (w == null || h == null) throw new Error('missing size');\n  return w * h;\n}\ntry {\n  console.log(area(3, 4));\n  console.log(area(3));\n} catch (e) {\n  console.error(e.message);\n  console.error(e.stack);\n}",
  "exampleCaption": "debugger + stack on a thrown error",
  "internals": [
    "The debugger statement is specified; hosts may ignore it when DevTools is closed.",
    "Error.stack is host-defined formatting, not fully standardized historically.",
    "Source maps rewrite frames from generated lines to original files."
  ],
  "takeaways": [
    "Write a failing reproduction first (smallest script or test).",
    "Log types (`typeof`, `Array.isArray`) when values look “impossible.”",
    "Fixing the first log you see without checking it is stale or from a different function of the same name.",
    "The debugger statement is specified; hosts may ignore it when DevTools is closed."
  ],
  "revision": [
    "Basic Debugging: The program is a movie; a breakpoint pauses a frame so you can look at props (variables) and the set (call stack).",
    "Write a failing reproduction first (smallest script or test).",
    "Log types (`typeof`, `Array.isArray`) when values look “impossible.”",
    "Use `debugger` or a breakpoint on the line you think is wrong.",
    "Trap: Fixing the first log you see without checking it is stale or from a different function of the same name."
  ],
  "flashcards": [
    [
      "Basic Debugging",
      "Basic debugging is a loop: reproduce, inspect values, form a hypothesis, change one thing."
    ],
    [
      "Mental model",
      "The program is a movie; a breakpoint pauses a frame so you can look at props (variables) and the set (call stack)."
    ],
    [
      "Common trap",
      "Fixing the first log you see without checking it is stale or from a different function of the same name."
    ],
    [
      "Write a failing reproduction first (smallest script or test).",
      "Log types (`typeof`, `Array.isArray`) when values look “impossible.”"
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Basic Debugging and where does a beginner first see it?",
      "answerHint": "Basic debugging is a loop: reproduce, inspect values, form a hypothesis, change one thing. Tools: console, debugger statement, breakpoints, reading stack traces, and binary-searching with logs. Guessing without inspecting is slower than watching the call stack once."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Basic Debugging works and name the main pitfall.",
      "answerHint": "Write a failing reproduction first (smallest script or test). Log types (`typeof`, `Array.isArray`) when values look “impossible.” Use `debugger` or a breakpoint on the line you think is wrong. Read the stack from the throw site upward — the top frame is usually the clue. Pitfall: Fixing the first log you see without checking it is stale or from a different function of the same name."
    },
    {
      "level": "advanced",
      "question": "How would you explain Basic Debugging at an interview, including engine/spec details?",
      "answerHint": "The debugger statement is specified; hosts may ignore it when DevTools is closed. Error.stack is host-defined formatting, not fully standardized historically. Source maps rewrite frames from generated lines to original files."
    }
  ],
  "pitfalls": [
    "Fixing the first log you see without checking it is stale or from a different function of the same name.",
    "Read the stack from the throw site upward — the top frame is usually the clue."
  ],
  "interview": {
    "expectations": [
      "Explain Basic Debugging without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The debugger statement is specified; hosts may ignore it when DevTools is closed."
    ],
    "commonQuestions": [
      "What is Basic Debugging?",
      "Why does JavaScript basic debugging behave this way?",
      "What is the classic Basic Debugging interview trap?"
    ],
    "traps": [
      "Fixing the first log you see without checking it is stale or from a different function of the same name."
    ],
    "misconceptions": [
      "JS fails at runtime more than at compile time. You need a way to see actual types and async order, not just source."
    ],
    "strongSignals": [
      "Separates Basic Debugging from lookalike APIs and can draw the mental model."
    ]
  }
})
