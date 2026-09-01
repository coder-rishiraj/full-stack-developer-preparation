import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "map / filter / reduce",
  "whatIsIt": "map transforms each element to a new array of the same length (holes stay holes). filter keeps elements whose predicate is truthy (holes dropped). reduce(acc, el) folds left to a single value; reduceRight from the right. reduce without initializer uses the first element and throws on empty arrays.",
  "whyExists": "Declarative list processing is easier to review than mutable for-loops when each step is a named transform.",
  "mentalModel": "map: same length, new values. filter: maybe shorter. reduce: funnel into one accumulator.",
  "how": [
    "Always pass reduce’s initial value unless you like empty-array throws.",
    "Do not map if you meant forEach (no return).",
    "filter(Boolean) drops falsy, including 0 — often a bug.",
    "Chain map/filter; use reduce when you truly accumulate."
  ],
  "callout": {
    "title": "Watch for",
    "text": "reduce without 0 on numbers: [].reduce(sum) TypeError; [1].reduce(sum) is 1 — easy to miss in tests.",
    "variant": "warning"
  },
  "example": "const a = [1, 2, 3, 4];\nconsole.log(a.map((n) => n * 2));\nconsole.log(a.filter((n) => n % 2 === 0));\nconsole.log(a.reduce((s, n) => s + n, 0));\ntry { [].reduce((s, n) => s + n); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "map, filter, reduce with initializer vs empty throw",
  "internals": [
    "map uses HasProperty; holes are not visited and remain holes.",
    "filter only Includes indices that existed and passed.",
    "reduce’s kPresent logic picks the first present index as the initial acc if omitted."
  ],
  "takeaways": [
    "Always pass reduce’s initial value unless you like empty-array throws.",
    "Do not map if you meant forEach (no return).",
    "reduce without 0 on numbers: [].reduce(sum) TypeError; [1].reduce(sum) is 1 — easy to miss in tests.",
    "map uses HasProperty; holes are not visited and remain holes."
  ],
  "revision": [
    "map / filter / reduce: map: same length, new values. filter: maybe shorter. reduce: funnel into one accumulator.",
    "Always pass reduce’s initial value unless you like empty-array throws.",
    "Do not map if you meant forEach (no return).",
    "filter(Boolean) drops falsy, including 0 — often a bug.",
    "Trap: reduce without 0 on numbers: [].reduce(sum) TypeError; [1].reduce(sum) is 1 — easy to miss in tests."
  ],
  "flashcards": [
    [
      "map / filter / reduce",
      "map transforms each element to a new array of the same length (holes stay holes)."
    ],
    [
      "Mental model",
      "map: same length, new values. filter: maybe shorter. reduce: funnel into one accumulator."
    ],
    [
      "Common trap",
      "reduce without 0 on numbers: [].reduce(sum) TypeError; [1].reduce(sum) is 1 — easy to miss in tests."
    ],
    [
      "Always pass reduce’s initial value unless you like empty-array throws.",
      "Do not map if you meant forEach (no return)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is map / filter / reduce and where does a beginner first see it?",
      "answerHint": "map transforms each element to a new array of the same length (holes stay holes). filter keeps elements whose predicate is truthy (holes dropped). reduce(acc, el) folds left to a single value; reduceRight from the right. reduce without initializer uses the first element and throws on empty arrays."
    },
    {
      "level": "intermediate",
      "question": "Walk through how map / filter / reduce works and name the main pitfall.",
      "answerHint": "Always pass reduce’s initial value unless you like empty-array throws. Do not map if you meant forEach (no return). filter(Boolean) drops falsy, including 0 — often a bug. Chain map/filter; use reduce when you truly accumulate. Pitfall: reduce without 0 on numbers: [].reduce(sum) TypeError; [1].reduce(sum) is 1 — easy to miss in tests."
    },
    {
      "level": "advanced",
      "question": "How would you explain map / filter / reduce at an interview, including engine/spec details?",
      "answerHint": "map uses HasProperty; holes are not visited and remain holes. filter only Includes indices that existed and passed. reduce’s kPresent logic picks the first present index as the initial acc if omitted."
    }
  ],
  "pitfalls": [
    "reduce without 0 on numbers: [].reduce(sum) TypeError; [1].reduce(sum) is 1 — easy to miss in tests.",
    "Chain map/filter; use reduce when you truly accumulate."
  ],
  "interview": {
    "expectations": [
      "Explain map / filter / reduce without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "map uses HasProperty; holes are not visited and remain holes."
    ],
    "commonQuestions": [
      "What is map / filter / reduce?",
      "Why does JavaScript map / filter / reduce behave this way?",
      "What is the classic map / filter / reduce interview trap?"
    ],
    "traps": [
      "reduce without 0 on numbers: [].reduce(sum) TypeError; [1].reduce(sum) is 1 — easy to miss in tests."
    ],
    "misconceptions": [
      "Declarative list processing is easier to review than mutable for-loops when each step is a named transform."
    ],
    "strongSignals": [
      "Separates map / filter / reduce from lookalike APIs and can draw the mental model."
    ]
  }
})
