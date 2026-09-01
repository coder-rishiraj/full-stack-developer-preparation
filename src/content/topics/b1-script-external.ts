import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "External Scripts",
  "whatIsIt": "External scripts load from a URL via src. The browser fetches, (often) caches, then executes the file as a classic or module script. Caching, CDNs, integrity hashes, and CORS apply here in a way inline scripts do not.",
  "whyExists": "Real apps are too large to paste into HTML. Separate files enable caching, code splitting, and teams owning different bundles.",
  "mentalModel": "HTML points at a file; the network and cache decide when bytes arrive; the script attributes decide when those bytes run.",
  "how": [
    "Prefer src + defer/module for app code.",
    "Use integrity (SRI) for third-party CDNs.",
    "crossorigin affects whether you get detailed errors and CORS for modules.",
    "One URL is one classic script instance; modules are cached in the module map."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Dynamically injected scripts default to async-like behavior (they run when fetched), which can race DOM setup.",
    "variant": "warning"
  },
  "example": "const s = document.createElement('script');\ns.src = '/app.js';\ns.defer = true;\ns.integrity = 'sha384-…'; // when you have a real hash\ns.onload = () => console.log('app.js ran');\ns.onerror = () => console.error('failed to load');\ndocument.head.append(s);",
  "exampleCaption": "Inject an external classic script",
  "internals": [
    "Fetch of classic scripts is render-blocking unless async/defer is set.",
    "nomodule lets you serve a legacy bundle to old browsers while modules go to modern ones.",
    "The script’s base URL affects relative import resolution for modules."
  ],
  "takeaways": [
    "Prefer src + defer/module for app code.",
    "Use integrity (SRI) for third-party CDNs.",
    "Dynamically injected scripts default to async-like behavior (they run when fetched), which can race DOM setup.",
    "Fetch of classic scripts is render-blocking unless async/defer is set."
  ],
  "revision": [
    "External Scripts: HTML points at a file; the network and cache decide when bytes arrive; the script attributes decide when those bytes run.",
    "Prefer src + defer/module for app code.",
    "Use integrity (SRI) for third-party CDNs.",
    "crossorigin affects whether you get detailed errors and CORS for modules.",
    "Trap: Dynamically injected scripts default to async-like behavior (they run when fetched), which can race DOM setup."
  ],
  "flashcards": [
    [
      "External Scripts",
      "External scripts load from a URL via src."
    ],
    [
      "Mental model",
      "HTML points at a file; the network and cache decide when bytes arrive; the script attributes decide when those bytes run."
    ],
    [
      "Common trap",
      "Dynamically injected scripts default to async-like behavior (they run when fetched), which can race DOM setup."
    ],
    [
      "Prefer src + defer/module for app code.",
      "Use integrity (SRI) for third-party CDNs."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is External Scripts and where does a beginner first see it?",
      "answerHint": "External scripts load from a URL via src. The browser fetches, (often) caches, then executes the file as a classic or module script. Caching, CDNs, integrity hashes, and CORS apply here in a way inline scripts do not."
    },
    {
      "level": "intermediate",
      "question": "Walk through how External Scripts works and name the main pitfall.",
      "answerHint": "Prefer src + defer/module for app code. Use integrity (SRI) for third-party CDNs. crossorigin affects whether you get detailed errors and CORS for modules. One URL is one classic script instance; modules are cached in the module map. Pitfall: Dynamically injected scripts default to async-like behavior (they run when fetched), which can race DOM setup."
    },
    {
      "level": "advanced",
      "question": "How would you explain External Scripts at an interview, including engine/spec details?",
      "answerHint": "Fetch of classic scripts is render-blocking unless async/defer is set. nomodule lets you serve a legacy bundle to old browsers while modules go to modern ones. The script’s base URL affects relative import resolution for modules."
    }
  ],
  "pitfalls": [
    "Dynamically injected scripts default to async-like behavior (they run when fetched), which can race DOM setup.",
    "One URL is one classic script instance; modules are cached in the module map."
  ],
  "interview": {
    "expectations": [
      "Explain External Scripts without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Fetch of classic scripts is render-blocking unless async/defer is set."
    ],
    "commonQuestions": [
      "What is External Scripts?",
      "Why does JavaScript external scripts behave this way?",
      "What is the classic External Scripts interview trap?"
    ],
    "traps": [
      "Dynamically injected scripts default to async-like behavior (they run when fetched), which can race DOM setup."
    ],
    "misconceptions": [
      "Real apps are too large to paste into HTML. Separate files enable caching, code splitting, and teams owning different bundles."
    ],
    "strongSignals": [
      "Separates External Scripts from lookalike APIs and can draw the mental model."
    ]
  }
})
