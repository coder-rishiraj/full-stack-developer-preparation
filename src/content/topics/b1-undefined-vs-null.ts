import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "undefined vs null vs Undeclared",
  "whatIsIt": "undefined: missing value (not assigned, not passed, not returned, not on the object). null: intentional emptiness, often “no object.” Undeclared: no binding exists; reading it throws ReferenceError (except typeof). `==` equates null and undefined; `===` does not. Default parameters treat only undefined as missing.",
  "whyExists": "Three different “nothing”s exist because JS grew in layers: missing properties, DOM’s null, and true unbound names.",
  "mentalModel": "Undeclared is a missing mailbox. undefined is an empty mailbox. null is a mailbox with a card that says “empty on purpose.”",
  "how": [
    "Use === to distinguish null and undefined when both can appear.",
    "Use ?? when either should fall through to a default.",
    "Fix undeclared by declaring — it is a bug, not a value.",
    "JSON: undefined properties vanish; null stays."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using `== null` accidentally treats undefined and null the same — sometimes you want that, sometimes you do not. Say it out loud.",
    "variant": "warning"
  },
  "example": "let declared;\nconsole.log(declared);\nconsole.log(null ?? 'default', undefined ?? 'default', 0 ?? 'default');\ntry { console.log(notThere); } catch (e) { console.log(e.name); }\nconsole.log(typeof notThere);",
  "exampleCaption": "undefined vs null vs undeclared vs ??",
  "internals": [
    "Unresolvable Reference: GetValue throws in strict mode for bare reads of undeclared names.",
    "Empty slot in arrays is undefined when read, but hasOwn is false (holes).",
    "Optional parameters: arguments.length vs undefined sentinels differ."
  ],
  "takeaways": [
    "Use === to distinguish null and undefined when both can appear.",
    "Use ?? when either should fall through to a default.",
    "Using `== null` accidentally treats undefined and null the same — sometimes you want that, sometimes you do not. Say it out loud.",
    "Unresolvable Reference: GetValue throws in strict mode for bare reads of undeclared names."
  ],
  "revision": [
    "undefined vs null vs Undeclared: Undeclared is a missing mailbox. undefined is an empty mailbox. null is a mailbox with a card that says “empty on purpose.”",
    "Use === to distinguish null and undefined when both can appear.",
    "Use ?? when either should fall through to a default.",
    "Fix undeclared by declaring — it is a bug, not a value.",
    "Trap: Using `== null` accidentally treats undefined and null the same — sometimes you want that, sometimes you do not. Say it out loud."
  ],
  "flashcards": [
    [
      "undefined vs null vs Undeclared",
      "undefined: missing value (not assigned, not passed, not returned, not on the object)."
    ],
    [
      "Mental model",
      "Undeclared is a missing mailbox. undefined is an empty mailbox. null is a mailbox with a card that says “empty on purpose.”"
    ],
    [
      "Common trap",
      "Using `== null` accidentally treats undefined and null the same — sometimes you want that, sometimes you do not. Say it out loud."
    ],
    [
      "Use === to distinguish null and undefined when both can appear.",
      "Use ?? when either should fall through to a default."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is undefined vs null vs Undeclared and where does a beginner first see it?",
      "answerHint": "undefined: missing value (not assigned, not passed, not returned, not on the object). null: intentional emptiness, often “no object.” Undeclared: no binding exists; reading it throws ReferenceError (except typeof). `==` equates null and undefined; `===` does not. Default parameters treat only undefined as missing."
    },
    {
      "level": "intermediate",
      "question": "Walk through how undefined vs null vs Undeclared works and name the main pitfall.",
      "answerHint": "Use === to distinguish null and undefined when both can appear. Use ?? when either should fall through to a default. Fix undeclared by declaring — it is a bug, not a value. JSON: undefined properties vanish; null stays. Pitfall: Using `== null` accidentally treats undefined and null the same — sometimes you want that, sometimes you do not. Say it out loud."
    },
    {
      "level": "advanced",
      "question": "How would you explain undefined vs null vs Undeclared at an interview, including engine/spec details?",
      "answerHint": "Unresolvable Reference: GetValue throws in strict mode for bare reads of undeclared names. Empty slot in arrays is undefined when read, but hasOwn is false (holes). Optional parameters: arguments.length vs undefined sentinels differ."
    }
  ],
  "pitfalls": [
    "Using `== null` accidentally treats undefined and null the same — sometimes you want that, sometimes you do not. Say it out loud.",
    "JSON: undefined properties vanish; null stays."
  ],
  "interview": {
    "expectations": [
      "Explain undefined vs null vs Undeclared without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Unresolvable Reference: GetValue throws in strict mode for bare reads of undeclared names."
    ],
    "commonQuestions": [
      "What is undefined vs null vs Undeclared?",
      "Why does JavaScript undefined vs null vs undeclared behave this way?",
      "What is the classic undefined vs null vs Undeclared interview trap?"
    ],
    "traps": [
      "Using `== null` accidentally treats undefined and null the same — sometimes you want that, sometimes you do not. Say it out loud."
    ],
    "misconceptions": [
      "Three different “nothing”s exist because JS grew in layers: missing properties, DOM’s null, and true unbound names."
    ],
    "strongSignals": [
      "Separates undefined vs null vs Undeclared from lookalike APIs and can draw the mental model."
    ]
  }
})
