import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement map / filter / reduce / forEach",
  "whatIsIt": "Implement map/filter/reduce/forEach on an array-like: loop indexes 0..length-1, skip holes if you match spec (HasProperty), call the callback with (value, index, array) and optional thisArg. map builds a new array of the same length; filter pushes passing values; reduce folds with an accumulator; forEach ignores returns. Do not call the built-ins you are implementing.",
  "whyExists": "Interviews test whether you understand holes, thisArg, and that map preserves length while filter does not. It is the spec algorithms in miniature.",
  "mentalModel": "A for-loop with a callback. map writes to dest[i]; filter only dest.push; reduce threads acc; forEach is map without dest.",
  "how": [
    "Read length once.",
    "if (!(i in arr)) continue for hole-skipping methods.",
    "callback.call(thisArg, arr[i], i, arr).",
    "reduce: if no init, find first present element as acc or throw.",
    "Return the new array or the acc; forEach returns undefined."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using Array.prototype.map inside your map — the interviewer asked you to write the loop.",
    "variant": "warning"
  },
  "example": "function map(arr, fn, thisArg) {\n  const len = arr.length, out = new Array(len);\n  for (let i = 0; i < len; i++) {\n    if (i in arr) out[i] = fn.call(thisArg, arr[i], i, arr);\n  }\n  return out;\n}\nfunction reduce(arr, fn, init) {\n  let i = 0, acc, started = arguments.length >= 3;\n  if (started) acc = init;\n  for (; i < arr.length; i++) {\n    if (!(i in arr)) continue;\n    if (!started) { acc = arr[i]; started = true; continue; }\n    acc = fn(acc, arr[i], i, arr);\n  }\n  if (!started) throw new TypeError('empty');\n  return acc;\n}\nconsole.log(map([1, , 3], (x) => x * 2), reduce([1, 2, 3], (a, b) => a + b, 0));\n",
  "exampleCaption": "map keeps holes; reduce with initializer",
  "internals": [
    "Spec uses HasProperty to skip holes in map/forEach/filter.",
    "ArraySpeciesCreate is skipped in a simple interview impl (always Array).",
    "reduce without init on empty/all-holes throws TypeError."
  ],
  "takeaways": [
    "Read length once.",
    "if (!(i in arr)) continue for hole-skipping methods.",
    "Using Array.prototype.map inside your map — the interviewer asked you to write the loop.",
    "Spec uses HasProperty to skip holes in map/forEach/filter."
  ],
  "revision": [
    "Implement map / filter / reduce / forEach: A for-loop with a callback. map writes to dest[i]; filter only dest.push; reduce threads acc; forEach is map without dest.",
    "Read length once.",
    "if (!(i in arr)) continue for hole-skipping methods.",
    "callback.call(thisArg, arr[i], i, arr).",
    "Trap: Using Array.prototype.map inside your map — the interviewer asked you to write the loop."
  ],
  "flashcards": [
    [
      "Implement map / filter / reduce / forEach",
      "Implement map/filter/reduce/forEach on an array-like: loop indexes 0..length-1, skip holes if you match spec (HasProperty), call the callback with (value, index, array) and optional thisArg."
    ],
    [
      "Mental model",
      "A for-loop with a callback. map writes to dest[i]; filter only dest.push; reduce threads acc; forEach is map without dest."
    ],
    [
      "Common trap",
      "Using Array.prototype.map inside your map — the interviewer asked you to write the loop."
    ],
    [
      "Read length once.",
      "if (!(i in arr)) continue for hole-skipping methods."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement map / filter / reduce / forEach and where does a beginner first see it?",
      "answerHint": "Implement map/filter/reduce/forEach on an array-like: loop indexes 0..length-1, skip holes if you match spec (HasProperty), call the callback with (value, index, array) and optional thisArg. map builds a new array of the same length; filter pushes passing values; reduce folds with an accumulator; forEach ignores returns. Do not call the built-ins you are implementing."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement map / filter / reduce / forEach works and name the main pitfall.",
      "answerHint": "Read length once. if (!(i in arr)) continue for hole-skipping methods. callback.call(thisArg, arr[i], i, arr). reduce: if no init, find first present element as acc or throw. Return the new array or the acc; forEach returns undefined. Pitfall: Using Array.prototype.map inside your map — the interviewer asked you to write the loop."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement map / filter / reduce / forEach at an interview, including engine/spec details?",
      "answerHint": "Spec uses HasProperty to skip holes in map/forEach/filter. ArraySpeciesCreate is skipped in a simple interview impl (always Array). reduce without init on empty/all-holes throws TypeError."
    }
  ],
  "pitfalls": [
    "Using Array.prototype.map inside your map — the interviewer asked you to write the loop.",
    "Return the new array or the acc; forEach returns undefined."
  ],
  "interview": {
    "expectations": [
      "Explain Implement map / filter / reduce / forEach without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Spec uses HasProperty to skip holes in map/forEach/filter."
    ],
    "commonQuestions": [
      "What is Implement map / filter / reduce / forEach?",
      "Why does JavaScript implement map / filter / reduce / foreach behave this way?",
      "What is the classic Implement map / filter / reduce / forEach interview trap?"
    ],
    "traps": [
      "Using Array.prototype.map inside your map — the interviewer asked you to write the loop."
    ],
    "misconceptions": [
      "Interviews test whether you understand holes, thisArg, and that map preserves length while filter does not. It is the spec algorithms in miniature."
    ],
    "strongSignals": [
      "Separates Implement map / filter / reduce / forEach from lookalike APIs and can draw the mental model."
    ]
  }
})
