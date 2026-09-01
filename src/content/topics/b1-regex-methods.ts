import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "test / exec / match / replace",
  "whatIsIt": "re.test(s) boolean (advances lastIndex if g/y). re.exec(s) returns a match array with groups or null (also advances). s.match(re) for /g returns all matches (no groups); without g like exec. s.matchAll(re) needs /g and yields exec-like results. s.replace / replaceAll. split. Prefer matchAll over looping exec.",
  "whyExists": "String and RegExp both grew methods; they overlap. lastIndex makes test/exec in a loop a footgun.",
  "mentalModel": "test = yes/no. exec/matchAll = details + groups. replace = paint. Shared /g regex is a cursor that moves.",
  "how": [
    "Do not use test() in a loop with /g on a shared regex without resetting lastIndex.",
    "matchAll for all group captures.",
    "replace callback gets groups.",
    "String methods ToString the receiver."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A global regex in a helper: second call starts at lastIndex and ‘fails’ randomly.",
    "variant": "warning"
  },
  "example": "const re = /(\\d+)/g;\nconsole.log(re.exec('a12 b34'));\nconsole.log(re.exec('a12 b34'));\nre.lastIndex = 0;\nconsole.log('a12 b34'.match(re));\nconsole.log([...('a12 b34'.matchAll(/(\\d+)/g))].map((m) => m[1]));\n",
  "exampleCaption": "exec lastIndex vs match vs matchAll groups",
  "internals": [
    "RegExp.prototype.exec updates lastIndex per spec for global/sticky.",
    "test is specified as exec !== null (and thus also updates lastIndex).",
    "matchAll creates a new iterator that does not share lastIndex surprises as easily if you pass a literal each time."
  ],
  "takeaways": [
    "Do not use test() in a loop with /g on a shared regex without resetting lastIndex.",
    "matchAll for all group captures.",
    "A global regex in a helper: second call starts at lastIndex and ‘fails’ randomly.",
    "RegExp.prototype.exec updates lastIndex per spec for global/sticky."
  ],
  "revision": [
    "test / exec / match / replace: test = yes/no. exec/matchAll = details + groups. replace = paint. Shared /g regex is a cursor that moves.",
    "Do not use test() in a loop with /g on a shared regex without resetting lastIndex.",
    "matchAll for all group captures.",
    "replace callback gets groups.",
    "Trap: A global regex in a helper: second call starts at lastIndex and ‘fails’ randomly."
  ],
  "flashcards": [
    [
      "test / exec / match / replace",
      "re.test(s) boolean (advances lastIndex if g/y)."
    ],
    [
      "Mental model",
      "test = yes/no. exec/matchAll = details + groups. replace = paint. Shared /g regex is a cursor that moves."
    ],
    [
      "Common trap",
      "A global regex in a helper: second call starts at lastIndex and ‘fails’ randomly."
    ],
    [
      "Do not use test() in a loop with /g on a shared regex without resetting lastInde",
      "matchAll for all group captures."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is test / exec / match / replace and where does a beginner first see it?",
      "answerHint": "re.test(s) boolean (advances lastIndex if g/y). re.exec(s) returns a match array with groups or null (also advances). s.match(re) for /g returns all matches (no groups); without g like exec. s.matchAll(re) needs /g and yields exec-like results. s.replace / replaceAll. split. Prefer matchAll over looping exec."
    },
    {
      "level": "intermediate",
      "question": "Walk through how test / exec / match / replace works and name the main pitfall.",
      "answerHint": "Do not use test() in a loop with /g on a shared regex without resetting lastIndex. matchAll for all group captures. replace callback gets groups. String methods ToString the receiver. Pitfall: A global regex in a helper: second call starts at lastIndex and ‘fails’ randomly."
    },
    {
      "level": "advanced",
      "question": "How would you explain test / exec / match / replace at an interview, including engine/spec details?",
      "answerHint": "RegExp.prototype.exec updates lastIndex per spec for global/sticky. test is specified as exec !== null (and thus also updates lastIndex). matchAll creates a new iterator that does not share lastIndex surprises as easily if you pass a literal each time."
    }
  ],
  "pitfalls": [
    "A global regex in a helper: second call starts at lastIndex and ‘fails’ randomly.",
    "String methods ToString the receiver."
  ],
  "interview": {
    "expectations": [
      "Explain test / exec / match / replace without mixing it up with a nearby B1.37 — Regular Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "RegExp.prototype.exec updates lastIndex per spec for global/sticky."
    ],
    "commonQuestions": [
      "What is test / exec / match / replace?",
      "Why does JavaScript test / exec / match / replace behave this way?",
      "What is the classic test / exec / match / replace interview trap?"
    ],
    "traps": [
      "A global regex in a helper: second call starts at lastIndex and ‘fails’ randomly."
    ],
    "misconceptions": [
      "String and RegExp both grew methods; they overlap. lastIndex makes test/exec in a loop a footgun."
    ],
    "strongSignals": [
      "Separates test / exec / match / replace from lookalike APIs and can draw the mental model."
    ]
  }
})
