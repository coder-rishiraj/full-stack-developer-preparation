import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Shallow vs Deep Copy",
  "whatIsIt": "A shallow copy duplicates one level of properties (new object, same nested references). A deep copy clones nested objects too. Spread and Object.assign are shallow. structuredClone is a deep structured clone. JSON.parse(JSON.stringify) is a lossy deep-ish clone. Identity of the copy is new; nested identity may not be.",
  "whyExists": "You often need a new object for immutability or to snapshot state without sharing mutations.",
  "mentalModel": "Shallow: new folder with the same file shortcuts. Deep: photocopy every nested folder too.",
  "how": [
    "Spread for one-level records.",
    "structuredClone for many built-ins (Dates, Maps) in supporting engines.",
    "Avoid JSON clone for Dates, undefined, functions, symbols, cycles.",
    "Libraries (lodash.cloneDeep) when you need custom."
  ],
  "callout": {
    "title": "Watch for",
    "text": "{...obj, nest: {...obj.nest}} is only two levels — deeper nests still share.",
    "variant": "warning"
  },
  "example": "const o = { a: 1, nest: { b: 2 } };\nconst shallow = { ...o };\nshallow.nest.b = 9;\nconsole.log(o.nest.b, shallow.a);\nconst deep = structuredClone(o);\ndeep.nest.b = 1;\nconsole.log(o.nest.b, deep.nest.b);\n",
  "exampleCaption": "Spread shallow vs structuredClone deep",
  "internals": [
    "Spread CopyDataProperties is enumerable own including symbols in objects.",
    "structuredClone uses the HTML structured clone algorithm (host).",
    "JSON clone uses ToJSON/enumerable strings only."
  ],
  "takeaways": [
    "Spread for one-level records.",
    "structuredClone for many built-ins (Dates, Maps) in supporting engines.",
    "{...obj, nest: {...obj.nest}} is only two levels — deeper nests still share.",
    "Spread CopyDataProperties is enumerable own including symbols in objects."
  ],
  "revision": [
    "Shallow vs Deep Copy: Shallow: new folder with the same file shortcuts. Deep: photocopy every nested folder too.",
    "Spread for one-level records.",
    "structuredClone for many built-ins (Dates, Maps) in supporting engines.",
    "Avoid JSON clone for Dates, undefined, functions, symbols, cycles.",
    "Trap: {...obj, nest: {...obj.nest}} is only two levels — deeper nests still share."
  ],
  "flashcards": [
    [
      "Shallow vs Deep Copy",
      "A shallow copy duplicates one level of properties (new object, same nested references)."
    ],
    [
      "Mental model",
      "Shallow: new folder with the same file shortcuts. Deep: photocopy every nested folder too."
    ],
    [
      "Common trap",
      "{...obj, nest: {...obj.nest}} is only two levels — deeper nests still share."
    ],
    [
      "Spread for one-level records.",
      "structuredClone for many built-ins (Dates, Maps) in supporting engines."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Shallow vs Deep Copy and where does a beginner first see it?",
      "answerHint": "A shallow copy duplicates one level of properties (new object, same nested references). A deep copy clones nested objects too. Spread and Object.assign are shallow. structuredClone is a deep structured clone. JSON.parse(JSON.stringify) is a lossy deep-ish clone. Identity of the copy is new; nested identity may not be."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Shallow vs Deep Copy works and name the main pitfall.",
      "answerHint": "Spread for one-level records. structuredClone for many built-ins (Dates, Maps) in supporting engines. Avoid JSON clone for Dates, undefined, functions, symbols, cycles. Libraries (lodash.cloneDeep) when you need custom. Pitfall: {...obj, nest: {...obj.nest}} is only two levels — deeper nests still share."
    },
    {
      "level": "advanced",
      "question": "How would you explain Shallow vs Deep Copy at an interview, including engine/spec details?",
      "answerHint": "Spread CopyDataProperties is enumerable own including symbols in objects. structuredClone uses the HTML structured clone algorithm (host). JSON clone uses ToJSON/enumerable strings only."
    }
  ],
  "pitfalls": [
    "{...obj, nest: {...obj.nest}} is only two levels — deeper nests still share.",
    "Libraries (lodash.cloneDeep) when you need custom."
  ],
  "interview": {
    "expectations": [
      "Explain Shallow vs Deep Copy without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Spread CopyDataProperties is enumerable own including symbols in objects."
    ],
    "commonQuestions": [
      "What is Shallow vs Deep Copy?",
      "Why does JavaScript shallow vs deep copy behave this way?",
      "What is the classic Shallow vs Deep Copy interview trap?"
    ],
    "traps": [
      "{...obj, nest: {...obj.nest}} is only two levels — deeper nests still share."
    ],
    "misconceptions": [
      "You often need a new object for immutability or to snapshot state without sharing mutations."
    ],
    "strongSignals": [
      "Separates Shallow vs Deep Copy from lookalike APIs and can draw the mental model."
    ]
  }
})
