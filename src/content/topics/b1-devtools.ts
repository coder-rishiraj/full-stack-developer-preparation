import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Browser DevTools",
  "whatIsIt": "Browser DevTools: Elements, Console, Sources, Network, Performance, Memory. Console evaluates in page or snippet context. $0 is the selected element. Preserve log, disable cache, and device mode are daily tools. This is a host debugger around the engine, not a language feature.",
  "whyExists": "Dynamic pages fail at runtime. Seeing the live DOM, network, and JS state is how you debug.",
  "mentalModel": "A cockpit: console is the radio, Sources is the pause button, Network is the mail log, Performance is the stopwatch.",
  "how": [
    "Reproduce with DevTools open; watch the failing request.",
    "Use console.table / dir for objects.",
    "Pretty-print minified, then source maps.",
    "Do not debug production only with alert()."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Logging a live object then expanding it later — you see the mutated state, not the past.",
    "variant": "warning"
  },
  "example": "console.log({ a: 1 });\nconsole.dir(document?.body);\nconsole.assert(1 === 1, 'ok');\nconsole.count('hit');\nconsole.count('hit');\n",
  "exampleCaption": "Console helpers used while DevTools is open",
  "internals": [
    "console is a host object; commands like inspect() are host REPL extras.",
    "The debugger protocol (CDP) talks to V8.",
    "Source maps are JSON mapping generated↔original."
  ],
  "takeaways": [
    "Reproduce with DevTools open; watch the failing request.",
    "Use console.table / dir for objects.",
    "Logging a live object then expanding it later — you see the mutated state, not the past.",
    "console is a host object; commands like inspect() are host REPL extras."
  ],
  "revision": [
    "Browser DevTools: A cockpit: console is the radio, Sources is the pause button, Network is the mail log, Performance is the stopwatch.",
    "Reproduce with DevTools open; watch the failing request.",
    "Use console.table / dir for objects.",
    "Pretty-print minified, then source maps.",
    "Trap: Logging a live object then expanding it later — you see the mutated state, not the past."
  ],
  "flashcards": [
    [
      "Browser DevTools",
      "Browser DevTools: Elements, Console, Sources, Network, Performance, Memory."
    ],
    [
      "Mental model",
      "A cockpit: console is the radio, Sources is the pause button, Network is the mail log, Performance is the stopwatch."
    ],
    [
      "Common trap",
      "Logging a live object then expanding it later — you see the mutated state, not the past."
    ],
    [
      "Reproduce with DevTools open; watch the failing request.",
      "Use console.table / dir for objects."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Browser DevTools and where does a beginner first see it?",
      "answerHint": "Browser DevTools: Elements, Console, Sources, Network, Performance, Memory. Console evaluates in page or snippet context. $0 is the selected element. Preserve log, disable cache, and device mode are daily tools. This is a host debugger around the engine, not a language feature."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Browser DevTools works and name the main pitfall.",
      "answerHint": "Reproduce with DevTools open; watch the failing request. Use console.table / dir for objects. Pretty-print minified, then source maps. Do not debug production only with alert(). Pitfall: Logging a live object then expanding it later — you see the mutated state, not the past."
    },
    {
      "level": "advanced",
      "question": "How would you explain Browser DevTools at an interview, including engine/spec details?",
      "answerHint": "console is a host object; commands like inspect() are host REPL extras. The debugger protocol (CDP) talks to V8. Source maps are JSON mapping generated↔original."
    }
  ],
  "pitfalls": [
    "Logging a live object then expanding it later — you see the mutated state, not the past.",
    "Do not debug production only with alert()."
  ],
  "interview": {
    "expectations": [
      "Explain Browser DevTools without mixing it up with a nearby B1.33 — Debugging topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "console is a host object; commands like inspect() are host REPL extras."
    ],
    "commonQuestions": [
      "What is Browser DevTools?",
      "Why does JavaScript browser devtools behave this way?",
      "What is the classic Browser DevTools interview trap?"
    ],
    "traps": [
      "Logging a live object then expanding it later — you see the mutated state, not the past."
    ],
    "misconceptions": [
      "Dynamic pages fail at runtime. Seeing the live DOM, network, and JS state is how you debug."
    ],
    "strongSignals": [
      "Separates Browser DevTools from lookalike APIs and can draw the mental model."
    ]
  }
})
