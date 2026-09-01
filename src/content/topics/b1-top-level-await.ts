import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Top-level await",
  "whatIsIt": "Modules may await at top level. That delays this module’s evaluation (and importers’) until the awaited promise settles. Sibling modules without the wait can finish first. It is a graph-blocking feature. Classic scripts cannot TLA. Errors reject the module (load failure).",
  "whyExists": "Config and WASM init needed to finish before the rest of the module ran, without a wrapping async function.",
  "mentalModel": "The file itself can pause. Anyone who imports you waits at the door until your await is done.",
  "how": [
    "Use for loaders, not for every fetch in a library (it blocks importers).",
    "Keep TLA small and failure-loud.",
    "Know that it can cause deadlocks with cycles if two modules TLA on each other.",
    "Bundlers need async chunk loading support."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A library with TLA makes every importer async-load — surprising in sync-looking apps.",
    "variant": "warning"
  },
  "example": "const cfg = await Promise.resolve({ url: '/api' });\nexport function api() { return cfg.url; }\nconsole.log(api());\n",
  "exampleCaption": "Top-level await initializing exported config",
  "internals": [
    "Module evaluation returns a promise when TLA is used.",
    "Importing modules await that promise during their evaluation.",
    "Cycles + TLA can deadlock the evaluation algorithm if not careful."
  ],
  "takeaways": [
    "Use for loaders, not for every fetch in a library (it blocks importers).",
    "Keep TLA small and failure-loud.",
    "A library with TLA makes every importer async-load — surprising in sync-looking apps.",
    "Module evaluation returns a promise when TLA is used."
  ],
  "revision": [
    "Top-level await: The file itself can pause. Anyone who imports you waits at the door until your await is done.",
    "Use for loaders, not for every fetch in a library (it blocks importers).",
    "Keep TLA small and failure-loud.",
    "Know that it can cause deadlocks with cycles if two modules TLA on each other.",
    "Trap: A library with TLA makes every importer async-load — surprising in sync-looking apps."
  ],
  "flashcards": [
    [
      "Top-level await",
      "Modules may await at top level."
    ],
    [
      "Mental model",
      "The file itself can pause. Anyone who imports you waits at the door until your await is done."
    ],
    [
      "Common trap",
      "A library with TLA makes every importer async-load — surprising in sync-looking apps."
    ],
    [
      "Use for loaders, not for every fetch in a library (it blocks importers).",
      "Keep TLA small and failure-loud."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Top-level await and where does a beginner first see it?",
      "answerHint": "Modules may await at top level. That delays this module’s evaluation (and importers’) until the awaited promise settles. Sibling modules without the wait can finish first. It is a graph-blocking feature. Classic scripts cannot TLA. Errors reject the module (load failure)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Top-level await works and name the main pitfall.",
      "answerHint": "Use for loaders, not for every fetch in a library (it blocks importers). Keep TLA small and failure-loud. Know that it can cause deadlocks with cycles if two modules TLA on each other. Bundlers need async chunk loading support. Pitfall: A library with TLA makes every importer async-load — surprising in sync-looking apps."
    },
    {
      "level": "advanced",
      "question": "How would you explain Top-level await at an interview, including engine/spec details?",
      "answerHint": "Module evaluation returns a promise when TLA is used. Importing modules await that promise during their evaluation. Cycles + TLA can deadlock the evaluation algorithm if not careful."
    }
  ],
  "pitfalls": [
    "A library with TLA makes every importer async-load — surprising in sync-looking apps.",
    "Bundlers need async chunk loading support."
  ],
  "interview": {
    "expectations": [
      "Explain Top-level await without mixing it up with a nearby B1.34 — Modules topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Module evaluation returns a promise when TLA is used."
    ],
    "commonQuestions": [
      "What is Top-level await?",
      "Why does JavaScript top-level await behave this way?",
      "What is the classic Top-level await interview trap?"
    ],
    "traps": [
      "A library with TLA makes every importer async-load — surprising in sync-looking apps."
    ],
    "misconceptions": [
      "Config and WASM init needed to finish before the rest of the module ran, without a wrapping async function."
    ],
    "strongSignals": [
      "Separates Top-level await from lookalike APIs and can draw the mental model."
    ]
  }
})
