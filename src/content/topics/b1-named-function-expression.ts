import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Named Function Expression",
  "whatIsIt": "const f = function g() {} creates two names: f in the outer scope, g inside the function. g is not a binding in the outer scope. g is handy for recursion if f might be rebound. Stack traces often show g. In strict mode g is read-only.",
  "whyExists": "Anonymous functions had poor stack traces and awkward recursion. A local name fixes both without polluting the outer scope.",
  "mentalModel": "A private nickname inside the function body; the outer world only knows the variable you assigned.",
  "how": [
    "Match names (const walk = function walk) for clearer traces.",
    "Use the inner name for recursion.",
    "Do not expect g to exist outside.",
    "Avoid relying on the inner name being writable (old sloppy engines)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Referring to the outer const inside before it is initialized (if the function runs synchronously during init) can TDZ — rare but real with IIFEs.",
    "variant": "warning"
  },
  "example": "const outer = function inner(n) {\n  if (n <= 0) return 0;\n  return n + inner(n - 1);\n};\nconsole.log(outer(3));\nconsole.log(typeof inner);\ntry { inner(1); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Inner name for recursion, not visible outside",
  "internals": [
    "Named eval of FunctionExpression creates an environment with an immutable binding for the name in strict.",
    "The outer variable is a separate binding that receives the function object.",
    "Function.prototype.name is set to the inferred or given name for DevTools."
  ],
  "takeaways": [
    "Match names (const walk = function walk) for clearer traces.",
    "Use the inner name for recursion.",
    "Referring to the outer const inside before it is initialized (if the function runs synchronously during init) can TDZ — rare but real with IIFEs.",
    "Named eval of FunctionExpression creates an environment with an immutable binding for the name in strict."
  ],
  "revision": [
    "Named Function Expression: A private nickname inside the function body; the outer world only knows the variable you assigned.",
    "Match names (const walk = function walk) for clearer traces.",
    "Use the inner name for recursion.",
    "Do not expect g to exist outside.",
    "Trap: Referring to the outer const inside before it is initialized (if the function runs synchronously during init) can TDZ — rare but real with IIFEs."
  ],
  "flashcards": [
    [
      "Named Function Expression",
      "const f = function g() {} creates two names: f in the outer scope, g inside the function."
    ],
    [
      "Mental model",
      "A private nickname inside the function body; the outer world only knows the variable you assigned."
    ],
    [
      "Common trap",
      "Referring to the outer const inside before it is initialized (if the function runs synchronously during init) can TDZ — rare but real with IIFEs."
    ],
    [
      "Match names (const walk = function walk) for clearer traces.",
      "Use the inner name for recursion."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Named Function Expression and where does a beginner first see it?",
      "answerHint": "const f = function g() {} creates two names: f in the outer scope, g inside the function. g is not a binding in the outer scope. g is handy for recursion if f might be rebound. Stack traces often show g. In strict mode g is read-only."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Named Function Expression works and name the main pitfall.",
      "answerHint": "Match names (const walk = function walk) for clearer traces. Use the inner name for recursion. Do not expect g to exist outside. Avoid relying on the inner name being writable (old sloppy engines). Pitfall: Referring to the outer const inside before it is initialized (if the function runs synchronously during init) can TDZ — rare but real with IIFEs."
    },
    {
      "level": "advanced",
      "question": "How would you explain Named Function Expression at an interview, including engine/spec details?",
      "answerHint": "Named eval of FunctionExpression creates an environment with an immutable binding for the name in strict. The outer variable is a separate binding that receives the function object. Function.prototype.name is set to the inferred or given name for DevTools."
    }
  ],
  "pitfalls": [
    "Referring to the outer const inside before it is initialized (if the function runs synchronously during init) can TDZ — rare but real with IIFEs.",
    "Avoid relying on the inner name being writable (old sloppy engines)."
  ],
  "interview": {
    "expectations": [
      "Explain Named Function Expression without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Named eval of FunctionExpression creates an environment with an immutable binding for the name in strict."
    ],
    "commonQuestions": [
      "What is Named Function Expression?",
      "Why does JavaScript named function expression behave this way?",
      "What is the classic Named Function Expression interview trap?"
    ],
    "traps": [
      "Referring to the outer const inside before it is initialized (if the function runs synchronously during init) can TDZ — rare but real with IIFEs."
    ],
    "misconceptions": [
      "Anonymous functions had poor stack traces and awkward recursion. A local name fixes both without polluting the outer scope."
    ],
    "strongSignals": [
      "Separates Named Function Expression from lookalike APIs and can draw the mental model."
    ]
  }
})
