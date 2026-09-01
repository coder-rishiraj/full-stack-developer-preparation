import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement call / apply / bind",
  "whatIsIt": "Implement call: set a unique key on the thisArg object, assign the function, invoke with args, delete the key, return the result. For primitives, Object(thisArg). apply unpacks an array-like by index. bind returns a function that concatenates bound args then calls with the bound this. Handle null this → globalThis in sloppy mental model; in strict, keep null/undefined.",
  "whyExists": "You cannot use .call to implement .call in the interview. The unique-key trick shows you know methods are [[Call]] with a receiver.",
  "mentalModel": "Temporarily hang the function on the object, call it as a method, unscrew it. bind is a closure over this+args.",
  "how": [
    "Symbol() as the temp key so you do not clash.",
    "Box primitives with Object(ctx).",
    "apply: convert arrayLike to a real argument list.",
    "bind: return a new function; support further partial args.",
    "Do not forget to delete the temp key in finally."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using a string key '__fn' that might exist on the object — Symbol is the fix.",
    "variant": "warning"
  },
  "example": "Function.prototype.myCall = function (ctx, ...args) {\n  if (ctx == null) ctx = globalThis;\n  else if (typeof ctx !== 'object' && typeof ctx !== 'function') ctx = Object(ctx);\n  const k = Symbol();\n  ctx[k] = this;\n  try { return ctx[k](...args); } finally { delete ctx[k]; }\n};\nfunction greet(p) { return p + this.name; }\nconsole.log(greet.myCall({ name: 'Ada' }, 'hi '));\nFunction.prototype.myBind = function (ctx, ...pre) {\n  const fn = this;\n  return (...post) => fn.myCall(ctx, ...pre, ...post);\n};\nconsole.log(greet.myBind({ name: 'Alan' }, 'yo ')());\n",
  "exampleCaption": "myCall via temp symbol key; myBind via closure",
  "internals": [
    "Real call uses Call(fn, thisArg, args) without mutating the object.",
    "Bound functions are exotic objects, not just arrows (they can be new'd in some cases).",
    "The temp-property trick fails on frozen objects — mention that in interviews."
  ],
  "takeaways": [
    "Symbol() as the temp key so you do not clash.",
    "Box primitives with Object(ctx).",
    "Using a string key '__fn' that might exist on the object — Symbol is the fix.",
    "Real call uses Call(fn, thisArg, args) without mutating the object."
  ],
  "revision": [
    "Implement call / apply / bind: Temporarily hang the function on the object, call it as a method, unscrew it. bind is a closure over this+args.",
    "Symbol() as the temp key so you do not clash.",
    "Box primitives with Object(ctx).",
    "apply: convert arrayLike to a real argument list.",
    "Trap: Using a string key '__fn' that might exist on the object — Symbol is the fix."
  ],
  "flashcards": [
    [
      "Implement call / apply / bind",
      "Implement call: set a unique key on the thisArg object, assign the function, invoke with args, delete the key, return the result."
    ],
    [
      "Mental model",
      "Temporarily hang the function on the object, call it as a method, unscrew it. bind is a closure over this+args."
    ],
    [
      "Common trap",
      "Using a string key '__fn' that might exist on the object — Symbol is the fix."
    ],
    [
      "Symbol() as the temp key so you do not clash.",
      "Box primitives with Object(ctx)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement call / apply / bind and where does a beginner first see it?",
      "answerHint": "Implement call: set a unique key on the thisArg object, assign the function, invoke with args, delete the key, return the result. For primitives, Object(thisArg). apply unpacks an array-like by index. bind returns a function that concatenates bound args then calls with the bound this. Handle null this → globalThis in sloppy mental model; in strict, keep null/undefined."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement call / apply / bind works and name the main pitfall.",
      "answerHint": "Symbol() as the temp key so you do not clash. Box primitives with Object(ctx). apply: convert arrayLike to a real argument list. bind: return a new function; support further partial args. Do not forget to delete the temp key in finally. Pitfall: Using a string key '__fn' that might exist on the object — Symbol is the fix."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement call / apply / bind at an interview, including engine/spec details?",
      "answerHint": "Real call uses Call(fn, thisArg, args) without mutating the object. Bound functions are exotic objects, not just arrows (they can be new'd in some cases). The temp-property trick fails on frozen objects — mention that in interviews."
    }
  ],
  "pitfalls": [
    "Using a string key '__fn' that might exist on the object — Symbol is the fix.",
    "Do not forget to delete the temp key in finally."
  ],
  "interview": {
    "expectations": [
      "Explain Implement call / apply / bind without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Real call uses Call(fn, thisArg, args) without mutating the object."
    ],
    "commonQuestions": [
      "What is Implement call / apply / bind?",
      "Why does JavaScript implement call / apply / bind behave this way?",
      "What is the classic Implement call / apply / bind interview trap?"
    ],
    "traps": [
      "Using a string key '__fn' that might exist on the object — Symbol is the fix."
    ],
    "misconceptions": [
      "You cannot use .call to implement .call in the interview. The unique-key trick shows you know methods are [[Call]] with a receiver."
    ],
    "strongSignals": [
      "Separates Implement call / apply / bind from lookalike APIs and can draw the mental model."
    ]
  }
})
