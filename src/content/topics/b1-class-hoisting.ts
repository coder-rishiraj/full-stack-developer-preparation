import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Class Hoisting",
  "whatIsIt": "class C {} is a lexical declaration: it hoists to the block/module like let, with TDZ until the class line runs. You cannot new C() above the class. The class name is also TDZ inside the extends clause of the same class. Unlike function declarations, there is no usable function object before evaluation.",
  "whyExists": "Classes can extend expressions that need the rest of the scope. TDZ prevents using C before its heritage and body are set up.",
  "mentalModel": "A let that also builds a constructor when its line runs — not a hoisted function.",
  "how": [
    "Put base classes above derived classes in a file.",
    "Do not call a class in the same block before its declaration.",
    "class expressions (const C = class {}) follow const TDZ.",
    "typeof C above a class declaration throws, unlike typeof of a function declaration."
  ],
  "callout": {
    "title": "Watch for",
    "text": "typeof MyClass before the class line is ReferenceError, not 'undefined'.",
    "variant": "warning"
  },
  "example": "try { console.log(typeof Box); } catch (e) { console.log(e.name); }\nclass Box {\n  constructor(n) { this.n = n; }\n}\nconsole.log(new Box(1).n);\nconst E = class Ext {};\nconsole.log(new E() instanceof E);\n",
  "exampleCaption": "class TDZ vs usable after the line",
  "internals": [
    "ClassDeclaration evaluation runs ClassDefinitionEvaluation, then InitializeBinding.",
    "Heritage expression evaluates while the class name is still in TDZ for the inner environment.",
    "The constructor is a function object created at evaluation, not at scope instantiate."
  ],
  "takeaways": [
    "Put base classes above derived classes in a file.",
    "Do not call a class in the same block before its declaration.",
    "typeof MyClass before the class line is ReferenceError, not 'undefined'.",
    "ClassDeclaration evaluation runs ClassDefinitionEvaluation, then InitializeBinding."
  ],
  "revision": [
    "Class Hoisting: A let that also builds a constructor when its line runs — not a hoisted function.",
    "Put base classes above derived classes in a file.",
    "Do not call a class in the same block before its declaration.",
    "class expressions (const C = class {}) follow const TDZ.",
    "Trap: typeof MyClass before the class line is ReferenceError, not 'undefined'."
  ],
  "flashcards": [
    [
      "Class Hoisting",
      "class C {} is a lexical declaration: it hoists to the block/module like let, with TDZ until the class line runs."
    ],
    [
      "Mental model",
      "A let that also builds a constructor when its line runs — not a hoisted function."
    ],
    [
      "Common trap",
      "typeof MyClass before the class line is ReferenceError, not 'undefined'."
    ],
    [
      "Put base classes above derived classes in a file.",
      "Do not call a class in the same block before its declaration."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Class Hoisting and where does a beginner first see it?",
      "answerHint": "class C {} is a lexical declaration: it hoists to the block/module like let, with TDZ until the class line runs. You cannot new C() above the class. The class name is also TDZ inside the extends clause of the same class. Unlike function declarations, there is no usable function object before evaluation."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Class Hoisting works and name the main pitfall.",
      "answerHint": "Put base classes above derived classes in a file. Do not call a class in the same block before its declaration. class expressions (const C = class {}) follow const TDZ. typeof C above a class declaration throws, unlike typeof of a function declaration. Pitfall: typeof MyClass before the class line is ReferenceError, not 'undefined'."
    },
    {
      "level": "advanced",
      "question": "How would you explain Class Hoisting at an interview, including engine/spec details?",
      "answerHint": "ClassDeclaration evaluation runs ClassDefinitionEvaluation, then InitializeBinding. Heritage expression evaluates while the class name is still in TDZ for the inner environment. The constructor is a function object created at evaluation, not at scope instantiate."
    }
  ],
  "pitfalls": [
    "typeof MyClass before the class line is ReferenceError, not 'undefined'.",
    "typeof C above a class declaration throws, unlike typeof of a function declaration."
  ],
  "interview": {
    "expectations": [
      "Explain Class Hoisting without mixing it up with a nearby B1.11 — Hoisting & Temporal Dead Zone topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ClassDeclaration evaluation runs ClassDefinitionEvaluation, then InitializeBinding."
    ],
    "commonQuestions": [
      "What is Class Hoisting?",
      "Why does JavaScript class hoisting behave this way?",
      "What is the classic Class Hoisting interview trap?"
    ],
    "traps": [
      "typeof MyClass before the class line is ReferenceError, not 'undefined'."
    ],
    "misconceptions": [
      "Classes can extend expressions that need the rest of the scope. TDZ prevents using C before its heritage and body are set up."
    ],
    "strongSignals": [
      "Separates Class Hoisting from lookalike APIs and can draw the mental model."
    ]
  }
})
