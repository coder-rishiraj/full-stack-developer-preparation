import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "How JavaScript Loads in a Webpage",
  "whatIsIt": "Browsers discover JavaScript through HTML: inline <script>, src files, type=module, import maps, and workers. Classic scripts without async/defer block HTML parsing while they fetch and run. How you load code changes when it runs relative to DOM construction and other scripts.",
  "whyExists": "HTML is the bootloader for web apps. The parser must decide whether to wait for JS (document.write / DOM order) or continue painting.",
  "mentalModel": "Scripts are jobs inserted into the parser’s timeline. Attributes (async, defer, module) move those jobs earlier or later.",
  "how": [
    "Default classic script: fetch + execute immediately, pausing the parser.",
    "defer: download in parallel, run in order after document is parsed.",
    "async: download in parallel, run as soon as ready (order not guaranteed).",
    "type=module: deferred by default, strict, and can import other modules."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Putting a classic script in <head> without defer means the browser waits on JS before it even sees <body>.",
    "variant": "warning"
  },
  "example": "// HTML (illustrative):\n// <script src=\"a.js\"></script>          <!-- blocks parser -->\n// <script src=\"b.js\" defer></script>    <!-- after parse, ordered -->\n// <script src=\"c.js\" async></script>    <!-- at download complete -->\nconsole.log(document.readyState); // \"loading\" | \"interactive\" | \"complete\"",
  "exampleCaption": "readyState while scripts run",
  "internals": [
    "HTML defines “prepare a script” and fetch/execute algorithms with different queues.",
    "document.write from a parser-inserted script can still mutate the stream; after load it opens a new document.",
    "Module graphs are fetched via the module map; duplicates share the same module instance."
  ],
  "takeaways": [
    "Default classic script: fetch + execute immediately, pausing the parser.",
    "defer: download in parallel, run in order after document is parsed.",
    "Putting a classic script in <head> without defer means the browser waits on JS before it even sees <body>.",
    "HTML defines “prepare a script” and fetch/execute algorithms with different queues."
  ],
  "revision": [
    "How JavaScript Loads in a Webpage: Scripts are jobs inserted into the parser’s timeline. Attributes (async, defer, module) move those jobs earlier or later.",
    "Default classic script: fetch + execute immediately, pausing the parser.",
    "defer: download in parallel, run in order after document is parsed.",
    "async: download in parallel, run as soon as ready (order not guaranteed).",
    "Trap: Putting a classic script in <head> without defer means the browser waits on JS before it even sees <body>."
  ],
  "flashcards": [
    [
      "How JavaScript Loads in a Webpage",
      "Browsers discover JavaScript through HTML: inline <script>, src files, type=module, import maps, and workers."
    ],
    [
      "Mental model",
      "Scripts are jobs inserted into the parser’s timeline. Attributes (async, defer, module) move those jobs earlier or later."
    ],
    [
      "Common trap",
      "Putting a classic script in <head> without defer means the browser waits on JS before it even sees <body>."
    ],
    [
      "Default classic script: fetch + execute immediately, pausing the parser.",
      "defer: download in parallel, run in order after document is parsed."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is How JavaScript Loads in a Webpage and where does a beginner first see it?",
      "answerHint": "Browsers discover JavaScript through HTML: inline <script>, src files, type=module, import maps, and workers. Classic scripts without async/defer block HTML parsing while they fetch and run. How you load code changes when it runs relative to DOM construction and other scripts."
    },
    {
      "level": "intermediate",
      "question": "Walk through how How JavaScript Loads in a Webpage works and name the main pitfall.",
      "answerHint": "Default classic script: fetch + execute immediately, pausing the parser. defer: download in parallel, run in order after document is parsed. async: download in parallel, run as soon as ready (order not guaranteed). type=module: deferred by default, strict, and can import other modules. Pitfall: Putting a classic script in <head> without defer means the browser waits on JS before it even sees <body>."
    },
    {
      "level": "advanced",
      "question": "How would you explain How JavaScript Loads in a Webpage at an interview, including engine/spec details?",
      "answerHint": "HTML defines “prepare a script” and fetch/execute algorithms with different queues. document.write from a parser-inserted script can still mutate the stream; after load it opens a new document. Module graphs are fetched via the module map; duplicates share the same module instance."
    }
  ],
  "pitfalls": [
    "Putting a classic script in <head> without defer means the browser waits on JS before it even sees <body>.",
    "type=module: deferred by default, strict, and can import other modules."
  ],
  "interview": {
    "expectations": [
      "Explain How JavaScript Loads in a Webpage without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HTML defines “prepare a script” and fetch/execute algorithms with different queues."
    ],
    "commonQuestions": [
      "What is How JavaScript Loads in a Webpage?",
      "Why does JavaScript how javascript loads in a webpage behave this way?",
      "What is the classic How JavaScript Loads in a Webpage interview trap?"
    ],
    "traps": [
      "Putting a classic script in <head> without defer means the browser waits on JS before it even sees <body>."
    ],
    "misconceptions": [
      "HTML is the bootloader for web apps. The parser must decide whether to wait for JS (document.write / DOM order) or continue painting."
    ],
    "strongSignals": [
      "Separates How JavaScript Loads in a Webpage from lookalike APIs and can draw the mental model."
    ]
  }
})
