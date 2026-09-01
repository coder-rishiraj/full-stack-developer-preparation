import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Statements vs Expressions",
  "whatIsIt": "An expression produces a value (2+2, fn(), x = 1). A statement performs an action and does not itself yield a value you can embed everywhere (if, while, const, return). Some constructs are both, like an assignment expression used as a statement. Mixing them causes SyntaxError: you cannot `if` in a value position without a ternary or &&.",
  "whyExists": "Grammars need a split so parsers know where values go versus where control-flow goes. It also lets ASI and return rules stay consistent.",
  "mentalModel": "Expressions are ingredients; statements are recipe steps. You can put ingredients in a bowl (another expression); you cannot put “if it rains” where a number is required.",
  "how": [
    "If it can sit on the right-hand side of `=`, it is an expression.",
    "if/for/while/const/function declarations are statements.",
    "Use ternaries, &&/||, or comma expressions when you need values; use if for multi-line branches.",
    "Arrow functions: `() => expr` vs `() => { statements }`."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`return` on one line and the value on the next returns undefined because of ASI — return is a statement with an optional expression.",
    "variant": "warning"
  },
  "example": "const n = 3;\nconst label = n > 2 ? 'big' : 'small'; // expressions\nif (n > 2) {                           // statement\n  console.log(label);\n}\nconst f = () => n + 1;                 // expression body\nconst g = () => { return n + 1; };     // statement body\nconsole.log(f(), g());",
  "exampleCaption": "Ternary (expression) vs if (statement)",
  "internals": [
    "ECMAScript syntactic grammar: Expression vs Statement vs Declaration.",
    "Completion records give statements an internal [[Value]] used by eval, but you cannot grab it in normal code.",
    "Function declarations are hoisted statements; function expressions are values."
  ],
  "takeaways": [
    "If it can sit on the right-hand side of `=`, it is an expression.",
    "if/for/while/const/function declarations are statements.",
    "`return` on one line and the value on the next returns undefined because of ASI — return is a statement with an optional expression.",
    "ECMAScript syntactic grammar: Expression vs Statement vs Declaration."
  ],
  "revision": [
    "Statements vs Expressions: Expressions are ingredients; statements are recipe steps. You can put ingredients in a bowl (another expression); you cannot put “if it rains” where a number is required.",
    "If it can sit on the right-hand side of `=`, it is an expression.",
    "if/for/while/const/function declarations are statements.",
    "Use ternaries, &&/||, or comma expressions when you need values; use if for multi-line branches.",
    "Trap: `return` on one line and the value on the next returns undefined because of ASI — return is a statement with an optional expression."
  ],
  "flashcards": [
    [
      "Statements vs Expressions",
      "An expression produces a value (2+2, fn(), x = 1)."
    ],
    [
      "Mental model",
      "Expressions are ingredients; statements are recipe steps. You can put ingredients in a bowl (another expression); you cannot put “if it rains” where a number is required."
    ],
    [
      "Common trap",
      "`return` on one line and the value on the next returns undefined because of ASI — return is a statement with an optional expression."
    ],
    [
      "If it can sit on the right-hand side of `=`, it is an expression.",
      "if/for/while/const/function declarations are statements."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Statements vs Expressions and where does a beginner first see it?",
      "answerHint": "An expression produces a value (2+2, fn(), x = 1). A statement performs an action and does not itself yield a value you can embed everywhere (if, while, const, return). Some constructs are both, like an assignment expression used as a statement. Mixing them causes SyntaxError: you cannot `if` in a value position without a ternary or &&."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Statements vs Expressions works and name the main pitfall.",
      "answerHint": "If it can sit on the right-hand side of `=`, it is an expression. if/for/while/const/function declarations are statements. Use ternaries, &&/||, or comma expressions when you need values; use if for multi-line branches. Arrow functions: `() => expr` vs `() => { statements }`. Pitfall: `return` on one line and the value on the next returns undefined because of ASI — return is a statement with an optional expression."
    },
    {
      "level": "advanced",
      "question": "How would you explain Statements vs Expressions at an interview, including engine/spec details?",
      "answerHint": "ECMAScript syntactic grammar: Expression vs Statement vs Declaration. Completion records give statements an internal [[Value]] used by eval, but you cannot grab it in normal code. Function declarations are hoisted statements; function expressions are values."
    }
  ],
  "pitfalls": [
    "`return` on one line and the value on the next returns undefined because of ASI — return is a statement with an optional expression.",
    "Arrow functions: `() => expr` vs `() => { statements }`."
  ],
  "interview": {
    "expectations": [
      "Explain Statements vs Expressions without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ECMAScript syntactic grammar: Expression vs Statement vs Declaration."
    ],
    "commonQuestions": [
      "What is Statements vs Expressions?",
      "Why does JavaScript statements vs expressions behave this way?",
      "What is the classic Statements vs Expressions interview trap?"
    ],
    "traps": [
      "`return` on one line and the value on the next returns undefined because of ASI — return is a statement with an optional expression."
    ],
    "misconceptions": [
      "Grammars need a split so parsers know where values go versus where control-flow goes. It also lets ASI and return rules stay consistent."
    ],
    "strongSignals": [
      "Separates Statements vs Expressions from lookalike APIs and can draw the mental model."
    ]
  }
})
