import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Block Scope",
  "whatIsIt": "Block scope (`let`, `const`, `class`, `function` in strict block) limits a binding to the nearest `{ }`, including `if`, `for`, `while`, `switch`, and bare blocks. Leaving the block ends the binding’s lifetime (unless a closure captured it). `var` is not block-scoped.",
  "whyExists": "C/Java programmers expected braces to hide names. ES2015 delivered that for lexical bindings so loops and ifs could have their own counters.",
  "mentalModel": "Each `{ }` can be a nested office. let/const nameplates come off the door when you leave, unless someone (a closure) kept a key.",
  "how": [
    "Use a bare `{ }` to limit a temporary name.",
    "switch cases share one block unless you wrap case bodies in `{ }`.",
    "for (let i) scope is the loop, with per-iteration clones.",
    "try/catch: the catch binding is scoped to the catch block."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`case 1: let x = 1; case 2: console.log(x)` can TDZ or clash because cases share the switch block.",
    "variant": "warning"
  },
  "example": "{\n  const secret = 42;\n  console.log(secret);\n}\ntry { console.log(secret); } catch (e) { console.log(e.name); }\nswitch (1) {\n  case 1: {\n    const label = 'one';\n    console.log(label);\n    break;\n  }\n}",
  "exampleCaption": "Block const is invisible outside; switch case wrapped",
  "internals": [
    "BlockDeclarationInstantiation runs when entering a block.",
    "switch has a single block; case clauses are labels, not scopes.",
    "Closures keep the environment record alive after the block completes."
  ],
  "takeaways": [
    "Use a bare `{ }` to limit a temporary name.",
    "switch cases share one block unless you wrap case bodies in `{ }`.",
    "`case 1: let x = 1; case 2: console.log(x)` can TDZ or clash because cases share the switch block.",
    "BlockDeclarationInstantiation runs when entering a block."
  ],
  "revision": [
    "Block Scope: Each `{ }` can be a nested office. let/const nameplates come off the door when you leave, unless someone (a closure) kept a key.",
    "Use a bare `{ }` to limit a temporary name.",
    "switch cases share one block unless you wrap case bodies in `{ }`.",
    "for (let i) scope is the loop, with per-iteration clones.",
    "Trap: `case 1: let x = 1; case 2: console.log(x)` can TDZ or clash because cases share the switch block."
  ],
  "flashcards": [
    [
      "Block Scope",
      "Block scope (`let`, `const`, `class`, `function` in strict block) limits a binding to the nearest `{ }`, including `if`, `for`, `while`, `switch`, and bare blocks."
    ],
    [
      "Mental model",
      "Each `{ }` can be a nested office. let/const nameplates come off the door when you leave, unless someone (a closure) kept a key."
    ],
    [
      "Common trap",
      "`case 1: let x = 1; case 2: console.log(x)` can TDZ or clash because cases share the switch block."
    ],
    [
      "Use a bare `{ }` to limit a temporary name.",
      "switch cases share one block unless you wrap case bodies in `{ }`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Block Scope and where does a beginner first see it?",
      "answerHint": "Block scope (`let`, `const`, `class`, `function` in strict block) limits a binding to the nearest `{ }`, including `if`, `for`, `while`, `switch`, and bare blocks. Leaving the block ends the binding’s lifetime (unless a closure captured it). `var` is not block-scoped."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Block Scope works and name the main pitfall.",
      "answerHint": "Use a bare `{ }` to limit a temporary name. switch cases share one block unless you wrap case bodies in `{ }`. for (let i) scope is the loop, with per-iteration clones. try/catch: the catch binding is scoped to the catch block. Pitfall: `case 1: let x = 1; case 2: console.log(x)` can TDZ or clash because cases share the switch block."
    },
    {
      "level": "advanced",
      "question": "How would you explain Block Scope at an interview, including engine/spec details?",
      "answerHint": "BlockDeclarationInstantiation runs when entering a block. switch has a single block; case clauses are labels, not scopes. Closures keep the environment record alive after the block completes."
    }
  ],
  "pitfalls": [
    "`case 1: let x = 1; case 2: console.log(x)` can TDZ or clash because cases share the switch block.",
    "try/catch: the catch binding is scoped to the catch block."
  ],
  "interview": {
    "expectations": [
      "Explain Block Scope without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "BlockDeclarationInstantiation runs when entering a block."
    ],
    "commonQuestions": [
      "What is Block Scope?",
      "Why does JavaScript block scope behave this way?",
      "What is the classic Block Scope interview trap?"
    ],
    "traps": [
      "`case 1: let x = 1; case 2: console.log(x)` can TDZ or clash because cases share the switch block."
    ],
    "misconceptions": [
      "C/Java programmers expected braces to hide names. ES2015 delivered that for lexical bindings so loops and ifs could have their own counters."
    ],
    "strongSignals": [
      "Separates Block Scope from lookalike APIs and can draw the mental model."
    ]
  }
})
