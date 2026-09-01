import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "ReturnType",
  "whatIsIt": "ReturnType<F> extracts function return type from F when F extends (...args: any) => any. Unwraps async returns as Promise — use Awaited for inner type.",
  "whyExists": "Derive types from functions without duplication — refactor-safe.",
  "mentalModel": "Ask function signature what it hands back.",
  "how": [
    "type Data = ReturnType<typeof fetchUser>.",
    "Works on overloaded functions — last signature used.",
    "Combine Awaited<ReturnType<typeof fn>> for async.",
    "Factory pattern: ReturnType<typeof createStore>.",
    "Not for generic functions without instantiation — use infer."
  ],
  "callout": {
    "title": "Watch for",
    "text": "ReturnType on generic unbound function — may yield any or error.",
    "variant": "warning"
  },
  "example": "function makeCounter(start: number) {\n  return { value: start, inc() { this.value += 1; return this.value; } };\n}\ntype Counter = ReturnType<typeof makeCounter>;\nconst c: Counter = makeCounter(0);\nconsole.log(c.inc());\nconst __typed: Counter = {} as Counter;\n// type Counter = ReturnType<typeof makeCounter>; narrows allowed values",
  "exampleCaption": "ReturnType derives Counter from makeCounter",
  "internals": [
    "Conditional type infer return slot.",
    "Constructor types use InstanceType instead.",
    "typeof needed for value-to-type query."
  ],
  "takeaways": [
    "type Data = ReturnType<typeof fetchUser>.",
    "Works on overloaded functions — last signature used.",
    "ReturnType on generic unbound function — may yield any or error.",
    "Conditional type infer return slot."
  ],
  "revision": [
    "ReturnType: Ask function signature what it hands back.",
    "type Data = ReturnType<typeof fetchUser>.",
    "Works on overloaded functions — last signature used.",
    "Combine Awaited<ReturnType<typeof fn>> for async.",
    "Trap: ReturnType on generic unbound function — may yield any or error."
  ],
  "flashcards": [
    [
      "ReturnType",
      "ReturnType<F> extracts function return type from F when F extends (...args: any) => any."
    ],
    [
      "Mental model",
      "Ask function signature what it hands back."
    ],
    [
      "Common trap",
      "ReturnType on generic unbound function — may yield any or error."
    ],
    [
      "type Data = ReturnType<typeof fetchUser>.",
      "Works on overloaded functions — last signature used."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is ReturnType in TypeScript and when do you use it?",
      "answerHint": "ReturnType<F> extracts function return type from F when F extends (...args: any) => any. Unwraps async returns as Promise — use Awaited for inner type."
    },
    {
      "level": "intermediate",
      "question": "Explain ReturnType with a code example and one pitfall.",
      "answerHint": "type Data = ReturnType<typeof fetchUser>. Works on overloaded functions — last signature used. Combine Awaited<ReturnType<typeof fn>> for async. Factory pattern: ReturnType<typeof createStore>. Not for generic functions without instantiation — use infer. Pitfall: ReturnType on generic unbound function — may yield any or error."
    },
    {
      "level": "advanced",
      "question": "How would you explain ReturnType in a senior frontend interview?",
      "answerHint": "Conditional type infer return slot. Constructor types use InstanceType instead. typeof needed for value-to-type query. function makeCounter(start: number) {\n  return { value: start, inc() { this.value += 1; return this.value; } };\n}\ntype C"
    }
  ],
  "pitfalls": [
    "ReturnType on generic unbound function — may yield any or error."
  ],
  "interview": {
    "expectations": [
      "Explain ReturnType with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Conditional type infer return slot."
    ],
    "commonQuestions": [
      "What is ReturnType?",
      "When would you choose ReturnType over alternatives?",
      "What is the classic ReturnType interview trap?"
    ],
    "traps": [
      "ReturnType on generic unbound function — may yield any or error."
    ],
    "misconceptions": [
      "Derive types from functions without duplication — refactor-safe."
    ],
    "strongSignals": [
      "Uses ReturnType to remove invalid states, not just document them."
    ]
  }
})
