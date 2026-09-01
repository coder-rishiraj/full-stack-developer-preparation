import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement curry / compose / pipe",
  "whatIsIt": "Curry: return a function that collects args until fn.length is met, then apply (or allow batched args). compose(f,g,h)(x) is f(g(h(x))) via reduceRight. pipe is reduce left. Do not use lodash. Handle 0-arg functions. compose() with no fns is identity.",
  "whyExists": "FP toolkit interviews: closures + reduce. .length pitfalls (defaults/rest) are the follow-up.",
  "mentalModel": "Curry: piggy bank of arguments until full. compose: wrap functions right-to-left. pipe: assembly line left-to-right.",
  "how": [
    "curried(...a) if a.length>=fn.length then fn(...a) else (...b)=>curried(...a,...b).",
    "compose: fns.reduceRight((v,f)=>f(v), x).",
    "pipe: fns.reduce((v,f)=>f(v), x).",
    "Identity: (x)=>x when fns empty.",
    "Do not copy this unless wrapping methods."
  ],
  "callout": {
    "title": "Watch for",
    "text": "fn.length is 0 for (...args)=> — your curry will call immediately with [].",
    "variant": "warning"
  },
  "example": "function curry(fn) {\n  const nest = (...a) => (a.length >= fn.length ? fn(...a) : (...b) => nest(...a, ...b));\n  return nest;\n}\nconst compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);\nconst pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\nconst add = (a, b, c) => a + b + c;\nconsole.log(curry(add)(1)(2)(3), compose((n) => n + 1, (n) => n * 2)(3), pipe((n) => n * 2, (n) => n + 1)(3));\n",
  "exampleCaption": "curry by arity; compose vs pipe on 3",
  "internals": [
    "Function.length ignores rest and counts until first default.",
    "Each nested curry function is a new closure object.",
    "compose of async functions needs a special async compose."
  ],
  "takeaways": [
    "curried(...a) if a.length>=fn.length then fn(...a) else (...b)=>curried(...a,...b).",
    "compose: fns.reduceRight((v,f)=>f(v), x).",
    "fn.length is 0 for (...args)=> — your curry will call immediately with [].",
    "Function.length ignores rest and counts until first default."
  ],
  "revision": [
    "Implement curry / compose / pipe: Curry: piggy bank of arguments until full. compose: wrap functions right-to-left. pipe: assembly line left-to-right.",
    "curried(...a) if a.length>=fn.length then fn(...a) else (...b)=>curried(...a,...b).",
    "compose: fns.reduceRight((v,f)=>f(v), x).",
    "pipe: fns.reduce((v,f)=>f(v), x).",
    "Trap: fn.length is 0 for (...args)=> — your curry will call immediately with []."
  ],
  "flashcards": [
    [
      "Implement curry / compose / pipe",
      "Curry: return a function that collects args until fn.length is met, then apply (or allow batched args)."
    ],
    [
      "Mental model",
      "Curry: piggy bank of arguments until full. compose: wrap functions right-to-left. pipe: assembly line left-to-right."
    ],
    [
      "Common trap",
      "fn.length is 0 for (...args)=> — your curry will call immediately with []."
    ],
    [
      "curried(...a) if a.length>=fn.length then fn(...a) else (...b)=>curried(...a,...",
      "compose: fns.reduceRight((v,f)=>f(v), x)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement curry / compose / pipe and where does a beginner first see it?",
      "answerHint": "Curry: return a function that collects args until fn.length is met, then apply (or allow batched args). compose(f,g,h)(x) is f(g(h(x))) via reduceRight. pipe is reduce left. Do not use lodash. Handle 0-arg functions. compose() with no fns is identity."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement curry / compose / pipe works and name the main pitfall.",
      "answerHint": "curried(...a) if a.length>=fn.length then fn(...a) else (...b)=>curried(...a,...b). compose: fns.reduceRight((v,f)=>f(v), x). pipe: fns.reduce((v,f)=>f(v), x). Identity: (x)=>x when fns empty. Do not copy this unless wrapping methods. Pitfall: fn.length is 0 for (...args)=> — your curry will call immediately with []."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement curry / compose / pipe at an interview, including engine/spec details?",
      "answerHint": "Function.length ignores rest and counts until first default. Each nested curry function is a new closure object. compose of async functions needs a special async compose."
    }
  ],
  "pitfalls": [
    "fn.length is 0 for (...args)=> — your curry will call immediately with [].",
    "Do not copy this unless wrapping methods."
  ],
  "interview": {
    "expectations": [
      "Explain Implement curry / compose / pipe without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Function.length ignores rest and counts until first default."
    ],
    "commonQuestions": [
      "What is Implement curry / compose / pipe?",
      "Why does JavaScript implement curry / compose / pipe behave this way?",
      "What is the classic Implement curry / compose / pipe interview trap?"
    ],
    "traps": [
      "fn.length is 0 for (...args)=> — your curry will call immediately with []."
    ],
    "misconceptions": [
      "FP toolkit interviews: closures + reduce. .length pitfalls (defaults/rest) are the follow-up."
    ],
    "strongSignals": [
      "Separates Implement curry / compose / pipe from lookalike APIs and can draw the mental model."
    ]
  }
})
