import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "script async",
  "whatIsIt": "The async attribute on a classic script downloads in parallel with HTML parsing and executes as soon as the file is ready. Execution order among async scripts is not document order. async is ignored on module scripts in the same way: modules are already deferred unless you also use async on modules (which makes them run at first opportunity, unordered).",
  "whyExists": "Analytics and independent widgets should not delay first paint. async trades ordering for “run whenever the network finishes.”",
  "mentalModel": "Race: parser vs download. Whichever download finishes first gets to run first — like taxis arriving in traffic, not in dispatch order.",
  "how": [
    "Use async for standalone third-party tags that do not depend on DOM order.",
    "Do not use async for app bundles that must run after specific markup or other files.",
    "Independent async scripts can see a partially parsed DOM.",
    "For ordered app code, prefer defer or type=module."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming async script A always runs before async script B because A is listed first — network order wins.",
    "variant": "warning"
  },
  "example": "// <script async src=\"ads.js\"></script>\n// <script async src=\"metrics.js\"></script>\nconsole.log('this file may run before or after the other async file');\nconsole.log('body?', document.body != null);",
  "exampleCaption": "Async scripts are unordered",
  "internals": [
    "HTML: async classic scripts use the “force async” flag and execute on fetch complete.",
    "Module scripts with async skip the defer queue and execute as soon as the graph is ready.",
    "document.write in async scripts after parse opens a new document (destroys the page)."
  ],
  "takeaways": [
    "Use async for standalone third-party tags that do not depend on DOM order.",
    "Do not use async for app bundles that must run after specific markup or other files.",
    "Assuming async script A always runs before async script B because A is listed first — network order wins.",
    "HTML: async classic scripts use the “force async” flag and execute on fetch complete."
  ],
  "revision": [
    "script async: Race: parser vs download. Whichever download finishes first gets to run first — like taxis arriving in traffic, not in dispatch order.",
    "Use async for standalone third-party tags that do not depend on DOM order.",
    "Do not use async for app bundles that must run after specific markup or other files.",
    "Independent async scripts can see a partially parsed DOM.",
    "Trap: Assuming async script A always runs before async script B because A is listed first — network order wins."
  ],
  "flashcards": [
    [
      "script async",
      "The async attribute on a classic script downloads in parallel with HTML parsing and executes as soon as the file is ready."
    ],
    [
      "Mental model",
      "Race: parser vs download. Whichever download finishes first gets to run first — like taxis arriving in traffic, not in dispatch order."
    ],
    [
      "Common trap",
      "Assuming async script A always runs before async script B because A is listed first — network order wins."
    ],
    [
      "Use async for standalone third-party tags that do not depend on DOM order.",
      "Do not use async for app bundles that must run after specific markup or other files."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is script async and where does a beginner first see it?",
      "answerHint": "The async attribute on a classic script downloads in parallel with HTML parsing and executes as soon as the file is ready. Execution order among async scripts is not document order. async is ignored on module scripts in the same way: modules are already deferred unless you also use async on modules (which makes them run at first opportunity, unordered)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how script async works and name the main pitfall.",
      "answerHint": "Use async for standalone third-party tags that do not depend on DOM order. Do not use async for app bundles that must run after specific markup or other files. Independent async scripts can see a partially parsed DOM. For ordered app code, prefer defer or type=module. Pitfall: Assuming async script A always runs before async script B because A is listed first — network order wins."
    },
    {
      "level": "advanced",
      "question": "How would you explain script async at an interview, including engine/spec details?",
      "answerHint": "HTML: async classic scripts use the “force async” flag and execute on fetch complete. Module scripts with async skip the defer queue and execute as soon as the graph is ready. document.write in async scripts after parse opens a new document (destroys the page)."
    }
  ],
  "pitfalls": [
    "Assuming async script A always runs before async script B because A is listed first — network order wins.",
    "For ordered app code, prefer defer or type=module."
  ],
  "interview": {
    "expectations": [
      "Explain script async without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HTML: async classic scripts use the “force async” flag and execute on fetch complete."
    ],
    "commonQuestions": [
      "What is script async?",
      "Why does JavaScript script async behave this way?",
      "What is the classic script async interview trap?"
    ],
    "traps": [
      "Assuming async script A always runs before async script B because A is listed first — network order wins."
    ],
    "misconceptions": [
      "Analytics and independent widgets should not delay first paint. async trades ordering for “run whenever the network finishes.”"
    ],
    "strongSignals": [
      "Separates script async from lookalike APIs and can draw the mental model."
    ]
  }
})
