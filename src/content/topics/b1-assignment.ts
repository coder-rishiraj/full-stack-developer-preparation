import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Assignment vs Reassignment",
  "whatIsIt": "Assignment (`=`) stores a new value in an existing mutable binding or property. Reassignment changes which value a `let`/`var` name refers to. `const` bindings cannot be reassigned, but properties of a const object can still change. Compound assignment (`+=`) reads, computes, then writes.",
  "whyExists": "Computation is useless if you cannot update stored results. Assignment is the write half of named storage.",
  "mentalModel": "Reassignment moves a pointer. Mutation edits the object at the other end of the pointer. Const locks the pointer, not the object.",
  "how": [
    "`let n = 1; n = 2` reassigns.",
    "`const o = {a:1}; o.a = 2` mutates; `o = {}` throws.",
    "Assignment is an expression: `x = y = 0` chains right-to-left.",
    "Assigning to a property of undefined/null throws TypeError."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interviewers ask if `const` is immutable. Answer: the binding is; objects and arrays are not.",
    "variant": "warning"
  },
  "example": "let score = 0;\nscore = score + 10;\nscore += 5;\nconst box = { n: 1 };\nbox.n = 2;\ntry { box = {}; } catch (e) { console.log(e.name); }\nconsole.log(score, box.n);",
  "exampleCaption": "Reassign let; mutate const object; failed rebind",
  "internals": [
    "Simple assignment uses PutValue on a Reference (binding or property).",
    "const SetMutableBinding throws in strict mode (always for const).",
    "Left-hand side can be a pattern (destructuring assignment)."
  ],
  "takeaways": [
    "`let n = 1; n = 2` reassigns.",
    "`const o = {a:1}; o.a = 2` mutates; `o = {}` throws.",
    "Interviewers ask if `const` is immutable. Answer: the binding is; objects and arrays are not.",
    "Simple assignment uses PutValue on a Reference (binding or property)."
  ],
  "revision": [
    "Assignment vs Reassignment: Reassignment moves a pointer. Mutation edits the object at the other end of the pointer. Const locks the pointer, not the object.",
    "`let n = 1; n = 2` reassigns.",
    "`const o = {a:1}; o.a = 2` mutates; `o = {}` throws.",
    "Assignment is an expression: `x = y = 0` chains right-to-left.",
    "Trap: Interviewers ask if `const` is immutable. Answer: the binding is; objects and arrays are not."
  ],
  "flashcards": [
    [
      "Assignment vs Reassignment",
      "Assignment (`=`) stores a new value in an existing mutable binding or property."
    ],
    [
      "Mental model",
      "Reassignment moves a pointer. Mutation edits the object at the other end of the pointer. Const locks the pointer, not the object."
    ],
    [
      "Common trap",
      "Interviewers ask if `const` is immutable. Answer: the binding is; objects and arrays are not."
    ],
    [
      "`let n = 1; n = 2` reassigns.",
      "`const o = {a:1}; o.a = 2` mutates; `o = {}` throws."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Assignment vs Reassignment and where does a beginner first see it?",
      "answerHint": "Assignment (`=`) stores a new value in an existing mutable binding or property. Reassignment changes which value a `let`/`var` name refers to. `const` bindings cannot be reassigned, but properties of a const object can still change. Compound assignment (`+=`) reads, computes, then writes."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Assignment vs Reassignment works and name the main pitfall.",
      "answerHint": "`let n = 1; n = 2` reassigns. `const o = {a:1}; o.a = 2` mutates; `o = {}` throws. Assignment is an expression: `x = y = 0` chains right-to-left. Assigning to a property of undefined/null throws TypeError. Pitfall: Interviewers ask if `const` is immutable. Answer: the binding is; objects and arrays are not."
    },
    {
      "level": "advanced",
      "question": "How would you explain Assignment vs Reassignment at an interview, including engine/spec details?",
      "answerHint": "Simple assignment uses PutValue on a Reference (binding or property). const SetMutableBinding throws in strict mode (always for const). Left-hand side can be a pattern (destructuring assignment)."
    }
  ],
  "pitfalls": [
    "Interviewers ask if `const` is immutable. Answer: the binding is; objects and arrays are not.",
    "Assigning to a property of undefined/null throws TypeError."
  ],
  "interview": {
    "expectations": [
      "Explain Assignment vs Reassignment without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Simple assignment uses PutValue on a Reference (binding or property)."
    ],
    "commonQuestions": [
      "What is Assignment vs Reassignment?",
      "Why does JavaScript assignment vs reassignment behave this way?",
      "What is the classic Assignment vs Reassignment interview trap?"
    ],
    "traps": [
      "Interviewers ask if `const` is immutable. Answer: the binding is; objects and arrays are not."
    ],
    "misconceptions": [
      "Computation is useless if you cannot update stored results. Assignment is the write half of named storage."
    ],
    "strongSignals": [
      "Separates Assignment vs Reassignment from lookalike APIs and can draw the mental model."
    ]
  }
})
