import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Coercion with +",
  "whatIsIt": "The + operator is overloaded: if either operand is a string after ToPrimitive, it concatenates; otherwise it adds numbers (or throws on mixed bigint). Unary plus is only ToNumber. {} + [] is parsed as a block plus an array in sloppy scripts, which is why puzzles print 0.",
  "whyExists": "HTML authors wanted 'Score: ' + n to work. One operator ended up meaning glue and add.",
  "mentalModel": "Ask both sides for primitives. If a string showed up, glue. Else numeric add. Arrays become strings via join.",
  "how": [
    "Convert both sides to numbers before adding if you mean math.",
    "Use template literals for strings to make intent obvious.",
    "Remember [] + [] is '' and [] + {} is '[object Object]'.",
    "bigint + number throws; convert explicitly."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Wanting 1 + '2' to be 3 — it is '12'. Use Number or parseInt first.",
    "variant": "warning"
  },
  "example": "console.log(1 + 2, '1' + 2, 1 + '2');\nconsole.log([] + [], [] + {}, 1 + []);\nconsole.log(true + 1, null + 1, undefined + 1);\ntry { console.log(1n + 1); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "+ chooses concat vs add after ToPrimitive",
  "internals": [
    "ToPrimitive on each operand with no hint (default) except dates.",
    "If Type is String for either, concatenate ToString of both.",
    "Else ToNumeric and Number::add or BigInt::add."
  ],
  "takeaways": [
    "Convert both sides to numbers before adding if you mean math.",
    "Use template literals for strings to make intent obvious.",
    "Wanting 1 + '2' to be 3 — it is '12'. Use Number or parseInt first.",
    "ToPrimitive on each operand with no hint (default) except dates."
  ],
  "revision": [
    "Coercion with +: Ask both sides for primitives. If a string showed up, glue. Else numeric add. Arrays become strings via join.",
    "Convert both sides to numbers before adding if you mean math.",
    "Use template literals for strings to make intent obvious.",
    "Remember [] + [] is '' and [] + {} is '[object Object]'.",
    "Trap: Wanting 1 + '2' to be 3 — it is '12'. Use Number or parseInt first."
  ],
  "flashcards": [
    [
      "Coercion with +",
      "The + operator is overloaded: if either operand is a string after ToPrimitive, it concatenates; otherwise it adds numbers (or throws on mixed bigint)."
    ],
    [
      "Mental model",
      "Ask both sides for primitives. If a string showed up, glue. Else numeric add. Arrays become strings via join."
    ],
    [
      "Common trap",
      "Wanting 1 + '2' to be 3 — it is '12'. Use Number or parseInt first."
    ],
    [
      "Convert both sides to numbers before adding if you mean math.",
      "Use template literals for strings to make intent obvious."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Coercion with + and where does a beginner first see it?",
      "answerHint": "The + operator is overloaded: if either operand is a string after ToPrimitive, it concatenates; otherwise it adds numbers (or throws on mixed bigint). Unary plus is only ToNumber. {} + [] is parsed as a block plus an array in sloppy scripts, which is why puzzles print 0."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Coercion with + works and name the main pitfall.",
      "answerHint": "Convert both sides to numbers before adding if you mean math. Use template literals for strings to make intent obvious. Remember [] + [] is '' and [] + {} is '[object Object]'. bigint + number throws; convert explicitly. Pitfall: Wanting 1 + '2' to be 3 — it is '12'. Use Number or parseInt first."
    },
    {
      "level": "advanced",
      "question": "How would you explain Coercion with + at an interview, including engine/spec details?",
      "answerHint": "ToPrimitive on each operand with no hint (default) except dates. If Type is String for either, concatenate ToString of both. Else ToNumeric and Number::add or BigInt::add."
    }
  ],
  "pitfalls": [
    "Wanting 1 + '2' to be 3 — it is '12'. Use Number or parseInt first.",
    "bigint + number throws; convert explicitly."
  ],
  "interview": {
    "expectations": [
      "Explain Coercion with + without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ToPrimitive on each operand with no hint (default) except dates."
    ],
    "commonQuestions": [
      "What is Coercion with +?",
      "Why does JavaScript coercion with + behave this way?",
      "What is the classic Coercion with + interview trap?"
    ],
    "traps": [
      "Wanting 1 + '2' to be 3 — it is '12'. Use Number or parseInt first."
    ],
    "misconceptions": [
      "HTML authors wanted 'Score: ' + n to work. One operator ended up meaning glue and add."
    ],
    "strongSignals": [
      "Separates Coercion with + from lookalike APIs and can draw the mental model."
    ]
  }
})
