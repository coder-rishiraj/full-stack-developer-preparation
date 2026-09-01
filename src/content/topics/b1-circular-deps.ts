import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Circular Dependencies",
  "whatIsIt": "Circular imports: A imports B imports A. ESM links first, then evaluates one module; the other may see uninitialized live bindings (TDZ) if it uses them at top level. CJS: one module.exports may still be incomplete when the other require runs. Fix: delay using the import until a function call, or break the cycle.",
  "whyExists": "Real graphs have cycles (types, registries). The module system still has to start evaluating somewhere.",
  "mentalModel": "Two rooms with windows into each other. If you reach through at construction time, the other room may still be empty.",
  "how": [
    "Move usage into functions called later.",
    "Extract a third module both import.",
    "Avoid top-level side effects that need the cycle.",
    "In CJS, assign exports before requiring the peer."
  ],
  "callout": {
    "title": "Watch for",
    "text": "export const x = helperFromPeer() at top level in a cycle → TDZ or undefined CJS export.",
    "variant": "warning"
  },
  "example": "export function fromA() { return 'A' + fromB(); }\nimport { fromB } from './b.js';\n// b.js: import { fromA } from './a.js'; export function fromB(){ return 'B'; }\nfunction fromB() { return 'B'; }\nconsole.log('A' + fromB());\n",
  "exampleCaption": "Safe pattern: functions run after both modules evaluated",
  "internals": [
    "ESM: inner module evaluation can run while outer is still evaluating.",
    "TDZ on imported let until Initialize finishes in the exporter.",
    "CJS partial exports object is already cached."
  ],
  "takeaways": [
    "Move usage into functions called later.",
    "Extract a third module both import.",
    "export const x = helperFromPeer() at top level in a cycle → TDZ or undefined CJS export.",
    "ESM: inner module evaluation can run while outer is still evaluating."
  ],
  "revision": [
    "Circular Dependencies: Two rooms with windows into each other. If you reach through at construction time, the other room may still be empty.",
    "Move usage into functions called later.",
    "Extract a third module both import.",
    "Avoid top-level side effects that need the cycle.",
    "Trap: export const x = helperFromPeer() at top level in a cycle → TDZ or undefined CJS export."
  ],
  "flashcards": [
    [
      "Circular Dependencies",
      "Circular imports: A imports B imports A."
    ],
    [
      "Mental model",
      "Two rooms with windows into each other. If you reach through at construction time, the other room may still be empty."
    ],
    [
      "Common trap",
      "export const x = helperFromPeer() at top level in a cycle → TDZ or undefined CJS export."
    ],
    [
      "Move usage into functions called later.",
      "Extract a third module both import."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Circular Dependencies and where does a beginner first see it?",
      "answerHint": "Circular imports: A imports B imports A. ESM links first, then evaluates one module; the other may see uninitialized live bindings (TDZ) if it uses them at top level. CJS: one module.exports may still be incomplete when the other require runs. Fix: delay using the import until a function call, or break the cycle."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Circular Dependencies works and name the main pitfall.",
      "answerHint": "Move usage into functions called later. Extract a third module both import. Avoid top-level side effects that need the cycle. In CJS, assign exports before requiring the peer. Pitfall: export const x = helperFromPeer() at top level in a cycle → TDZ or undefined CJS export."
    },
    {
      "level": "advanced",
      "question": "How would you explain Circular Dependencies at an interview, including engine/spec details?",
      "answerHint": "ESM: inner module evaluation can run while outer is still evaluating. TDZ on imported let until Initialize finishes in the exporter. CJS partial exports object is already cached."
    }
  ],
  "pitfalls": [
    "export const x = helperFromPeer() at top level in a cycle → TDZ or undefined CJS export.",
    "In CJS, assign exports before requiring the peer."
  ],
  "interview": {
    "expectations": [
      "Explain Circular Dependencies without mixing it up with a nearby B1.34 — Modules topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ESM: inner module evaluation can run while outer is still evaluating."
    ],
    "commonQuestions": [
      "What is Circular Dependencies?",
      "Why does JavaScript circular dependencies behave this way?",
      "What is the classic Circular Dependencies interview trap?"
    ],
    "traps": [
      "export const x = helperFromPeer() at top level in a cycle → TDZ or undefined CJS export."
    ],
    "misconceptions": [
      "Real graphs have cycles (types, registries). The module system still has to start evaluating somewhere."
    ],
    "strongSignals": [
      "Separates Circular Dependencies from lookalike APIs and can draw the mental model."
    ]
  }
})
