import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Declaration",
  "whatIsIt": "A declaration introduces a binding in a scope: `let x`, `const y = 1`, `var z`, `function f`, `class C`, imports. Declaration is not the same as assigning a value. Some declarations also initialize immediately (`const` must). Duplicate `let` in the same scope is a SyntaxError.",
  "whyExists": "The engine must know which names exist in a scope before running lines, so it can allocate environment slots and catch duplicates.",
  "mentalModel": "Putting a label on a mailbox. Initialization is putting mail in it; assignment later is replacing the mail.",
  "how": [
    "`let x;` declares and starts uninitialized until that statement runs.",
    "`const x = 1` must initialize in the declaration.",
    "Function declarations create a binding and initialize it during instantiation (classic scripts).",
    "Do not redeclare the same let/const in one scope."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using a `let` on the line before its declaration (even inside the same block) throws TDZ, unlike `var`.",
    "variant": "warning"
  },
  "example": "let a;\nconsole.log(a); // undefined after the declaration runs\na = 10;\nconst b = 20;\nfunction f() { return a + b; }\nconsole.log(f());\n// let a; // SyntaxError in this scope",
  "exampleCaption": "Declare, then assign; const needs a value",
  "internals": [
    "VarScopedDeclarations vs LexicallyScopedDeclarations are collected in instantiation.",
    "Duplicate lexical bindings in one scope are early errors.",
    "for (let i) creates a fresh binding per iteration for closures."
  ],
  "takeaways": [
    "`let x;` declares and starts uninitialized until that statement runs.",
    "`const x = 1` must initialize in the declaration.",
    "Using a `let` on the line before its declaration (even inside the same block) throws TDZ, unlike `var`.",
    "VarScopedDeclarations vs LexicallyScopedDeclarations are collected in instantiation."
  ],
  "revision": [
    "Declaration: Putting a label on a mailbox. Initialization is putting mail in it; assignment later is replacing the mail.",
    "`let x;` declares and starts uninitialized until that statement runs.",
    "`const x = 1` must initialize in the declaration.",
    "Function declarations create a binding and initialize it during instantiation (classic scripts).",
    "Trap: Using a `let` on the line before its declaration (even inside the same block) throws TDZ, unlike `var`."
  ],
  "flashcards": [
    [
      "Declaration",
      "A declaration introduces a binding in a scope: `let x`, `const y = 1`, `var z`, `function f`, `class C`, imports."
    ],
    [
      "Mental model",
      "Putting a label on a mailbox. Initialization is putting mail in it; assignment later is replacing the mail."
    ],
    [
      "Common trap",
      "Using a `let` on the line before its declaration (even inside the same block) throws TDZ, unlike `var`."
    ],
    [
      "`let x;` declares and starts uninitialized until that statement runs.",
      "`const x = 1` must initialize in the declaration."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Declaration and where does a beginner first see it?",
      "answerHint": "A declaration introduces a binding in a scope: `let x`, `const y = 1`, `var z`, `function f`, `class C`, imports. Declaration is not the same as assigning a value. Some declarations also initialize immediately (`const` must). Duplicate `let` in the same scope is a SyntaxError."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Declaration works and name the main pitfall.",
      "answerHint": "`let x;` declares and starts uninitialized until that statement runs. `const x = 1` must initialize in the declaration. Function declarations create a binding and initialize it during instantiation (classic scripts). Do not redeclare the same let/const in one scope. Pitfall: Using a `let` on the line before its declaration (even inside the same block) throws TDZ, unlike `var`."
    },
    {
      "level": "advanced",
      "question": "How would you explain Declaration at an interview, including engine/spec details?",
      "answerHint": "VarScopedDeclarations vs LexicallyScopedDeclarations are collected in instantiation. Duplicate lexical bindings in one scope are early errors. for (let i) creates a fresh binding per iteration for closures."
    }
  ],
  "pitfalls": [
    "Using a `let` on the line before its declaration (even inside the same block) throws TDZ, unlike `var`.",
    "Do not redeclare the same let/const in one scope."
  ],
  "interview": {
    "expectations": [
      "Explain Declaration without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "VarScopedDeclarations vs LexicallyScopedDeclarations are collected in instantiation."
    ],
    "commonQuestions": [
      "What is Declaration?",
      "Why does JavaScript declaration behave this way?",
      "What is the classic Declaration interview trap?"
    ],
    "traps": [
      "Using a `let` on the line before its declaration (even inside the same block) throws TDZ, unlike `var`."
    ],
    "misconceptions": [
      "The engine must know which names exist in a scope before running lines, so it can allocate environment slots and catch duplicates."
    ],
    "strongSignals": [
      "Separates Declaration from lookalike APIs and can draw the mental model."
    ]
  }
})
