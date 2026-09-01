import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "== Abstract Equality",
  "whatIsIt": "== first compares types. If they differ, it converts: null==undefined is true; number vs string ToNumber’s the string; boolean ToNumber’s first; object vs primitive ToPrimitive’s the object. The algorithm is a table, not ‘make them look similar.’",
  "whyExists": "Early JS wanted fewer type errors in comparisons. The table is still in the spec for the web’s old pages.",
  "mentalModel": "A flowchart on the interview whiteboard. If you skip a row (especially boolean→number), you miss the puzzle.",
  "how": [
    "Do not memorize every pair; memorize the algorithm steps.",
    "Replace == with === unless you want null/undefined collapsing.",
    "Watch objects: [0] == false is true.",
    "Never use == with dates vs strings without intent."
  ],
  "callout": {
    "title": "Watch for",
    "text": "[] == ![] is true: ![] is false, [] == false becomes [] == 0 becomes '' == 0 becomes 0 == 0.",
    "variant": "warning"
  },
  "example": "console.log(false == 0, false == '0', false == '');\nconsole.log([] == false, [] == 0, [] == '');\nconsole.log([1] == true, ['1'] == true);\nconsole.log(null == 0, undefined == 0, null == undefined);\n",
  "exampleCaption": "Abstract equality surprises with arrays and booleans",
  "internals": [
    "If Type differs, prefer converting Boolean via ToNumber, then String/Number, then ToPrimitive on objects.",
    "null and undefined only match each other in this table.",
    "ToPrimitive on arrays uses toString join, producing '' for []."
  ],
  "takeaways": [
    "Do not memorize every pair; memorize the algorithm steps.",
    "Replace == with === unless you want null/undefined collapsing.",
    "[] == ![] is true: ![] is false, [] == false becomes [] == 0 becomes '' == 0 becomes 0 == 0.",
    "If Type differs, prefer converting Boolean via ToNumber, then String/Number, then ToPrimitive on objects."
  ],
  "revision": [
    "== Abstract Equality: A flowchart on the interview whiteboard. If you skip a row (especially boolean→number), you miss the puzzle.",
    "Do not memorize every pair; memorize the algorithm steps.",
    "Replace == with === unless you want null/undefined collapsing.",
    "Watch objects: [0] == false is true.",
    "Trap: [] == ![] is true: ![] is false, [] == false becomes [] == 0 becomes '' == 0 becomes 0 == 0."
  ],
  "flashcards": [
    [
      "== Abstract Equality",
      "== first compares types."
    ],
    [
      "Mental model",
      "A flowchart on the interview whiteboard. If you skip a row (especially boolean→number), you miss the puzzle."
    ],
    [
      "Common trap",
      "[] == ![] is true: ![] is false, [] == false becomes [] == 0 becomes '' == 0 becomes 0 == 0."
    ],
    [
      "Do not memorize every pair; memorize the algorithm steps.",
      "Replace == with === unless you want null/undefined collapsing."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is == Abstract Equality and where does a beginner first see it?",
      "answerHint": "== first compares types. If they differ, it converts: null==undefined is true; number vs string ToNumber’s the string; boolean ToNumber’s first; object vs primitive ToPrimitive’s the object. The algorithm is a table, not ‘make them look similar.’"
    },
    {
      "level": "intermediate",
      "question": "Walk through how == Abstract Equality works and name the main pitfall.",
      "answerHint": "Do not memorize every pair; memorize the algorithm steps. Replace == with === unless you want null/undefined collapsing. Watch objects: [0] == false is true. Never use == with dates vs strings without intent. Pitfall: [] == ![] is true: ![] is false, [] == false becomes [] == 0 becomes '' == 0 becomes 0 == 0."
    },
    {
      "level": "advanced",
      "question": "How would you explain == Abstract Equality at an interview, including engine/spec details?",
      "answerHint": "If Type differs, prefer converting Boolean via ToNumber, then String/Number, then ToPrimitive on objects. null and undefined only match each other in this table. ToPrimitive on arrays uses toString join, producing '' for []."
    }
  ],
  "pitfalls": [
    "[] == ![] is true: ![] is false, [] == false becomes [] == 0 becomes '' == 0 becomes 0 == 0.",
    "Never use == with dates vs strings without intent."
  ],
  "interview": {
    "expectations": [
      "Explain == Abstract Equality without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "If Type differs, prefer converting Boolean via ToNumber, then String/Number, then ToPrimitive on objects."
    ],
    "commonQuestions": [
      "What is == Abstract Equality?",
      "Why does JavaScript == abstract equality behave this way?",
      "What is the classic == Abstract Equality interview trap?"
    ],
    "traps": [
      "[] == ![] is true: ![] is false, [] == false becomes [] == 0 becomes '' == 0 becomes 0 == 0."
    ],
    "misconceptions": [
      "Early JS wanted fewer type errors in comparisons. The table is still in the spec for the web’s old pages."
    ],
    "strongSignals": [
      "Separates == Abstract Equality from lookalike APIs and can draw the mental model."
    ]
  }
})
