import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "TypeError / ReferenceError / RangeError",
  "whatIsIt": "TypeError: calling a non-function, reading property of null/undefined, mixing bigint and number, assigning to const (some engines), immutable object writes in strict. ReferenceError: reading an unbound identifier (or TDZ). RangeError: invalid array length, stack overflow, toFixed digits. They are not interchangeable in interviews.",
  "whyExists": "Different abstract operations fail differently: GetValue unbound vs Call non-callable vs ToIndex out of range.",
  "mentalModel": "TypeError = wrong kind of value. ReferenceError = no such binding. RangeError = number out of allowed range.",
  "how": [
    "nullish guard before .prop to avoid TypeError.",
    "Declare names to avoid ReferenceError.",
    "Validate lengths before new Array(n).",
    "Read e.name in tests, not just e.message language."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Saying ‘undefined is not a function’ is TypeError, not ReferenceError — the binding existed, the value was not callable.",
    "variant": "warning"
  },
  "example": "try { (undefined)(); } catch (e) { console.log(e.name); }\ntry { console.log(notDeclared); } catch (e) { console.log(e.name); }\ntry { (1n + 1); } catch (e) { console.log(e.name); }\ntry { ''.toFixed(100); } catch (e) { console.log(typeof ''.toFixed); }\ntry { (1).toFixed(101); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "TypeError vs ReferenceError vs RangeError on toFixed",
  "internals": [
    "Call requires IsCallable.",
    "GetValue of an unresolvable reference → ReferenceError.",
    "ToIndex / array length operations → RangeError."
  ],
  "takeaways": [
    "nullish guard before .prop to avoid TypeError.",
    "Declare names to avoid ReferenceError.",
    "Saying ‘undefined is not a function’ is TypeError, not ReferenceError — the binding existed, the value was not callable.",
    "Call requires IsCallable."
  ],
  "revision": [
    "TypeError / ReferenceError / RangeError: TypeError = wrong kind of value. ReferenceError = no such binding. RangeError = number out of allowed range.",
    "nullish guard before .prop to avoid TypeError.",
    "Declare names to avoid ReferenceError.",
    "Validate lengths before new Array(n).",
    "Trap: Saying ‘undefined is not a function’ is TypeError, not ReferenceError — the binding existed, the value was not callable."
  ],
  "flashcards": [
    [
      "TypeError / ReferenceError / RangeError",
      "TypeError: calling a non-function, reading property of null/undefined, mixing bigint and number, assigning to const (some engines), immutable object writes in strict."
    ],
    [
      "Mental model",
      "TypeError = wrong kind of value. ReferenceError = no such binding. RangeError = number out of allowed range."
    ],
    [
      "Common trap",
      "Saying ‘undefined is not a function’ is TypeError, not ReferenceError — the binding existed, the value was not callable."
    ],
    [
      "nullish guard before .prop to avoid TypeError.",
      "Declare names to avoid ReferenceError."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is TypeError / ReferenceError / RangeError and where does a beginner first see it?",
      "answerHint": "TypeError: calling a non-function, reading property of null/undefined, mixing bigint and number, assigning to const (some engines), immutable object writes in strict. ReferenceError: reading an unbound identifier (or TDZ). RangeError: invalid array length, stack overflow, toFixed digits. They are not interchangeable in interviews."
    },
    {
      "level": "intermediate",
      "question": "Walk through how TypeError / ReferenceError / RangeError works and name the main pitfall.",
      "answerHint": "nullish guard before .prop to avoid TypeError. Declare names to avoid ReferenceError. Validate lengths before new Array(n). Read e.name in tests, not just e.message language. Pitfall: Saying ‘undefined is not a function’ is TypeError, not ReferenceError — the binding existed, the value was not callable."
    },
    {
      "level": "advanced",
      "question": "How would you explain TypeError / ReferenceError / RangeError at an interview, including engine/spec details?",
      "answerHint": "Call requires IsCallable. GetValue of an unresolvable reference → ReferenceError. ToIndex / array length operations → RangeError."
    }
  ],
  "pitfalls": [
    "Saying ‘undefined is not a function’ is TypeError, not ReferenceError — the binding existed, the value was not callable.",
    "Read e.name in tests, not just e.message language."
  ],
  "interview": {
    "expectations": [
      "Explain TypeError / ReferenceError / RangeError without mixing it up with a nearby B1.32 — Error Handling topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Call requires IsCallable."
    ],
    "commonQuestions": [
      "What is TypeError / ReferenceError / RangeError?",
      "Why does JavaScript typeerror / referenceerror / rangeerror behave this way?",
      "What is the classic TypeError / ReferenceError / RangeError interview trap?"
    ],
    "traps": [
      "Saying ‘undefined is not a function’ is TypeError, not ReferenceError — the binding existed, the value was not callable."
    ],
    "misconceptions": [
      "Different abstract operations fail differently: GetValue unbound vs Call non-callable vs ToIndex out of range."
    ],
    "strongSignals": [
      "Separates TypeError / ReferenceError / RangeError from lookalike APIs and can draw the mental model."
    ]
  }
})
