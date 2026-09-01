import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Custom Errors",
  "whatIsIt": "class MyError extends Error { constructor(msg, options) { super(msg, options); this.name = 'MyError'; } }. Set name, keep message, pass { cause }. instanceof MyError works in the same realm. Some engines need Error.captureStackTrace. Do not extend Error in a way that loses stack (old Babel).",
  "whyExists": "Callers catch(ValidationError) vs catch(NetworkError) to recover differently. A string throw cannot do that well.",
  "mentalModel": "A named subclass of Error so catch can discriminate without parsing messages.",
  "how": [
    "extends Error, super(message, { cause }).",
    "this.name = this.constructor.name.",
    "instanceof for control flow; still log stack.",
    "Do not over-hierarchy; a few types beat twenty."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Object.setPrototypeOf missing in old transpilers: instanceof MyError is false after extend.",
    "variant": "warning"
  },
  "example": "class ValidationError extends Error {\n  constructor(msg, field) {\n    super(msg);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\ntry { throw new ValidationError('required', 'email'); }\ncatch (e) {\n  if (e instanceof ValidationError) console.log(e.field, e.message);\n}\n",
  "exampleCaption": "Custom Error subclass with extra field",
  "internals": [
    "NewError / Error constructor sets the stack using the construct call.",
    "cause is a standard data property from the options bag.",
    "Cross-realm instanceof fails because the class function differs."
  ],
  "takeaways": [
    "extends Error, super(message, { cause }).",
    "this.name = this.constructor.name.",
    "Object.setPrototypeOf missing in old transpilers: instanceof MyError is false after extend.",
    "NewError / Error constructor sets the stack using the construct call."
  ],
  "revision": [
    "Custom Errors: A named subclass of Error so catch can discriminate without parsing messages.",
    "extends Error, super(message, { cause }).",
    "this.name = this.constructor.name.",
    "instanceof for control flow; still log stack.",
    "Trap: Object.setPrototypeOf missing in old transpilers: instanceof MyError is false after extend."
  ],
  "flashcards": [
    [
      "Custom Errors",
      "class MyError extends Error { constructor(msg, options) { super(msg, options); this.name = 'MyError'; } }."
    ],
    [
      "Mental model",
      "A named subclass of Error so catch can discriminate without parsing messages."
    ],
    [
      "Common trap",
      "Object.setPrototypeOf missing in old transpilers: instanceof MyError is false after extend."
    ],
    [
      "extends Error, super(message, { cause }).",
      "this.name = this.constructor.name."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Custom Errors and where does a beginner first see it?",
      "answerHint": "class MyError extends Error { constructor(msg, options) { super(msg, options); this.name = 'MyError'; } }. Set name, keep message, pass { cause }. instanceof MyError works in the same realm. Some engines need Error.captureStackTrace. Do not extend Error in a way that loses stack (old Babel)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Custom Errors works and name the main pitfall.",
      "answerHint": "extends Error, super(message, { cause }). this.name = this.constructor.name. instanceof for control flow; still log stack. Do not over-hierarchy; a few types beat twenty. Pitfall: Object.setPrototypeOf missing in old transpilers: instanceof MyError is false after extend."
    },
    {
      "level": "advanced",
      "question": "How would you explain Custom Errors at an interview, including engine/spec details?",
      "answerHint": "NewError / Error constructor sets the stack using the construct call. cause is a standard data property from the options bag. Cross-realm instanceof fails because the class function differs."
    }
  ],
  "pitfalls": [
    "Object.setPrototypeOf missing in old transpilers: instanceof MyError is false after extend.",
    "Do not over-hierarchy; a few types beat twenty."
  ],
  "interview": {
    "expectations": [
      "Explain Custom Errors without mixing it up with a nearby B1.32 — Error Handling topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "NewError / Error constructor sets the stack using the construct call."
    ],
    "commonQuestions": [
      "What is Custom Errors?",
      "Why does JavaScript custom errors behave this way?",
      "What is the classic Custom Errors interview trap?"
    ],
    "traps": [
      "Object.setPrototypeOf missing in old transpilers: instanceof MyError is false after extend."
    ],
    "misconceptions": [
      "Callers catch(ValidationError) vs catch(NetworkError) to recover differently. A string throw cannot do that well."
    ],
    "strongSignals": [
      "Separates Custom Errors from lookalike APIs and can draw the mental model."
    ]
  }
})
