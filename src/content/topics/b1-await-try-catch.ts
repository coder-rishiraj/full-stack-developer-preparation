import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "try/catch with await",
  "whatIsIt": "try/catch around await catches rejections of that await (and sync throws). catch on the returned promise is equivalent for the caller. finally runs on both. If you await in try and forget catch, the async function rejects. Multiple awaits can share one try or use finer-grained catches.",
  "whyExists": "await rethrows rejections as exceptions so existing try/catch works. That is the ergonomic point.",
  "mentalModel": "A rejected promise at await becomes a throw at that line. catch is the same net as .catch on the function’s promise if it wraps everything.",
  "how": [
    "try { await x; await y } catch (e) { ... }.",
    "catch per await if recovery differs.",
    "finally { hideSpinner() }.",
    "Do not mix .catch and try on the same await without understanding double-handle."
  ],
  "callout": {
    "title": "Watch for",
    "text": "try/catch around Promise.all without awaiting — you catch nothing; the promise rejects later unhandled.",
    "variant": "warning"
  },
  "example": "async function main() {\n  try {\n    await Promise.reject(new Error('fail'));\n    console.log('unreachable');\n  } catch (e) {\n    console.log('caught', e.message);\n  } finally {\n    console.log('finally');\n  }\n}\nawait main();\n",
  "exampleCaption": "await rejection → catch → finally",
  "internals": [
    "Await’s reject path throws the reason in the async function’s resume.",
    "It is still a microtask later, not a sync throw from the callee’s stack.",
    "finally in async still runs as JS finally after completion of the try."
  ],
  "takeaways": [
    "try { await x; await y } catch (e) { ... }.",
    "catch per await if recovery differs.",
    "try/catch around Promise.all without awaiting — you catch nothing; the promise rejects later unhandled.",
    "Await’s reject path throws the reason in the async function’s resume."
  ],
  "revision": [
    "try/catch with await: A rejected promise at await becomes a throw at that line. catch is the same net as .catch on the function’s promise if it wraps everything.",
    "try { await x; await y } catch (e) { ... }.",
    "catch per await if recovery differs.",
    "finally { hideSpinner() }.",
    "Trap: try/catch around Promise.all without awaiting — you catch nothing; the promise rejects later unhandled."
  ],
  "flashcards": [
    [
      "try/catch with await",
      "try/catch around await catches rejections of that await (and sync throws)."
    ],
    [
      "Mental model",
      "A rejected promise at await becomes a throw at that line. catch is the same net as .catch on the function’s promise if it wraps everything."
    ],
    [
      "Common trap",
      "try/catch around Promise.all without awaiting — you catch nothing; the promise rejects later unhandled."
    ],
    [
      "try { await x; await y } catch (e) { ... }.",
      "catch per await if recovery differs."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is try/catch with await and where does a beginner first see it?",
      "answerHint": "try/catch around await catches rejections of that await (and sync throws). catch on the returned promise is equivalent for the caller. finally runs on both. If you await in try and forget catch, the async function rejects. Multiple awaits can share one try or use finer-grained catches."
    },
    {
      "level": "intermediate",
      "question": "Walk through how try/catch with await works and name the main pitfall.",
      "answerHint": "try { await x; await y } catch (e) { ... }. catch per await if recovery differs. finally { hideSpinner() }. Do not mix .catch and try on the same await without understanding double-handle. Pitfall: try/catch around Promise.all without awaiting — you catch nothing; the promise rejects later unhandled."
    },
    {
      "level": "advanced",
      "question": "How would you explain try/catch with await at an interview, including engine/spec details?",
      "answerHint": "Await’s reject path throws the reason in the async function’s resume. It is still a microtask later, not a sync throw from the callee’s stack. finally in async still runs as JS finally after completion of the try."
    }
  ],
  "pitfalls": [
    "try/catch around Promise.all without awaiting — you catch nothing; the promise rejects later unhandled.",
    "Do not mix .catch and try on the same await without understanding double-handle."
  ],
  "interview": {
    "expectations": [
      "Explain try/catch with await without mixing it up with a nearby B1.30 — Async/Await topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Await’s reject path throws the reason in the async function’s resume."
    ],
    "commonQuestions": [
      "What is try/catch with await?",
      "Why does JavaScript try/catch with await behave this way?",
      "What is the classic try/catch with await interview trap?"
    ],
    "traps": [
      "try/catch around Promise.all without awaiting — you catch nothing; the promise rejects later unhandled."
    ],
    "misconceptions": [
      "await rethrows rejections as exceptions so existing try/catch works. That is the ergonomic point."
    ],
    "strongSignals": [
      "Separates try/catch with await from lookalike APIs and can draw the mental model."
    ]
  }
})
