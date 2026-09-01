import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "throw / try / catch / finally",
  "whatIsIt": "throw expr raises an exception (any value). try runs a block; catch binds the thrown value; finally always runs on leave (return, throw, break). catch optional if finally exists. Inner finally runs before the outer catch. throw in finally can mask the original error.",
  "whyExists": "Structured exception handling lets deep code fail without every layer returning error codes — until async, where promises take over.",
  "mentalModel": "Eject from the stack until a catch net. finally is the ‘wash your hands’ on the way out, even if you rethrow.",
  "how": [
    "throw new Error(msg).",
    "finally for cleanup (close, unlock).",
    "Do not throw from finally unless you intend to hide the first error.",
    "Optional catch binding: catch { } when you do not need e."
  ],
  "callout": {
    "title": "Watch for",
    "text": "return in finally overrides a return in try — the try value is discarded.",
    "variant": "warning"
  },
  "example": "function f() {\n  try {\n    throw new Error('x');\n  } catch (e) {\n    console.log('catch', e.message);\n    return 1;\n  } finally {\n    console.log('finally');\n  }\n}\nconsole.log('ret', f());\n",
  "exampleCaption": "finally runs even on return from catch",
  "internals": [
    "TryCatch finally uses completion records (return/throw/normal).",
    "finally replacing a return is specified via UpdateEmpty / completion overwrite.",
    "throw uses GetValue of the expression then abrupt throw completion."
  ],
  "takeaways": [
    "throw new Error(msg).",
    "finally for cleanup (close, unlock).",
    "return in finally overrides a return in try — the try value is discarded.",
    "TryCatch finally uses completion records (return/throw/normal)."
  ],
  "revision": [
    "throw / try / catch / finally: Eject from the stack until a catch net. finally is the ‘wash your hands’ on the way out, even if you rethrow.",
    "throw new Error(msg).",
    "finally for cleanup (close, unlock).",
    "Do not throw from finally unless you intend to hide the first error.",
    "Trap: return in finally overrides a return in try — the try value is discarded."
  ],
  "flashcards": [
    [
      "throw / try / catch / finally",
      "throw expr raises an exception (any value)."
    ],
    [
      "Mental model",
      "Eject from the stack until a catch net. finally is the ‘wash your hands’ on the way out, even if you rethrow."
    ],
    [
      "Common trap",
      "return in finally overrides a return in try — the try value is discarded."
    ],
    [
      "throw new Error(msg).",
      "finally for cleanup (close, unlock)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is throw / try / catch / finally and where does a beginner first see it?",
      "answerHint": "throw expr raises an exception (any value). try runs a block; catch binds the thrown value; finally always runs on leave (return, throw, break). catch optional if finally exists. Inner finally runs before the outer catch. throw in finally can mask the original error."
    },
    {
      "level": "intermediate",
      "question": "Walk through how throw / try / catch / finally works and name the main pitfall.",
      "answerHint": "throw new Error(msg). finally for cleanup (close, unlock). Do not throw from finally unless you intend to hide the first error. Optional catch binding: catch { } when you do not need e. Pitfall: return in finally overrides a return in try — the try value is discarded."
    },
    {
      "level": "advanced",
      "question": "How would you explain throw / try / catch / finally at an interview, including engine/spec details?",
      "answerHint": "TryCatch finally uses completion records (return/throw/normal). finally replacing a return is specified via UpdateEmpty / completion overwrite. throw uses GetValue of the expression then abrupt throw completion."
    }
  ],
  "pitfalls": [
    "return in finally overrides a return in try — the try value is discarded.",
    "Optional catch binding: catch { } when you do not need e."
  ],
  "interview": {
    "expectations": [
      "Explain throw / try / catch / finally without mixing it up with a nearby B1.32 — Error Handling topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "TryCatch finally uses completion records (return/throw/normal)."
    ],
    "commonQuestions": [
      "What is throw / try / catch / finally?",
      "Why does JavaScript throw / try / catch / finally behave this way?",
      "What is the classic throw / try / catch / finally interview trap?"
    ],
    "traps": [
      "return in finally overrides a return in try — the try value is discarded."
    ],
    "misconceptions": [
      "Structured exception handling lets deep code fail without every layer returning error codes — until async, where promises take over."
    ],
    "strongSignals": [
      "Separates throw / try / catch / finally from lookalike APIs and can draw the mental model."
    ]
  }
})
