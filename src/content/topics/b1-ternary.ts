import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Ternary Operator",
  "whatIsIt": "The conditional operator cond ? a : b evaluates cond with ToBoolean, then evaluates exactly one of a or b. It is an expression, so it can sit inside assignments and returns. Nesting ternaries is legal and often unreadable. It is not a replacement for if when branches are statements.",
  "whyExists": "Expressions needed an inline if so function returns and JSX-like trees could branch without extra statements.",
  "mentalModel": "A three-hole expression: test, then only the chosen hole is evaluated (short-circuit).",
  "how": [
    "Use for simple value selection.",
    "Break nested ternaries into named consts or ifs.",
    "Do not put side-effect-only calls in both branches unless needed.",
    "Remember it is right-associative: a ? b : c ? d : e."
  ],
  "callout": {
    "title": "Watch for",
    "text": "n ? 'yes' : 'no' treats 0 as 'no'. Use n === 0 ? or explicit comparisons.",
    "variant": "warning"
  },
  "example": "const n = 7;\nconst label = n % 2 === 0 ? 'even' : 'odd';\nconst abs = n < 0 ? -n : n;\nfunction pick(flag) {\n  return flag ? bump('yes') : bump('no');\n}\nfunction bump(s) { console.log('called', s); return s; }\nconsole.log(label, abs, pick(false));\n",
  "exampleCaption": "Ternary selects a value and skips the other branch",
  "internals": [
    "ConditionalExpression evaluates one branch only.",
    "Grammar is right-associative.",
    "Completion value of the chosen branch becomes the expression’s value."
  ],
  "takeaways": [
    "Use for simple value selection.",
    "Break nested ternaries into named consts or ifs.",
    "n ? 'yes' : 'no' treats 0 as 'no'. Use n === 0 ? or explicit comparisons.",
    "ConditionalExpression evaluates one branch only."
  ],
  "revision": [
    "Ternary Operator: A three-hole expression: test, then only the chosen hole is evaluated (short-circuit).",
    "Use for simple value selection.",
    "Break nested ternaries into named consts or ifs.",
    "Do not put side-effect-only calls in both branches unless needed.",
    "Trap: n ? 'yes' : 'no' treats 0 as 'no'. Use n === 0 ? or explicit comparisons."
  ],
  "flashcards": [
    [
      "Ternary Operator",
      "The conditional operator cond ? a : b evaluates cond with ToBoolean, then evaluates exactly one of a or b."
    ],
    [
      "Mental model",
      "A three-hole expression: test, then only the chosen hole is evaluated (short-circuit)."
    ],
    [
      "Common trap",
      "n ? 'yes' : 'no' treats 0 as 'no'. Use n === 0 ? or explicit comparisons."
    ],
    [
      "Use for simple value selection.",
      "Break nested ternaries into named consts or ifs."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Ternary Operator and where does a beginner first see it?",
      "answerHint": "The conditional operator cond ? a : b evaluates cond with ToBoolean, then evaluates exactly one of a or b. It is an expression, so it can sit inside assignments and returns. Nesting ternaries is legal and often unreadable. It is not a replacement for if when branches are statements."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Ternary Operator works and name the main pitfall.",
      "answerHint": "Use for simple value selection. Break nested ternaries into named consts or ifs. Do not put side-effect-only calls in both branches unless needed. Remember it is right-associative: a ? b : c ? d : e. Pitfall: n ? 'yes' : 'no' treats 0 as 'no'. Use n === 0 ? or explicit comparisons."
    },
    {
      "level": "advanced",
      "question": "How would you explain Ternary Operator at an interview, including engine/spec details?",
      "answerHint": "ConditionalExpression evaluates one branch only. Grammar is right-associative. Completion value of the chosen branch becomes the expression’s value."
    }
  ],
  "pitfalls": [
    "n ? 'yes' : 'no' treats 0 as 'no'. Use n === 0 ? or explicit comparisons.",
    "Remember it is right-associative: a ? b : c ? d : e."
  ],
  "interview": {
    "expectations": [
      "Explain Ternary Operator without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ConditionalExpression evaluates one branch only."
    ],
    "commonQuestions": [
      "What is Ternary Operator?",
      "Why does JavaScript ternary operator behave this way?",
      "What is the classic Ternary Operator interview trap?"
    ],
    "traps": [
      "n ? 'yes' : 'no' treats 0 as 'no'. Use n === 0 ? or explicit comparisons."
    ],
    "misconceptions": [
      "Expressions needed an inline if so function returns and JSX-like trees could branch without extra statements."
    ],
    "strongSignals": [
      "Separates Ternary Operator from lookalike APIs and can draw the mental model."
    ]
  }
})
