import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Blob & File API",
  "whatIsIt": "In the browser, <input type=file> and drag-drop give File objects (Blobs with name). URL.createObjectURL(blob) makes a temporary blob: URL for img/src or download. Revoke it to free memory. FormData.append('file', file) for multipart upload. FileReader is legacy; prefer await file.text()/arrayBuffer(). Show a picker with showOpenFilePicker where supported.",
  "whyExists": "Uploads, image previews, and downloads are core web tasks. Blob URLs avoid huge base64 in the DOM.",
  "mentalModel": "A File is a named bag of bytes from the user’s disk. createObjectURL is a temporary http-like address for that bag in this tab.",
  "how": [
    "input.files[0] is a File.",
    "const url = URL.createObjectURL(file); img.src = url; then revoke.",
    "fetch(url) can read a blob URL.",
    "Do not stringify files.",
    "Accept attribute filters the picker, not a security boundary."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Never revoking object URLs in a preview gallery — memory leak of decoded images.",
    "variant": "warning"
  },
  "example": "const blob = new Blob(['hi'], { type: 'text/plain' });\nconst url = URL.createObjectURL(blob);\nconsole.log(url.startsWith('blob:'));\nconst file = new File(['hi'], 'a.txt', { type: 'text/plain' });\nconsole.log(file.name, file.size, await file.text());\nURL.revokeObjectURL(url);\n",
  "exampleCaption": "Blob URL + File.name; revoke after use",
  "internals": [
    "blob: URLs are origin-tied and listed in a per-document store until revoke or unload.",
    "File inherits Blob; lastModified is extra.",
    "Drag-drop DataTransfer.files is a FileList, not an Array."
  ],
  "takeaways": [
    "input.files[0] is a File.",
    "const url = URL.createObjectURL(file); img.src = url; then revoke.",
    "Never revoking object URLs in a preview gallery — memory leak of decoded images.",
    "blob: URLs are origin-tied and listed in a per-document store until revoke or unload."
  ],
  "revision": [
    "Blob & File API: A File is a named bag of bytes from the user’s disk. createObjectURL is a temporary http-like address for that bag in this tab.",
    "input.files[0] is a File.",
    "const url = URL.createObjectURL(file); img.src = url; then revoke.",
    "fetch(url) can read a blob URL.",
    "Trap: Never revoking object URLs in a preview gallery — memory leak of decoded images."
  ],
  "flashcards": [
    [
      "Blob & File API",
      "In the browser, <input type=file> and drag-drop give File objects (Blobs with name)."
    ],
    [
      "Mental model",
      "A File is a named bag of bytes from the user’s disk. createObjectURL is a temporary http-like address for that bag in this tab."
    ],
    [
      "Common trap",
      "Never revoking object URLs in a preview gallery — memory leak of decoded images."
    ],
    [
      "input.files[0] is a File.",
      "const url = URL.createObjectURL(file); img.src = url; then revoke."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Blob & File API and where does a beginner first see it?",
      "answerHint": "In the browser, <input type=file> and drag-drop give File objects (Blobs with name). URL.createObjectURL(blob) makes a temporary blob: URL for img/src or download. Revoke it to free memory. FormData.append('file', file) for multipart upload. FileReader is legacy; prefer await file.text()/arrayBuffer(). Show a picker with showOpenFilePicker where supported."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Blob & File API works and name the main pitfall.",
      "answerHint": "input.files[0] is a File. const url = URL.createObjectURL(file); img.src = url; then revoke. fetch(url) can read a blob URL. Do not stringify files. Accept attribute filters the picker, not a security boundary. Pitfall: Never revoking object URLs in a preview gallery — memory leak of decoded images."
    },
    {
      "level": "advanced",
      "question": "How would you explain Blob & File API at an interview, including engine/spec details?",
      "answerHint": "blob: URLs are origin-tied and listed in a per-document store until revoke or unload. File inherits Blob; lastModified is extra. Drag-drop DataTransfer.files is a FileList, not an Array."
    }
  ],
  "pitfalls": [
    "Never revoking object URLs in a preview gallery — memory leak of decoded images.",
    "Accept attribute filters the picker, not a security boundary."
  ],
  "interview": {
    "expectations": [
      "Explain Blob & File API without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "blob: URLs are origin-tied and listed in a per-document store until revoke or unload."
    ],
    "commonQuestions": [
      "What is Blob & File API?",
      "Why does JavaScript blob & file api behave this way?",
      "What is the classic Blob & File API interview trap?"
    ],
    "traps": [
      "Never revoking object URLs in a preview gallery — memory leak of decoded images."
    ],
    "misconceptions": [
      "Uploads, image previews, and downloads are core web tasks. Blob URLs avoid huge base64 in the DOM."
    ],
    "strongSignals": [
      "Separates Blob & File API from lookalike APIs and can draw the mental model."
    ]
  }
})
