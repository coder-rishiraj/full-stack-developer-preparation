import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object.is()",
  "whatIsIt": "Object.is(a, b) implements the SameValue algorithm: like `===` except that Object.is(NaN, NaN) is true and Object.is(0, -0) is false. Use it when those two edge cases matter (maps, sets internals, React’s Object.is state comparison). For everyday code, `===` is still the default.",
  "whyExists": "Spec algorithms needed a comparison that treats NaN as identical to itself (Map/Set keys, Object.defineProperty unchanged checks). Object.is exposed that algorithm.",
  "mentalModel": "=== with two patches: NaN equals NaN, and the sign of zero counts.",
  "how": [
    "Use === unless you are implementing Map-like semantics or detecting -0.",
    "React Object.is compares state to skip renders — NaN state will look “equal.”",
    "Do not use Object.is for deep equality.",
    "Document why you chose Object.is so readers do not “simplify” to ===."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming Object.is is “deeper ===.” It is still reference equality for objects.",
    "variant": "warning"
  },
  "example": "console.log(Object.is(NaN, NaN), NaN === NaN);\nconsole.log(Object.is(0, -0), 0 === -0);\nconsole.log(Object.is(1, 1), Object.is({}, {}));\nconsole.log(1 / Object.is(0, -0) ? -0 : 0);",
  "exampleCaption": "SameValue vs strict equality",
  "internals": [
    "SameValue vs SameValueZero (Set/Map use SameValueZero, where +0 and -0 are equal).",
    "Object.is is not SameValueZero — Map keys 0 and -0 collide.",
    "defineProperty uses SameValue to decide if a value changed."
  ],
  "takeaways": [
    "Use === unless you are implementing Map-like semantics or detecting -0.",
    "React Object.is compares state to skip renders — NaN state will look “equal.”",
    "Assuming Object.is is “deeper ===.” It is still reference equality for objects.",
    "SameValue vs SameValueZero (Set/Map use SameValueZero, where +0 and -0 are equal)."
  ],
  "revision": [
    "Object.is(): === with two patches: NaN equals NaN, and the sign of zero counts.",
    "Use === unless you are implementing Map-like semantics or detecting -0.",
    "React Object.is compares state to skip renders — NaN state will look “equal.”",
    "Do not use Object.is for deep equality.",
    "Trap: Assuming Object.is is “deeper ===.” It is still reference equality for objects."
  ],
  "flashcards": [
    [
      "Object.is()",
      "Object.is(a, b) implements the SameValue algorithm: like `===` except that Object.is(NaN, NaN) is true and Object.is(0, -0) is false."
    ],
    [
      "Mental model",
      "=== with two patches: NaN equals NaN, and the sign of zero counts."
    ],
    [
      "Common trap",
      "Assuming Object.is is “deeper ===.” It is still reference equality for objects."
    ],
    [
      "Use === unless you are implementing Map-like semantics or detecting -0.",
      "React Object.is compares state to skip renders — NaN state will look “equal.”"
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Object.is() and where does a beginner first see it?",
      "answerHint": "Object.is(a, b) implements the SameValue algorithm: like `===` except that Object.is(NaN, NaN) is true and Object.is(0, -0) is false. Use it when those two edge cases matter (maps, sets internals, React’s Object.is state comparison). For everyday code, `===` is still the default."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Object.is() works and name the main pitfall.",
      "answerHint": "Use === unless you are implementing Map-like semantics or detecting -0. React Object.is compares state to skip renders — NaN state will look “equal.” Do not use Object.is for deep equality. Document why you chose Object.is so readers do not “simplify” to ===. Pitfall: Assuming Object.is is “deeper ===.” It is still reference equality for objects."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object.is() at an interview, including engine/spec details?",
      "answerHint": "SameValue vs SameValueZero (Set/Map use SameValueZero, where +0 and -0 are equal). Object.is is not SameValueZero — Map keys 0 and -0 collide. defineProperty uses SameValue to decide if a value changed."
    }
  ],
  "pitfalls": [
    "Assuming Object.is is “deeper ===.” It is still reference equality for objects.",
    "Document why you chose Object.is so readers do not “simplify” to ===."
  ],
  "interview": {
    "expectations": [
      "Explain Object.is() without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "SameValue vs SameValueZero (Set/Map use SameValueZero, where +0 and -0 are equal)."
    ],
    "commonQuestions": [
      "What is Object.is()?",
      "Why does JavaScript object.is() behave this way?",
      "What is the classic Object.is() interview trap?"
    ],
    "traps": [
      "Assuming Object.is is “deeper ===.” It is still reference equality for objects."
    ],
    "misconceptions": [
      "Spec algorithms needed a comparison that treats NaN as identical to itself (Map/Set keys, Object.defineProperty unchanged checks). Object.is exposed that algorithm."
    ],
    "strongSignals": [
      "Separates Object.is() from lookalike APIs and can draw the mental model."
    ]
  }
})
