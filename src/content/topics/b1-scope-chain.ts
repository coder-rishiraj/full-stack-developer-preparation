import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Scope Chain",
  "whatIsIt": "The scope chain is the linked list of environment records from inner to outer: block → function → module/global. Identifier lookup walks this chain. The chain is not the prototype chain (that is for object properties). Closures keep a prefix of this chain alive.",
  "whyExists": "Nested scopes need a search order. A chain is the simplest structure for ‘inner wins, then outer.’",
  "mentalModel": "A stack of dictionaries. Miss in the top dictionary, look in the next, until global, then ReferenceError.",
  "how": [
    "Shadowing: inner name hides outer on the chain.",
    "Do not confuse obj.x lookup (prototypes) with x lookup (scope chain).",
    "Global is the last link for classic scripts.",
    "with/eval can insert extra links."
  ],
  "callout": {
    "title": "Watch for",
    "text": "obj.x is not found by walking scopes — if x is not a binding, you need the object.",
    "variant": "warning"
  },
  "example": "const x = 'global';\nfunction f() {\n  const x = 'function';\n  {\n    const x = 'block';\n    console.log(x);\n  }\n  console.log(x);\n}\nf();\nconsole.log(x);\n",
  "exampleCaption": "Three links on the scope chain all named x",
  "internals": [
    "Environment Record [[OuterEnv]] forms the chain.",
    "Global object environment + declarative environment sit at the end.",
    "Unresolvable references throw in strict GetValue."
  ],
  "takeaways": [
    "Shadowing: inner name hides outer on the chain.",
    "Do not confuse obj.x lookup (prototypes) with x lookup (scope chain).",
    "obj.x is not found by walking scopes — if x is not a binding, you need the object.",
    "Environment Record [[OuterEnv]] forms the chain."
  ],
  "revision": [
    "Scope Chain: A stack of dictionaries. Miss in the top dictionary, look in the next, until global, then ReferenceError.",
    "Shadowing: inner name hides outer on the chain.",
    "Do not confuse obj.x lookup (prototypes) with x lookup (scope chain).",
    "Global is the last link for classic scripts.",
    "Trap: obj.x is not found by walking scopes — if x is not a binding, you need the object."
  ],
  "flashcards": [
    [
      "Scope Chain",
      "The scope chain is the linked list of environment records from inner to outer: block → function → module/global."
    ],
    [
      "Mental model",
      "A stack of dictionaries. Miss in the top dictionary, look in the next, until global, then ReferenceError."
    ],
    [
      "Common trap",
      "obj.x is not found by walking scopes — if x is not a binding, you need the object."
    ],
    [
      "Shadowing: inner name hides outer on the chain.",
      "Do not confuse obj.x lookup (prototypes) with x lookup (scope chain)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Scope Chain and where does a beginner first see it?",
      "answerHint": "The scope chain is the linked list of environment records from inner to outer: block → function → module/global. Identifier lookup walks this chain. The chain is not the prototype chain (that is for object properties). Closures keep a prefix of this chain alive."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Scope Chain works and name the main pitfall.",
      "answerHint": "Shadowing: inner name hides outer on the chain. Do not confuse obj.x lookup (prototypes) with x lookup (scope chain). Global is the last link for classic scripts. with/eval can insert extra links. Pitfall: obj.x is not found by walking scopes — if x is not a binding, you need the object."
    },
    {
      "level": "advanced",
      "question": "How would you explain Scope Chain at an interview, including engine/spec details?",
      "answerHint": "Environment Record [[OuterEnv]] forms the chain. Global object environment + declarative environment sit at the end. Unresolvable references throw in strict GetValue."
    }
  ],
  "pitfalls": [
    "obj.x is not found by walking scopes — if x is not a binding, you need the object.",
    "with/eval can insert extra links."
  ],
  "interview": {
    "expectations": [
      "Explain Scope Chain without mixing it up with a nearby B1.10 — Scope & Lexical Environments topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Environment Record [[OuterEnv]] forms the chain."
    ],
    "commonQuestions": [
      "What is Scope Chain?",
      "Why does JavaScript scope chain behave this way?",
      "What is the classic Scope Chain interview trap?"
    ],
    "traps": [
      "obj.x is not found by walking scopes — if x is not a binding, you need the object."
    ],
    "misconceptions": [
      "Nested scopes need a search order. A chain is the simplest structure for ‘inner wins, then outer.’"
    ],
    "strongSignals": [
      "Separates Scope Chain from lookalike APIs and can draw the mental model."
    ]
  }
})
