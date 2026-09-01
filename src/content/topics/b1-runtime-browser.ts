import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Browser Runtime",
  "whatIsIt": "In a browser, JavaScript runs per window/worker with access to HTML, CSSOM, networking, storage, and user events. The page’s main thread also does layout and paint, so long JS tasks freeze the UI. Scripts load through HTML, modules, or workers; they share the document unless they run in a worker.",
  "whyExists": "The original purpose of JS was to make documents interactive: respond to clicks, validate forms, and update the page without a full reload.",
  "mentalModel": "A tab is a factory: engine + Web APIs + rendering. Your script is one worker on the assembly line; blocking it stalls painting.",
  "how": [
    "Main-thread JS shares the thread with style, layout, and paint.",
    "Use Web Workers for CPU work that must not jank the page.",
    "DOM, fetch, history, and storage exist only in this kind of runtime.",
    "Each iframe is a separate realm with its own window and JS heap."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Heavy loops on the main thread look like a “frozen tab,” not a JS error — the event loop never gets to paint.",
    "variant": "warning"
  },
  "example": "window.addEventListener('DOMContentLoaded', () => {\n  document.body.dataset.ready = '1';\n});\nconsole.log(location.origin);\nconsole.log(navigator.userAgent.slice(0, 20));",
  "exampleCaption": "Browser globals: document, location, navigator",
  "internals": [
    "Browsers implement the HTML event loop, which includes rendering opportunity steps.",
    "Window is a WindowProxy; navigating can swap the inner Window while the proxy stays.",
    "Module scripts defer by default and run after document parse, unlike classic scripts."
  ],
  "takeaways": [
    "Main-thread JS shares the thread with style, layout, and paint.",
    "Use Web Workers for CPU work that must not jank the page.",
    "Heavy loops on the main thread look like a “frozen tab,” not a JS error — the event loop never gets to paint.",
    "Browsers implement the HTML event loop, which includes rendering opportunity steps."
  ],
  "revision": [
    "Browser Runtime: A tab is a factory: engine + Web APIs + rendering. Your script is one worker on the assembly line; blocking it stalls painting.",
    "Main-thread JS shares the thread with style, layout, and paint.",
    "Use Web Workers for CPU work that must not jank the page.",
    "DOM, fetch, history, and storage exist only in this kind of runtime.",
    "Trap: Heavy loops on the main thread look like a “frozen tab,” not a JS error — the event loop never gets to paint."
  ],
  "flashcards": [
    [
      "Browser Runtime",
      "In a browser, JavaScript runs per window/worker with access to HTML, CSSOM, networking, storage, and user events."
    ],
    [
      "Mental model",
      "A tab is a factory: engine + Web APIs + rendering. Your script is one worker on the assembly line; blocking it stalls painting."
    ],
    [
      "Common trap",
      "Heavy loops on the main thread look like a “frozen tab,” not a JS error — the event loop never gets to paint."
    ],
    [
      "Main-thread JS shares the thread with style, layout, and paint.",
      "Use Web Workers for CPU work that must not jank the page."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Browser Runtime and where does a beginner first see it?",
      "answerHint": "In a browser, JavaScript runs per window/worker with access to HTML, CSSOM, networking, storage, and user events. The page’s main thread also does layout and paint, so long JS tasks freeze the UI. Scripts load through HTML, modules, or workers; they share the document unless they run in a worker."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Browser Runtime works and name the main pitfall.",
      "answerHint": "Main-thread JS shares the thread with style, layout, and paint. Use Web Workers for CPU work that must not jank the page. DOM, fetch, history, and storage exist only in this kind of runtime. Each iframe is a separate realm with its own window and JS heap. Pitfall: Heavy loops on the main thread look like a “frozen tab,” not a JS error — the event loop never gets to paint."
    },
    {
      "level": "advanced",
      "question": "How would you explain Browser Runtime at an interview, including engine/spec details?",
      "answerHint": "Browsers implement the HTML event loop, which includes rendering opportunity steps. Window is a WindowProxy; navigating can swap the inner Window while the proxy stays. Module scripts defer by default and run after document parse, unlike classic scripts."
    }
  ],
  "pitfalls": [
    "Heavy loops on the main thread look like a “frozen tab,” not a JS error — the event loop never gets to paint.",
    "Each iframe is a separate realm with its own window and JS heap."
  ],
  "interview": {
    "expectations": [
      "Explain Browser Runtime without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Browsers implement the HTML event loop, which includes rendering opportunity steps."
    ],
    "commonQuestions": [
      "What is Browser Runtime?",
      "Why does JavaScript browser runtime behave this way?",
      "What is the classic Browser Runtime interview trap?"
    ],
    "traps": [
      "Heavy loops on the main thread look like a “frozen tab,” not a JS error — the event loop never gets to paint."
    ],
    "misconceptions": [
      "The original purpose of JS was to make documents interactive: respond to clicks, validate forms, and update the page without a full reload."
    ],
    "strongSignals": [
      "Separates Browser Runtime from lookalike APIs and can draw the mental model."
    ]
  }
})
