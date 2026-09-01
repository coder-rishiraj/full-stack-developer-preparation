import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Blob / File / FileReader (Language)",
  "whatIsIt": "In language terms, Blob is an immutable blob of bytes with a type; File extends Blob with name and lastModified. FileReader (legacy) reads blobs async via events; today blob.arrayBuffer()/text()/stream() return promises. They are host objects in browsers and Node, not ECMA-262. This is the data-model view; UI input lives in B3.",
  "whyExists": "Uploads and downloads needed a JS value for ‘file contents + MIME’ without being a path string.",
  "mentalModel": "A sealed bag of bytes with a label (type) and maybe a filename. Reading is async because bytes can be huge.",
  "how": [
    "new Blob([str], { type: 'text/plain' }).",
    "await blob.text() / arrayBuffer().",
    "File comes from inputs; you rarely new File except in tests.",
    "Do not FileReader unless you maintain old code."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify(file) is {} — send FormData or the bytes, not stringify.",
    "variant": "warning"
  },
  "example": "const blob = new Blob(['hello'], { type: 'text/plain' });\nconsole.log(blob.size, blob.type);\nconst t = await blob.text();\nconsole.log(t);\nconst buf = await blob.arrayBuffer();\nconsole.log(new Uint8Array(buf));\n",
  "exampleCaption": "Blob from text, then text() and arrayBuffer()",
  "internals": [
    "Blob is specified in the File API / HTML, not ECMA-262.",
    "slice of a blob is cheap (reference + offset) until read.",
    "Transferable in some structured clone paths."
  ],
  "takeaways": [
    "new Blob([str], { type: 'text/plain' }).",
    "await blob.text() / arrayBuffer().",
    "JSON.stringify(file) is {} — send FormData or the bytes, not stringify.",
    "Blob is specified in the File API / HTML, not ECMA-262."
  ],
  "revision": [
    "Blob / File / FileReader (Language): A sealed bag of bytes with a label (type) and maybe a filename. Reading is async because bytes can be huge.",
    "new Blob([str], { type: 'text/plain' }).",
    "await blob.text() / arrayBuffer().",
    "File comes from inputs; you rarely new File except in tests.",
    "Trap: JSON.stringify(file) is {} — send FormData or the bytes, not stringify."
  ],
  "flashcards": [
    [
      "Blob / File / FileReader (Language)",
      "In language terms, Blob is an immutable blob of bytes with a type; File extends Blob with name and lastModified."
    ],
    [
      "Mental model",
      "A sealed bag of bytes with a label (type) and maybe a filename. Reading is async because bytes can be huge."
    ],
    [
      "Common trap",
      "JSON.stringify(file) is {} — send FormData or the bytes, not stringify."
    ],
    [
      "new Blob([str], { type: 'text/plain' }).",
      "await blob.text() / arrayBuffer()."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Blob / File / FileReader (Language) and where does a beginner first see it?",
      "answerHint": "In language terms, Blob is an immutable blob of bytes with a type; File extends Blob with name and lastModified. FileReader (legacy) reads blobs async via events; today blob.arrayBuffer()/text()/stream() return promises. They are host objects in browsers and Node, not ECMA-262. This is the data-model view; UI input lives in B3."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Blob / File / FileReader (Language) works and name the main pitfall.",
      "answerHint": "new Blob([str], { type: 'text/plain' }). await blob.text() / arrayBuffer(). File comes from inputs; you rarely new File except in tests. Do not FileReader unless you maintain old code. Pitfall: JSON.stringify(file) is {} — send FormData or the bytes, not stringify."
    },
    {
      "level": "advanced",
      "question": "How would you explain Blob / File / FileReader (Language) at an interview, including engine/spec details?",
      "answerHint": "Blob is specified in the File API / HTML, not ECMA-262. slice of a blob is cheap (reference + offset) until read. Transferable in some structured clone paths."
    }
  ],
  "pitfalls": [
    "JSON.stringify(file) is {} — send FormData or the bytes, not stringify.",
    "Do not FileReader unless you maintain old code."
  ],
  "interview": {
    "expectations": [
      "Explain Blob / File / FileReader (Language) without mixing it up with a nearby B1.42 — Binary Data topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Blob is specified in the File API / HTML, not ECMA-262."
    ],
    "commonQuestions": [
      "What is Blob / File / FileReader (Language)?",
      "Why does JavaScript blob / file / filereader (language) behave this way?",
      "What is the classic Blob / File / FileReader (Language) interview trap?"
    ],
    "traps": [
      "JSON.stringify(file) is {} — send FormData or the bytes, not stringify."
    ],
    "misconceptions": [
      "Uploads and downloads needed a JS value for ‘file contents + MIME’ without being a path string."
    ],
    "strongSignals": [
      "Separates Blob / File / FileReader (Language) from lookalike APIs and can draw the mental model."
    ]
  }
})
