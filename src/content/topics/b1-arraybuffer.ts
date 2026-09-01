import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "ArrayBuffer / TypedArray / DataView",
  "whatIsIt": "ArrayBuffer is a fixed-length raw binary store. TypedArrays (Uint8Array, Float64Array, …) are views with a type, offset, and length. DataView is an untyped view with endianness control. They share memory; mutating a view mutates the buffer. Not resizable unless using the newer resizable buffers. JSON cannot hold them (use base64).",
  "whyExists": "Audio, images, WASM, and protocols need bytes, not UTF-16 strings or number arrays.",
  "mentalModel": "A slab of bytes (buffer) plus window frames (views) that interpret those bytes as ints/floats.",
  "how": [
    "new Uint8Array(buffer) or new Uint8Array(n).",
    "DataView for mixed endian fields.",
    "Do not overlap views carelessly if you care about aliasing.",
    "structuredClone can clone buffers; postMessage can transfer them."
  ],
  "callout": {
    "title": "Watch for",
    "text": "new Float64Array(buf) requires byteLength multiple of 8 — RangeError otherwise.",
    "variant": "warning"
  },
  "example": "const buf = new ArrayBuffer(8);\nconst u8 = new Uint8Array(buf);\nconst dv = new DataView(buf);\nu8[0] = 1;\nu8[1] = 2;\nconsole.log(dv.getUint16(0, true), u8);\nconst f64 = new Float64Array(1);\nf64[0] = 1.5;\nconsole.log(new Uint8Array(f64.buffer).length);\n",
  "exampleCaption": "Shared buffer: Uint8Array and DataView",
  "internals": [
    "[[ArrayBufferData]] internal slot; views have [[ViewedArrayBuffer]], [[ByteOffset]].",
    "TypedArray integer indexed exotic objects.",
    "Transfer detaches the buffer ([[ArrayBufferData]] empty)."
  ],
  "takeaways": [
    "new Uint8Array(buffer) or new Uint8Array(n).",
    "DataView for mixed endian fields.",
    "new Float64Array(buf) requires byteLength multiple of 8 — RangeError otherwise.",
    "[[ArrayBufferData]] internal slot; views have [[ViewedArrayBuffer]], [[ByteOffset]]."
  ],
  "revision": [
    "ArrayBuffer / TypedArray / DataView: A slab of bytes (buffer) plus window frames (views) that interpret those bytes as ints/floats.",
    "new Uint8Array(buffer) or new Uint8Array(n).",
    "DataView for mixed endian fields.",
    "Do not overlap views carelessly if you care about aliasing.",
    "Trap: new Float64Array(buf) requires byteLength multiple of 8 — RangeError otherwise."
  ],
  "flashcards": [
    [
      "ArrayBuffer / TypedArray / DataView",
      "ArrayBuffer is a fixed-length raw binary store."
    ],
    [
      "Mental model",
      "A slab of bytes (buffer) plus window frames (views) that interpret those bytes as ints/floats."
    ],
    [
      "Common trap",
      "new Float64Array(buf) requires byteLength multiple of 8 — RangeError otherwise."
    ],
    [
      "new Uint8Array(buffer) or new Uint8Array(n).",
      "DataView for mixed endian fields."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is ArrayBuffer / TypedArray / DataView and where does a beginner first see it?",
      "answerHint": "ArrayBuffer is a fixed-length raw binary store. TypedArrays (Uint8Array, Float64Array, …) are views with a type, offset, and length. DataView is an untyped view with endianness control. They share memory; mutating a view mutates the buffer. Not resizable unless using the newer resizable buffers. JSON cannot hold them (use base64)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how ArrayBuffer / TypedArray / DataView works and name the main pitfall.",
      "answerHint": "new Uint8Array(buffer) or new Uint8Array(n). DataView for mixed endian fields. Do not overlap views carelessly if you care about aliasing. structuredClone can clone buffers; postMessage can transfer them. Pitfall: new Float64Array(buf) requires byteLength multiple of 8 — RangeError otherwise."
    },
    {
      "level": "advanced",
      "question": "How would you explain ArrayBuffer / TypedArray / DataView at an interview, including engine/spec details?",
      "answerHint": "[[ArrayBufferData]] internal slot; views have [[ViewedArrayBuffer]], [[ByteOffset]]. TypedArray integer indexed exotic objects. Transfer detaches the buffer ([[ArrayBufferData]] empty)."
    }
  ],
  "pitfalls": [
    "new Float64Array(buf) requires byteLength multiple of 8 — RangeError otherwise.",
    "structuredClone can clone buffers; postMessage can transfer them."
  ],
  "interview": {
    "expectations": [
      "Explain ArrayBuffer / TypedArray / DataView without mixing it up with a nearby B1.42 — Binary Data topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[ArrayBufferData]] internal slot; views have [[ViewedArrayBuffer]], [[ByteOffset]]."
    ],
    "commonQuestions": [
      "What is ArrayBuffer / TypedArray / DataView?",
      "Why does JavaScript arraybuffer / typedarray / dataview behave this way?",
      "What is the classic ArrayBuffer / TypedArray / DataView interview trap?"
    ],
    "traps": [
      "new Float64Array(buf) requires byteLength multiple of 8 — RangeError otherwise."
    ],
    "misconceptions": [
      "Audio, images, WASM, and protocols need bytes, not UTF-16 strings or number arrays."
    ],
    "strongSignals": [
      "Separates ArrayBuffer / TypedArray / DataView from lookalike APIs and can draw the mental model."
    ]
  }
})
