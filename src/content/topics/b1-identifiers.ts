import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Identifiers",
  "whatIsIt": "Identifiers name variables, functions, parameters, and labels. They may start with a Unicode letter, `$`, or `_`, then letters, digits, `$`, `_`, or certain Unicode combining marks. Reserved words cannot be identifiers. Unicode escapes (`\\u0061`) can spell names, which is a footgun in security reviews.",
  "whyExists": "Programs need stable names that survive minification maps and tooling. The spec picked Unicode so non-English names are legal, not just ASCII.",
  "mentalModel": "A name is a key in an environment record. If the lexer will not accept it as IdentifierName (minus reserved words), it cannot be a binding.",
  "how": [
    "Prefer ASCII camelCase in shared codebases unless the team standard says otherwise.",
    "`$` is legal (jQuery history); do not start names with digits.",
    "Private class fields use `#name`, which is not a normal identifier in the outer scope.",
    "Avoid Unicode lookalikes that spoof Latin letters."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`await` is reserved in modules and async functions; a file that worked as a script can break when you add type=module.",
    "variant": "warning"
  },
  "example": "const $el = 'ok';\nconst _privateHint = 1;\nconst π = Math.PI;\nconst café = true;\nconsole.log($el, _privateHint, π > 3, café);\n// const 2bad = 1; // SyntaxError",
  "exampleCaption": "Legal identifier shapes",
  "internals": [
    "IdentifierName vs Identifier: keywords are names in property positions (`obj.default`) but not bindings.",
    "Early error: binding Identifier must not be a reserved word in that goal symbol.",
    "Normalized Unicode (NFC) is not automatically applied — visually identical names can be different bindings."
  ],
  "takeaways": [
    "Prefer ASCII camelCase in shared codebases unless the team standard says otherwise.",
    "`$` is legal (jQuery history); do not start names with digits.",
    "`await` is reserved in modules and async functions; a file that worked as a script can break when you add type=module.",
    "IdentifierName vs Identifier: keywords are names in property positions (`obj.default`) but not bindings."
  ],
  "revision": [
    "Identifiers: A name is a key in an environment record. If the lexer will not accept it as IdentifierName (minus reserved words), it cannot be a binding.",
    "Prefer ASCII camelCase in shared codebases unless the team standard says otherwise.",
    "`$` is legal (jQuery history); do not start names with digits.",
    "Private class fields use `#name`, which is not a normal identifier in the outer scope.",
    "Trap: `await` is reserved in modules and async functions; a file that worked as a script can break when you add type=module."
  ],
  "flashcards": [
    [
      "Identifiers",
      "Identifiers name variables, functions, parameters, and labels."
    ],
    [
      "Mental model",
      "A name is a key in an environment record. If the lexer will not accept it as IdentifierName (minus reserved words), it cannot be a binding."
    ],
    [
      "Common trap",
      "`await` is reserved in modules and async functions; a file that worked as a script can break when you add type=module."
    ],
    [
      "Prefer ASCII camelCase in shared codebases unless the team standard says otherwi",
      "`$` is legal (jQuery history); do not start names with digits."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Identifiers and where does a beginner first see it?",
      "answerHint": "Identifiers name variables, functions, parameters, and labels. They may start with a Unicode letter, `$`, or `_`, then letters, digits, `$`, `_`, or certain Unicode combining marks. Reserved words cannot be identifiers. Unicode escapes (`\\u0061`) can spell names, which is a footgun in security reviews."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Identifiers works and name the main pitfall.",
      "answerHint": "Prefer ASCII camelCase in shared codebases unless the team standard says otherwise. `$` is legal (jQuery history); do not start names with digits. Private class fields use `#name`, which is not a normal identifier in the outer scope. Avoid Unicode lookalikes that spoof Latin letters. Pitfall: `await` is reserved in modules and async functions; a file that worked as a script can break when you add type=module."
    },
    {
      "level": "advanced",
      "question": "How would you explain Identifiers at an interview, including engine/spec details?",
      "answerHint": "IdentifierName vs Identifier: keywords are names in property positions (`obj.default`) but not bindings. Early error: binding Identifier must not be a reserved word in that goal symbol. Normalized Unicode (NFC) is not automatically applied — visually identical names can be different bindings."
    }
  ],
  "pitfalls": [
    "`await` is reserved in modules and async functions; a file that worked as a script can break when you add type=module.",
    "Avoid Unicode lookalikes that spoof Latin letters."
  ],
  "interview": {
    "expectations": [
      "Explain Identifiers without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "IdentifierName vs Identifier: keywords are names in property positions (`obj.default`) but not bindings."
    ],
    "commonQuestions": [
      "What is Identifiers?",
      "Why does JavaScript identifiers behave this way?",
      "What is the classic Identifiers interview trap?"
    ],
    "traps": [
      "`await` is reserved in modules and async functions; a file that worked as a script can break when you add type=module."
    ],
    "misconceptions": [
      "Programs need stable names that survive minification maps and tooling. The spec picked Unicode so non-English names are legal, not just ASCII."
    ],
    "strongSignals": [
      "Separates Identifiers from lookalike APIs and can draw the mental model."
    ]
  }
})
