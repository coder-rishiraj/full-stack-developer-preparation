import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Sparse Arrays",
  "whatIsIt": "A sparse array has holes: indexes that are not own properties. [,'x'] has a hole at 0. forEach/map/filter skip holes; for/of and Array.from visit them as undefined. JSON.stringify turns holes into null. Density matters for engine internals (packed vs holey elements).",
  "whyExists": "length can be set independently, so JS allowed missing indexes. That created two kinds of ‘empty.’",
  "mentalModel": "A street with house numbers missing. Some algorithms skip vacant lots; others pretend undefined lives there.",
  "how": [
    "Avoid new Array(n) and delete a[i] (creates holes).",
    "Prefer fill or Array.from({length:n}, fn).",
    "Know map skips holes — pad if you need them.",
    "Use in or hasOwn to detect holes."
  ],
  "callout": {
    "title": "Watch for",
    "text": "a.map(x => x) does not densify holes — the result stays sparse.",
    "variant": "warning"
  },
  "example": "const a = [];\na[0] = 1;\na[2] = 3;\nconsole.log(a, a.length, 1 in a);\nconsole.log(a.map((x) => x * 2));\nconsole.log([...a]);\nconsole.log(JSON.stringify(a));\n",
  "exampleCaption": "Hole at index 1: map vs spread vs JSON",
  "internals": [
    "HasProperty vs Get: Get on a hole walks the prototype (Array.prototype[1] could exist!).",
    "Array.prototype methods use HasProperty to skip holes.",
    "V8 holey_smi / holey_double / holey_elements kinds."
  ],
  "takeaways": [
    "Avoid new Array(n) and delete a[i] (creates holes).",
    "Prefer fill or Array.from({length:n}, fn).",
    "a.map(x => x) does not densify holes — the result stays sparse.",
    "HasProperty vs Get: Get on a hole walks the prototype (Array.prototype[1] could exist!)."
  ],
  "revision": [
    "Sparse Arrays: A street with house numbers missing. Some algorithms skip vacant lots; others pretend undefined lives there.",
    "Avoid new Array(n) and delete a[i] (creates holes).",
    "Prefer fill or Array.from({length:n}, fn).",
    "Know map skips holes — pad if you need them.",
    "Trap: a.map(x => x) does not densify holes — the result stays sparse."
  ],
  "flashcards": [
    [
      "Sparse Arrays",
      "A sparse array has holes: indexes that are not own properties."
    ],
    [
      "Mental model",
      "A street with house numbers missing. Some algorithms skip vacant lots; others pretend undefined lives there."
    ],
    [
      "Common trap",
      "a.map(x => x) does not densify holes — the result stays sparse."
    ],
    [
      "Avoid new Array(n) and delete a[i] (creates holes).",
      "Prefer fill or Array.from({length:n}, fn)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Sparse Arrays and where does a beginner first see it?",
      "answerHint": "A sparse array has holes: indexes that are not own properties. [,'x'] has a hole at 0. forEach/map/filter skip holes; for/of and Array.from visit them as undefined. JSON.stringify turns holes into null. Density matters for engine internals (packed vs holey elements)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Sparse Arrays works and name the main pitfall.",
      "answerHint": "Avoid new Array(n) and delete a[i] (creates holes). Prefer fill or Array.from({length:n}, fn). Know map skips holes — pad if you need them. Use in or hasOwn to detect holes. Pitfall: a.map(x => x) does not densify holes — the result stays sparse."
    },
    {
      "level": "advanced",
      "question": "How would you explain Sparse Arrays at an interview, including engine/spec details?",
      "answerHint": "HasProperty vs Get: Get on a hole walks the prototype (Array.prototype[1] could exist!). Array.prototype methods use HasProperty to skip holes. V8 holey_smi / holey_double / holey_elements kinds."
    }
  ],
  "pitfalls": [
    "a.map(x => x) does not densify holes — the result stays sparse.",
    "Use in or hasOwn to detect holes."
  ],
  "interview": {
    "expectations": [
      "Explain Sparse Arrays without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HasProperty vs Get: Get on a hole walks the prototype (Array.prototype[1] could exist!)."
    ],
    "commonQuestions": [
      "What is Sparse Arrays?",
      "Why does JavaScript sparse arrays behave this way?",
      "What is the classic Sparse Arrays interview trap?"
    ],
    "traps": [
      "a.map(x => x) does not densify holes — the result stays sparse."
    ],
    "misconceptions": [
      "length can be set independently, so JS allowed missing indexes. That created two kinds of ‘empty.’"
    ],
    "strongSignals": [
      "Separates Sparse Arrays from lookalike APIs and can draw the mental model."
    ]
  }
})
