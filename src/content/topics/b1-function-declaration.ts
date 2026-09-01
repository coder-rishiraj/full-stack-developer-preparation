import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Function Declaration",
  "whatIsIt": "function name() {} is a declaration. In classic scripts it is hoisted (created before evaluation) and available in the whole enclosing function/script. In blocks, sloppy mode has Annex B quirks; modules/strict treat it as block-scoped. Declarations cannot be in if without a block in strict the same way as var-like old behavior.",
  "whyExists": "Named, reusable procedures are the unit of work. Hoisting let people call helpers before they appeared in the file.",
  "mentalModel": "A named recipe pinned to the scope at instantiation time (in classic functions), not at the line you wrote it.",
  "how": [
    "Use declarations for named top-level helpers.",
    "Do not rely on function-in-block sloppy hoisting.",
    "Prefer const fn = () => in modules for a consistent mental model, or keep declarations at top level.",
    "Name things for stack traces."
  ],
  "callout": {
    "title": "Watch for",
    "text": "In some sloppy browsers, function inner inside a block is visible outside the block — do not depend on it.",
    "variant": "warning"
  },
  "example": "console.log(add(2, 3));\nfunction add(a, b) { return a + b; }\n{\n  function inner() { return 'block'; }\n  console.log(inner());\n}\nconsole.log(typeof add);\n",
  "exampleCaption": "Hoisted declaration vs a function inside a block",
  "internals": [
    "HoistableDeclaration Instantiation binds the function object during evaluation setup.",
    "Annex B.3.3 mutates block-level functions onto the enclosing var environment in sloppy scripts.",
    "Modules are strict; block functions are lexical."
  ],
  "takeaways": [
    "Use declarations for named top-level helpers.",
    "Do not rely on function-in-block sloppy hoisting.",
    "In some sloppy browsers, function inner inside a block is visible outside the block — do not depend on it.",
    "HoistableDeclaration Instantiation binds the function object during evaluation setup."
  ],
  "revision": [
    "Function Declaration: A named recipe pinned to the scope at instantiation time (in classic functions), not at the line you wrote it.",
    "Use declarations for named top-level helpers.",
    "Do not rely on function-in-block sloppy hoisting.",
    "Prefer const fn = () => in modules for a consistent mental model, or keep declarations at top level.",
    "Trap: In some sloppy browsers, function inner inside a block is visible outside the block — do not depend on it."
  ],
  "flashcards": [
    [
      "Function Declaration",
      "function name() {} is a declaration."
    ],
    [
      "Mental model",
      "A named recipe pinned to the scope at instantiation time (in classic functions), not at the line you wrote it."
    ],
    [
      "Common trap",
      "In some sloppy browsers, function inner inside a block is visible outside the block — do not depend on it."
    ],
    [
      "Use declarations for named top-level helpers.",
      "Do not rely on function-in-block sloppy hoisting."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Function Declaration and where does a beginner first see it?",
      "answerHint": "function name() {} is a declaration. In classic scripts it is hoisted (created before evaluation) and available in the whole enclosing function/script. In blocks, sloppy mode has Annex B quirks; modules/strict treat it as block-scoped. Declarations cannot be in if without a block in strict the same way as var-like old behavior."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Function Declaration works and name the main pitfall.",
      "answerHint": "Use declarations for named top-level helpers. Do not rely on function-in-block sloppy hoisting. Prefer const fn = () => in modules for a consistent mental model, or keep declarations at top level. Name things for stack traces. Pitfall: In some sloppy browsers, function inner inside a block is visible outside the block — do not depend on it."
    },
    {
      "level": "advanced",
      "question": "How would you explain Function Declaration at an interview, including engine/spec details?",
      "answerHint": "HoistableDeclaration Instantiation binds the function object during evaluation setup. Annex B.3.3 mutates block-level functions onto the enclosing var environment in sloppy scripts. Modules are strict; block functions are lexical."
    }
  ],
  "pitfalls": [
    "In some sloppy browsers, function inner inside a block is visible outside the block — do not depend on it.",
    "Name things for stack traces."
  ],
  "interview": {
    "expectations": [
      "Explain Function Declaration without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HoistableDeclaration Instantiation binds the function object during evaluation setup."
    ],
    "commonQuestions": [
      "What is Function Declaration?",
      "Why does JavaScript function declaration behave this way?",
      "What is the classic Function Declaration interview trap?"
    ],
    "traps": [
      "In some sloppy browsers, function inner inside a block is visible outside the block — do not depend on it."
    ],
    "misconceptions": [
      "Named, reusable procedures are the unit of work. Hoisting let people call helpers before they appeared in the file."
    ],
    "strongSignals": [
      "Separates Function Declaration from lookalike APIs and can draw the mental model."
    ]
  }
})
