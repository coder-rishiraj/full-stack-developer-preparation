import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Traps (get/set/has/deleteProperty)",
  "whatIsIt": "Common traps: get, set, has (in), deleteProperty, ownKeys, getOwnPropertyDescriptor, defineProperty, apply, construct. Missing traps forward to the target. getPrototypeOf/setPrototypeOf exist too. Invariants: you cannot report a non-configurable property as missing if it exists on a non-extensible target.",
  "whyExists": "Each object internal method needed a hook so a proxy can emulate exotic objects fully.",
  "mentalModel": "A switchboard: one socket per kind of operation. Unplugged sockets go straight to the cabinet.",
  "how": [
    "Implement the traps you need; let the rest default.",
    "ownKeys + getOwnPropertyDescriptor together for Object.keys to work.",
    "apply trap for function proxies.",
    "Read the invariant errors — they mean your lie was illegal."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Hiding a non-configurable property via ownKeys throws — you cannot lie that way.",
    "variant": "warning"
  },
  "example": "const p = new Proxy({ a: 1, b: 2 }, {\n  has(t, k) { return k === 'a'; },\n  ownKeys() { return ['a']; },\n  getOwnPropertyDescriptor(t, k) {\n    if (k === 'a') return { value: t.a, enumerable: true, configurable: true, writable: true };\n  },\n  get(t, k) { return k === 'a' ? t.a : undefined; },\n});\nconsole.log('a' in p, 'b' in p, Object.keys(p), p.b);\n",
  "exampleCaption": "has/ownKeys/get cooperating to hide b",
  "internals": [
    "Each trap corresponds to an internal method on the Proxy object.",
    "Invariant checks run after the trap returns.",
    "Function proxies need apply/construct to be callable/newable."
  ],
  "takeaways": [
    "Implement the traps you need; let the rest default.",
    "ownKeys + getOwnPropertyDescriptor together for Object.keys to work.",
    "Hiding a non-configurable property via ownKeys throws — you cannot lie that way.",
    "Each trap corresponds to an internal method on the Proxy object."
  ],
  "revision": [
    "Traps (get/set/has/deleteProperty): A switchboard: one socket per kind of operation. Unplugged sockets go straight to the cabinet.",
    "Implement the traps you need; let the rest default.",
    "ownKeys + getOwnPropertyDescriptor together for Object.keys to work.",
    "apply trap for function proxies.",
    "Trap: Hiding a non-configurable property via ownKeys throws — you cannot lie that way."
  ],
  "flashcards": [
    [
      "Traps (get/set/has/deleteProperty)",
      "Common traps: get, set, has (in), deleteProperty, ownKeys, getOwnPropertyDescriptor, defineProperty, apply, construct."
    ],
    [
      "Mental model",
      "A switchboard: one socket per kind of operation. Unplugged sockets go straight to the cabinet."
    ],
    [
      "Common trap",
      "Hiding a non-configurable property via ownKeys throws — you cannot lie that way."
    ],
    [
      "Implement the traps you need; let the rest default.",
      "ownKeys + getOwnPropertyDescriptor together for Object.keys to work."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Traps (get/set/has/deleteProperty) and where does a beginner first see it?",
      "answerHint": "Common traps: get, set, has (in), deleteProperty, ownKeys, getOwnPropertyDescriptor, defineProperty, apply, construct. Missing traps forward to the target. getPrototypeOf/setPrototypeOf exist too. Invariants: you cannot report a non-configurable property as missing if it exists on a non-extensible target."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Traps (get/set/has/deleteProperty) works and name the main pitfall.",
      "answerHint": "Implement the traps you need; let the rest default. ownKeys + getOwnPropertyDescriptor together for Object.keys to work. apply trap for function proxies. Read the invariant errors — they mean your lie was illegal. Pitfall: Hiding a non-configurable property via ownKeys throws — you cannot lie that way."
    },
    {
      "level": "advanced",
      "question": "How would you explain Traps (get/set/has/deleteProperty) at an interview, including engine/spec details?",
      "answerHint": "Each trap corresponds to an internal method on the Proxy object. Invariant checks run after the trap returns. Function proxies need apply/construct to be callable/newable."
    }
  ],
  "pitfalls": [
    "Hiding a non-configurable property via ownKeys throws — you cannot lie that way.",
    "Read the invariant errors — they mean your lie was illegal."
  ],
  "interview": {
    "expectations": [
      "Explain Traps (get/set/has/deleteProperty) without mixing it up with a nearby B1.41 — Proxy & Reflect topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Each trap corresponds to an internal method on the Proxy object."
    ],
    "commonQuestions": [
      "What is Traps (get/set/has/deleteProperty)?",
      "Why does JavaScript traps (get/set/has/deleteproperty) behave this way?",
      "What is the classic Traps (get/set/has/deleteProperty) interview trap?"
    ],
    "traps": [
      "Hiding a non-configurable property via ownKeys throws — you cannot lie that way."
    ],
    "misconceptions": [
      "Each object internal method needed a hook so a proxy can emulate exotic objects fully."
    ],
    "strongSignals": [
      "Separates Traps (get/set/has/deleteProperty) from lookalike APIs and can draw the mental model."
    ]
  }
})
