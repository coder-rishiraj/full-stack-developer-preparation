import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Function Expression",
  "whatIsIt": "A function expression is a value: const f = function () {} or (function () {}). It is not hoisted as a usable function (the const/let binding is TDZ). It can be anonymous or named. The name inside a named expression is local to the function, useful for recursion and stack traces.",
  "whyExists": "First-class functions need to be created as expressions to pass as callbacks or assign conditionally.",
  "mentalModel": "A function value baked at the line it runs, stored in a variable like any other object.",
  "how": [
    "Assign to const unless you rebind.",
    "Use a name: const fact = function fact(n){...} for recursion/debug.",
    "Do not call it above the const line.",
    "Parenthesize when using as IIFE."
  ],
  "callout": {
    "title": "Watch for",
    "text": "typeof f before const f = function(){} is TDZ ReferenceError, not 'undefined' like var f = function(){}.",
    "variant": "warning"
  },
  "example": "const double = function (n) { return n * 2; };\nconst fact = function fact(n) {\n  return n <= 1 ? 1 : n * fact(n - 1);\n};\nconsole.log(double(4), fact(5));\ntry { console.log(hidden()); } catch (e) { console.log(e.name); }\nconst hidden = function () { return 1; };\n",
  "exampleCaption": "Function expressions are not hoisted as callable",
  "internals": [
    "Runtime Semantics: Evaluate FunctionExpression creates a new function object then.",
    "NamedFunctionExpression binds the name in the function’s own environment, not the outer scope.",
    "The binding for const is uninitialized until the assignment completes."
  ],
  "takeaways": [
    "Assign to const unless you rebind.",
    "Use a name: const fact = function fact(n){...} for recursion/debug.",
    "typeof f before const f = function(){} is TDZ ReferenceError, not 'undefined' like var f = function(){}.",
    "Runtime Semantics: Evaluate FunctionExpression creates a new function object then."
  ],
  "revision": [
    "Function Expression: A function value baked at the line it runs, stored in a variable like any other object.",
    "Assign to const unless you rebind.",
    "Use a name: const fact = function fact(n){...} for recursion/debug.",
    "Do not call it above the const line.",
    "Trap: typeof f before const f = function(){} is TDZ ReferenceError, not 'undefined' like var f = function(){}."
  ],
  "flashcards": [
    [
      "Function Expression",
      "A function expression is a value: const f = function () {} or (function () {})."
    ],
    [
      "Mental model",
      "A function value baked at the line it runs, stored in a variable like any other object."
    ],
    [
      "Common trap",
      "typeof f before const f = function(){} is TDZ ReferenceError, not 'undefined' like var f = function(){}."
    ],
    [
      "Assign to const unless you rebind.",
      "Use a name: const fact = function fact(n){...} for recursion/debug."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Function Expression and where does a beginner first see it?",
      "answerHint": "A function expression is a value: const f = function () {} or (function () {}). It is not hoisted as a usable function (the const/let binding is TDZ). It can be anonymous or named. The name inside a named expression is local to the function, useful for recursion and stack traces."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Function Expression works and name the main pitfall.",
      "answerHint": "Assign to const unless you rebind. Use a name: const fact = function fact(n){...} for recursion/debug. Do not call it above the const line. Parenthesize when using as IIFE. Pitfall: typeof f before const f = function(){} is TDZ ReferenceError, not 'undefined' like var f = function(){}."
    },
    {
      "level": "advanced",
      "question": "How would you explain Function Expression at an interview, including engine/spec details?",
      "answerHint": "Runtime Semantics: Evaluate FunctionExpression creates a new function object then. NamedFunctionExpression binds the name in the function’s own environment, not the outer scope. The binding for const is uninitialized until the assignment completes."
    }
  ],
  "pitfalls": [
    "typeof f before const f = function(){} is TDZ ReferenceError, not 'undefined' like var f = function(){}.",
    "Parenthesize when using as IIFE."
  ],
  "interview": {
    "expectations": [
      "Explain Function Expression without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Runtime Semantics: Evaluate FunctionExpression creates a new function object then."
    ],
    "commonQuestions": [
      "What is Function Expression?",
      "Why does JavaScript function expression behave this way?",
      "What is the classic Function Expression interview trap?"
    ],
    "traps": [
      "typeof f before const f = function(){} is TDZ ReferenceError, not 'undefined' like var f = function(){}."
    ],
    "misconceptions": [
      "First-class functions need to be created as expressions to pass as callbacks or assign conditionally."
    ],
    "strongSignals": [
      "Separates Function Expression from lookalike APIs and can draw the mental model."
    ]
  }
})
