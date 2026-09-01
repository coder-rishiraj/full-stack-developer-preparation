import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Shadowing",
  "whatIsIt": "Shadowing is an inner binding with the same name as an outer one. Lookups stop at the inner name; the outer is hidden until the inner scope ends. let x in a block shadows outer x immediately (TDZ until the line). Parameters can shadow outer names. You cannot reach the outer x except by not using the same name (or some globalThis tricks for globals).",
  "whyExists": "Inner helpers need local names without inventing unique names for everything. Shadowing is the collision policy: inner wins.",
  "mentalModel": "A closer sign covering a farther sign. The farther sign is still there; you just cannot see it from here.",
  "how": [
    "Rename instead of shadowing if both values are needed.",
    "Be careful with inner const x in a block that still wants outer x in a default initializer.",
    "Catch (e) shadows outer e.",
    "Do not shadow Map, Error, document."
  ],
  "callout": {
    "title": "Watch for",
    "text": "if (typeof x === 'undefined') { let x = 1 } — typeof sees the inner x in TDZ if the let is in that block.",
    "variant": "warning"
  },
  "example": "const value = 'outer';\nfunction f(value) {\n  console.log('param', value);\n  {\n    const value = 'block';\n    console.log('block', value);\n  }\n  console.log('after', value);\n}\nf('arg');\nconsole.log(value);\n",
  "exampleCaption": "Parameter and block shadowing outer const",
  "internals": [
    "HasBinding on the inner record is true as soon as the environment is created.",
    "GetBindingValue still throws if uninitialized (TDZ).",
    "There is no with-outer-prefix operator for declarative bindings."
  ],
  "takeaways": [
    "Rename instead of shadowing if both values are needed.",
    "Be careful with inner const x in a block that still wants outer x in a default initializer.",
    "if (typeof x === 'undefined') { let x = 1 } — typeof sees the inner x in TDZ if the let is in that block.",
    "HasBinding on the inner record is true as soon as the environment is created."
  ],
  "revision": [
    "Shadowing: A closer sign covering a farther sign. The farther sign is still there; you just cannot see it from here.",
    "Rename instead of shadowing if both values are needed.",
    "Be careful with inner const x in a block that still wants outer x in a default initializer.",
    "Catch (e) shadows outer e.",
    "Trap: if (typeof x === 'undefined') { let x = 1 } — typeof sees the inner x in TDZ if the let is in that block."
  ],
  "flashcards": [
    [
      "Shadowing",
      "Shadowing is an inner binding with the same name as an outer one."
    ],
    [
      "Mental model",
      "A closer sign covering a farther sign. The farther sign is still there; you just cannot see it from here."
    ],
    [
      "Common trap",
      "if (typeof x === 'undefined') { let x = 1 } — typeof sees the inner x in TDZ if the let is in that block."
    ],
    [
      "Rename instead of shadowing if both values are needed.",
      "Be careful with inner const x in a block that still wants outer x in a default initializer."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Shadowing and where does a beginner first see it?",
      "answerHint": "Shadowing is an inner binding with the same name as an outer one. Lookups stop at the inner name; the outer is hidden until the inner scope ends. let x in a block shadows outer x immediately (TDZ until the line). Parameters can shadow outer names. You cannot reach the outer x except by not using the same name (or some globalThis tricks for globals)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Shadowing works and name the main pitfall.",
      "answerHint": "Rename instead of shadowing if both values are needed. Be careful with inner const x in a block that still wants outer x in a default initializer. Catch (e) shadows outer e. Do not shadow Map, Error, document. Pitfall: if (typeof x === 'undefined') { let x = 1 } — typeof sees the inner x in TDZ if the let is in that block."
    },
    {
      "level": "advanced",
      "question": "How would you explain Shadowing at an interview, including engine/spec details?",
      "answerHint": "HasBinding on the inner record is true as soon as the environment is created. GetBindingValue still throws if uninitialized (TDZ). There is no with-outer-prefix operator for declarative bindings."
    }
  ],
  "pitfalls": [
    "if (typeof x === 'undefined') { let x = 1 } — typeof sees the inner x in TDZ if the let is in that block.",
    "Do not shadow Map, Error, document."
  ],
  "interview": {
    "expectations": [
      "Explain Shadowing without mixing it up with a nearby B1.10 — Scope & Lexical Environments topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HasBinding on the inner record is true as soon as the environment is created."
    ],
    "commonQuestions": [
      "What is Shadowing?",
      "Why does JavaScript shadowing behave this way?",
      "What is the classic Shadowing interview trap?"
    ],
    "traps": [
      "if (typeof x === 'undefined') { let x = 1 } — typeof sees the inner x in TDZ if the let is in that block."
    ],
    "misconceptions": [
      "Inner helpers need local names without inventing unique names for everything. Shadowing is the collision policy: inner wins."
    ],
    "strongSignals": [
      "Separates Shadowing from lookalike APIs and can draw the mental model."
    ]
  }
})
