import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Closure Lifecycle",
  "whatIsIt": "A closure lives as long as something can still call the inner function: a variable, a DOM handler, a Map, a timer. When the last reference drops, GC can collect the function and the captured environment (if nothing else points at those bindings). Capturing a whole outer object keeps that object too.",
  "whyExists": "Memory bugs in SPAs are often ‘I still have a listener that closes over the world.’ Lifecycle is how you explain leaks.",
  "mentalModel": "The inner function is a kite; the environment is the string. As long as someone holds the kite, the string’s variables stay.",
  "how": [
    "Remove event listeners / clear timers to drop closures.",
    "Null out large caches that hold callbacks.",
    "Do not capture `element` if you only need `element.id`.",
    "Module-level closures live for the process/tab."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Engines may retain the whole environment record, not just the one variable you read — capturing unused bulky neighbors can leak in some cases.",
    "variant": "warning"
  },
  "example": "function watch() {\n  const bulky = new Array(3).fill('data');\n  const id = 42;\n  return () => id; // does not need bulky — don't capture it\n}\nconst fn = watch();\nconsole.log(fn());\nlet handler = () => console.log('still held');\nhandler = null;\nconsole.log(handler);\n",
  "exampleCaption": "Capture only what the inner function uses",
  "internals": [
    "GC is reachability from roots; function objects are ordinary heap objects.",
    "Optimization: some engines skip storing unused bindings (not a spec guarantee).",
    "DOM listener lists are roots until removeEventListener or node GC."
  ],
  "takeaways": [
    "Remove event listeners / clear timers to drop closures.",
    "Null out large caches that hold callbacks.",
    "Engines may retain the whole environment record, not just the one variable you read — capturing unused bulky neighbors can leak in some cases.",
    "GC is reachability from roots; function objects are ordinary heap objects."
  ],
  "revision": [
    "Closure Lifecycle: The inner function is a kite; the environment is the string. As long as someone holds the kite, the string’s variables stay.",
    "Remove event listeners / clear timers to drop closures.",
    "Null out large caches that hold callbacks.",
    "Do not capture `element` if you only need `element.id`.",
    "Trap: Engines may retain the whole environment record, not just the one variable you read — capturing unused bulky neighbors can leak in some cases."
  ],
  "flashcards": [
    [
      "Closure Lifecycle",
      "A closure lives as long as something can still call the inner function: a variable, a DOM handler, a Map, a timer."
    ],
    [
      "Mental model",
      "The inner function is a kite; the environment is the string. As long as someone holds the kite, the string’s variables stay."
    ],
    [
      "Common trap",
      "Engines may retain the whole environment record, not just the one variable you read — capturing unused bulky neighbors can leak in some cases."
    ],
    [
      "Remove event listeners / clear timers to drop closures.",
      "Null out large caches that hold callbacks."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Closure Lifecycle and where does a beginner first see it?",
      "answerHint": "A closure lives as long as something can still call the inner function: a variable, a DOM handler, a Map, a timer. When the last reference drops, GC can collect the function and the captured environment (if nothing else points at those bindings). Capturing a whole outer object keeps that object too."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Closure Lifecycle works and name the main pitfall.",
      "answerHint": "Remove event listeners / clear timers to drop closures. Null out large caches that hold callbacks. Do not capture `element` if you only need `element.id`. Module-level closures live for the process/tab. Pitfall: Engines may retain the whole environment record, not just the one variable you read — capturing unused bulky neighbors can leak in some cases."
    },
    {
      "level": "advanced",
      "question": "How would you explain Closure Lifecycle at an interview, including engine/spec details?",
      "answerHint": "GC is reachability from roots; function objects are ordinary heap objects. Optimization: some engines skip storing unused bindings (not a spec guarantee). DOM listener lists are roots until removeEventListener or node GC."
    }
  ],
  "pitfalls": [
    "Engines may retain the whole environment record, not just the one variable you read — capturing unused bulky neighbors can leak in some cases.",
    "Module-level closures live for the process/tab."
  ],
  "interview": {
    "expectations": [
      "Explain Closure Lifecycle without mixing it up with a nearby B1.12 — Closures topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "GC is reachability from roots; function objects are ordinary heap objects."
    ],
    "commonQuestions": [
      "What is Closure Lifecycle?",
      "Why does JavaScript closure lifecycle behave this way?",
      "What is the classic Closure Lifecycle interview trap?"
    ],
    "traps": [
      "Engines may retain the whole environment record, not just the one variable you read — capturing unused bulky neighbors can leak in some cases."
    ],
    "misconceptions": [
      "Memory bugs in SPAs are often ‘I still have a listener that closes over the world.’ Lifecycle is how you explain leaks."
    ],
    "strongSignals": [
      "Separates Closure Lifecycle from lookalike APIs and can draw the mental model."
    ]
  }
})
