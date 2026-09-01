import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Tuples",
  "whatIsIt": "Tuples are arrays with fixed length and typed positions: type Pair = [string, number]. Optional and rest elements supported: [string, ...number[]]. Tuples model CSV rows, coordinates, React useState pairs.",
  "whyExists": "When index meaning matters, tuples beat homogeneous arrays.",
  "mentalModel": "Labeled slots in a fixed rack — slot 0 is always string, slot 1 number.",
  "how": [
    "declare [x, y]: [number, number] for coords.",
    "Labeled tuples (TS 4.0+): [name: string, age: number].",
    "Rest tuple: type Head = [string, ...boolean[]].",
    "Destructuring preserves tuple types.",
    "Use readonly tuples for immutable pairs."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assigning [1,2,3,4] to [number, number] — excess length error under strict tuples.",
    "variant": "warning"
  },
  "example": "type RGB = [number, number, number];\nfunction toHex([r, g, b]: RGB): string {\n  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');\n}\nconsole.log(toHex([255, 0, 128]));\nconst __typed: RGB = {} as RGB;\nconsole.log(\"export type { RGB }\");\n// type RGB = [number, number, number]; narrows allowed values",
  "exampleCaption": "RGB tuple destructured in toHex",
  "internals": [
    "Variadic tuple types combine with spreads in calls.",
    "Tuple inference from as const on array literal.",
    "Optional tuple elements use ? on element type."
  ],
  "takeaways": [
    "declare [x, y]: [number, number] for coords.",
    "Labeled tuples (TS 4.0+): [name: string, age: number].",
    "Assigning [1,2,3,4] to [number, number] — excess length error under strict tuples.",
    "Variadic tuple types combine with spreads in calls."
  ],
  "revision": [
    "Tuples: Labeled slots in a fixed rack — slot 0 is always string, slot 1 number.",
    "declare [x, y]: [number, number] for coords.",
    "Labeled tuples (TS 4.0+): [name: string, age: number].",
    "Rest tuple: type Head = [string, ...boolean[]].",
    "Trap: Assigning [1,2,3,4] to [number, number] — excess length error under strict tuples."
  ],
  "flashcards": [
    [
      "Tuples",
      "Tuples are arrays with fixed length and typed positions: type Pair = [string, number]."
    ],
    [
      "Mental model",
      "Labeled slots in a fixed rack — slot 0 is always string, slot 1 number."
    ],
    [
      "Common trap",
      "Assigning [1,2,3,4] to [number, number] — excess length error under strict tuples."
    ],
    [
      "declare [x, y]: [number, number] for coords.",
      "Labeled tuples (TS 4.0+): [name: string, age: number]."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Tuples in TypeScript and when do you use it?",
      "answerHint": "Tuples are arrays with fixed length and typed positions: type Pair = [string, number]. Optional and rest elements supported: [string, ...number[]]. Tuples model CSV rows, coordinates, React useState pairs."
    },
    {
      "level": "intermediate",
      "question": "Explain Tuples with a code example and one pitfall.",
      "answerHint": "declare [x, y]: [number, number] for coords. Labeled tuples (TS 4.0+): [name: string, age: number]. Rest tuple: type Head = [string, ...boolean[]]. Destructuring preserves tuple types. Use readonly tuples for immutable pairs. Pitfall: Assigning [1,2,3,4] to [number, number] — excess length error under strict tuples."
    },
    {
      "level": "advanced",
      "question": "How would you explain Tuples in a senior frontend interview?",
      "answerHint": "Variadic tuple types combine with spreads in calls. Tuple inference from as const on array literal. Optional tuple elements use ? on element type. type RGB = [number, number, number];\nfunction toHex([r, g, b]: RGB): string {\n  return '#' + [r, g, b].map((n) => n.toSt"
    }
  ],
  "pitfalls": [
    "Assigning [1,2,3,4] to [number, number] — excess length error under strict tuples."
  ],
  "interview": {
    "expectations": [
      "Explain Tuples with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Variadic tuple types combine with spreads in calls."
    ],
    "commonQuestions": [
      "What is Tuples?",
      "When would you choose Tuples over alternatives?",
      "What is the classic Tuples interview trap?"
    ],
    "traps": [
      "Assigning [1,2,3,4] to [number, number] — excess length error under strict tuples."
    ],
    "misconceptions": [
      "When index meaning matters, tuples beat homogeneous arrays."
    ],
    "strongSignals": [
      "Uses Tuples to remove invalid states, not just document them."
    ]
  }
})
