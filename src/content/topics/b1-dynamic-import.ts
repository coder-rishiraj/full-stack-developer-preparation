import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Dynamic import()",
  "whatIsIt": "import(specifier) returns a Promise of the module namespace. The specifier can be computed. Use for code splitting, optional plugins, and conditional polyfills. It is not a require() — it is async, ESM, and cached in the module map after first load. Errors become rejections.",
  "whyExists": "Static import cannot branch on runtime feature tests or load a heavy editor only on that route.",
  "mentalModel": "A late import: fetch/parse/eval that subgraph, then hand me the namespace object.",
  "how": [
    "const m = await import('./heavy.js').",
    "Catch load errors.",
    "Same URL = same instance later.",
    "import() in CJS Node is allowed as a bridge to ESM."
  ],
  "callout": {
    "title": "Watch for",
    "text": "import(userInput) is a code-load injection risk — allowlist specifiers.",
    "variant": "warning"
  },
  "example": "const name = './math.js';\nconst ns = await import(name);\nconsole.log(ns.add?.(1, 2) ?? 'no add');\ntry { await import('./missing.js'); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Computed specifier; failed import rejects",
  "internals": [
    "HostImportModuleDynamically.",
    "Returns a promise of a module namespace exotic object.",
    "Already-evaluated modules resolve immediately (still async thenable)."
  ],
  "takeaways": [
    "const m = await import('./heavy.js').",
    "Catch load errors.",
    "import(userInput) is a code-load injection risk — allowlist specifiers.",
    "HostImportModuleDynamically."
  ],
  "revision": [
    "Dynamic import(): A late import: fetch/parse/eval that subgraph, then hand me the namespace object.",
    "const m = await import('./heavy.js').",
    "Catch load errors.",
    "Same URL = same instance later.",
    "Trap: import(userInput) is a code-load injection risk — allowlist specifiers."
  ],
  "flashcards": [
    [
      "Dynamic import()",
      "import(specifier) returns a Promise of the module namespace."
    ],
    [
      "Mental model",
      "A late import: fetch/parse/eval that subgraph, then hand me the namespace object."
    ],
    [
      "Common trap",
      "import(userInput) is a code-load injection risk — allowlist specifiers."
    ],
    [
      "const m = await import('./heavy.js').",
      "Catch load errors."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Dynamic import() and where does a beginner first see it?",
      "answerHint": "import(specifier) returns a Promise of the module namespace. The specifier can be computed. Use for code splitting, optional plugins, and conditional polyfills. It is not a require() — it is async, ESM, and cached in the module map after first load. Errors become rejections."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Dynamic import() works and name the main pitfall.",
      "answerHint": "const m = await import('./heavy.js'). Catch load errors. Same URL = same instance later. import() in CJS Node is allowed as a bridge to ESM. Pitfall: import(userInput) is a code-load injection risk — allowlist specifiers."
    },
    {
      "level": "advanced",
      "question": "How would you explain Dynamic import() at an interview, including engine/spec details?",
      "answerHint": "HostImportModuleDynamically. Returns a promise of a module namespace exotic object. Already-evaluated modules resolve immediately (still async thenable)."
    }
  ],
  "pitfalls": [
    "import(userInput) is a code-load injection risk — allowlist specifiers.",
    "import() in CJS Node is allowed as a bridge to ESM."
  ],
  "interview": {
    "expectations": [
      "Explain Dynamic import() without mixing it up with a nearby B1.34 — Modules topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HostImportModuleDynamically."
    ],
    "commonQuestions": [
      "What is Dynamic import()?",
      "Why does JavaScript dynamic import() behave this way?",
      "What is the classic Dynamic import() interview trap?"
    ],
    "traps": [
      "import(userInput) is a code-load injection risk — allowlist specifiers."
    ],
    "misconceptions": [
      "Static import cannot branch on runtime feature tests or load a heavy editor only on that route."
    ],
    "strongSignals": [
      "Separates Dynamic import() from lookalike APIs and can draw the mental model."
    ]
  }
})
