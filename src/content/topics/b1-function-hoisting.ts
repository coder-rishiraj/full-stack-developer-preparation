import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Function Hoisting vs Expression",
  "whatIsIt": "Function declarations are initialized during instantiation, so you can call them above their source line in the same scope (classic scripts/functions). Function expressions assigned to var are hoisted as undefined, then assigned later — calling early throws TypeError. let/const expressions are TDZ. Class declarations are TDZ too.",
  "whyExists": "Authors wanted helpers at the bottom of the file. The split between declarations and expressions is the interview staple.",
  "mentalModel": "Declarations: the function exists from the first millisecond of the scope. Expressions: only the name may exist (var=undefined) until the line runs.",
  "how": [
    "Put declarations at the top or just use them knowing they hoist.",
    "Do not call expression-assigned functions above their line.",
    "In modules, function declarations hoist within the module scope.",
    "class is not like function in this regard."
  ],
  "callout": {
    "title": "Watch for",
    "text": "var f = function(){} above the line: typeof f is 'undefined', then f() is TypeError — not ReferenceError.",
    "variant": "warning"
  },
  "example": "console.log(decl());\nfunction decl() { return 'decl'; }\nconsole.log(typeof expr);\nvar expr = function () { return 'expr'; };\nconsole.log(expr());\ntry { Cls; } catch (e) { console.log('class', e.name); }\nclass Cls {}\n",
  "exampleCaption": "Declaration hoist vs var expression vs class TDZ",
  "internals": [
    "FunctionDeclarationInstantiation / GlobalDeclarationInstantiation create function objects for declarations.",
    "var is InitializeBinding(undefined) then later Assign.",
    "class DeclarationInstantiation leaves uninitialized (TDZ) until evaluation."
  ],
  "takeaways": [
    "Put declarations at the top or just use them knowing they hoist.",
    "Do not call expression-assigned functions above their line.",
    "var f = function(){} above the line: typeof f is 'undefined', then f() is TypeError — not ReferenceError.",
    "FunctionDeclarationInstantiation / GlobalDeclarationInstantiation create function objects for declarations."
  ],
  "revision": [
    "Function Hoisting vs Expression: Declarations: the function exists from the first millisecond of the scope. Expressions: only the name may exist (var=undefined) until the line runs.",
    "Put declarations at the top or just use them knowing they hoist.",
    "Do not call expression-assigned functions above their line.",
    "In modules, function declarations hoist within the module scope.",
    "Trap: var f = function(){} above the line: typeof f is 'undefined', then f() is TypeError — not ReferenceError."
  ],
  "flashcards": [
    [
      "Function Hoisting vs Expression",
      "Function declarations are initialized during instantiation, so you can call them above their source line in the same scope (classic scripts/functions)."
    ],
    [
      "Mental model",
      "Declarations: the function exists from the first millisecond of the scope. Expressions: only the name may exist (var=undefined) until the line runs."
    ],
    [
      "Common trap",
      "var f = function(){} above the line: typeof f is 'undefined', then f() is TypeError — not ReferenceError."
    ],
    [
      "Put declarations at the top or just use them knowing they hoist.",
      "Do not call expression-assigned functions above their line."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Function Hoisting vs Expression and where does a beginner first see it?",
      "answerHint": "Function declarations are initialized during instantiation, so you can call them above their source line in the same scope (classic scripts/functions). Function expressions assigned to var are hoisted as undefined, then assigned later — calling early throws TypeError. let/const expressions are TDZ. Class declarations are TDZ too."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Function Hoisting vs Expression works and name the main pitfall.",
      "answerHint": "Put declarations at the top or just use them knowing they hoist. Do not call expression-assigned functions above their line. In modules, function declarations hoist within the module scope. class is not like function in this regard. Pitfall: var f = function(){} above the line: typeof f is 'undefined', then f() is TypeError — not ReferenceError."
    },
    {
      "level": "advanced",
      "question": "How would you explain Function Hoisting vs Expression at an interview, including engine/spec details?",
      "answerHint": "FunctionDeclarationInstantiation / GlobalDeclarationInstantiation create function objects for declarations. var is InitializeBinding(undefined) then later Assign. class DeclarationInstantiation leaves uninitialized (TDZ) until evaluation."
    }
  ],
  "pitfalls": [
    "var f = function(){} above the line: typeof f is 'undefined', then f() is TypeError — not ReferenceError.",
    "class is not like function in this regard."
  ],
  "interview": {
    "expectations": [
      "Explain Function Hoisting vs Expression without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "FunctionDeclarationInstantiation / GlobalDeclarationInstantiation create function objects for declarations."
    ],
    "commonQuestions": [
      "What is Function Hoisting vs Expression?",
      "Why does JavaScript function hoisting vs expression behave this way?",
      "What is the classic Function Hoisting vs Expression interview trap?"
    ],
    "traps": [
      "var f = function(){} above the line: typeof f is 'undefined', then f() is TypeError — not ReferenceError."
    ],
    "misconceptions": [
      "Authors wanted helpers at the bottom of the file. The split between declarations and expressions is the interview staple."
    ],
    "strongSignals": [
      "Separates Function Hoisting vs Expression from lookalike APIs and can draw the mental model."
    ]
  }
})
