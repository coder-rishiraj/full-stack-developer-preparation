import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Temporal Dead Zone",
  "whatIsIt": "The Temporal Dead Zone is the time from entering a scope until a `let`/`const`/`class` declaration is evaluated. Accessing the binding in that window throws ReferenceError. The binding exists (so it shadows outer names) but is uninitialized. `typeof` on a TDZ binding also throws, unlike `typeof` on an undeclared name.",
  "whyExists": "If let behaved like var (`undefined` before the line), `let x = x` would silently use undefined instead of catching a typo/shadow bug. TDZ makes initialization order real.",
  "mentalModel": "The name is reserved in the room, but the light is off until the declaration line. Touching it is an error, not undefined.",
  "how": [
    "Do not use a let/const above its declaration, including in default params of the same scope.",
    "Inner let x shadows outer x immediately when you enter the block — even before the inner line.",
    "`typeof undeclared` is \"undefined\"; `typeof tdzLet` throws.",
    "class names are also TDZ until the class statement runs."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`if (typeof x === \"undefined\") let x = 1` is not a safe existence check — typeof hits TDZ if x is declared later in the block.",
    "variant": "warning"
  },
  "example": "const x = 1;\n{\n  try { console.log(x); } catch (e) { console.log('tdz', e.name); }\n  const x = 2;\n  console.log('after', x);\n}\nconsole.log('outer', x);",
  "exampleCaption": "Inner const shadows immediately and TDZ-throws",
  "internals": [
    "InitializeBinding from uninitialized to a value happens at evaluation of the declaration.",
    "GetBindingValue throws if IsUninitializedBinding is true.",
    "Shadowing starts at BlockDeclarationInstantiation, not at the line of source."
  ],
  "takeaways": [
    "Do not use a let/const above its declaration, including in default params of the same scope.",
    "Inner let x shadows outer x immediately when you enter the block — even before the inner line.",
    "`if (typeof x === \"undefined\") let x = 1` is not a safe existence check — typeof hits TDZ if x is declared later in the block.",
    "InitializeBinding from uninitialized to a value happens at evaluation of the declaration."
  ],
  "revision": [
    "Temporal Dead Zone: The name is reserved in the room, but the light is off until the declaration line. Touching it is an error, not undefined.",
    "Do not use a let/const above its declaration, including in default params of the same scope.",
    "Inner let x shadows outer x immediately when you enter the block — even before the inner line.",
    "`typeof undeclared` is \"undefined\"; `typeof tdzLet` throws.",
    "Trap: `if (typeof x === \"undefined\") let x = 1` is not a safe existence check — typeof hits TDZ if x is declared later in the block."
  ],
  "flashcards": [
    [
      "Temporal Dead Zone",
      "The Temporal Dead Zone is the time from entering a scope until a `let`/`const`/`class` declaration is evaluated."
    ],
    [
      "Mental model",
      "The name is reserved in the room, but the light is off until the declaration line. Touching it is an error, not undefined."
    ],
    [
      "Common trap",
      "`if (typeof x === \"undefined\") let x = 1` is not a safe existence check — typeof hits TDZ if x is declared later in the block."
    ],
    [
      "Do not use a let/const above its declaration, including in default params of the",
      "Inner let x shadows outer x immediately when you enter the block — even before the inner line."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Temporal Dead Zone and where does a beginner first see it?",
      "answerHint": "The Temporal Dead Zone is the time from entering a scope until a `let`/`const`/`class` declaration is evaluated. Accessing the binding in that window throws ReferenceError. The binding exists (so it shadows outer names) but is uninitialized. `typeof` on a TDZ binding also throws, unlike `typeof` on an undeclared name."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Temporal Dead Zone works and name the main pitfall.",
      "answerHint": "Do not use a let/const above its declaration, including in default params of the same scope. Inner let x shadows outer x immediately when you enter the block — even before the inner line. `typeof undeclared` is \"undefined\"; `typeof tdzLet` throws. class names are also TDZ until the class statement runs. Pitfall: `if (typeof x === \"undefined\") let x = 1` is not a safe existence check — typeof hits TDZ if x is declared later in the block."
    },
    {
      "level": "advanced",
      "question": "How would you explain Temporal Dead Zone at an interview, including engine/spec details?",
      "answerHint": "InitializeBinding from uninitialized to a value happens at evaluation of the declaration. GetBindingValue throws if IsUninitializedBinding is true. Shadowing starts at BlockDeclarationInstantiation, not at the line of source."
    }
  ],
  "pitfalls": [
    "`if (typeof x === \"undefined\") let x = 1` is not a safe existence check — typeof hits TDZ if x is declared later in the block.",
    "class names are also TDZ until the class statement runs."
  ],
  "interview": {
    "expectations": [
      "Explain Temporal Dead Zone without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "InitializeBinding from uninitialized to a value happens at evaluation of the declaration."
    ],
    "commonQuestions": [
      "What is Temporal Dead Zone?",
      "Why does JavaScript temporal dead zone behave this way?",
      "What is the classic Temporal Dead Zone interview trap?"
    ],
    "traps": [
      "`if (typeof x === \"undefined\") let x = 1` is not a safe existence check — typeof hits TDZ if x is declared later in the block."
    ],
    "misconceptions": [
      "If let behaved like var (`undefined` before the line), `let x = x` would silently use undefined instead of catching a typo/shadow bug. TDZ makes initialization order real."
    ],
    "strongSignals": [
      "Separates Temporal Dead Zone from lookalike APIs and can draw the mental model."
    ]
  }
})
