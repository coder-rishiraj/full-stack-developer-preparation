import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Error Types",
  "whatIsIt": "Error is the base. Subclasses: TypeError (wrong type/shape), ReferenceError (bad binding), SyntaxError (parse), RangeError (stack overflow, invalid length), URIError, EvalError (legacy). DOMException in browsers. Custom classes should extend Error and set name. Anything can be thrown; only Error has stack (usually).",
  "whyExists": "Catch blocks and logs need a taxonomy. Built-in names tell you which language rule broke.",
  "mentalModel": "A family of failure objects. name is the species; message is the story; stack is the trail.",
  "how": [
    "throw new TypeError('...') when types are wrong.",
    "if (e instanceof TypeError) for recovery.",
    "instanceof fails across realms.",
    "Always Error, not throw 'string' (no stack in some hosts)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "catch (e) { if (e === 'string') } after libraries throw strings — normalize to Error.",
    "variant": "warning"
  },
  "example": "try { null.f(); } catch (e) { console.log(e.name); }\ntry { missing; } catch (e) { console.log(e.name); }\ntry { new Array(-1); } catch (e) { console.log(e.name); }\ntry { JSON.parse('{'); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "TypeError, ReferenceError, RangeError, SyntaxError",
  "internals": [
    "NativeError constructors set [[ErrorData]] and name.",
    "SyntaxError from JSON.parse is runtime, from eval/parse of scripts can be early.",
    "error.cause is a standard chain field."
  ],
  "takeaways": [
    "throw new TypeError('...') when types are wrong.",
    "if (e instanceof TypeError) for recovery.",
    "catch (e) { if (e === 'string') } after libraries throw strings — normalize to Error.",
    "NativeError constructors set [[ErrorData]] and name."
  ],
  "revision": [
    "Error Types: A family of failure objects. name is the species; message is the story; stack is the trail.",
    "throw new TypeError('...') when types are wrong.",
    "if (e instanceof TypeError) for recovery.",
    "instanceof fails across realms.",
    "Trap: catch (e) { if (e === 'string') } after libraries throw strings — normalize to Error."
  ],
  "flashcards": [
    [
      "Error Types",
      "Error is the base."
    ],
    [
      "Mental model",
      "A family of failure objects. name is the species; message is the story; stack is the trail."
    ],
    [
      "Common trap",
      "catch (e) { if (e === 'string') } after libraries throw strings — normalize to Error."
    ],
    [
      "throw new TypeError('...') when types are wrong.",
      "if (e instanceof TypeError) for recovery."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Error Types and where does a beginner first see it?",
      "answerHint": "Error is the base. Subclasses: TypeError (wrong type/shape), ReferenceError (bad binding), SyntaxError (parse), RangeError (stack overflow, invalid length), URIError, EvalError (legacy). DOMException in browsers. Custom classes should extend Error and set name. Anything can be thrown; only Error has stack (usually)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Error Types works and name the main pitfall.",
      "answerHint": "throw new TypeError('...') when types are wrong. if (e instanceof TypeError) for recovery. instanceof fails across realms. Always Error, not throw 'string' (no stack in some hosts). Pitfall: catch (e) { if (e === 'string') } after libraries throw strings — normalize to Error."
    },
    {
      "level": "advanced",
      "question": "How would you explain Error Types at an interview, including engine/spec details?",
      "answerHint": "NativeError constructors set [[ErrorData]] and name. SyntaxError from JSON.parse is runtime, from eval/parse of scripts can be early. error.cause is a standard chain field."
    }
  ],
  "pitfalls": [
    "catch (e) { if (e === 'string') } after libraries throw strings — normalize to Error.",
    "Always Error, not throw 'string' (no stack in some hosts)."
  ],
  "interview": {
    "expectations": [
      "Explain Error Types without mixing it up with a nearby B1.32 — Error Handling topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "NativeError constructors set [[ErrorData]] and name."
    ],
    "commonQuestions": [
      "What is Error Types?",
      "Why does JavaScript error types behave this way?",
      "What is the classic Error Types interview trap?"
    ],
    "traps": [
      "catch (e) { if (e === 'string') } after libraries throw strings — normalize to Error."
    ],
    "misconceptions": [
      "Catch blocks and logs need a taxonomy. Built-in names tell you which language rule broke."
    ],
    "strongSignals": [
      "Separates Error Types from lookalike APIs and can draw the mental model."
    ]
  }
})
