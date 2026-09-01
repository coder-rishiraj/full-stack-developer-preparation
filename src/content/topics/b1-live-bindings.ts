import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Live Bindings",
  "whatIsIt": "ESM imports are live: if the exporting module updates an exported let, importers see the new value. You cannot assign to an imported binding (it is const-like). CJS importers of a primitive get a copy. This matters for circular deps and for mutable exported state (generally discouraged).",
  "whyExists": "Cycles need to see the binding after it initializes. Live bindings make that possible without a second lookup API.",
  "mentalModel": "You were given a window onto their variable, not a photocopied number. The window is read-only from your side.",
  "how": [
    "Do not mutate exported lets as an API — export functions.",
    "Imported names cannot be assigned.",
    "namespace.n can reflect live values for lets.",
    "CJS: mutating the exported object’s fields is shared (same object)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "const { n } = await import(m) copies the current primitive — that destructure is not live.",
    "variant": "warning"
  },
  "example": "let n = 1;\nexport { n };\nexport function bump() { n += 1; }\n// importer:\nimport { n, bump } from './c.js';\nbump();\nconsole.log(n);\ntry { n = 3; } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Imported let is live and not assignable",
  "internals": [
    "Module Environment Record GetBindingValue reads the target module’s slot.",
    "Imported Binding is immutable from the importer.",
    "Namespace objects have accessors that read live."
  ],
  "takeaways": [
    "Do not mutate exported lets as an API — export functions.",
    "Imported names cannot be assigned.",
    "const { n } = await import(m) copies the current primitive — that destructure is not live.",
    "Module Environment Record GetBindingValue reads the target module’s slot."
  ],
  "revision": [
    "Live Bindings: You were given a window onto their variable, not a photocopied number. The window is read-only from your side.",
    "Do not mutate exported lets as an API — export functions.",
    "Imported names cannot be assigned.",
    "namespace.n can reflect live values for lets.",
    "Trap: const { n } = await import(m) copies the current primitive — that destructure is not live."
  ],
  "flashcards": [
    [
      "Live Bindings",
      "ESM imports are live: if the exporting module updates an exported let, importers see the new value."
    ],
    [
      "Mental model",
      "You were given a window onto their variable, not a photocopied number. The window is read-only from your side."
    ],
    [
      "Common trap",
      "const { n } = await import(m) copies the current primitive — that destructure is not live."
    ],
    [
      "Do not mutate exported lets as an API — export functions.",
      "Imported names cannot be assigned."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Live Bindings and where does a beginner first see it?",
      "answerHint": "ESM imports are live: if the exporting module updates an exported let, importers see the new value. You cannot assign to an imported binding (it is const-like). CJS importers of a primitive get a copy. This matters for circular deps and for mutable exported state (generally discouraged)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Live Bindings works and name the main pitfall.",
      "answerHint": "Do not mutate exported lets as an API — export functions. Imported names cannot be assigned. namespace.n can reflect live values for lets. CJS: mutating the exported object’s fields is shared (same object). Pitfall: const { n } = await import(m) copies the current primitive — that destructure is not live."
    },
    {
      "level": "advanced",
      "question": "How would you explain Live Bindings at an interview, including engine/spec details?",
      "answerHint": "Module Environment Record GetBindingValue reads the target module’s slot. Imported Binding is immutable from the importer. Namespace objects have accessors that read live."
    }
  ],
  "pitfalls": [
    "const { n } = await import(m) copies the current primitive — that destructure is not live.",
    "CJS: mutating the exported object’s fields is shared (same object)."
  ],
  "interview": {
    "expectations": [
      "Explain Live Bindings without mixing it up with a nearby B1.34 — Modules topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Module Environment Record GetBindingValue reads the target module’s slot."
    ],
    "commonQuestions": [
      "What is Live Bindings?",
      "Why does JavaScript live bindings behave this way?",
      "What is the classic Live Bindings interview trap?"
    ],
    "traps": [
      "const { n } = await import(m) copies the current primitive — that destructure is not live."
    ],
    "misconceptions": [
      "Cycles need to see the binding after it initializes. Live bindings make that possible without a second lookup API."
    ],
    "strongSignals": [
      "Separates Live Bindings from lookalike APIs and can draw the mental model."
    ]
  }
})
