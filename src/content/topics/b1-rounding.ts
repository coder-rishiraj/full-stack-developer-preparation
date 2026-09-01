import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Rounding",
  "whatIsIt": "Math.floor goes toward -∞, Math.ceil toward +∞, Math.trunc toward 0, Math.round half away from +∞ on .5 (for positives 2.5→3, but 2.5 rounding is ‘to nearest, ties toward +∞’). |x| of negatives makes round(-2.5) → -2. Integer conversion |0 truncates toward 0 like trunc for 32-bit range.",
  "whyExists": "UI and pagination need whole numbers. IEEE defines several rounding modes; JS picked a small set of functions instead of one mode flag.",
  "mentalModel": "floor = down the number line. ceil = up. trunc = chop the fraction. round = nearest, with a .5 rule that surprises on negatives.",
  "how": [
    "Use trunc or |0 when you mean ‘drop the fraction.’",
    "Use floor for paging (page = floor(i / size)).",
    "Do not use round for money without a decimal policy.",
    "Remember round(-1.5) is -1, not -2."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Math.round(-1.5) is -1; many school diagrams assume ‘.5 away from zero.’",
    "variant": "warning"
  },
  "example": "const xs = [1.2, 1.5, 1.8, -1.2, -1.5, -1.8];\nfor (const x of xs) {\n  console.log(x, Math.floor(x), Math.ceil(x), Math.trunc(x), Math.round(x));\n}\n",
  "exampleCaption": "floor, ceil, trunc, round on positives and negatives",
  "internals": [
    "Math.round is specified as floor(x + 0.5) for finite x, which interacts with IEEE -0 and negatives.",
    "ToIntegerOrInfinity used elsewhere is closer to trunc for finite numbers.",
    "Bitwise |0 is ToInt32, not full-range trunc."
  ],
  "takeaways": [
    "Use trunc or |0 when you mean ‘drop the fraction.’",
    "Use floor for paging (page = floor(i / size)).",
    "Math.round(-1.5) is -1; many school diagrams assume ‘.5 away from zero.’",
    "Math.round is specified as floor(x + 0.5) for finite x, which interacts with IEEE -0 and negatives."
  ],
  "revision": [
    "Rounding: floor = down the number line. ceil = up. trunc = chop the fraction. round = nearest, with a .5 rule that surprises on negatives.",
    "Use trunc or |0 when you mean ‘drop the fraction.’",
    "Use floor for paging (page = floor(i / size)).",
    "Do not use round for money without a decimal policy.",
    "Trap: Math.round(-1.5) is -1; many school diagrams assume ‘.5 away from zero.’"
  ],
  "flashcards": [
    [
      "Rounding",
      "Math.floor goes toward -∞, Math.ceil toward +∞, Math.trunc toward 0, Math.round half away from +∞ on .5 (for positives 2.5→3, but 2.5 rounding is ‘to nearest, ties toward +∞’)."
    ],
    [
      "Mental model",
      "floor = down the number line. ceil = up. trunc = chop the fraction. round = nearest, with a .5 rule that surprises on negatives."
    ],
    [
      "Common trap",
      "Math.round(-1.5) is -1; many school diagrams assume ‘.5 away from zero.’"
    ],
    [
      "Use trunc or |0 when you mean ‘drop the fraction.’",
      "Use floor for paging (page = floor(i / size))."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Rounding and where does a beginner first see it?",
      "answerHint": "Math.floor goes toward -∞, Math.ceil toward +∞, Math.trunc toward 0, Math.round half away from +∞ on .5 (for positives 2.5→3, but 2.5 rounding is ‘to nearest, ties toward +∞’). |x| of negatives makes round(-2.5) → -2. Integer conversion |0 truncates toward 0 like trunc for 32-bit range."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Rounding works and name the main pitfall.",
      "answerHint": "Use trunc or |0 when you mean ‘drop the fraction.’ Use floor for paging (page = floor(i / size)). Do not use round for money without a decimal policy. Remember round(-1.5) is -1, not -2. Pitfall: Math.round(-1.5) is -1; many school diagrams assume ‘.5 away from zero.’"
    },
    {
      "level": "advanced",
      "question": "How would you explain Rounding at an interview, including engine/spec details?",
      "answerHint": "Math.round is specified as floor(x + 0.5) for finite x, which interacts with IEEE -0 and negatives. ToIntegerOrInfinity used elsewhere is closer to trunc for finite numbers. Bitwise |0 is ToInt32, not full-range trunc."
    }
  ],
  "pitfalls": [
    "Math.round(-1.5) is -1; many school diagrams assume ‘.5 away from zero.’",
    "Remember round(-1.5) is -1, not -2."
  ],
  "interview": {
    "expectations": [
      "Explain Rounding without mixing it up with a nearby B1.8 — Numbers & Math topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Math.round is specified as floor(x + 0.5) for finite x, which interacts with IEEE -0 and negatives."
    ],
    "commonQuestions": [
      "What is Rounding?",
      "Why does JavaScript rounding behave this way?",
      "What is the classic Rounding interview trap?"
    ],
    "traps": [
      "Math.round(-1.5) is -1; many school diagrams assume ‘.5 away from zero.’"
    ],
    "misconceptions": [
      "UI and pagination need whole numbers. IEEE defines several rounding modes; JS picked a small set of functions instead of one mode flag."
    ],
    "strongSignals": [
      "Separates Rounding from lookalike APIs and can draw the mental model."
    ]
  }
})
