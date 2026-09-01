import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Primitive Immutability",
  "whatIsIt": "Primitive values cannot be changed in place. `str.toUpperCase()` returns a new string. Number methods do not edit the number. Even though autoboxing lets you write `\"hi\".length`, there is no way to set `\"hi\"[0]`. Const vs let only affects the binding, but the primitive value itself was always immutable.",
  "whyExists": "Immutable atoms are easy to share across the stack and across threads of reasoning: nothing aliases a mutating 5.",
  "mentalModel": "You never sharpen the same pencil; you throw it away and pick up a new one with a new value.",
  "how": [
    "Any “change” to a string/number/boolean is a new value.",
    "Store the returned value: `s = s.trim()`.",
    "Do not expect `s[0] = \"A\"` to work.",
    "Frozen objects are a separate, shallow concept."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Calling trim without assignment and wondering why the UI still shows spaces.",
    "variant": "warning"
  },
  "example": "let s = ' ada ';\ns.trim();\nconsole.log(s); // still padded\ns = s.trim().toUpperCase();\nconsole.log(s);\nconst n = 1;\nconsole.log(n.toFixed(2), n);",
  "exampleCaption": "Must capture new primitive returns",
  "internals": [
    "String exotic objects used internally for autoboxing are discarded after the property access.",
    "Primitive values have no [[Set]] of character slots.",
    "Interning may reuse string identity for equal contents; that is an engine optimization, not mutability."
  ],
  "takeaways": [
    "Any “change” to a string/number/boolean is a new value.",
    "Store the returned value: `s = s.trim()`.",
    "Calling trim without assignment and wondering why the UI still shows spaces.",
    "String exotic objects used internally for autoboxing are discarded after the property access."
  ],
  "revision": [
    "Primitive Immutability: You never sharpen the same pencil; you throw it away and pick up a new one with a new value.",
    "Any “change” to a string/number/boolean is a new value.",
    "Store the returned value: `s = s.trim()`.",
    "Do not expect `s[0] = \"A\"` to work.",
    "Trap: Calling trim without assignment and wondering why the UI still shows spaces."
  ],
  "flashcards": [
    [
      "Primitive Immutability",
      "Primitive values cannot be changed in place."
    ],
    [
      "Mental model",
      "You never sharpen the same pencil; you throw it away and pick up a new one with a new value."
    ],
    [
      "Common trap",
      "Calling trim without assignment and wondering why the UI still shows spaces."
    ],
    [
      "Any “change” to a string/number/boolean is a new value.",
      "Store the returned value: `s = s.trim()`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Primitive Immutability and where does a beginner first see it?",
      "answerHint": "Primitive values cannot be changed in place. `str.toUpperCase()` returns a new string. Number methods do not edit the number. Even though autoboxing lets you write `\"hi\".length`, there is no way to set `\"hi\"[0]`. Const vs let only affects the binding, but the primitive value itself was always immutable."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Primitive Immutability works and name the main pitfall.",
      "answerHint": "Any “change” to a string/number/boolean is a new value. Store the returned value: `s = s.trim()`. Do not expect `s[0] = \"A\"` to work. Frozen objects are a separate, shallow concept. Pitfall: Calling trim without assignment and wondering why the UI still shows spaces."
    },
    {
      "level": "advanced",
      "question": "How would you explain Primitive Immutability at an interview, including engine/spec details?",
      "answerHint": "String exotic objects used internally for autoboxing are discarded after the property access. Primitive values have no [[Set]] of character slots. Interning may reuse string identity for equal contents; that is an engine optimization, not mutability."
    }
  ],
  "pitfalls": [
    "Calling trim without assignment and wondering why the UI still shows spaces.",
    "Frozen objects are a separate, shallow concept."
  ],
  "interview": {
    "expectations": [
      "Explain Primitive Immutability without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "String exotic objects used internally for autoboxing are discarded after the property access."
    ],
    "commonQuestions": [
      "What is Primitive Immutability?",
      "Why does JavaScript primitive immutability behave this way?",
      "What is the classic Primitive Immutability interview trap?"
    ],
    "traps": [
      "Calling trim without assignment and wondering why the UI still shows spaces."
    ],
    "misconceptions": [
      "Immutable atoms are easy to share across the stack and across threads of reasoning: nothing aliases a mutating 5."
    ],
    "strongSignals": [
      "Separates Primitive Immutability from lookalike APIs and can draw the mental model."
    ]
  }
})
