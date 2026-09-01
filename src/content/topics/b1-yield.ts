import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "yield / yield*",
  "whatIsIt": "yield expr pauses the generator and gives expr to .next(). The result of the yield expression is the argument to the subsequent .next(arg). yield* iterable delegates to another iterator, forwarding next/return/throw, and the value of yield* is the inner iterator’s final value. yield is not a return; the function can continue.",
  "whyExists": "Two-way communication (pull values out, push values in) and composing generators (yield*) needed syntax.",
  "mentalModel": "yield = pause and send. next(x) = resume and deliver x as the value of yield. yield* = ‘you take over for a while.’",
  "how": [
    "Use yield* to flatten nested generators.",
    "Do not confuse yield with await (async generators have both).",
    "The expression after yield is evaluated before pausing.",
    "return in a generator sets done true with that value."
  ],
  "callout": {
    "title": "Watch for",
    "text": "[...gen] drops the return value of the generator — spread only collects yielded values, not the final return.",
    "variant": "warning"
  },
  "example": "function* inner() { yield 1; yield 2; return 99; }\nfunction* outer() {\n  const r = yield* inner();\n  yield r;\n}\nconsole.log([...outer()]);\nfunction* twoWay() {\n  const a = yield 10;\n  yield a;\n}\nconst g = twoWay();\nconsole.log(g.next(), g.next('hi'));\n",
  "exampleCaption": "yield* forwarding and two-way next(arg)",
  "internals": [
    "yield* uses Loop of IteratorStep and can capture completion value.",
    "IteratorClose is invoked if the outer generator closes early.",
    "yield in try/finally: finally runs on close."
  ],
  "takeaways": [
    "Use yield* to flatten nested generators.",
    "Do not confuse yield with await (async generators have both).",
    "[...gen] drops the return value of the generator — spread only collects yielded values, not the final return.",
    "yield* uses Loop of IteratorStep and can capture completion value."
  ],
  "revision": [
    "yield / yield*: yield = pause and send. next(x) = resume and deliver x as the value of yield. yield* = ‘you take over for a while.’",
    "Use yield* to flatten nested generators.",
    "Do not confuse yield with await (async generators have both).",
    "The expression after yield is evaluated before pausing.",
    "Trap: [...gen] drops the return value of the generator — spread only collects yielded values, not the final return."
  ],
  "flashcards": [
    [
      "yield / yield*",
      "yield expr pauses the generator and gives expr to .next()."
    ],
    [
      "Mental model",
      "yield = pause and send. next(x) = resume and deliver x as the value of yield. yield* = ‘you take over for a while.’"
    ],
    [
      "Common trap",
      "[...gen] drops the return value of the generator — spread only collects yielded values, not the final return."
    ],
    [
      "Use yield* to flatten nested generators.",
      "Do not confuse yield with await (async generators have both)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is yield / yield* and where does a beginner first see it?",
      "answerHint": "yield expr pauses the generator and gives expr to .next(). The result of the yield expression is the argument to the subsequent .next(arg). yield* iterable delegates to another iterator, forwarding next/return/throw, and the value of yield* is the inner iterator’s final value. yield is not a return; the function can continue."
    },
    {
      "level": "intermediate",
      "question": "Walk through how yield / yield* works and name the main pitfall.",
      "answerHint": "Use yield* to flatten nested generators. Do not confuse yield with await (async generators have both). The expression after yield is evaluated before pausing. return in a generator sets done true with that value. Pitfall: [...gen] drops the return value of the generator — spread only collects yielded values, not the final return."
    },
    {
      "level": "advanced",
      "question": "How would you explain yield / yield* at an interview, including engine/spec details?",
      "answerHint": "yield* uses Loop of IteratorStep and can capture completion value. IteratorClose is invoked if the outer generator closes early. yield in try/finally: finally runs on close."
    }
  ],
  "pitfalls": [
    "[...gen] drops the return value of the generator — spread only collects yielded values, not the final return.",
    "return in a generator sets done true with that value."
  ],
  "interview": {
    "expectations": [
      "Explain yield / yield* without mixing it up with a nearby B1.21 — Iterables, Iterators & Generators topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "yield* uses Loop of IteratorStep and can capture completion value."
    ],
    "commonQuestions": [
      "What is yield / yield*?",
      "Why does JavaScript yield / yield* behave this way?",
      "What is the classic yield / yield* interview trap?"
    ],
    "traps": [
      "[...gen] drops the return value of the generator — spread only collects yielded values, not the final return."
    ],
    "misconceptions": [
      "Two-way communication (pull values out, push values in) and composing generators (yield*) needed syntax."
    ],
    "strongSignals": [
      "Separates yield / yield* from lookalike APIs and can draw the mental model."
    ]
  }
})
