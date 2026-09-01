import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Side Effects",
  "whatIsIt": "A side effect is any change besides returning a value: assigning outer variables, mutating objects, I/O, throwing (control-flow effect), scheduling timers. JS programs need effects to be useful; the skill is containing them. Hidden effects in getters and toString are especially nasty.",
  "whyExists": "Software has to talk to the world. The language does not isolate effects (unlike some FP langs), so discipline is on you.",
  "mentalModel": "Return values are the receipt. Side effects are moving stuff in the warehouse. Getters that write are pickpockets.",
  "how": [
    "Name functions as verbs when they effect: saveUser, not user.",
    "Keep render/compute functions effect-free.",
    "Do not put mutations in map callbacks.",
    "Beware Proxies and getters that log or write."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A getter that increments a counter makes debugging logs change program behavior.",
    "variant": "warning"
  },
  "example": "const state = { n: 0 };\nfunction inc() { state.n += 1; return state.n; }\nfunction add(a, b) { return a + b; }\nconsole.log(add(1, 2), inc(), inc(), state.n);\nconst o = {\n  get x() { console.log('get'); return 1; },\n};\nconsole.log(o.x + o.x);\n",
  "exampleCaption": "Explicit mutation vs getter side effects",
  "internals": [
    "Get vs Set internal methods are where many hidden effects hook in (proxies).",
    "Throwing is an abrupt completion — a control-flow side channel.",
    "Host I/O (console, fetch) is outside ECMA-262."
  ],
  "takeaways": [
    "Name functions as verbs when they effect: saveUser, not user.",
    "Keep render/compute functions effect-free.",
    "A getter that increments a counter makes debugging logs change program behavior.",
    "Get vs Set internal methods are where many hidden effects hook in (proxies)."
  ],
  "revision": [
    "Side Effects: Return values are the receipt. Side effects are moving stuff in the warehouse. Getters that write are pickpockets.",
    "Name functions as verbs when they effect: saveUser, not user.",
    "Keep render/compute functions effect-free.",
    "Do not put mutations in map callbacks.",
    "Trap: A getter that increments a counter makes debugging logs change program behavior."
  ],
  "flashcards": [
    [
      "Side Effects",
      "A side effect is any change besides returning a value: assigning outer variables, mutating objects, I/O, throwing (control-flow effect), scheduling timers."
    ],
    [
      "Mental model",
      "Return values are the receipt. Side effects are moving stuff in the warehouse. Getters that write are pickpockets."
    ],
    [
      "Common trap",
      "A getter that increments a counter makes debugging logs change program behavior."
    ],
    [
      "Name functions as verbs when they effect: saveUser, not user.",
      "Keep render/compute functions effect-free."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Side Effects and where does a beginner first see it?",
      "answerHint": "A side effect is any change besides returning a value: assigning outer variables, mutating objects, I/O, throwing (control-flow effect), scheduling timers. JS programs need effects to be useful; the skill is containing them. Hidden effects in getters and toString are especially nasty."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Side Effects works and name the main pitfall.",
      "answerHint": "Name functions as verbs when they effect: saveUser, not user. Keep render/compute functions effect-free. Do not put mutations in map callbacks. Beware Proxies and getters that log or write. Pitfall: A getter that increments a counter makes debugging logs change program behavior."
    },
    {
      "level": "advanced",
      "question": "How would you explain Side Effects at an interview, including engine/spec details?",
      "answerHint": "Get vs Set internal methods are where many hidden effects hook in (proxies). Throwing is an abrupt completion — a control-flow side channel. Host I/O (console, fetch) is outside ECMA-262."
    }
  ],
  "pitfalls": [
    "A getter that increments a counter makes debugging logs change program behavior.",
    "Beware Proxies and getters that log or write."
  ],
  "interview": {
    "expectations": [
      "Explain Side Effects without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Get vs Set internal methods are where many hidden effects hook in (proxies)."
    ],
    "commonQuestions": [
      "What is Side Effects?",
      "Why does JavaScript side effects behave this way?",
      "What is the classic Side Effects interview trap?"
    ],
    "traps": [
      "A getter that increments a counter makes debugging logs change program behavior."
    ],
    "misconceptions": [
      "Software has to talk to the world. The language does not isolate effects (unlike some FP langs), so discipline is on you."
    ],
    "strongSignals": [
      "Separates Side Effects from lookalike APIs and can draw the mental model."
    ]
  }
})
